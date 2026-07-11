import { H3Event, getHeader, createError } from 'h3'
import { verifyToken } from '~/utils/jwt'

export async function requireAuth(event: H3Event) {
  const config = useRuntimeConfig()
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'No autorizado' })
  }

  const token = authHeader.slice(7)

  try {
    const payload = await verifyToken(token, config.jwtSecret)
    return payload as { userId: string; role: string; email: string }
  } catch {
    throw createError({ statusCode: 401, message: 'Token inválido o expirado' })
  }
}

export async function requireRole(event: H3Event, roles: string[]) {
  const user = await requireAuth(event)
  if (!roles.includes(user.role)) {
    throw createError({ statusCode: 403, message: 'Sin permisos suficientes' })
  }
  return user
}
