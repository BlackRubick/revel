import { z } from 'zod'
import { requireRole } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

const schema = z.object({
  guestId: z.string().uuid(),
  tableId: z.string().uuid().nullable(),
})

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN', 'ORGANIZER', 'ENCARGADO'])
  const body = await readBody(event)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, message: 'Datos inválidos' })
  }

  const { guestId, tableId } = parsed.data

  if (tableId) {
    const [table, guestToAssign] = await Promise.all([
      prisma.eventTable.findUnique({ where: { id: tableId } }),
      prisma.guest.findUnique({ where: { id: guestId }, select: { companions: true } }),
    ])

    if (!table) throw createError({ statusCode: 404, message: 'Mesa no encontrada' })
    if (!guestToAssign) throw createError({ statusCode: 404, message: 'Invitado no encontrado' })

    const guestsAtTable = await prisma.guest.findMany({
      where: { tableId, id: { not: guestId } },
      select: { companions: true },
    })
    const occupiedSeats = guestsAtTable.reduce((sum, g) => sum + 1 + g.companions, 0)
    const seatsNeeded = 1 + guestToAssign.companions

    if (occupiedSeats + seatsNeeded > table.capacity) {
      const available = table.capacity - occupiedSeats
      throw createError({
        statusCode: 409,
        message: `Capacidad insuficiente. Se necesitan ${seatsNeeded} lugares (invitado + ${guestToAssign.companions} acompañante${guestToAssign.companions !== 1 ? 's' : ''}) pero la mesa solo tiene ${available} lugar${available !== 1 ? 'es' : ''} disponible${available !== 1 ? 's' : ''}.`,
      })
    }
  }

  const updated = await prisma.guest.update({
    where: { id: guestId },
    data: { tableId },
    include: { table: { select: { id: true, number: true, name: true } } },
  })

  return { success: true, data: updated }
})
