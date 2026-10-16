import { z } from 'zod'
import { v2 as cloudinary } from 'cloudinary'
import { prisma } from '~/server/utils/prisma'
import { moderateAnnotationImage } from '~/server/utils/moderation'
import { findProfanity } from '~/utils/profanity'

const schema = z.object({
  imageBase64: z.string().startsWith('data:image/jpeg;base64,').max(6_000_000),
  texts: z.array(z.string().max(120)).max(30).default([]),
  authorName: z.string().trim().max(60).optional(),
  guestCode: z.string().optional(),
})

// Límite simple por IP: cada edición pasa por moderación (tiene costo).
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 15
const hits = new Map<string, number[]>()

function rateLimit(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    throw createError({ statusCode: 429, message: 'Has enviado muchas ediciones. Intenta de nuevo en unos minutos.' })
  }
  recent.push(now)
  hits.set(ip, recent)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const photoId = getRouterParam(event, 'id')

  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 422, message: 'Datos inválidos' })
  }
  const { imageBase64, texts, authorName, guestCode } = parsed.data

  const photo = await prisma.photo.findUnique({
    where: { id: photoId },
    select: { id: true, eventId: true, url: true, status: true, event: { select: { status: true } } },
  })
  if (!photo || photo.status !== 'APPROVED') {
    throw createError({ statusCode: 404, message: 'Foto no encontrada' })
  }
  if (photo.event.status === 'DRAFT' || photo.event.status === 'CANCELLED') {
    throw createError({ statusCode: 403, message: 'El álbum de este evento no está disponible' })
  }

  // 1) Texto: filtro local, rápido y sin costo
  for (const t of [...texts, authorName ?? '']) {
    if (findProfanity(t)) {
      throw createError({ statusCode: 422, message: 'Tu texto contiene palabras no permitidas. Por favor cámbialo.' })
    }
  }

  rateLimit(getRequestIP(event, { xForwardedFor: true }) ?? 'unknown')

  // 2) Imagen: revisión visual de lo dibujado/escrito
  const verdict = await moderateAnnotationImage({ originalUrl: photo.url, editedBase64: imageBase64, texts })
  if (verdict.decision === 'REJECTED') {
    throw createError({ statusCode: 422, message: verdict.reason })
  }

  let guestName: string | undefined
  if (guestCode && !authorName) {
    const qr = await prisma.qRCode.findUnique({ where: { code: guestCode }, include: { guest: { select: { name: true } } } })
    guestName = qr?.guest?.name
  }

  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  })
  const upload = await cloudinary.uploader.upload(imageBase64, {
    folder: `revel/${photo.eventId}/annotations`,
    resource_type: 'image',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  })

  const annotation = await prisma.photoAnnotation.create({
    data: {
      photoId: photo.id,
      eventId: photo.eventId,
      authorName: authorName || guestName || null,
      url: upload.secure_url,
      publicId: upload.public_id,
      texts: texts.length ? JSON.stringify(texts) : null,
      status: verdict.decision,
      moderationReason: verdict.reason,
    },
  })

  return {
    success: true,
    data: annotation,
    message: verdict.decision === 'APPROVED'
      ? '¡Listo! Tu dedicatoria ya aparece en el álbum.'
      : 'Recibimos tu dedicatoria. Aparecerá cuando el organizador la apruebe.',
  }
})
