import { hash } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

const adminSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'ORGANIZER', 'SCANNER', 'SCREEN']),
})

const encargadoSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ORGANIZER', 'SCANNER', 'SCREEN']),
})

export default defineEventHandler(async (event) => {
  const caller = await requireRole(event, ['ADMIN', 'ENCARGADO'])
  const body = await readBody(event)

  const isEncargado = caller.role === 'ENCARGADO'
  const parsed = (isEncargado ? encargadoSchema : adminSchema).safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      message: isEncargado ? 'Rol no permitido o datos inválidos' : 'Datos inválidos',
    })
  }

  const { name, email, password, role } = parsed.data

  let companyId: string | undefined
  if (isEncargado) {
    const callerUser = await prisma.user.findUnique({
      where: { id: caller.userId },
      select: { companyId: true },
    })
    if (!callerUser?.companyId) {
      throw createError({ statusCode: 403, message: 'Sin empresa asignada' })
    }
    companyId = callerUser.companyId
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, message: 'Ya existe un usuario con ese correo' })
  }

  const passwordHash = await hash(password, 10)

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role, ...(companyId ? { companyId } : {}) },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
  })

  return { success: true, data: user }
})
