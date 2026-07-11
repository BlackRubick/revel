import { z } from 'zod'
import { requireRole } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

const schema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  companions: z.number().int().min(0).max(20).optional(),
  tableId: z.string().nullable().optional(),
  rsvpStatus: z.enum(['PENDING', 'CONFIRMED', 'DECLINED']).optional(),
  checkedIn: z.boolean().optional(),
  notes: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN', 'ORGANIZER', 'ENCARGADO'])
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, message: 'Datos inválidos' })
  }

  const updateData: Record<string, unknown> = { ...parsed.data }
  if (parsed.data.checkedIn === true) updateData.checkedInAt = new Date()
  if (parsed.data.rsvpStatus) updateData.rsvpAt = new Date()

  const updated = await prisma.guest.update({
    where: { id },
    data: updateData,
    include: {
      table: { select: { id: true, number: true, name: true } },
      qrCodes: { select: { id: true, code: true, qrImage: true, type: true } },
    },
  })

  return { success: true, data: updated }
})
