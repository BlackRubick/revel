import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

const schema = z.object({
  name: z.string().min(2).optional(),
  category: z.string().min(2).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
  supplierUserId: z.string().uuid().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN'])

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, message: 'Datos inválidos' })
  }

  const supplier = await prisma.supplier.findUnique({ where: { id } })
  if (!supplier) throw createError({ statusCode: 404, message: 'Proveedor no encontrado' })

  const { email, supplierUserId, ...rest } = parsed.data

  const updated = await prisma.supplier.update({
    where: { id },
    data: {
      ...rest,
      ...(email !== undefined ? { email: email || null } : {}),
      ...(supplierUserId !== undefined ? { supplierUserId: supplierUserId ?? null } : {}),
    },
    include: {
      supplierUser: { select: { id: true, name: true, email: true, isActive: true } },
    },
  })

  return { success: true, data: updated }
})
