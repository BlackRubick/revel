import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN'])

  const companies = await prisma.company.findMany({
    include: {
      users: {
        where: { role: 'ENCARGADO' },
        select: { id: true, name: true, email: true },
      },
      _count: { select: { users: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return { success: true, data: companies }
})
