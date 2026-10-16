import { v2 as cloudinary } from 'cloudinary'
import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'
import { checkEventModerationAccess } from '~/server/utils/annotationAccess'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const user = await requireRole(event, ['ADMIN', 'ORGANIZER', 'ENCARGADO'])
  const id = getRouterParam(event, 'id')

  const annotation = await prisma.photoAnnotation.findUnique({ where: { id }, select: { eventId: true, publicId: true } })
  if (!annotation) throw createError({ statusCode: 404, message: 'Dedicatoria no encontrada' })
  await checkEventModerationAccess(annotation.eventId, user)

  await prisma.photoAnnotation.delete({ where: { id } })

  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  })
  await cloudinary.uploader.destroy(annotation.publicId).catch(() => {})

  return { success: true }
})
