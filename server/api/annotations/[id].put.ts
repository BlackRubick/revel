import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'
import { checkEventModerationAccess } from '~/server/utils/annotationAccess'

const schema = z.object({ status: z.enum(['APPROVED', 'REJECTED']) })

export default defineEventHandler(async (event) => {
  const user = await requireRole(event, ['ADMIN', 'ORGANIZER', 'ENCARGADO'])
  const id = getRouterParam(event, 'id')

  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 422, message: 'Estado inválido' })

  const annotation = await prisma.photoAnnotation.findUnique({ where: { id }, select: { eventId: true } })
  if (!annotation) throw createError({ statusCode: 404, message: 'Dedicatoria no encontrada' })
  await checkEventModerationAccess(annotation.eventId, user)

  const updated = await prisma.photoAnnotation.update({ where: { id }, data: { status: parsed.data.status } })
  return { success: true, data: updated }
})
