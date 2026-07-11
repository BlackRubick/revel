import { z } from 'zod'
import { requireRole } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

const schema = z.object({ code: z.string() })

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN', 'ORGANIZER', 'SCANNER'])
  const body = await readBody(event)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, message: 'Código requerido' })
  }

  let code = parsed.data.code.trim()
  try {
    const url = new URL(code)
    const parts = url.pathname.split('/')
    code = parts[parts.length - 1]
  } catch {

  }

  const qr = await prisma.qRCode.findUnique({
    where: { code },
    include: {
      guest: {
        include: {
          event: { select: { id: true, name: true, date: true } },
          table: { select: { id: true, number: true, name: true } },
        },
      },
    },
  })

  if (!qr) {
    return { success: false, valid: false, message: 'Código no encontrado' }
  }

  if (!qr.isActive) {
    return { success: false, valid: false, message: 'Código desactivado' }
  }

  if (qr.guest?.checkedIn) {
    return { success: false, valid: false, duplicate: true, message: 'QR ya utilizado', data: qr }
  }

  if (qr.guestId) {
    await prisma.guest.update({
      where: { id: qr.guestId },
      data: { checkedIn: true, checkedInAt: new Date() },
    })
  }

  await prisma.qRCode.update({
    where: { id: qr.id },
    data: { usedAt: new Date(), usedCount: { increment: 1 } },
  })

  return { success: true, valid: true, message: 'Entrada válida', data: qr }
})
