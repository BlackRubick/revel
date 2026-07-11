import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const query = getQuery(event)

  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const status = query.status as string | undefined
  const skip = (page - 1) * limit

  const where =
    auth.role === 'ADMIN'
      ? status ? { status: status as any } : {}
      : status
        ? { organizerId: auth.userId, status: status as any }
        : { organizerId: auth.userId }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        package: { select: { name: true, type: true } },
        organizer: { select: { name: true, email: true } },
        _count: { select: { guests: true, photos: true, videos: true } },
      },
    }),
    prisma.event.count({ where }),
  ])

  return {
    success: true,
    data: events,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
})
