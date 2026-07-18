import { z } from 'zod'
import QRCode from 'qrcode'
import { nanoid } from 'nanoid'
import { prisma } from '~/server/utils/prisma'

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  companions: z.number().int().min(0).max(20).default(0),
})

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

  const guest = await prisma.guest.create({
    data: {
      eventId: ev.id,
      name: parsed.data.name.trim(),
      companions: parsed.data.companions,
      rsvpStatus: 'CONFIRMED',
      rsvpAt: new Date(),
    },
  })

  const code = nanoid(16)
  const config = useRuntimeConfig()
  const qrUrl = `${config.public.appUrl}/confirmar/${code}`
  const qrImage = await QRCode.toDataURL(qrUrl, {
    color: { dark: '#D4AF37', light: '#0A0A0A' },
    width: 300,
    margin: 2,
  })

  await prisma.qRCode.create({
    data: { eventId: ev.id, guestId: guest.id, type: 'GUEST', code, qrImage },
  })

  return {
    success: true,
    data: {
      guest: { name: guest.name, companions: guest.companions },
      event: ev,
      code,
      qrImage,
    },
  }
})
