import { prisma } from '~/server/utils/prisma'

/** Solo ADMIN, ENCARGADO o el ORGANIZER dueño del evento pueden moderar. */
export async function checkEventModerationAccess(eventId: string, user: { userId: string; role: string }) {
  if (user.role === 'ADMIN' || user.role === 'ENCARGADO') return
  const ev = await prisma.event.findUnique({ where: { id: eventId }, select: { organizerId: true } })
  if (!ev) throw createError({ statusCode: 404, message: 'Evento no encontrado' })
  if (ev.organizerId !== user.userId) {
    throw createError({ statusCode: 403, message: 'Sin acceso a este evento' })
  }
}
