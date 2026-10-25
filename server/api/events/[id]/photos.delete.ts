import { requireRole } from '~/server/utils/auth'
import { deletePhotos } from '~/server/utils/photoDeletion'

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN'])
  const eventId = getRouterParam(event, 'id')

  const deleted = await deletePhotos({ eventId })

  return { success: true, deleted }
})
