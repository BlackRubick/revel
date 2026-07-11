import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const query = getQuery(event)

  const eventId = query.eventId as string
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 50
  const search = query.search as string | undefined
  const rsvpStatus = query.rsvpStatus as string | undefined
  const skip = (page - 1) * limit

  if (!eventId) throw createError({ statusCode: 400, message: 'eventId requerido' })

  const where: Record<string, unknown> = { eventId }
  if (search) where.name = { contains: search, mode: 'insensitive' }
  if (rsvpStatus) where.rsvpStatus = rsvpStatus

  const [guests, total] = await Promise.all([
    prisma.guest.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        table: { select: { id: true, number: true, name: true } },
        qrCodes: { select: { id: true, code: true, qrImage: true, type: true } },
      },
    }),
    prisma.guest.count({ where }),
  ])

  return { success: true, data: guests, total, page, limit, totalPages: Math.ceil(total / limit) }
})
