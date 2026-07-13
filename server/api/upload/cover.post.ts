import { requireRole } from '~/server/utils/auth'
import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN', 'ORGANIZER', 'ENCARGADO'])
  const config = useRuntimeConfig()
  const { imageBase64 } = await readBody(event)

  if (!imageBase64) throw createError({ statusCode: 422, message: 'Imagen requerida' })

  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  })

  const result = await cloudinary.uploader.upload(imageBase64, {
    folder: 'revel/covers',
    resource_type: 'image',
    transformation: [{ quality: 'auto', fetch_format: 'auto', width: 1200, crop: 'limit' }],
  })

  return { success: true, url: result.secure_url }
})
