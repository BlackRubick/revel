import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

const schema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const caller = await requireRole(event, ['ADMIN'])

  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, message: 'Datos inválidos' })
  }

  const { email, ...rest } = parsed.data

  const supplier = await prisma.supplier.create({
    data: { ...rest, email: email || null, creatorId: caller.userId },
  })

  return { success: true, data: supplier }
})
