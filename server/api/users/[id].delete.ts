import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const caller = await requireRole(event, ['ADMIN', 'ENCARGADO'])
  const id = getRouterParam(event, 'id')

  if (caller.userId === id) {
    throw createError({ statusCode: 400, message: 'No puedes eliminar tu propia cuenta' })
  }

  if (caller.role === 'ENCARGADO') {
    const callerUser = await prisma.user.findUnique({
      where: { id: caller.userId },
      select: { companyId: true },
    })
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { companyId: true },
    })
    if (!targetUser || targetUser.companyId !== callerUser?.companyId) {
      throw createError({ statusCode: 403, message: 'Sin permisos para eliminar este usuario' })
    }
  }

  await prisma.user.delete({ where: { id } })

  return { success: true }
})
