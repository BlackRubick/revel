import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { upsertPresence, getOtherPresence } from '~/server/utils/chatPresence'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const { bookingId } = getRouterParams(event)

  const booking = await prisma.supplierBooking.findUnique({
    where: { id: bookingId },
    include: { supplier: { select: { supplierUserId: true } } },
  })

  if (!booking) {
    throw createError({ statusCode: 404, message: 'Booking no encontrado' })
  }

  if (user.role === 'SUPPLIER') {
    if (booking.supplier.supplierUserId !== user.userId) {
      throw createError({ statusCode: 403, message: 'Sin acceso a este chat' })
    }
  } else if (!['ADMIN', 'ORGANIZER', 'ENCARGADO'].includes(user.role)) {
    throw createError({ statusCode: 403, message: 'Sin permisos' })
  }

  upsertPresence(bookingId, user.userId) // solo actualiza lastSeen, preserva isTyping del PUT

  await prisma.chatMessage.updateMany({
    where: { bookingId, senderId: { not: user.userId }, readAt: null },
    data: { readAt: new Date() },
  })

  const messages = await prisma.chatMessage.findMany({
    where: { bookingId },
    include: {
      sender: { select: { id: true, name: true, role: true, avatar: true } },
      replyTo: { select: { id: true, message: true, sender: { select: { id: true, name: true, role: true } } } },
    },
    orderBy: { createdAt: 'asc' },
  })

  const presence = getOtherPresence(bookingId, user.userId)

  return { success: true, data: messages, presence }
})
