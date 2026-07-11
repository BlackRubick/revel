import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const query = getQuery(event)
  const eventId = query.eventId as string

  if (!eventId) throw createError({ statusCode: 400, message: 'eventId requerido' })

  const tables = await prisma.eventTable.findMany({
    where: { eventId },
    orderBy: { number: 'asc' },
    include: {
      guests: {
        select: { id: true, name: true, companions: true, rsvpStatus: true, checkedIn: true },
      },
    },
  })

  return { success: true, data: tables }
})
