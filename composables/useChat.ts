import type { Socket } from 'socket.io-client'
import type { ChatMessage } from '~/types'

export function useChat(bookingId: Ref<string>) {
  const socket = ref<Socket | null>(null)
  const messages = ref<ChatMessage[]>([])
  const connected = ref(false)

  async function connect() {
    if (import.meta.server || !bookingId.value) return

    const { io } = await import('socket.io-client')
    const config = useRuntimeConfig()

    socket.value = io(config.public.socketUrl, {
      transports: ['websocket', 'polling'],
    })

    socket.value.on('connect', () => {
      connected.value = true
      socket.value?.emit('join-chat', bookingId.value)
    })

    socket.value.on('disconnect', () => {
      connected.value = false
    })

    socket.value.on('chat-message', (msg: ChatMessage) => {
      messages.value.push(msg)
    })
  }

  function disconnect() {
    socket.value?.disconnect()
    socket.value = null
    connected.value = false
  }

  watch(bookingId, (newId, oldId) => {
    if (newId !== oldId) {
      disconnect()
      messages.value = []
      if (newId) connect()
    }
  })

  onUnmounted(disconnect)

  return { messages, connected, connect, disconnect }
}
