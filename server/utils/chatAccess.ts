import { prisma } from '~/server/utils/prisma'

/**
 * Verifica que el usuario tenga acceso al chat de un booking.
 * Solo pueden acceder:
 *   - El SUPPLIER vinculado al booking
 *   - El ORGANIZER del evento al que pertenece el booking
 *   - Cualquier ADMIN
 */
export async function checkChatAccess(
  bookingId: string,
  user: { userId: string; role: string },
) {
  const booking = await prisma.supplierBooking.findUnique({
    where: { id: bookingId },
    include: {
      supplier: { select: { supplierUserId: true } },
      event:    { select: { organizerId: true } },
    },
  })

  if (!booking) throw createError({ statusCode: 404, message: 'Booking no encontrado' })

  const isAdmin     = user.role === 'ADMIN'
  const isSupplier  = user.role === 'SUPPLIER'  && booking.supplier.supplierUserId === user.userId
  const isOrganizer = user.role === 'ORGANIZER' && booking.event.organizerId       === user.userId

  if (!isAdmin && !isSupplier && !isOrganizer) {
    throw createError({ statusCode: 403, message: 'Sin acceso a este chat' })
  }

  return booking
}
