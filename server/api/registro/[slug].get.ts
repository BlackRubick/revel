import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  const ev = await prisma.event.findUnique({
    where: { slug },
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
      churchName: true,
      churchAddress: true,
      status: true,
    },
  })

  if (!ev) throw createError({ statusCode: 404, message: 'Evento no encontrado' })

  if (ev.status === 'FINISHED' || ev.status === 'CANCELLED') {
    throw createError({ statusCode: 410, message: 'Este evento ya finalizó o fue cancelado' })
  }

  return { success: true, data: ev }
})
