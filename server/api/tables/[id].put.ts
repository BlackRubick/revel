import { z } from 'zod'
import { requireRole } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

const schema = z.object({
  name: z.string().min(1).max(60).optional(),
  capacity: z.number().int().min(1).max(50).optional(),
  shape: z.enum(['ROUND', 'RECTANGULAR']).optional(),
})

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN', 'ORGANIZER', 'ENCARGADO'])
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, message: 'Datos inválidos' })
  }

  const existing = await prisma.eventTable.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Mesa no encontrada' })

  const updated = await prisma.eventTable.update({
    where: { id },
    data: parsed.data,
    include: {
      guests: {
        select: { id: true, name: true, companions: true, rsvpStatus: true, checkedIn: true },
      },
    },
  })

  return { success: true, data: updated }
})
