import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN', 'ENCARGADO', 'ORGANIZER'])

  const suppliers = await prisma.supplier.findMany({
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
    include: {
      supplierUser: { select: { id: true, name: true, email: true, isActive: true } },
      _count: { select: { bookings: true } },
    },
  })

  return { success: true, data: suppliers }
})
