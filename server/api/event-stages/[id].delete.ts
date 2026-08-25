import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'
import type { Server as SocketIOServer } from 'socket.io'

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN', 'ORGANIZER', 'ENCARGADO'])
  const { id } = getRouterParams(event)

  const existing = await prisma.eventStage.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Etapa no encontrada' })

  await prisma.eventStage.delete({ where: { id } })

  const nitroApp = useNitroApp() as { $socket?: SocketIOServer }
  nitroApp.$socket?.to(`event:${existing.eventId}`).emit('stage-update', { type: 'deleted', stageId: id })

  return { success: true }
})
