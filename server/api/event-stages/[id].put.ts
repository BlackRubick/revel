import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'
import type { Server as SocketIOServer } from 'socket.io'

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN', 'ORGANIZER', 'ENCARGADO'])
  const { id } = getRouterParams(event)
  const body = await readBody(event)

  const existing = await prisma.eventStage.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Etapa no encontrada' })

  const data: Record<string, unknown> = {}
  if (body.title !== undefined) data.title = body.title.trim()
  if (body.description !== undefined) data.description = body.description?.trim() || null
  if (body.order !== undefined) data.order = body.order
  if ('completed' in body) {
    data.completedAt = body.completed ? new Date() : null
  }

  const stage = await prisma.eventStage.update({ where: { id }, data })

  const nitroApp = useNitroApp() as { $socket?: SocketIOServer }
  nitroApp.$socket?.to(`event:${existing.eventId}`).emit('stage-update', { type: 'updated', stage })

  return { success: true, data: stage }
})
