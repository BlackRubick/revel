import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import { broadcastToChat } from '~/server/utils/chatSSE'
import type { Server as SocketIOServer } from 'socket.io'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const { bookingId } = getRouterParams(event)
  const body = await readBody(event)

  if (!body?.message?.trim() && !body?.fileUrl) {
    throw createError({ statusCode: 400, message: 'Se requiere mensaje o archivo' })
  }

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

  const chatMessage = await prisma.chatMessage.create({
    data: {
      bookingId,
      senderId: user.userId,
      message: body.message?.trim() ?? '',
      fileUrl: body.fileUrl ?? null,
      fileType: body.fileType ?? null,
      fileName: body.fileName ?? null,
      replyToId: body.replyToId ?? null,
    },
    include: {
      sender: { select: { id: true, name: true, role: true, avatar: true } },
      replyTo: { select: { id: true, message: true, sender: { select: { id: true, name: true, role: true } } } },
    },
  })

  broadcastToChat(bookingId, chatMessage)

  const nitroApp = useNitroApp() as { $socket?: SocketIOServer }
  nitroApp.$socket?.to(`chat:${bookingId}`).emit('chat-message', chatMessage)

  return { success: true, data: chatMessage }
})
