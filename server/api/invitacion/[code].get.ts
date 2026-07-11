import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')

  const qr = await prisma.qRCode.findUnique({
    where: { code },
    include: {
      guest: {
        select: {
          id: true,
          name: true,
          companions: true,
          rsvpStatus: true,
          event: {
            select: {
              id: true,
              name: true,
              date: true,
              time: true,
              venue: true,
              venueAddress: true,
              venueMapUrl: true,
              coverImage: true,
              type: true,
            },
          },
          table: { select: { name: true, number: true } },
        },
      },
    },
  })

  if (!qr?.guest) {
    throw createError({ statusCode: 404, message: 'Invitación no encontrada' })
  }

  return { success: true, data: { code: qr.code, guest: qr.guest } }
})
