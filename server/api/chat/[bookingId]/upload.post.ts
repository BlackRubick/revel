import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const { bookingId } = getRouterParams(event)
  const config = useRuntimeConfig()

  const booking = await prisma.supplierBooking.findUnique({
    where: { id: bookingId },
    include: { supplier: { select: { supplierUserId: true } } },
  })
  if (!booking) throw createError({ statusCode: 404, message: 'Booking no encontrado' })
  if (user.role === 'SUPPLIER') {
    if (booking.supplier.supplierUserId !== user.userId)
      throw createError({ statusCode: 403, message: 'Sin acceso' })
  } else if (!['ADMIN', 'ORGANIZER', 'ENCARGADO'].includes(user.role)) {
    throw createError({ statusCode: 403, message: 'Sin permisos' })
  }

  const parts = await readMultipartFormData(event)
  const filePart = parts?.find(p => p.name === 'file')
  if (!filePart?.data?.length) throw createError({ statusCode: 422, message: 'Archivo requerido' })

  if (filePart.data.length > 50 * 1024 * 1024)
    throw createError({ statusCode: 413, message: 'Máximo 50 MB por archivo' })

  const mimeType = filePart.type ?? 'application/octet-stream'
  const fileName = filePart.filename ?? 'archivo'

  let resourceType: 'image' | 'video' | 'raw' = 'raw'
  let fileType: 'image' | 'video' | 'file' = 'file'
  if (mimeType.startsWith('image/')) { resourceType = 'image'; fileType = 'image' }
  else if (mimeType.startsWith('video/')) { resourceType = 'video'; fileType = 'video' }

  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  })

  const base64 = `data:${mimeType};base64,${filePart.data.toString('base64')}`
  const result = await cloudinary.uploader.upload(base64, {
    folder: 'revel/chat',
    resource_type: resourceType,
    use_filename: true,
    unique_filename: true,
  })

  return { success: true, fileUrl: result.secure_url, fileType, fileName }
})
