import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN', 'ORGANIZER', 'ENCARGADO'])
  const { id } = getRouterParams(event)

  const stages = await prisma.eventStage.findMany({
    where: { eventId: id },
    orderBy: { order: 'asc' },
  })

  return { success: true, data: stages }
})
