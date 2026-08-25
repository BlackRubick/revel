import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN', 'ENCARGADO', 'ORGANIZER'])

  const id = getRouterParam(event, 'id')
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      bookings: {
        include: {
          event: { select: { id: true, name: true, slug: true, date: true, venue: true, type: true, status: true } },
        },
        orderBy: { eventDate: 'asc' },
      },
      supplierUser: { select: { id: true, name: true, email: true, isActive: true } },
    },
  })

  if (!supplier) throw createError({ statusCode: 404, message: 'Proveedor no encontrado' })

  return { success: true, data: supplier }
})
