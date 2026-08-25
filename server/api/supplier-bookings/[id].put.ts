import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

const schema = z.object({
  eventDate: z.string().datetime().optional(),
  cost: z.number().min(0).optional(),
  currency: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).optional(),
  notes: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const caller = await requireRole(event, ['ADMIN', 'ENCARGADO', 'SUPPLIER'])

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, message: 'Datos inválidos' })
  }

  const existing = await prisma.supplierBooking.findUnique({ where: { id }, include: { supplier: true } })
  if (!existing) throw createError({ statusCode: 404, message: 'Booking no encontrado' })

  // Supplier solo puede editar sus propias bookings
  if (caller.role === 'SUPPLIER') {
    if (existing.supplier.supplierUserId !== caller.userId) {
      throw createError({ statusCode: 403, message: 'Sin permisos' })
    }
  }

  const { eventDate, ...rest } = parsed.data
  const updated = await prisma.supplierBooking.update({
    where: { id },
    data: {
      ...rest,
      ...(eventDate ? { eventDate: new Date(eventDate) } : {}),
    },
    include: {
      supplier: { select: { id: true, name: true, category: true } },
      event: { select: { id: true, name: true, date: true, venue: true } },
    },
  })

  return { success: true, data: updated }
})
