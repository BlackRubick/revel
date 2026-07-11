import { z } from 'zod'
import { requireRole } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { generateEventSlug } from '~/utils/slugify'
import { nanoid } from 'nanoid'

const schema = z.object({
  name: z.string().min(3).max(120),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  date: z.string(),
  time: z.string(),
  venue: z.string().min(2),
  venueAddress: z.string().optional(),
  venueMapUrl: z.string().optional(),
  type: z.string(),
  tableCount: z.number().int().min(1).max(200).default(10),
  tableCapacity: z.number().int().min(1).max(50).default(8),
  packageId: z.string().uuid(),
  giftListUrl: z.string().optional(),
  customColor: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const auth = await requireRole(event, ['ADMIN', 'ORGANIZER', 'ENCARGADO'])
  const body = await readBody(event)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, message: 'Datos inválidos', data: parsed.error.issues })
  }

  const data = parsed.data
  const slug = generateEventSlug(data.name)
  const qrAlbumCode = nanoid(12)

  const newEvent = await prisma.event.create({
    data: {
      ...data,
      slug,
      qrAlbumCode,
      organizerId: auth.userId,
      date: new Date(data.date),
      status: 'DRAFT',
    },
    include: {
      package: { select: { name: true, type: true } },
    },
  })

  const tables = Array.from({ length: data.tableCount }, (_, i) => ({
    eventId: newEvent.id,
    number: i + 1,
    name: `Mesa ${i + 1}`,
    capacity: data.tableCapacity,
  }))

  await prisma.eventTable.createMany({ data: tables })

  return { success: true, data: newEvent }
})
