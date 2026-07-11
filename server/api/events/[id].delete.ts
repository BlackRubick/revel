import { requireRole } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = await requireRole(event, ['ADMIN', 'ORGANIZER', 'ENCARGADO'])
  const id = getRouterParam(event, 'id')

  const existing = await prisma.event.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Evento no encontrado' })

  if (auth.role !== 'ADMIN' && existing.organizerId !== auth.userId) {
    throw createError({ statusCode: 403, message: 'Sin permisos' })
  }

  await prisma.event.delete({ where: { id } })

  return { success: true, message: 'Evento eliminado' }
})
