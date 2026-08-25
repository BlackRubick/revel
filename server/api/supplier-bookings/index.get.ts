import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const caller = await requireRole(event, ['ADMIN', 'ENCARGADO', 'ORGANIZER', 'SUPPLIER'])

  const query = getQuery(event)
  const supplierId = query.supplierId as string | undefined
  const eventId = query.eventId as string | undefined

  let where: Record<string, unknown> = {}

  if (caller.role === 'SUPPLIER') {
    // Supplier solo ve sus propias bookings
    const supplierProfile = await prisma.supplier.findUnique({
      where: { supplierUserId: caller.userId },
      select: { id: true },
    })
    if (!supplierProfile) return { success: true, data: [] }
    where.supplierId = supplierProfile.id
  } else {
    if (supplierId) where.supplierId = supplierId
    if (eventId) where.eventId = eventId
  }

  const bookings = await prisma.supplierBooking.findMany({
    where,
    include: {
      supplier: { select: { id: true, name: true, category: true, phone: true, email: true } },
      event: { select: { id: true, name: true, slug: true, date: true, venue: true, type: true } },
    },
    orderBy: { eventDate: 'asc' },
  })

  return { success: true, data: bookings }
})
