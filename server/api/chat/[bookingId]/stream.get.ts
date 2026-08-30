import { prisma } from '~/server/utils/prisma'
import { registerSSE, unregisterSSE } from '~/server/utils/chatSSE'
import { verifyToken } from '~/utils/jwt'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { bookingId } = getRouterParams(event)

  // EventSource no puede enviar Authorization header — leer token de query param
  const query = getQuery(event)
  const token = (query.token as string) ?? getHeader(event, 'authorization')?.slice(7)
  if (!token) throw createError({ statusCode: 401, message: 'No autorizado' })

  let user: { userId: string; role: string; email: string }
  try {
    user = await verifyToken(token, config.jwtSecret) as typeof user
  } catch {
    throw createError({ statusCode: 401, message: 'Token inválido' })
  }

  const booking = await prisma.supplierBooking.findUnique({
    where: { id: bookingId },
    include: { supplier: { select: { supplierUserId: true } } },
  })

  if (!booking) throw createError({ statusCode: 404, message: 'Booking no encontrado' })

  if (user.role === 'SUPPLIER') {
    if (booking.supplier.supplierUserId !== user.userId)
      throw createError({ statusCode: 403, message: 'Sin acceso' })
  } else if (!['ADMIN', 'ORGANIZER', 'ENCARGADO'].includes(user.role)) {
    throw createError({ statusCode: 403, message: 'Sin permisos' })
  }

  const res = event.node.res
  const req = event.node.req

  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  })
  res.flushHeaders()

  const send = (data: string) => {
    try { res.write(`data: ${data}\n\n`) } catch { /* connection closed */ }
  }

  registerSSE(bookingId, send)

  // Heartbeat each 25s to keep nginx from closing the idle connection
  const heartbeat = setInterval(() => {
    try { res.write(': ping\n\n') } catch { }
  }, 25000)

  await new Promise<void>((resolve) => {
    req.on('close', resolve)
    req.on('error', resolve)
  })

  clearInterval(heartbeat)
  unregisterSSE(bookingId, send)
})
