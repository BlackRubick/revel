import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN'])

  const id = getRouterParam(event, 'id')

  await prisma.company.delete({ where: { id } })

  return { success: true }
})
