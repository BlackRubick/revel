import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'

const schema = z.object({
  code: z.string(),
  status: z.enum(['CONFIRMED', 'DECLINED']),
  message: z.string().max(500).optional(),
  companions: z.number().int().min(0).max(10).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, message: 'Datos inválidos' })
  }

  const { code, status, message, companions } = parsed.data

  const qr = await prisma.qRCode.findUnique({
    where: { code },
    include: { guest: true },
  })

  if (!qr || !qr.guest) {
    throw createError({ statusCode: 404, message: 'Código no válido' })
  }

  const updatedGuest = await prisma.guest.update({
    where: { id: qr.guest.id },
    data: {
      rsvpStatus: status,
      rsvpAt: new Date(),
      ...(companions !== undefined && { companions }),
    },
  })

  if (message && message.trim()) {
    await prisma.guestMessage.create({
      data: {
        eventId: qr.guest.eventId,
        guestId: qr.guest.id,
        guestName: qr.guest.name,
        message: message.trim(),
      },
    })
  }

  return { success: true, data: updatedGuest, message: 'Confirmación registrada' }
})
