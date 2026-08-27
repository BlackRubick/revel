import { z } from 'zod'
import QRCode from 'qrcode'
import { nanoid } from 'nanoid'
import { prisma } from '~/server/utils/prisma'

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  companions: z.number().int().min(0).max(20).default(0),
  companionNames: z.array(z.string().max(100)).optional().default([]),
})

async function generateQR(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    color: { dark: '#D4AF37', light: '#0A0A0A' },
    width: 300,
    margin: 2,
  })
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const body = await readBody(event)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, message: parsed.error.issues[0]?.message ?? 'Datos inválidos' })
  }

  const ev = await prisma.event.findUnique({
    where: { slug },
    select: {
      id: true, name: true, date: true, time: true, venue: true,
      venueAddress: true, venueMapUrl: true, coverImage: true,
      type: true, churchName: true, churchAddress: true, status: true,
    },
  })

  if (!ev) throw createError({ statusCode: 404, message: 'Evento no encontrado' })
  if (ev.status === 'FINISHED' || ev.status === 'CANCELLED') {
    throw createError({ statusCode: 410, message: 'Este evento ya finalizó o fue cancelado' })
  }

  const config = useRuntimeConfig()
  const { companions: companionCount, companionNames } = parsed.data

  const guest = await prisma.guest.create({
    data: {
      eventId: ev.id,
      name: parsed.data.name.trim(),
      companions: companionCount,
      rsvpStatus: 'CONFIRMED',
      rsvpAt: new Date(),
    },
  })

  // QR del invitado principal
  const guestCode = nanoid(16)
  const guestQrImage = await generateQR(`${config.public.appUrl}/confirmar/${guestCode}`)
  await prisma.qRCode.create({
    data: { eventId: ev.id, guestId: guest.id, type: 'GUEST', code: guestCode, qrImage: guestQrImage },
  })

  // QR por cada acompañante nombrado
  const companionResults: { name: string; qrImage: string; code: string }[] = []

  const names = companionNames.slice(0, companionCount)
  for (let i = 0; i < companionCount; i++) {
    const companionName = names[i]?.trim() || `Acompañante ${i + 1}`

    const companion = await prisma.companion.create({
      data: { guestId: guest.id, name: companionName },
    })

    const companionCode = nanoid(16)
    const companionQrImage = await generateQR(`${config.public.appUrl}/confirmar/${companionCode}`)
    await prisma.qRCode.create({
      data: {
        eventId: ev.id,
        guestId: guest.id,
        companionId: companion.id,
        type: 'COMPANION',
        code: companionCode,
        qrImage: companionQrImage,
      },
    })

    companionResults.push({ name: companionName, qrImage: companionQrImage, code: companionCode })
  }

  return {
    success: true,
    data: {
      guest: { name: guest.name, companions: guest.companions },
      event: ev,
      code: guestCode,
      qrImage: guestQrImage,
      companionResults,
    },
  }
})
