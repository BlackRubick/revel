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

      <div v-if="loadingEvents" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
        </div>
      </div>

      <div v-if="loadingPhotos" class="grid grid-cols-4 gap-3">
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
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end p-2 opacity-0 group-hover:opacity-100">
            <p class="text-xs text-white truncate">{{ photo.guest?.name || 'Anónimo' }}</p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
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
        <div v-if="selectedPhoto" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" @click.self="selectedPhoto = null">
          <div class="relative max-w-3xl w-full">
            <img :src="selectedPhoto.url" :alt="selectedPhoto.caption || ''" class="w-full rounded-2xl shadow-card" />
            <button class="absolute top-3 right-3 w-9 h-9 glass-dark rounded-full flex items-center justify-center text-white/70 hover:text-white" @click="selectedPhoto = null">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <div class="absolute bottom-3 left-3 glass-dark rounded-xl px-3 py-1.5">
              <p class="text-xs text-white/70">{{ selectedPhoto.guest?.name || 'Invitado' }} · {{ formatDate(selectedPhoto.uploadedAt) }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { useEventsStore } from '~/stores/events'
import type { Photo } from '~/types'

const eventsStore = useEventsStore()
const { get, getHeaders } = useApi()

const selectedEventId = ref('')
const photos = ref<Photo[]>([])
const loadingEvents = ref(true)
const loadingPhotos = ref(false)
const downloading = ref(false)
const selectedPhoto = ref<Photo | null>(null)
const search = ref('')

const filteredEvents = computed(() =>
  eventsStore.events.filter((e) =>
    !search.value || e.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

const currentEvent = computed(() => eventsStore.events.find((e) => e.id === selectedEventId.value))

async function selectEvent(id: string) {
  selectedEventId.value = id
  loadingPhotos.value = true
  try {
    const res = await get<{ data: Photo[] }>('/api/photos', { eventId: id, limit: 200 })
    photos.value = res.data
  } finally {
    loadingPhotos.value = false
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
