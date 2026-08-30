import { requireAuth } from '~/server/utils/auth'
import { upsertPresence } from '~/server/utils/chatPresence'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const { bookingId } = getRouterParams(event)
  const body = await readBody(event)

  upsertPresence(bookingId, user.userId, body?.isTyping === true)

  return { success: true }
})
