import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const photoId = getRouterParam(event, 'id')

  const annotations = await prisma.photoAnnotation.findMany({
    where: { photoId, status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
    select: { id: true, url: true, authorName: true, createdAt: true },
  })

  return { success: true, data: annotations }
})
