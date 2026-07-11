import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN'])

  const id = getRouterParam(event, 'id')

  const supplier = await prisma.supplier.findUnique({ where: { id } })
  if (!supplier) throw createError({ statusCode: 404, message: 'Proveedor no encontrado' })

  await prisma.supplier.delete({ where: { id } })

  return { success: true }
})
