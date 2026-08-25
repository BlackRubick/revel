import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN', 'ENCARGADO'])

  const id = getRouterParam(event, 'id')
  const existing = await prisma.supplierBooking.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Booking no encontrado' })

  await prisma.supplierBooking.delete({ where: { id } })
  return { success: true }
})
