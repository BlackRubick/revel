import { requireRole } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN', 'ORGANIZER', 'ENCARGADO'])
  const id = getRouterParam(event, 'id')

  const guest = await prisma.guest.findUnique({ where: { id } })
  if (!guest) throw createError({ statusCode: 404, message: 'Invitado no encontrado' })

  await prisma.guest.delete({ where: { id } })

  return { success: true, message: 'Invitado eliminado' }
})
