import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  let bookingIds: string[] = []

  if (user.role === 'SUPPLIER') {
    const bookings = await prisma.supplierBooking.findMany({
      where: { supplier: { supplierUserId: user.userId } },
      select: { id: true },
    })
    bookingIds = bookings.map(b => b.id)
  } else if (['ADMIN', 'ORGANIZER', 'ENCARGADO'].includes(user.role)) {
    const bookings = await prisma.supplierBooking.findMany({
      where: { event: { organizerId: user.userId } },
      select: { id: true },
    })
    bookingIds = bookings.map(b => b.id)
  }

  if (!bookingIds.length) return { success: true, data: [] }

  const counts = await prisma.chatMessage.groupBy({
    by: ['bookingId'],
    where: {
      bookingId: { in: bookingIds },
      senderId: { not: user.userId },
      readAt: null,
    },
    _count: { id: true },
  })

  return {
    success: true,
    data: counts.map(c => ({ bookingId: c.bookingId, unreadCount: c._count.id })),
  }
})
