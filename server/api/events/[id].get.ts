import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const id = getRouterParam(event, 'id')

  const ev = await prisma.event.findUnique({
    where: { id },
    include: {
      package: true,
      organizer: { select: { id: true, name: true, email: true } },
      tables: { orderBy: { number: 'asc' }, include: { guests: true } },
      _count: { select: { guests: true, photos: true, videos: true, messages: true } },
    },
  })

  if (!ev) throw createError({ statusCode: 404, message: 'Evento no encontrado' })

  if (auth.role !== 'ADMIN' && ev.organizerId !== auth.userId) {
    throw createError({ statusCode: 403, message: 'Sin acceso a este evento' })
  }

  return { success: true, data: ev }
})
