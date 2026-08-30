import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/auth'
import type { Server as SocketIOServer } from 'socket.io'

const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'ON_THE_WAY', 'AT_VENUE']

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const { id } = getRouterParams(event)
  const body = await readBody(event)

  if (!body?.supplierStatus || !VALID_STATUSES.includes(body.supplierStatus)) {
    throw createError({ statusCode: 400, message: 'Estado inválido' })
  }

  const booking = await prisma.supplierBooking.findUnique({
    where: { id },
    include: { supplier: { select: { supplierUserId: true } } },
  })

  if (!booking) throw createError({ statusCode: 404, message: 'Booking no encontrado' })

  if (user.role === 'SUPPLIER') {
    if (booking.supplier.supplierUserId !== user.userId) {
      throw createError({ statusCode: 403, message: 'Sin acceso' })
    }
  } else if (!['ADMIN', 'ORGANIZER', 'ENCARGADO'].includes(user.role)) {
    throw createError({ statusCode: 403, message: 'Sin permisos' })
  }

  const updated = await prisma.supplierBooking.update({
    where: { id },
    data: { supplierStatus: body.supplierStatus },
    include: {
      supplier: { select: { id: true, name: true, category: true } },
    },
  })

  const nitroApp = useNitroApp() as { $socket?: SocketIOServer }
  nitroApp.$socket?.to(`event:${booking.eventId}`).emit('supplier-status-update', {
    bookingId: id,
    supplierStatus: body.supplierStatus,
    supplierName: updated.supplier.name,
  })

  return { success: true, data: updated }
})
