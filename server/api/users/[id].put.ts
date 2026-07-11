import { hash } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

const adminSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['ADMIN', 'ORGANIZER', 'SCANNER', 'SCREEN']).optional(),
  isActive: z.boolean().optional(),
})

const encargadoSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['ORGANIZER', 'SCANNER', 'SCREEN']).optional(),
  isActive: z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  const caller = await requireRole(event, ['ADMIN', 'ENCARGADO'])

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const isEncargado = caller.role === 'ENCARGADO'
  const parsed = (isEncargado ? encargadoSchema : adminSchema).safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 422, message: 'Datos inválidos' })
  }

  if (isEncargado) {
    const callerUser = await prisma.user.findUnique({
      where: { id: caller.userId },
      select: { companyId: true },
    })
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { companyId: true },
    })
    if (!targetUser || targetUser.companyId !== callerUser?.companyId) {
      throw createError({ statusCode: 403, message: 'Sin permisos para editar este usuario' })
    }
  }

  const { password, ...rest } = parsed.data
  const data: Record<string, unknown> = { ...rest }

  if (password) {
    data.passwordHash = await hash(password, 10)
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
  })

  return { success: true, data: user }
})
