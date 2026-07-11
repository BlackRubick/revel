import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { verifyToken, signAccessToken } from '~/utils/jwt'

const schema = z.object({ refreshToken: z.string() })

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, message: 'Token requerido' })
  }

  const { refreshToken } = parsed.data

  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } })
  if (!stored || stored.expiresAt < new Date()) {
    throw createError({ statusCode: 401, message: 'Refresh token inválido' })
  }

  let payload: { userId: string; role: string; email: string }
  try {
    payload = (await verifyToken(refreshToken, config.jwtRefreshSecret)) as typeof payload
  } catch {
    throw createError({ statusCode: 401, message: 'Refresh token inválido' })
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user || !user.isActive) {
    throw createError({ statusCode: 401, message: 'Usuario inactivo' })
  }

  const accessToken = await signAccessToken(
    { userId: user.id, role: user.role, email: user.email },
    config.jwtSecret,
  )

  return { success: true, data: { accessToken } }
})
