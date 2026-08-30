import { requireAuth } from '~/server/utils/auth'
import { checkChatAccess } from '~/server/utils/chatAccess'
import { upsertPresence, getOtherPresence } from '~/server/utils/chatPresence'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const { bookingId } = getRouterParams(event)

  await checkChatAccess(bookingId, user)

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
