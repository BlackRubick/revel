import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'
import type { Server as SocketIOServer } from 'socket.io'

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN', 'ORGANIZER', 'ENCARGADO'])
  const { id: eventId } = getRouterParams(event)
  const body = await readBody(event)

  if (!body?.title?.trim()) {
    throw createError({ statusCode: 400, message: 'El título es requerido' })
  }

  const lastStage = await prisma.eventStage.findFirst({
    where: { eventId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })

  const stage = await prisma.eventStage.create({
    data: {
      eventId,
      title: body.title.trim(),
      description: body.description?.trim() || null,
      order: (lastStage?.order ?? -1) + 1,
    },
  })

  const nitroApp = useNitroApp() as { $socket?: SocketIOServer }
  nitroApp.$socket?.to(`event:${eventId}`).emit('stage-update', { type: 'created', stage })

  return { success: true, data: stage }
})
