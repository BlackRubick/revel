import { ref, onUnmounted } from 'vue'
import type { Socket } from 'socket.io-client'

export function useSocket(eventId: string) {
  const socket = ref<Socket | null>(null)
  const connected = ref(false)
  const photos = ref<unknown[]>([])
  const messages = ref<unknown[]>([])

  async function connect() {
    if (import.meta.server) return

    const { io } = await import('socket.io-client')
    const config = useRuntimeConfig()

    socket.value = io(config.public.socketUrl, {
      query: { eventId },
      transports: ['websocket', 'polling'],
    })

    socket.value.on('connect', () => {
      connected.value = true
      socket.value?.emit('join-event', eventId)
    })

    socket.value.on('disconnect', () => {
      connected.value = false
    })

    socket.value.on('new-photo', (photo: unknown) => {
      photos.value.unshift(photo)
    })

    socket.value.on('new-message', (msg: unknown) => {
      messages.value.unshift(msg)
    })
  }

  function disconnect() {
    socket.value?.disconnect()
    socket.value = null
    connected.value = false
  }

  onUnmounted(disconnect)

  return { socket, connected, photos, messages, connect, disconnect }
}
