<template>
  <div class="min-h-screen bg-revel-black">
    
    <div class="h-1 bg-gold-gradient" />

    <div class="max-w-2xl mx-auto px-4 py-8">
      
      <div class="text-center mb-8">
        <div class="w-12 h-12 rounded-2xl bg-gold-gradient mx-auto mb-3 flex items-center justify-center shadow-gold">
          <span class="font-display font-bold text-revel-black text-xl">R</span>
        </div>
        <h1 class="font-display text-2xl font-bold text-white mb-1">Álbum digital</h1>
        <p class="text-white/50 text-sm">Comparte tus fotos del evento</p>
      </div>

      
      <div class="card-revel p-6 mb-6">
        <h2 class="font-display text-base font-semibold text-white mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-revel-gold" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
          Subir fotos
        </h2>

        <!-- Bloqueado: evento no ha comenzado -->
        <div v-if="eventInfo && !albumOpen" class="text-center py-2">
          <!-- Ícono reloj -->
          <div class="w-16 h-16 rounded-2xl bg-revel-gold/8 border border-revel-gold/20 flex items-center justify-center mx-auto mb-5">
            <svg class="w-8 h-8 text-revel-gold/70" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <p class="text-white/50 text-xs uppercase tracking-widest font-semibold mb-1">El álbum abre en</p>
          <p class="text-white/30 text-xs mb-6">
            {{ formatEventDate(eventInfo.date) }} · {{ eventInfo.time }} hrs
          </p>

          <!-- Contador -->
          <div class="grid grid-cols-4 gap-3 max-w-xs mx-auto mb-6">
            <div v-for="unit in countdown" :key="unit.label" class="flex flex-col items-center gap-1">
              <div class="w-full rounded-xl bg-white/[0.05] border border-white/8 py-3">
                <span class="font-display text-2xl font-bold text-white tabular-nums leading-none">
                  {{ unit.value }}
                </span>
              </div>
              <span class="text-[10px] text-white/30 uppercase tracking-wider">{{ unit.label }}</span>
            </div>
          </div>

          <p class="text-white/25 text-xs">A partir de esa hora podrás compartir tus fotos del evento</p>
        </div>

        <!-- Disponible: evento ya comenzó -->
        <template v-else-if="albumOpen || !eventInfo">
          <div
            ref="dropZone"
            :class="['border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer', isDragOver ? 'border-revel-gold bg-revel-gold/5' : 'border-white/12 hover:border-revel-gold/40']"
            @click="triggerFileInput"
            @dragover.prevent="isDragOver = true"
            @dragleave="isDragOver = false"
            @drop.prevent="handleDrop"
          >
            <div class="w-14 h-14 rounded-2xl bg-revel-gold/10 flex items-center justify-center mx-auto mb-3 text-revel-gold">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <p class="text-white/60 text-sm mb-1">Arrastra fotos aquí o haz clic</p>
            <p class="text-white/30 text-xs">JPG, PNG, WEBP — Máx. 10MB por foto</p>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              class="hidden"
              @change="handleFileChange"
            />
          </div>
        </template>

        
        <div v-if="uploadQueue.length" class="mt-4 space-y-2">
          <div
            v-for="item in uploadQueue"
            :key="item.id"
            class="flex items-center gap-3 p-3 rounded-xl bg-white/3"
          >
            <img :src="item.preview" alt="" class="w-10 h-10 object-cover rounded-lg" />
            <div class="flex-1 min-w-0">
              <p class="text-xs text-white/70 truncate">{{ item.file.name }}</p>
              <p v-if="item.status === 'error' && item.errorMsg" class="text-xs text-red-400 mt-0.5">{{ item.errorMsg }}</p>
              <div v-else class="mt-1 h-1 bg-white/8 rounded-full overflow-hidden">
                <div
                  :class="['h-full rounded-full transition-all duration-300', item.status === 'done' ? 'bg-green-400' : item.status === 'error' ? 'bg-red-400' : 'bg-revel-gold']"
                  :style="{ width: `${item.progress}%` }"
                />
              </div>
            </div>
            <span class="text-xs" :class="{ 'text-green-400': item.status === 'done', 'text-red-400': item.status === 'error', 'text-white/40': item.status === 'pending' || item.status === 'uploading' }">
              <svg v-if="item.status === 'done'" class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <svg v-else-if="item.status === 'error'" class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              <div v-else class="w-3.5 h-3.5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </span>
          </div>
        </div>

        <UiButton
          v-if="pendingUploads.length"
          class="mt-4 w-full"
          :loading="uploading"
          @click="uploadAll"
        >
          Subir {{ pendingUploads.length }} foto{{ pendingUploads.length !== 1 ? 's' : '' }}
        </UiButton>
      </div>

      
      <div class="card-revel p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-display text-base font-semibold text-white flex items-center gap-2">
            <svg class="w-4 h-4 text-revel-gold" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Galería del evento
          </h2>
          <span class="text-xs text-white/40">{{ photos.length }} fotos</span>
        </div>

        <div v-if="loadingPhotos" class="grid grid-cols-3 gap-2">
          <div v-for="i in 6" :key="i" class="aspect-square shimmer rounded-xl" />
        </div>

        <div v-else-if="photos.length" class="grid grid-cols-3 gap-2">
          <div
            v-for="photo in photos"
            :key="photo.id"
            class="aspect-square rounded-xl overflow-hidden cursor-pointer group"
            @click="selectedPhoto = photo"
          >
            <img
              :src="photo.thumbnailUrl || photo.url"
              :alt="photo.caption || 'Foto del evento'"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </div>

        <div v-else class="text-center py-8 text-white/30 text-sm">
          Sé el primero en subir una foto
        </div>
      </div>
    </div>

    
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedPhoto"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
          @click.self="selectedPhoto = null"
        >
          <div class="relative max-w-2xl w-full">
            <img
              :src="selectedPhoto.url"
              :alt="selectedPhoto.caption || ''"
              class="w-full rounded-2xl shadow-card"
            />
            <button
              class="absolute top-3 right-3 w-9 h-9 glass-dark rounded-full flex items-center justify-center text-white/70 hover:text-white"
              @click="selectedPhoto = null"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

import type { Photo } from '~/types'

const route = useRoute()
const eventId = route.params.eventId as string
const guestCode = (route.query.code as string) || ''

const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const uploading = ref(false)
const loadingPhotos = ref(true)
const photos = ref<Photo[]>([])
const selectedPhoto = ref<Photo | null>(null)

interface EventInfo {
  id: string
  name: string
  date: string
  time: string
  status: string
  startsAt: string
  hasStarted: boolean
}
const eventInfo = ref<EventInfo | null>(null)
const albumOpen = ref(false)
const now = ref(new Date())
let countdownInterval: ReturnType<typeof setInterval> | null = null

const countdown = computed(() => {
  if (!eventInfo.value) return []
  const target = new Date(eventInfo.value.startsAt).getTime()
  const diff = Math.max(0, target - now.value.getTime())

  const days    = Math.floor(diff / 86400000)
  const hours   = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)

  return [
    { label: 'Días',    value: String(days).padStart(2, '0') },
    { label: 'Horas',   value: String(hours).padStart(2, '0') },
    { label: 'Min',     value: String(minutes).padStart(2, '0') },
    { label: 'Seg',     value: String(seconds).padStart(2, '0') },
  ]
})

function startCountdown() {
  countdownInterval = setInterval(() => {
    now.value = new Date()
    if (eventInfo.value && now.value >= new Date(eventInfo.value.startsAt)) {
      albumOpen.value = true
      if (countdownInterval) clearInterval(countdownInterval)
    }
  }, 1000)
}

function formatEventDate(date: string) {
  return new Date(date).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
}

interface UploadItem {
  id: string
  file: File
  preview: string
  status: 'pending' | 'uploading' | 'done' | 'error'
  progress: number
  errorMsg?: string
}

const uploadQueue = ref<UploadItem[]>([])
const pendingUploads = computed(() => uploadQueue.value.filter((i) => i.status === 'pending'))

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files) addFiles(Array.from(files))
}

function handleDrop(e: DragEvent) {
  isDragOver.value = false
  const files = e.dataTransfer?.files
  if (files) addFiles(Array.from(files))
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const MAX = 1600
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round(height * MAX / width); width = MAX }
          else { width = Math.round(width * MAX / height); height = MAX }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

function addFiles(files: File[]) {
  files.forEach(async (file) => {
    const id = Math.random().toString(36).slice(2)
    uploadQueue.value.push({ id, file, preview: '', status: 'pending', progress: 0 })
    try {
      const preview = await compressImage(file)
      const item = uploadQueue.value.find((i) => i.id === id)
      if (item) item.preview = preview
    } catch {
      // preview fallback — upload still works
    }
  })
}

async function uploadAll() {
  uploading.value = true
  for (const item of pendingUploads.value) {
    item.status = 'uploading'
    item.progress = 30
    try {
      const base64 = item.preview || await compressImage(item.file)

      item.progress = 70
      const uploaded = await $fetch<{ success: boolean; data: Photo }>('/api/photos/upload', {
        method: 'POST',
        body: { eventId, guestCode, imageBase64: base64 },
      })
      photos.value.unshift(uploaded.data)
      item.progress = 100
      item.status = 'done'
    } catch (e: unknown) {
      item.status = 'error'
      item.errorMsg = (e as { data?: { message?: string } })?.data?.message ?? 'No se pudo subir la foto'
    }
  }
  uploading.value = false
}

async function loadPhotos() {
  try {
    const res = await $fetch<{ success: boolean; data: Photo[] }>('/api/photos', {
      query: { eventId },
    })
    photos.value = res.data
  } finally {
    loadingPhotos.value = false
  }
}

onMounted(async () => {
  const [info] = await Promise.all([
    $fetch<{ success: boolean; data: EventInfo }>(`/api/album/${eventId}`).catch(() => null),
    loadPhotos(),
  ])
  if (info) {
    eventInfo.value = info.data
    albumOpen.value = info.data.hasStarted
    if (!info.data.hasStarted) startCountdown()
  }
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
