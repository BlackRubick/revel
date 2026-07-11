import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const caller = await requireRole(event, ['ADMIN', 'ENCARGADO'])

  let where: Record<string, unknown> = {}

  if (caller.role === 'ENCARGADO') {
    const callerUser = await prisma.user.findUnique({
      where: { id: caller.userId },
      select: { companyId: true },
    })
    where = { companyId: callerUser?.companyId }
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return { success: true, data: users }
})
