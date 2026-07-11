import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const packages = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  })

  return { success: true, data: packages }
})
