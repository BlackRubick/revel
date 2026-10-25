import { requireRole } from '~/server/utils/auth'
import { deletePhotos } from '~/server/utils/photoDeletion'

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN'])
  const id = getRouterParam(event, 'id')

  const deleted = await deletePhotos({ id })
  if (!deleted) throw createError({ statusCode: 404, message: 'Foto no encontrada' })

  return { success: true }
})
