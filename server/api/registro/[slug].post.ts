import { z } from 'zod'
import QRCode from 'qrcode'
import { nanoid } from 'nanoid'
import { prisma } from '~/server/utils/prisma'

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  companions: z.number().int().min(0).max(20).default(0),
  companionNames: z.array(z.string().max(100)).optional().default([]),
  company: z.string().trim().max(150).optional(),
  phone: z.string().trim().max(30).optional(),
  email: z.string().trim().max(150).optional(),
})

// En eventos empresariales se piden los datos de contacto del asistente
const businessSchema = z.object({
  company: z.string({ required_error: 'Escribe tu empresa o institución' }).trim().min(2, 'Escribe tu empresa o institución').max(150),
  phone: z.string({ required_error: 'Escribe tu teléfono' }).trim().refine(v => v.replace(/\D/g, '').length >= 10, 'Escribe un teléfono válido (10 dígitos)'),
  email: z.string({ required_error: 'Escribe tu correo electrónico' }).trim().email('Escribe un correo electrónico válido'),
})

async function generateQR(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    color: { dark: '#D4AF37', light: '#0A0A0A' },
    width: 300,
    margin: 2,
  })
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const body = await readBody(event)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, message: parsed.error.issues[0]?.message ?? 'Datos inválidos' })
  }

  const ev = await prisma.event.findUnique({
    where: { slug },
    select: {
      id: true, name: true, date: true, time: true, venue: true,
      venueAddress: true, venueMapUrl: true, coverImage: true,
      type: true, category: true, churchName: true, churchAddress: true, status: true,
    },
  })

  if (!ev) throw createError({ statusCode: 404, message: 'Evento no encontrado' })
  if (ev.status === 'FINISHED' || ev.status === 'CANCELLED') {
    throw createError({ statusCode: 410, message: 'Este evento ya finalizó o fue cancelado' })
  }

  const config = useRuntimeConfig()
  const isBusiness = ev.category === 'BUSINESS'

  let contact: z.infer<typeof businessSchema> | null = null
  if (isBusiness) {
    const parsedContact = businessSchema.safeParse(parsed.data)
    if (!parsedContact.success) {
      throw createError({ statusCode: 422, message: parsedContact.error.issues[0]?.message ?? 'Datos inválidos' })
    }
    contact = { ...parsedContact.data, email: parsedContact.data.email.toLowerCase() }
  }

  // En empresariales cada asistente se registra por su cuenta, sin acompañantes
  const companionCount = isBusiness ? 0 : parsed.data.companions
  const companionNames = isBusiness ? [] : parsed.data.companionNames

  // Social: un registro por nombre. Empresarial: un registro por correo
  const existing = await prisma.guest.findFirst({
    where: contact
      ? { eventId: ev.id, email: contact.email }
      : { eventId: ev.id, name: parsed.data.name.trim() },
  })
  if (existing) {
    throw createError({
      statusCode: 409,
      message: `Ya existe un registro con ese ${contact ? 'correo' : 'nombre'} para este evento. Si ya te registraste, revisa el QR que recibiste anteriormente.`,
    })
  }

  const guest = await prisma.guest.create({
    data: {
      eventId: ev.id,
      name: parsed.data.name.trim(),
      company: contact?.company ?? null,
      phone: contact?.phone ?? null,
      email: contact?.email ?? null,
      companions: companionCount,
      rsvpStatus: 'CONFIRMED',
      rsvpAt: new Date(),
    },
  })

  // QR del invitado principal
  const guestCode = nanoid(16)
  const guestQrImage = await generateQR(`${config.public.appUrl}/confirmar/${guestCode}`)
  await prisma.qRCode.create({
    data: { eventId: ev.id, guestId: guest.id, type: 'GUEST', code: guestCode, qrImage: guestQrImage },
  })

  // QR por cada acompañante nombrado
  const companionResults: { name: string; qrImage: string; code: string }[] = []

  const names = companionNames.slice(0, companionCount)
  for (let i = 0; i < companionCount; i++) {
    const companionName = names[i]?.trim() || `Acompañante ${i + 1}`

    const companion = await prisma.companion.create({
      data: { guestId: guest.id, name: companionName },
    })

    const companionCode = nanoid(16)
    const companionQrImage = await generateQR(`${config.public.appUrl}/confirmar/${companionCode}`)
    await prisma.qRCode.create({
      data: {
        eventId: ev.id,
        guestId: guest.id,
        companionId: companion.id,
        type: 'COMPANION',
        code: companionCode,
        qrImage: companionQrImage,
      },
    })

    companionResults.push({ name: companionName, qrImage: companionQrImage, code: companionCode })
  }

  return {
    success: true,
    data: {
      guest: { name: guest.name, company: guest.company, companions: guest.companions },
      event: ev,
      code: guestCode,
      qrImage: guestQrImage,
      companionResults,
    },
  }
})
