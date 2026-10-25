<template>
  <div>
    
    <template v-if="!selectedEventId">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="font-display text-2xl font-bold text-white mb-1">Álbum digital</h2>
          <p class="text-white/45 text-sm">Selecciona un evento para ver y gestionar sus fotos</p>
        </div>
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input v-model="search" type="text" placeholder="Buscar evento..." class="input-revel pl-9 py-2 text-sm w-56" />
        </div>
      </div>

      <div v-if="loadingEvents && !eventsStore.events.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="i in 6" :key="i" class="h-48 shimmer rounded-2xl" />
      </div>

      <div v-else-if="eventsStore.events.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-if="!filteredEvents.length" class="col-span-full text-center py-12 text-white/30 text-sm">
          No se encontraron eventos con "{{ search }}"
        </div>
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="card-revel overflow-hidden cursor-pointer group"
          @click="selectEvent(event.id)"
        >
          
          <div class="h-32 relative overflow-hidden">
            <img
              v-if="event.coverImage"
              :src="event.coverImage"
              :alt="event.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="w-full h-full relative overflow-hidden">
              <img
                :src="eventConfig(event.type).image"
                :alt="eventConfig(event.type).label"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
            </div>
            <div class="absolute top-2.5 right-2.5">
              <UiBadge :variant="statusVariant(event.status)" dot>{{ statusLabel(event.status) }}</UiBadge>
            </div>
          </div>

          
          <div class="p-4">
            <h3 class="font-display text-base font-semibold text-white mb-0.5 truncate group-hover:text-revel-gold transition-colors">
              {{ event.name }}
            </h3>
            <p class="text-xs text-white/40 mb-3">{{ formatDate(event.date) }} · {{ event.venue }}</p>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-white/50 text-xs">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {{ event._count?.photos ?? 0 }} fotos
              </div>
              <span class="text-xs text-revel-gold/70 group-hover:text-revel-gold transition-colors flex items-center gap-1">
                Ver álbum
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <div class="w-16 h-16 rounded-2xl bg-revel-gold/10 flex items-center justify-center mx-auto mb-4 text-revel-gold">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <h3 class="font-display text-xl font-semibold text-white mb-2">Sin eventos</h3>
        <p class="text-white/40 text-sm mb-6">Crea un evento para comenzar a subir fotos.</p>
        <NuxtLink to="/dashboard/events/create" class="btn-primary">Crear evento</NuxtLink>
      </div>
    </template>

    
    <template v-else>
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <button
            class="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white transition-colors flex-shrink-0"
            @click="selectedEventId = ''"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div>
            <h2 class="font-display text-xl font-bold text-white leading-tight">{{ currentEvent?.name }}</h2>
            <p class="text-white/40 text-xs">{{ formatDate(currentEvent?.date ?? '') }} · {{ currentEvent?.venue }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-white/40 text-sm">{{ photos.length }} fotos</span>
          <NuxtLink :to="`/pantalla/${selectedEventId}`" target="_blank" class="btn-secondary text-sm px-3 py-1.5">
            Ver pantalla
          </NuxtLink>
          <button
            class="btn-secondary text-sm px-3 py-1.5 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="!photos.length || downloading"
            @click="downloadPhotos"
          >
            <svg v-if="!downloading" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            <svg v-else class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            {{ downloading ? 'Generando ZIP...' : `Descargar todo (${photos.length})` }}
          </button>
          <button
            v-if="auth.isAdmin"
            class="text-sm px-3 py-1.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="!photos.length"
            @click="showDeleteAll = true"
          >
            Borrar todas
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2 mb-5">
        <button
          :class="['px-4 py-1.5 rounded-lg text-sm transition-colors', view === 'photos' ? 'bg-revel-gold text-revel-black font-medium' : 'bg-white/5 text-white/60 hover:bg-white/10']"
          @click="view = 'photos'"
        >
          Fotos
        </button>
        <button
          :class="['px-4 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2', view === 'annotations' ? 'bg-revel-gold text-revel-black font-medium' : 'bg-white/5 text-white/60 hover:bg-white/10']"
          @click="view = 'annotations'"
        >
          Dibujos y dedicatorias
          <span v-if="pendingCount" class="bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5 leading-none">{{ pendingCount }}</span>
        </button>
      </div>

      <!-- Moderación de dibujos y dedicatorias -->
      <div v-if="view === 'annotations'">
        <div class="flex items-center gap-2 mb-4">
          <button
            v-for="f in annotationFilters"
            :key="f.id"
            :class="['px-3 py-1 rounded-full text-xs border transition-colors', annotationFilter === f.id ? 'border-revel-gold text-revel-gold' : 'border-white/10 text-white/50 hover:text-white']"
            @click="annotationFilter = f.id"
          >
            {{ f.label }} ({{ annotations.filter((a) => a.status === f.id).length }})
          </button>
        </div>

        <div v-if="loadingAnnotations" class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div v-for="i in 4" :key="i" class="aspect-square shimmer rounded-xl" />
        </div>
        <div v-else-if="filteredAnnotations.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div v-for="a in filteredAnnotations" :key="a.id" class="card-revel overflow-hidden">
            <img :src="a.url" alt="Dedicatoria" class="w-full aspect-square object-cover cursor-pointer" @click="previewUrl = a.url" />
            <div class="p-3 space-y-2">
              <p class="text-xs text-white/70">{{ a.authorName || 'Invitado' }} · {{ formatDate(a.createdAt) }}</p>
              <p v-if="a.moderationReason" class="text-[11px] text-white/40">Moderador: {{ a.moderationReason }}</p>
              <div class="flex gap-2">
                <button v-if="a.status !== 'APPROVED'" class="btn-secondary text-xs px-2.5 py-1" @click="setAnnotationStatus(a, 'APPROVED')">Aprobar</button>
                <button v-if="a.status !== 'REJECTED'" class="btn-secondary text-xs px-2.5 py-1" @click="setAnnotationStatus(a, 'REJECTED')">Ocultar</button>
                <button class="text-xs px-2.5 py-1 text-red-400 hover:text-red-300 ml-auto" @click="deleteAnnotation(a)">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-16 text-white/40 text-sm">No hay dedicatorias en esta categoría</div>
      </div>

      <div v-else-if="loadingPhotos" class="grid grid-cols-4 gap-3">
        <div v-for="i in 12" :key="i" class="aspect-square shimmer rounded-xl" />
      </div>

      <div v-else-if="photos.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <div
          v-for="photo in photos"
          :key="photo.id"
          class="aspect-square rounded-xl overflow-hidden relative group cursor-pointer"
          @click="selectedPhoto = photo"
        >
          <img :src="photo.thumbnailUrl || photo.url" :alt="photo.caption || ''" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
          <span v-if="photo._count?.annotations" class="absolute top-2 right-2 glass-dark rounded-full px-2 py-0.5 text-[10px] text-white/90">🎨 {{ photo._count.annotations }}</span>
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end p-2 opacity-0 group-hover:opacity-100">
            <p class="text-xs text-white truncate">{{ photo.guest?.name || 'Anónimo' }}</p>
          </div>
          <button
            v-if="auth.isAdmin"
            class="absolute top-2 left-2 w-8 h-8 rounded-lg bg-black/60 flex items-center justify-center text-white/80 hover:text-red-400 hover:bg-black/80 transition-all sm:opacity-0 sm:group-hover:opacity-100"
            title="Eliminar foto"
            @click.stop="photoToDelete = photo"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div v-else-if="view === 'photos'" class="text-center py-20">
        <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3 text-white/30">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <p class="text-white/40 text-sm">Sin fotos todavía</p>
      </div>
    </template>

    
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="previewUrl" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" @click="previewUrl = ''">
          <img :src="previewUrl" alt="" class="max-w-3xl w-full max-h-[90vh] object-contain rounded-2xl" />
        </div>
      </Transition>
      <Transition name="modal">
        <div v-if="selectedPhoto" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" @click.self="selectedPhoto = null">
          <div class="relative max-w-3xl w-full">
            <img :src="selectedPhoto.url" :alt="selectedPhoto.caption || ''" class="w-full rounded-2xl shadow-card" />
            <button class="absolute top-3 right-3 w-9 h-9 glass-dark rounded-full flex items-center justify-center text-white/70 hover:text-white" @click="selectedPhoto = null">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <div class="absolute bottom-3 left-3 glass-dark rounded-xl px-3 py-1.5">
              <p class="text-xs text-white/70">{{ selectedPhoto.guest?.name || 'Invitado' }} · {{ formatDate(selectedPhoto.uploadedAt) }}</p>
            </div>
            <button
              v-if="auth.isAdmin"
              class="absolute bottom-3 right-3 glass-dark rounded-xl px-3 py-1.5 text-xs text-red-400 hover:text-red-300"
              @click="photoToDelete = selectedPhoto"
            >
              Eliminar foto
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <UiConfirm
      :model-value="!!photoToDelete"
      title="Eliminar foto"
      message="La foto y sus dedicatorias se borrarán definitivamente del álbum. Esta acción no se puede deshacer."
      confirm-text="Eliminar"
      danger
      :loading="deleting"
      @update:model-value="(v: boolean) => { if (!v) photoToDelete = null }"
      @confirm="deletePhoto"
    />
    <UiConfirm
      v-model="showDeleteAll"
      title="Borrar todas las fotos"
      :message="`Se borrarán definitivamente las ${photos.length} fotos de «${currentEvent?.name}» y sus dedicatorias. Esta acción no se puede deshacer.`"
      confirm-text="Borrar todas"
      danger
      :loading="deleting"
      @confirm="deleteAllPhotos"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { useEventsStore } from '~/stores/events'
import { useAuthStore } from '~/stores/auth'
import { useUiStore } from '~/stores/ui'
import type { Photo, PhotoAnnotation } from '~/types'

const eventsStore = useEventsStore()
const auth = useAuthStore()
const ui = useUiStore()
const { get, put, del, getHeaders } = useApi()

const selectedEventId = ref('')
const photos = ref<Photo[]>([])
const loadingEvents = ref(true)
const loadingPhotos = ref(false)
const downloading = ref(false)
const selectedPhoto = ref<Photo | null>(null)
const search = ref('')
const photoToDelete = ref<Photo | null>(null)
const showDeleteAll = ref(false)
const deleting = ref(false)

const view = ref<'photos' | 'annotations'>('photos')
const annotations = ref<PhotoAnnotation[]>([])
const loadingAnnotations = ref(false)
const annotationFilter = ref<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING')
const previewUrl = ref('')
const annotationFilters = [
  { id: 'PENDING' as const, label: 'Por revisar' },
  { id: 'APPROVED' as const, label: 'Publicadas' },
  { id: 'REJECTED' as const, label: 'Ocultas' },
]
const filteredAnnotations = computed(() => annotations.value.filter((a) => a.status === annotationFilter.value))
const pendingCount = computed(() => annotations.value.filter((a) => a.status === 'PENDING').length)

async function loadAnnotations(eventId: string) {
  loadingAnnotations.value = true
  try {
    const res = await get<{ data: PhotoAnnotation[] }>('/api/annotations', { eventId })
    annotations.value = res.data
  } finally {
    loadingAnnotations.value = false
  }
}

async function setAnnotationStatus(a: PhotoAnnotation, status: 'APPROVED' | 'REJECTED') {
  await put(`/api/annotations/${a.id}`, { status })
  a.status = status
}

async function deleteAnnotation(a: PhotoAnnotation) {
  if (!confirm('¿Eliminar esta dedicatoria definitivamente?')) return
  await del(`/api/annotations/${a.id}`)
  annotations.value = annotations.value.filter((x) => x.id !== a.id)
}

const filteredEvents = computed(() =>
  eventsStore.events.filter((e) =>
    !search.value || e.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

const currentEvent = computed(() => eventsStore.events.find((e) => e.id === selectedEventId.value))

async function selectEvent(id: string) {
  selectedEventId.value = id
  view.value = 'photos'
  annotations.value = []
  loadAnnotations(id)
  loadingPhotos.value = true
  try {
    const res = await get<{ data: Photo[] }>('/api/photos', { eventId: id, limit: 200 })
    photos.value = res.data
  } finally {
    loadingPhotos.value = false
  }
}

function setEventPhotoCount(count: number) {
  const ev = eventsStore.events.find((e) => e.id === selectedEventId.value)
  if (ev?._count) ev._count.photos = count
}

async function deletePhoto() {
  const photo = photoToDelete.value
  if (!photo) return
  deleting.value = true
  try {
    await del(`/api/photos/${photo.id}`)
    photos.value = photos.value.filter((p) => p.id !== photo.id)
    setEventPhotoCount(photos.value.length)
    if (selectedPhoto.value?.id === photo.id) selectedPhoto.value = null
    photoToDelete.value = null
    ui.success('Foto eliminada')
  } catch {
    ui.error('Error', 'No se pudo eliminar la foto')
  } finally {
    deleting.value = false
  }
}

async function deleteAllPhotos() {
  if (!selectedEventId.value) return
  deleting.value = true
  try {
    const res = await del<{ deleted: number }>(`/api/events/${selectedEventId.value}/photos`)
    photos.value = []
    annotations.value = []
    setEventPhotoCount(0)
    showDeleteAll.value = false
    ui.success('Fotos eliminadas', `${res.deleted} fotos borradas`)
  } catch {
    ui.error('Error', 'No se pudieron eliminar las fotos')
  } finally {
    deleting.value = false
  }
}

async function downloadPhotos() {
  if (!selectedEventId.value || !photos.value.length) return
  downloading.value = true
  try {
    const res = await fetch(`/api/events/${selectedEventId.value}/download-photos`, {
      headers: getHeaders(),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message ?? 'Error al generar el ZIP')
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fotos-${(currentEvent.value?.name ?? 'evento').replace(/\s+/g, '-').toLowerCase()}.zip`
    a.click()
    URL.revokeObjectURL(url)
  } catch (e: unknown) {
    alert((e as Error).message ?? 'No se pudo descargar')
  } finally {
    downloading.value = false
  }
}

function eventConfig(type: string): { image: string; label: string } {
  const map: Record<string, { image: string; label: string }> = {
    wedding:       { image: '/images/event-types/wedding.jpg',     label: 'Boda' },
    birthday:      { image: '/images/event-types/birthday.jpg',    label: 'Cumpleaños' },
    'quinceañera': { image: '/images/event-types/quinceanera.jpg', label: 'Quinceañera' },
    corporate:     { image: '/images/event-types/corporate.jpg',   label: 'Corporativo' },
    baby_shower:   { image: '/images/event-types/baby_shower.jpg', label: 'Baby Shower' },
    graduation:    { image: '/images/event-types/graduation.jpg',  label: 'Graduación' },
    other:         { image: '/images/event-types/other.jpg',       label: 'Evento' },
  }
  return map[type] ?? map.other
}

function formatDate(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusLabel(status: string) {
  const map: Record<string, string> = { DRAFT: 'Borrador', ACTIVE: 'Activo', FINISHED: 'Finalizado', CANCELLED: 'Cancelado' }
  return map[status] ?? status
}

function statusVariant(status: string): 'gold' | 'success' | 'neutral' | 'danger' {
  const map: Record<string, 'gold' | 'success' | 'neutral' | 'danger'> = { DRAFT: 'neutral', ACTIVE: 'success', FINISHED: 'gold', CANCELLED: 'danger' }
  return map[status] ?? 'neutral'
}

onMounted(async () => {
  await eventsStore.fetchEvents()
  loadingEvents.value = false
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
