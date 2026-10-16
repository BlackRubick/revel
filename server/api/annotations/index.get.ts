import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'
import { checkEventModerationAccess } from '~/server/utils/annotationAccess'

export default defineEventHandler(async (event) => {
  const user = await requireRole(event, ['ADMIN', 'ORGANIZER', 'ENCARGADO'])
  const query = getQuery(event)
  const eventId = query.eventId as string
  const status = query.status as 'PENDING' | 'APPROVED' | 'REJECTED' | undefined

  if (!eventId) throw createError({ statusCode: 400, message: 'eventId requerido' })
  await checkEventModerationAccess(eventId, user)

  const annotations = await prisma.photoAnnotation.findMany({
    where: { eventId, ...(status ? { status } : {}) },
    orderBy: { createdAt: 'desc' },
    include: { photo: { select: { id: true, url: true, thumbnailUrl: true } } },
  })

  return { success: true, data: annotations }
})
