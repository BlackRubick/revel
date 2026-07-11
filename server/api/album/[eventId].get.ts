import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, 'eventId')

  const eventRecord = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, name: true, date: true, time: true, status: true },
  })

  if (!eventRecord) {
    throw createError({ statusCode: 404, message: 'Evento no encontrado' })
  }

  const eventDate = new Date(eventRecord.date)
  const [hours, minutes] = (eventRecord.time ?? '00:00').split(':').map(Number)
  const eventStart = new Date(Date.UTC(
    eventDate.getUTCFullYear(),
    eventDate.getUTCMonth(),
    eventDate.getUTCDate(),
    hours ?? 0,
    minutes ?? 0,
    0,
  ))

  return {
    success: true,
    data: {
      id: eventRecord.id,
      name: eventRecord.name,
      date: eventRecord.date,
      time: eventRecord.time,
      status: eventRecord.status,
      startsAt: eventStart.toISOString(),
      hasStarted: new Date() >= eventStart,
    },
  }
})
