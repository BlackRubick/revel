import { z } from 'zod'
import { requireRole } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import QRCode from 'qrcode'
import { nanoid } from 'nanoid'

const schema = z.object({
  eventId: z.string().uuid(),
  name: z.string().min(2).max(100),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  companions: z.number().int().min(0).max(20).default(0),
  tableId: z.string().optional(),
  notes: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const auth = await requireRole(event, ['ADMIN', 'ORGANIZER', 'ENCARGADO'])
  const body = await readBody(event)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, message: 'Datos inválidos', data: parsed.error.issues })
  }

  const data = parsed.data

  const ev = await prisma.event.findUnique({ where: { id: data.eventId } })
  if (!ev) throw createError({ statusCode: 404, message: 'Evento no encontrado' })
  if (auth.role !== 'ADMIN' && ev.organizerId !== auth.userId) {
    throw createError({ statusCode: 403, message: 'Sin permisos' })
  }

  const guest = await prisma.guest.create({
    data: {
      eventId: data.eventId,
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
      companions: data.companions,
      tableId: data.tableId || null,
      notes: data.notes || null,
    },
  })

  const code = nanoid(16)
  const config = useRuntimeConfig()
  const qrUrl = `${config.public.appUrl}/confirmar/${code}`
  const qrImage = await QRCode.toDataURL(qrUrl, {
    color: { dark: '#D4AF37', light: '#0A0A0A' },
    width: 300,
    margin: 2,
  })

  await prisma.qRCode.create({
    data: { eventId: data.eventId, guestId: guest.id, type: 'GUEST', code, qrImage },
  })

  const guestWithQr = await prisma.guest.findUnique({
    where: { id: guest.id },
    include: {
      table: { select: { id: true, number: true, name: true } },
      qrCodes: { select: { id: true, code: true, qrImage: true, type: true } },
    },
  })

  return { success: true, data: guestWithQr }
})
