import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'

const schema = z.object({ refreshToken: z.string() })

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (parsed.success) {
    await prisma.refreshToken.deleteMany({ where: { token: parsed.data.refreshToken } })
  }

  return { success: true, message: 'Sesión cerrada' }
})
