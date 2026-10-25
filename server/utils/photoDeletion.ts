import { v2 as cloudinary } from 'cloudinary'
import { prisma } from '~/server/utils/prisma'

/**
 * Borra fotos (y sus dibujos/dedicatorias) de la base de datos y de Cloudinary.
 * Devuelve cuántas fotos se borraron.
 */
export async function deletePhotos(where: { id?: string; eventId?: string }) {
  const photos = await prisma.photo.findMany({
    where,
    select: { id: true, publicId: true, annotations: { select: { publicId: true } } },
  })
  if (!photos.length) return 0

  // Las dedicatorias se borran en cascada con la foto
  await prisma.photo.deleteMany({ where: { id: { in: photos.map(p => p.id) } } })

  const config = useRuntimeConfig()
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  })

  const publicIds = photos.flatMap(p => [p.publicId, ...p.annotations.map(a => a.publicId)])
  // Cloudinary acepta hasta 100 ids por llamada; si falla, la foto ya no se muestra
  for (let i = 0; i < publicIds.length; i += 100) {
    await cloudinary.api.delete_resources(publicIds.slice(i, i + 100)).catch(() => {})
  }

  return photos.length
}
