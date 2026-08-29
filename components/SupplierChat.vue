<template>
  <Teleport to="body">
    <Transition name="chat-overlay">
      <div v-if="modelValue" class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />
    </Transition>

    <Transition name="chat-panel">
      <div
        v-if="modelValue"
        class="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col bg-revel-gray-dark border-l border-white/8 shadow-2xl"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 px-5 py-4 border-b border-white/8 flex-shrink-0">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-white text-sm truncate">{{ supplierName }}</h3>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-500" :class="isOnline ? 'bg-green-400' : 'bg-white/20'" />
              <p class="text-xs truncate transition-all duration-300" :class="isTypingFresh ? 'text-revel-gold/80' : 'text-white/40'">
                <template v-if="isTypingFresh">escribiendo...</template>
                <template v-else-if="isOnline">En línea</template>
                <template v-else-if="otherLastSeenText">Última vez {{ otherLastSeenText }}</template>
                <template v-else>{{ eventName }}</template>
              </p>
            </div>
          </div>
          <button class="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all flex-shrink-0" @click="$emit('update:modelValue', false)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Messages -->
        <div ref="messagesEl" class="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <div v-if="loadingMessages" class="flex justify-center py-8">
            <div class="w-5 h-5 border-2 border-revel-gold/30 border-t-revel-gold rounded-full animate-spin"/>
          </div>

          <div v-else-if="!allMessages.length" class="flex flex-col items-center justify-center py-12 text-center">
            <svg class="w-10 h-10 text-white/15 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            <p class="text-white/35 text-sm">No hay mensajes aún.</p>
            <p class="text-white/20 text-xs mt-1">Escribe el primero para comenzar.</p>
          </div>

          <template v-else>
            <div
              v-for="(msg, i) in allMessages"
              :key="msg.id"
              class="flex flex-col gap-1 group"
              :class="isMine(msg) ? 'items-end' : 'items-start'"
            >
              <div class="flex items-end gap-2" :class="isMine(msg) ? 'flex-row-reverse' : 'flex-row'">
                <!-- Avatar -->
                <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mb-1" :class="isMine(msg) ? 'bg-revel-gold/20 text-revel-gold' : 'bg-white/10 text-white/60'">
                  {{ msg.sender?.name?.[0]?.toUpperCase() ?? '?' }}
                </div>

                <div class="flex flex-col gap-0.5 max-w-[78%]" :class="isMine(msg) ? 'items-end' : 'items-start'">
                  <!-- Bubble -->
                  <div
                    class="relative px-3 py-2 rounded-2xl text-sm leading-relaxed cursor-pointer select-none"
                    :class="[
                      isMine(msg) ? 'bg-revel-gold/15 border border-revel-gold/25 text-white rounded-br-sm' : 'bg-white/[0.06] border border-white/8 text-white/85 rounded-bl-sm',
                      msg.fileUrl && !msg.message ? 'p-1.5' : ''
                    ]"
                    @click="selectReply(msg)"
                  >
                    <!-- Quoted reply -->
                    <div v-if="msg.replyTo" class="mb-2 pl-2 border-l-2 border-revel-gold/60">
                      <p class="text-[10px] font-semibold text-revel-gold/80 mb-0.5">{{ msg.replyTo.sender?.name ?? 'Mensaje' }}</p>
                      <p class="text-[11px] text-white/50 line-clamp-2">{{ msg.replyTo.message }}</p>
                    </div>

                    <!-- Image -->
                    <img
                      v-if="msg.fileType === 'image'"
                      :src="msg.fileUrl!"
                      class="rounded-xl max-h-56 max-w-full object-cover block cursor-zoom-in"
                      :class="msg.message ? 'mb-2' : ''"
                      @click.stop="openFile(msg.fileUrl!)"
                    />
                    <!-- Video -->
                    <video
                      v-else-if="msg.fileType === 'video'"
                      :src="msg.fileUrl!"
                      controls
                      class="rounded-xl max-h-48 max-w-full block"
                      :class="msg.message ? 'mb-2' : ''"
                      @click.stop
                    />
                    <!-- File -->
                    <a
                      v-else-if="msg.fileType === 'file'"
                      :href="msg.fileUrl!"
                      target="_blank"
                      :download="msg.fileName"
                      class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
                      :class="msg.message ? 'mb-2' : ''"
                      @click.stop
                    >
                      <svg class="w-8 h-8 text-revel-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      <div class="min-w-0">
                        <p class="text-xs font-medium text-white/80 truncate max-w-[160px]">{{ msg.fileName }}</p>
                        <p class="text-[10px] text-white/40">Toca para descargar</p>
                      </div>
                    </a>

                    <!-- Text / caption -->
                    <span v-if="msg.message" class="block break-words whitespace-pre-wrap">{{ msg.message }}</span>

                    <!-- Reply button on hover -->
                    <button
                      class="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                      :class="isMine(msg) ? '-left-8' : '-right-8'"
                      @click.stop="selectReply(msg)"
                    >
                      <svg class="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Meta -->
              <div class="flex items-center gap-1.5 px-8" :class="isMine(msg) ? 'flex-row-reverse' : 'flex-row'">
                <span class="text-[10px] text-white/25">{{ senderLabel(msg) }}</span>
                <span class="text-[10px] text-white/20">·</span>
                <span class="text-[10px] text-white/25">{{ formatTime(msg.createdAt) }}</span>
              </div>

              <!-- Visto -->
              <div v-if="isMine(msg) && msg.readAt && isLastReadSent(i)" class="flex justify-end px-8">
                <span class="text-[10px] text-revel-gold/80 font-medium">Visto ✓✓</span>
              </div>
            </div>
          </template>
        </div>

        <!-- File preview bar -->
        <Transition name="reply-bar">
          <div v-if="pendingFile" class="px-4 pt-2 pb-0 flex-shrink-0">
            <div class="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 border-b-0 rounded-b-none">
              <!-- Image thumb -->
              <img v-if="pendingFile.type === 'image'" :src="pendingFile.preview" class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              <!-- Video icon -->
              <div v-else-if="pendingFile.type === 'video'" class="w-10 h-10 rounded-lg bg-revel-gold/10 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-revel-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <!-- File icon -->
              <div v-else class="w-10 h-10 rounded-lg bg-revel-gold/10 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-revel-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-white/70 truncate">{{ pendingFile.file.name }}</p>
                <p class="text-[10px] text-white/30">{{ formatFileSize(pendingFile.file.size) }}</p>
              </div>
              <button class="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors" @click="clearPendingFile">
                <svg class="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
        </Transition>

        <!-- Reply preview bar -->
        <Transition name="reply-bar">
          <div v-if="replyTo && !pendingFile" class="px-4 pt-2 pb-0 flex-shrink-0">
            <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 border-b-0 rounded-b-none">
              <div class="flex-1 min-w-0 pl-2 border-l-2 border-revel-gold/60">
                <p class="text-[10px] font-semibold text-revel-gold/80">{{ isMine(replyTo) ? 'Tú' : (replyTo.sender?.name ?? 'Mensaje') }}</p>
                <p class="text-xs text-white/50 truncate">{{ replyTo.message || (replyTo.fileType === 'image' ? '📷 Imagen' : replyTo.fileType === 'video' ? '🎥 Video' : '📎 Archivo') }}</p>
              </div>
              <button class="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors" @click="replyTo = null">
                <svg class="w-3 h-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
        </Transition>

        <!-- Input -->
        <div
          class="px-4 py-3 flex-shrink-0 border-white/8"
          :class="pendingFile || replyTo ? 'border-t pt-2 rounded-t-none' : 'border-t'"
        >
          <!-- Hidden file input -->
          <input ref="fileInputEl" type="file" accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar" class="hidden" @change="onFileSelected" />
          <div class="flex gap-2">
            <!-- Attachment button -->
            <button
              class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70"
              :disabled="uploading"
              @click="fileInputEl?.click()"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
            </button>

            <input
              ref="inputEl"
              v-model="draft"
              type="text"
              :placeholder="pendingFile ? 'Añadir un pie de foto...' : 'Escribe un mensaje...'"
              class="flex-1 px-3 py-2.5 rounded-xl text-white text-sm placeholder-white/25 focus:outline-none transition-all bg-white/[0.05] border border-white/10 focus:border-revel-gold/40 focus:bg-white/[0.07]"
              :class="pendingFile || replyTo ? 'border-t-0 rounded-t-none' : ''"
              @keydown.enter.prevent="sendMessage"
              @keydown.escape="replyTo = null; clearPendingFile()"
              @input="handleTyping"
            />

            <button
              :disabled="(!draft.trim() && !pendingFile) || sending"
              class="w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
              :class="(draft.trim() || pendingFile) && !sending ? 'bg-revel-gold hover:bg-revel-gold/80 text-revel-black' : 'bg-white/5 text-white/20 cursor-not-allowed'"
              @click="sendMessage"
            >
              <div v-if="uploading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>
              <svg v-else-if="!sending" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              <div v-else class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { ChatMessage, ChatPresence } from '~/types'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
  modelValue: boolean
  bookingId: string
  supplierName: string
  eventName: string
}>()

defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const auth = useAuthStore()
const { get, post, put } = useApi()

const bookingIdRef = toRef(props, 'bookingId')
const { messages: socketMessages, connect, disconnect } = useChat(bookingIdRef)

const historicalMessages = ref<ChatMessage[]>([])
const loadingMessages = ref(false)
const draft = ref('')
const sending = ref(false)
const uploading = ref(false)
const messagesEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const fileInputEl = ref<HTMLInputElement | null>(null)
const otherPresence = ref<ChatPresence | null>(null)
const replyTo = ref<ChatMessage | null>(null)
const pendingFile = ref<{ file: File; preview: string; type: 'image' | 'video' | 'file' } | null>(null)

let pollTimer: ReturnType<typeof setInterval> | null = null
let typingTimer: ReturnType<typeof setTimeout> | null = null
let lastPresenceSentAt = 0
let sseSource: EventSource | null = null

const allMessages = computed<ChatMessage[]>(() => {
  const histIds = new Set(historicalMessages.value.map(m => m.id))
  const merged = [
    ...historicalMessages.value,
    ...socketMessages.value.filter(m => !histIds.has(m.id)),
  ]
  return merged.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
})

const isOnline = computed(() => {
  if (!otherPresence.value?.lastSeen) return false
  return Date.now() - new Date(otherPresence.value.lastSeen).getTime() < 30000
})

const isTypingFresh = computed(() => otherPresence.value?.isTypingFresh === true)

const otherLastSeenText = computed(() => {
  const ls = otherPresence.value?.lastSeen
  if (!ls) return ''
  const diff = Date.now() - new Date(ls).getTime()
  if (diff < 60000) return 'hace un momento'
  if (diff < 3600000) return `hace ${Math.floor(diff / 60000)} min`
  if (diff < 86400000) return `hace ${Math.floor(diff / 3600000)} h`
  return ''
})

async function loadMessages(silent = false) {
  if (!props.bookingId) return
  if (!silent) loadingMessages.value = true
  try {
    const res = await get<{ success: boolean; data: ChatMessage[]; presence: ChatPresence | null }>(`/api/chat/${props.bookingId}`)
    otherPresence.value = res.presence ?? null

    if (!silent && !historicalMessages.value.length) {
      historicalMessages.value = res.data
      scrollToBottom()
    } else {
      const byId = new Map(historicalMessages.value.map(m => [m.id, m]))
      let newCount = 0
      for (const incoming of res.data) {
        const existing = byId.get(incoming.id)
        if (!existing) {
          historicalMessages.value.push(incoming)
          newCount++
        } else if (existing.readAt !== incoming.readAt) {
          existing.readAt = incoming.readAt
        }
      }
      if (newCount > 0) scrollToBottom()
    }
  } catch {
    if (!silent) historicalMessages.value = []
  } finally {
    if (!silent) loadingMessages.value = false
  }
}

function startPolling() {
  stopPolling()
  pollTimer = setInterval(() => loadMessages(true), 3000)
}

function stopPolling() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
}

function connectSSE() {
  if (sseSource) return
  const token = encodeURIComponent(auth.accessToken ?? '')
  sseSource = new EventSource(`/api/chat/${props.bookingId}/stream?token=${token}`)
  sseSource.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data) as ChatMessage
      if (!historicalMessages.value.some(m => m.id === msg.id)) {
        historicalMessages.value.push(msg)
        scrollToBottom()
      }
    } catch { /* ignore */ }
  }
}

function disconnectSSE() {
  sseSource?.close()
  sseSource = null
}

async function sendPresence(isTyping: boolean) {
  if (!props.bookingId) return
  try { await put(`/api/chat/${props.bookingId}/presence`, { isTyping }) } catch { /* silent */ }
}

function handleTyping() {
  const now = Date.now()
  // Refrescar typing cada 3s para que el servidor no lo expire (ventana de 5s)
  if (now - lastPresenceSentAt > 3000) {
    lastPresenceSentAt = now
    sendPresence(true)
  }
  if (typingTimer) clearTimeout(typingTimer)
  typingTimer = setTimeout(() => {
    typingTimer = null
    lastPresenceSentAt = 0
    sendPresence(false)
  }, 4000)
}

function onFileSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  clearPendingFile()
  const type: 'image' | 'video' | 'file' = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file'
  const preview = type === 'image' ? URL.createObjectURL(file) : ''
  pendingFile.value = { file, preview, type }
  input.value = ''
  nextTick(() => inputEl.value?.focus())
}

function clearPendingFile() {
  if (pendingFile.value?.preview) URL.revokeObjectURL(pendingFile.value.preview)
  pendingFile.value = null
}

function openFile(url: string) {
  window.open(url, '_blank')
}

function selectReply(msg: ChatMessage) {
  replyTo.value = msg
  nextTick(() => inputEl.value?.focus())
}

async function sendMessage() {
  const text = draft.value.trim()
  if ((!text && !pendingFile.value) || sending.value) return
  sending.value = true

  if (typingTimer) {
    clearTimeout(typingTimer)
    typingTimer = null
    lastPresenceSentAt = 0
    sendPresence(false)
  }

  let fileData: { fileUrl: string; fileType: string; fileName: string } | null = null
  if (pendingFile.value) {
    uploading.value = true
    try {
      const fd = new FormData()
      fd.append('file', pendingFile.value.file)
      const res = await fetch(`/api/chat/${props.bookingId}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth.accessToken}` },
        body: fd,
      })
      if (!res.ok) throw new Error('Upload failed')
      fileData = await res.json()
    } catch {
      uploading.value = false
      sending.value = false
      return
    }
    uploading.value = false
  }

  const savedFile = pendingFile.value
  const savedReply = replyTo.value
  clearPendingFile()
  replyTo.value = null

  try {
    const res = await post<{ success: boolean; data: ChatMessage }>(`/api/chat/${props.bookingId}`, {
      message: text,
      fileUrl: fileData?.fileUrl ?? null,
      fileType: fileData?.fileType ?? null,
      fileName: fileData?.fileName ?? null,
      replyToId: savedReply?.id ?? null,
    })
    draft.value = ''
    if (res?.data && !historicalMessages.value.some(m => m.id === res.data.id)) {
      historicalMessages.value.push(res.data)
      scrollToBottom()
    }
  } catch {
    pendingFile.value = savedFile
    replyTo.value = savedReply
  } finally {
    sending.value = false
  }
}

function isMine(msg: ChatMessage) {
  return !!auth.user?.id && msg.senderId === auth.user.id
}

function isLastReadSent(index: number) {
  const msgs = allMessages.value
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (isMine(msgs[i]) && msgs[i].readAt) return i === index
  }
  return false
}

function senderLabel(msg: ChatMessage) {
  if (!msg.sender) return ''
  if (isMine(msg)) return 'Tú'
  const map: Record<string, string> = { ADMIN: 'Admin', ORGANIZER: 'Organizador', ENCARGADO: 'Encargado', SUPPLIER: 'Proveedor' }
  return msg.sender.name ?? map[msg.sender.role ?? ''] ?? ''
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const isToday = d.toDateString() === new Date().toDateString()
  if (isToday) return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) + ' ' + d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

async function scrollToBottom() {
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}

watch(() => props.modelValue, async (open) => {
  if (open) {
    await loadMessages()
    connectSSE()
    await connect()
    scrollToBottom()
    startPolling()
  } else {
    stopPolling()
    disconnectSSE()
    disconnect()
    replyTo.value = null
    clearPendingFile()
  }
}, { immediate: true })

onUnmounted(() => {
  stopPolling()
  disconnectSSE()
  clearPendingFile()
  if (typingTimer) clearTimeout(typingTimer)
})

watch(allMessages, () => scrollToBottom(), { deep: true })
</script>

<style scoped>
.chat-overlay-enter-active, .chat-overlay-leave-active { transition: opacity 0.2s ease; }
.chat-overlay-enter-from, .chat-overlay-leave-to { opacity: 0; }
.chat-panel-enter-active, .chat-panel-leave-active { transition: transform 0.25s cubic-bezier(0.4,0,0.2,1); }
.chat-panel-enter-from, .chat-panel-leave-to { transform: translateX(100%); }
.reply-bar-enter-active, .reply-bar-leave-active { transition: all 0.15s ease; }
.reply-bar-enter-from, .reply-bar-leave-to { opacity: 0; transform: translateY(4px); }
</style>
