import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { v2 as cloudinary } from 'cloudinary'

const schema = z.object({
  eventId: z.string(),
  guestCode: z.string().optional(),
  imageBase64: z.string(),
  caption: z.string().max(200).optional(),
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, message: 'Datos inválidos' })
  }

  const { eventId, guestCode, imageBase64, caption } = parsed.data

  // Verificar que el evento existe, está activo y ya comenzó
  const eventRecord = await prisma.event.findUnique({
    where: { id: eventId },
    select: { date: true, time: true, status: true },
  })

  if (!eventRecord) {
    throw createError({ statusCode: 404, message: 'Evento no encontrado' })
  }

  if (eventRecord.status !== 'ACTIVE') {
    throw createError({ statusCode: 403, message: 'El evento no está activo' })
  }

  const eventDate = new Date(eventRecord.date)
  const [hours, minutes] = (eventRecord.time ?? '00:00').split(':').map(Number)
  const eventStart = new Date(Date.UTC(
    eventDate.getUTCFullYear(),
    eventDate.getUTCMonth(),
    eventDate.getUTCDate(),
    hours ?? 0,
    minutes ?? 0,
    0,
  ))

  if (new Date() < eventStart) {
    throw createError({
      statusCode: 403,
      message: `El álbum estará disponible a partir de las ${eventRecord.time} hrs`,
    })
  }

  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  })

  let guestId: string | undefined
  if (guestCode) {
    const qr = await prisma.qRCode.findUnique({ where: { code: guestCode } })
    if (qr?.guestId) guestId = qr.guestId
  }

  const uploadResult = await cloudinary.uploader.upload(imageBase64, {
    folder: `revel/${eventId}/photos`,
    resource_type: 'image',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  })

  const photo = await prisma.photo.create({
    data: {
      eventId,
      guestId: guestId || null,
      url: uploadResult.secure_url,
      thumbnailUrl: uploadResult.secure_url.replace('/upload/', '/upload/w_400,h_400,c_fill/'),
      publicId: uploadResult.public_id,
      caption: caption || null,
      status: 'APPROVED',
    },
    include: { guest: { select: { id: true, name: true } } },
  })

  return { success: true, data: photo }
})
