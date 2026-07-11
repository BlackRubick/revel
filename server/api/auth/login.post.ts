import { compare } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { signAccessToken, signRefreshToken } from '~/utils/jwt'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, message: 'Datos inválidos' })
  }

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.isActive) {
    throw createError({ statusCode: 401, message: 'Credenciales incorrectas' })
  }

  const valid = await compare(password, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Credenciales incorrectas' })
  }

  const tokenPayload = { userId: user.id, role: user.role, email: user.email }
  const accessToken = await signAccessToken(tokenPayload, config.jwtSecret)
  const refreshToken = await signRefreshToken(tokenPayload, config.jwtRefreshSecret)

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  })

  const { passwordHash: _, ...safeUser } = user

  return {
    success: true,
    data: { user: safeUser, accessToken, refreshToken },
  }
})
