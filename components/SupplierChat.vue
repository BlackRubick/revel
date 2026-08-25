<template>
  <!-- Overlay -->
  <Teleport to="body">
    <Transition name="chat-overlay">
      <div v-if="modelValue" class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />
    </Transition>

    <!-- Panel -->
    <Transition name="chat-panel">
      <div
        v-if="modelValue"
        class="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col bg-revel-gray-dark border-l border-white/8 shadow-2xl"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 px-5 py-4 border-b border-white/8 flex-shrink-0">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-white text-sm truncate">{{ supplierName }}</h3>
            <p class="text-xs text-white/40 truncate mt-0.5">{{ eventName }}</p>
          </div>
          <button
            class="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all flex-shrink-0"
            @click="$emit('update:modelValue', false)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Messages -->
        <div ref="messagesEl" class="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <div v-if="loadingMessages" class="flex justify-center py-8">
            <div class="w-5 h-5 border-2 border-revel-gold/30 border-t-revel-gold rounded-full animate-spin"/>
          </div>

          <div v-else-if="!allMessages.length" class="flex flex-col items-center justify-center py-12 text-center">
            <svg class="w-10 h-10 text-white/15 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <p class="text-white/35 text-sm">No hay mensajes aún.</p>
            <p class="text-white/20 text-xs mt-1">Escribe el primero para comenzar la conversación.</p>
          </div>

          <template v-else>
            <div
              v-for="msg in allMessages"
              :key="msg.id"
              :class="isMine(msg) ? 'items-end' : 'items-start'"
              class="flex flex-col gap-1"
            >
              <div class="flex items-center gap-2" :class="isMine(msg) ? 'flex-row-reverse' : 'flex-row'">
                <!-- Avatar -->
                <div
                  class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  :class="isMine(msg) ? 'bg-revel-gold/20 text-revel-gold' : 'bg-white/10 text-white/60'"
                >
                  {{ msg.sender?.name?.[0]?.toUpperCase() ?? '?' }}
                </div>
                <!-- Bubble -->
                <div
                  class="max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                  :class="isMine(msg)
                    ? 'bg-revel-gold/15 border border-revel-gold/25 text-white rounded-br-sm'
                    : 'bg-white/[0.06] border border-white/8 text-white/85 rounded-bl-sm'"
                >
                  {{ msg.message }}
                </div>
              </div>
              <div class="flex items-center gap-1.5 px-8" :class="isMine(msg) ? 'flex-row-reverse' : 'flex-row'">
                <span class="text-[10px] text-white/25">{{ senderLabel(msg) }}</span>
                <span class="text-[10px] text-white/20">·</span>
                <span class="text-[10px] text-white/25">{{ formatTime(msg.createdAt) }}</span>
              </div>
            </div>
          </template>
        </div>

        <!-- Input -->
        <div class="px-4 py-3 border-t border-white/8 flex-shrink-0">
          <div class="flex gap-2">
            <input
              v-model="draft"
              type="text"
              placeholder="Escribe un mensaje..."
              class="flex-1 px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder-white/25 focus:outline-none focus:border-revel-gold/40 focus:bg-white/[0.07] transition-all"
              @keydown.enter.prevent="sendMessage"
            />
            <button
              :disabled="!draft.trim() || sending"
              class="w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
              :class="draft.trim() && !sending
                ? 'bg-revel-gold hover:bg-revel-gold/80 text-revel-black shadow-gold'
                : 'bg-white/5 text-white/20 cursor-not-allowed'"
              @click="sendMessage"
            >
              <svg v-if="!sending" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
              <div v-else class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { ChatMessage } from '~/types'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
  modelValue: boolean
  bookingId: string
  supplierName: string
  eventName: string
}>()

defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const auth = useAuthStore()
const { get, post } = useApi()

const bookingIdRef = toRef(props, 'bookingId')
const { messages: socketMessages, connect, disconnect } = useChat(bookingIdRef)

const historicalMessages = ref<ChatMessage[]>([])
const loadingMessages = ref(false)
const draft = ref('')
const sending = ref(false)
const messagesEl = ref<HTMLElement | null>(null)

const allMessages = computed<ChatMessage[]>(() => {
  const socketIds = new Set(socketMessages.value.map(m => m.id))
  const merged = [
    ...historicalMessages.value.filter(m => !socketIds.has(m.id)),
    ...socketMessages.value,
  ]
  return merged.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
})

async function loadMessages() {
  if (!props.bookingId) return
  loadingMessages.value = true
  try {
    const res = await get<{ success: boolean; data: ChatMessage[] }>(`/api/chat/${props.bookingId}`)
    historicalMessages.value = res.data
  } catch {
    historicalMessages.value = []
  } finally {
    loadingMessages.value = false
  }
}

async function sendMessage() {
  const text = draft.value.trim()
  if (!text || sending.value) return
  sending.value = true
  try {
    await post(`/api/chat/${props.bookingId}`, { message: text })
    draft.value = ''
  } catch {
    // error silencioso; el socket entregará el mensaje si se envió
  } finally {
    sending.value = false
  }
}

function isMine(msg: ChatMessage) {
  return msg.senderId === auth.user?.id
}

function senderLabel(msg: ChatMessage) {
  if (!msg.sender) return ''
  if (isMine(msg)) return 'Tú'
  const roleLabel: Record<string, string> = {
    ADMIN: 'Admin',
    ORGANIZER: 'Organizador',
    ENCARGADO: 'Encargado',
    SUPPLIER: 'Proveedor',
  }
  return msg.sender.name ?? roleLabel[msg.sender.role ?? ''] ?? ''
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) + ' ' + d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

async function scrollToBottom() {
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

watch(() => props.modelValue, async (open) => {
  if (open) {
    await loadMessages()
    await connect()
    scrollToBottom()
  } else {
    disconnect()
  }
})

watch(allMessages, () => scrollToBottom(), { deep: true })
</script>

<style scoped>
.chat-overlay-enter-active,
.chat-overlay-leave-active {
  transition: opacity 0.2s ease;
}
.chat-overlay-enter-from,
.chat-overlay-leave-to {
  opacity: 0;
}

.chat-panel-enter-active,
.chat-panel-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.chat-panel-enter-from,
.chat-panel-leave-to {
  transform: translateX(100%);
}
</style>
