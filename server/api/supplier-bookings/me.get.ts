import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const caller = await requireRole(event, ['SUPPLIER'])

  const supplier = await prisma.supplier.findUnique({
    where: { supplierUserId: caller.userId },
    select: {
      id: true,
      name: true,
      category: true,
      email: true,
      phone: true,
      website: true,
      address: true,
      notes: true,
      isActive: true,
    },
  })

  if (!supplier) {
    return { success: true, data: null }
  }

  return { success: true, data: supplier }
})
