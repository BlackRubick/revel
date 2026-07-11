import { z } from 'zod'
import { requireRole } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

const schema = z.object({
  name: z.string().min(3).max(120).optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  venue: z.string().min(2).optional(),
  venueAddress: z.string().optional(),
  venueMapUrl: z.string().optional(),
  type: z.string().optional(),
  tableCount: z.number().int().min(1).max(200).optional(),
  tableCapacity: z.number().int().min(1).max(50).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'FINISHED', 'CANCELLED']).optional(),
  giftListUrl: z.string().optional(),
  customColor: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const auth = await requireRole(event, ['ADMIN', 'ORGANIZER', 'ENCARGADO'])
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, message: 'Datos inválidos' })
  }

  const existing = await prisma.event.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Evento no encontrado' })

  if (auth.role !== 'ADMIN' && existing.organizerId !== auth.userId) {
    throw createError({ statusCode: 403, message: 'Sin permisos' })
  }

  const updateData: Record<string, unknown> = { ...parsed.data }
  if (parsed.data.date) updateData.date = new Date(parsed.data.date)

  const updated = await prisma.event.update({
    where: { id },
    data: updateData,
    include: { package: { select: { name: true, type: true } } },
  })

  return { success: true, data: updated }
})
