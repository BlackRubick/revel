import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

const schema = z.object({
  supplierId: z.string().uuid(),
  eventId: z.string().uuid(),
  eventDate: z.string().datetime(),
  cost: z.number().min(0),
  currency: z.string().default('MXN'),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).default('PENDING'),
  notes: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const caller = await requireRole(event, ['ADMIN', 'ENCARGADO', 'SUPPLIER'])

  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, message: 'Datos inválidos' })
  }

  // Si es SUPPLIER, solo puede crear bookings para sí mismo
  if (caller.role === 'SUPPLIER') {
    const supplierProfile = await prisma.supplier.findUnique({
      where: { supplierUserId: caller.userId },
      select: { id: true },
    })
    if (!supplierProfile || supplierProfile.id !== parsed.data.supplierId) {
      throw createError({ statusCode: 403, message: 'Sin permisos para este proveedor' })
    }
  }

  const booking = await prisma.supplierBooking.create({
    data: {
      supplierId: parsed.data.supplierId,
      eventId: parsed.data.eventId,
      eventDate: new Date(parsed.data.eventDate),
      cost: parsed.data.cost,
      currency: parsed.data.currency,
      status: parsed.data.status,
      notes: parsed.data.notes,
    },
    include: {
      supplier: { select: { id: true, name: true, category: true } },
      event: { select: { id: true, name: true, date: true, venue: true } },
    },
  })

  return { success: true, data: booking }
})
