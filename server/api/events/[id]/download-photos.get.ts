import JSZip from 'jszip'
import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireRole(event, ['ADMIN', 'ORGANIZER', 'ENCARGADO'])

  const id = getRouterParam(event, 'id')

  const [eventData, photos] = await Promise.all([
    prisma.event.findUnique({ where: { id }, select: { name: true } }),
    prisma.photo.findMany({
      where: { eventId: id, status: 'APPROVED' },
      orderBy: { uploadedAt: 'asc' },
      select: { id: true, url: true, uploadedAt: true, guest: { select: { name: true } } },
    }),
  ])

  if (!eventData) {
    throw createError({ statusCode: 404, message: 'Evento no encontrado' })
  }

  if (photos.length === 0) {
    throw createError({ statusCode: 404, message: 'Este evento no tiene fotos' })
  }

  const zip = new JSZip()
  const folder = zip.folder(eventData.name.replace(/[^a-z0-9\s-]/gi, '').trim()) as JSZip

  const chunkSize = 10
  for (let i = 0; i < photos.length; i += chunkSize) {
    const chunk = photos.slice(i, i + chunkSize)
    await Promise.all(
      chunk.map(async (photo, idx) => {
        try {
          const res = await fetch(photo.url)
          if (!res.ok) return
          const buffer = await res.arrayBuffer()
          const ext = photo.url.includes('.png') ? 'png' : 'jpg'
          const guestName = photo.guest?.name?.replace(/[^a-z0-9\s]/gi, '') ?? 'invitado'
          const num = String(i + idx + 1).padStart(3, '0')
          folder.file(`${num}_${guestName}.${ext}`, buffer)
        } catch {

        }
      }),
    )
  }

  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  })

  const safeName = eventData.name.replace(/[^a-z0-9\s-]/gi, '').trim().replace(/\s+/g, '-').toLowerCase()

  setHeader(event, 'Content-Type', 'application/zip')
  setHeader(event, 'Content-Disposition', `attachment; filename="fotos-${safeName}.zip"`)
  setHeader(event, 'Content-Length', zipBuffer.length)

  return zipBuffer
})
