import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')

  const qr = await prisma.qRCode.findUnique({
    where: { code },
    include: {
      guest: {
        include: {
          event: {
            include: { package: true },
          },
          table: { select: { id: true, number: true, name: true } },
        },
      },
    },
  })

  if (!qr || !qr.guest) {
    throw createError({ statusCode: 404, message: 'Código no válido' })
  }

  return { success: true, data: qr }
})
