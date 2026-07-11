import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const eventId = query.eventId as string
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 20
  const skip = (page - 1) * limit

  if (!eventId) throw createError({ statusCode: 400, message: 'eventId requerido' })

  const [photos, total] = await Promise.all([
    prisma.photo.findMany({
      where: { eventId, status: 'APPROVED' },
      skip,
      take: limit,
      orderBy: { uploadedAt: 'desc' },
      include: { guest: { select: { id: true, name: true } } },
    }),
    prisma.photo.count({ where: { eventId, status: 'APPROVED' } }),
  ])

  return { success: true, data: photos, total, page, limit, totalPages: Math.ceil(total / limit) }
})
