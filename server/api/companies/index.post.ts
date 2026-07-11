import { hash } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

const schema = z.object({
  company: z.object({
    name: z.string().min(2),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
  encargado: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  }),
})

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN'])

  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, message: 'Datos inválidos' })
  }

  const { company: companyData, encargado } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email: encargado.email } })
  if (existing) {
    throw createError({ statusCode: 409, message: 'Ya existe un usuario con ese correo' })
  }

  const passwordHash = await hash(encargado.password, 10)

  const result = await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        name: companyData.name,
        email: companyData.email || null,
        phone: companyData.phone || null,
        address: companyData.address || null,
      },
    })
    const user = await tx.user.create({
      data: {
        name: encargado.name,
        email: encargado.email,
        passwordHash,
        role: 'ENCARGADO',
        companyId: company.id,
      },
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    })
    return { company, encargado: user }
  })

  return { success: true, data: result }
})
