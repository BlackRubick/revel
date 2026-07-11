import { Server as SocketIOServer } from 'socket.io'

export default defineNitroPlugin((nitroApp) => {
  const storage = useStorage('redis') as unknown

  const io = new SocketIOServer({
    cors: {
      origin: process.env.APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  })

  ;(nitroApp as { node?: { server?: object } }).node?.server && io.attach((nitroApp as { node: { server: object } }).node.server)

  io.on('connection', (socket) => {
    const eventId = socket.handshake.query.eventId as string

    socket.on('join-event', (id: string) => {
      socket.join(`event:${id}`)
    })

    if (eventId) socket.join(`event:${eventId}`)

    socket.on('disconnect', () => {})
  })

  ;(nitroApp as { $socket?: SocketIOServer }).$socket = io
})
