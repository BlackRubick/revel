import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const query = getQuery(event)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (auth.role !== 'SUPPLIER') {
    // Convert any lingering DRAFT events to ACTIVE
    const draftWhere = auth.role === 'ADMIN'
      ? { status: 'DRAFT' as const }
      : { status: 'DRAFT' as const, organizerId: auth.userId }
    await prisma.event.updateMany({ where: draftWhere, data: { status: 'ACTIVE' } })

    // Auto-archive: flip ACTIVE → FINISHED for events whose date has already passed
    const archiveWhere = auth.role === 'ADMIN'
      ? { status: 'ACTIVE' as const, date: { lt: today } }
      : { status: 'ACTIVE' as const, date: { lt: today }, organizerId: auth.userId }
    await prisma.event.updateMany({ where: archiveWhere, data: { status: 'FINISHED' } })
  }

  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 50
  const status = query.status as string | undefined
  const skip = (page - 1) * limit

  let where: Record<string, unknown> = {}
  if (auth.role === 'ADMIN') {
    where = status ? { status: status as any } : {}
  } else if (auth.role === 'SUPPLIER') {
    // Supplier ve todos los eventos activos para seleccionar al crear bookings
    where = status ? { status: status as any } : {}
  } else {
    where = status ? { organizerId: auth.userId, status: status as any } : { organizerId: auth.userId }
  }

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
