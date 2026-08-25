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
  churchName: z.string().optional(),
  churchAddress: z.string().optional(),
  templateId: z.string().optional(),
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
    include: {
      package: true,
      organizer: { select: { id: true, name: true, email: true } },
      tables: { orderBy: { number: 'asc' }, include: { guests: true } },
      _count: { select: { guests: true, photos: true, videos: true, messages: true } },
    },
  })

  // Sync event_tables when tableCount or tableCapacity changes
  if (parsed.data.tableCount !== undefined || parsed.data.tableCapacity !== undefined) {
    const newCount = updated.tableCount
    const newCapacity = updated.tableCapacity

    const existingTables = await prisma.eventTable.findMany({
      where: { eventId: id! },
      orderBy: { number: 'asc' },
    })

    const currentCount = existingTables.length

    // Update capacity on all existing tables
    if (parsed.data.tableCapacity !== undefined) {
      await prisma.eventTable.updateMany({
        where: { eventId: id! },
        data: { capacity: newCapacity },
      })
    }

    // Add missing tables if count increased
    if (newCount > currentCount) {
      for (let i = currentCount + 1; i <= newCount; i++) {
        await prisma.eventTable.create({
          data: { eventId: id!, number: i, name: `Mesa ${i}`, capacity: newCapacity, shape: 'ROUND', positionX: 0, positionY: 0 },
        })
      }
    }

    // Remove extra tables if count decreased (only unassigned ones first)
    if (newCount < currentCount) {
      const toRemove = existingTables.slice(newCount)
      for (const table of toRemove) {
        await prisma.eventTable.delete({ where: { id: table.id } }).catch(() => {})
      }
    }
  }

  return { success: true, data: updated }
})
