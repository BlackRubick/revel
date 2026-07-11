import { requireRole } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = await requireRole(event, ['ADMIN', 'ORGANIZER', 'ENCARGADO'])

  const eventWhere = auth.role === 'ADMIN' ? {} : { organizerId: auth.userId }

  const [
    totalEvents,
    activeEvents,
    totalGuests,
    confirmedGuests,
    pendingGuests,
    totalPhotos,
    recentEvents,
    paymentsAgg,
  ] = await Promise.all([
    prisma.event.count({ where: eventWhere }),
    prisma.event.count({ where: { ...eventWhere, status: 'ACTIVE' } }),
    prisma.guest.count({ where: { event: eventWhere } }),
    prisma.guest.count({ where: { event: eventWhere, rsvpStatus: 'CONFIRMED' } }),
    prisma.guest.count({ where: { event: eventWhere, rsvpStatus: 'PENDING' } }),
    prisma.photo.count({ where: { event: eventWhere } }),
    prisma.event.findMany({
      where: eventWhere,
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        package: { select: { name: true, type: true } },
        _count: { select: { guests: true, photos: true } },
      },
    }),
    prisma.payment.aggregate({
      where: { event: eventWhere, status: 'paid' },
      _sum: { total: true },
    }),
  ])

  return {
    success: true,
    data: {
      totalEvents,
      activeEvents,
      totalGuests,
      confirmedGuests,
      pendingGuests,
      totalPhotos,
      totalRevenue: Number(paymentsAgg._sum.total || 0),
      recentEvents,
    },
  }
})
