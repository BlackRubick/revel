import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { slug } = getRouterParams(event)

  const ev = await prisma.event.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      date: true,
      time: true,
      venue: true,
      venueAddress: true,
      type: true,
      status: true,
      stages: {
        orderBy: { order: 'asc' },
        select: { id: true, title: true, description: true, order: true, completedAt: true },
      },
      supplierBookings: {
        where: { status: { not: 'CANCELLED' } },
        select: {
          id: true,
          supplierStatus: true,
          supplier: { select: { name: true, category: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!ev) throw createError({ statusCode: 404, message: 'Evento no encontrado' })

  return { success: true, data: ev }
})
