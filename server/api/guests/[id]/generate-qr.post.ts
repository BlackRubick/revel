import QRCode from 'qrcode'
import { nanoid } from 'nanoid'
import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN', 'ORGANIZER', 'ENCARGADO'])
  const id = getRouterParam(event, 'id')

  const guest = await prisma.guest.findUnique({
    where: { id },
    include: { qrCodes: { select: { id: true, code: true } } },
  })

  if (!guest) throw createError({ statusCode: 404, message: 'Invitado no encontrado' })

  if (guest.qrCodes.length > 0) {
    return { success: true, data: guest.qrCodes[0] }
  }

  const config = useRuntimeConfig()
  const code = nanoid(16)
  const qrUrl = `${config.public.appUrl}/confirmar/${code}`
  const qrImage = await QRCode.toDataURL(qrUrl, {
    color: { dark: '#D4AF37', light: '#0A0A0A' },
    width: 300,
    margin: 2,
  })

  const qr = await prisma.qRCode.create({
    data: { eventId: guest.eventId, guestId: guest.id, type: 'GUEST', code, qrImage },
  })

  return { success: true, data: qr }
})
