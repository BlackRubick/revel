<template>
  <div>
    
    <template v-if="!selectedEventId">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="font-display text-2xl font-bold text-white mb-1">Invitados</h2>
          <p class="text-white/45 text-sm">Selecciona un evento para gestionar sus invitados</p>
        </div>
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input v-model="search" type="text" placeholder="Buscar evento..." class="input-revel pl-9 py-2 text-sm w-56" />
        </div>
      </div>

      <div v-if="loading && !eventsStore.events.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
          @click="selectedEventId = event.id"
        >
          
          <div class="h-32 relative overflow-hidden">
            <img
              v-if="event.coverImage"
              :src="event.coverImage"
              :alt="event.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              v-else
              class="w-full h-full relative overflow-hidden"
              :style="{ background: eventConfig(event.type).gradient }"
            >
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
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {{ event._count?.guests ?? 0 }} invitados
              </div>
              <span class="text-xs text-revel-gold/70 group-hover:text-revel-gold transition-colors flex items-center gap-1">
                Ver invitados
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
        <p class="text-white/40 text-sm mb-6">Crea un evento para comenzar a gestionar invitados.</p>
        <NuxtLink to="/dashboard/events/create" class="btn-primary">Crear evento</NuxtLink>
      </div>
    </template>

    
    <template v-else>
      <div class="flex items-center gap-3 mb-6">
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

      <DashboardGuestsTab :event-id="selectedEventId" :event-name="currentEvent?.name" :event-slug="currentEvent?.slug" />
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { useEventsStore } from '~/stores/events'

const eventsStore = useEventsStore()
const route = useRoute()
const router = useRouter()
const selectedEventId = ref((route.query.event as string) || '')
const loading = ref(true)
const search = ref('')

// Sincronizar selectedEventId con la URL para que el botón atrás del navegador funcione
watch(selectedEventId, (id) => {
  router.replace({ query: id ? { event: id } : {} })
})
watch(() => route.query.event, (eventId) => {
  selectedEventId.value = (eventId as string) || ''
})

const filteredEvents = computed(() =>
  eventsStore.events.filter((e) =>
    !search.value || e.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

const currentEvent = computed(() => eventsStore.events.find((e) => e.id === selectedEventId.value))

function eventConfig(type: string): { image: string; gradient: string; label: string } {
  const map: Record<string, { image: string; gradient: string; label: string }> = {
    wedding:       { image: '/images/event-types/wedding.jpg',     gradient: 'linear-gradient(135deg,#6B2D5E,#C9A84C)', label: 'Boda' },
    birthday:      { image: '/images/event-types/birthday.jpg',    gradient: 'linear-gradient(135deg,#4C1D95,#EC4899)', label: 'Cumpleaños' },
    'quinceañera': { image: '/images/event-types/quinceanera.jpg', gradient: 'linear-gradient(135deg,#831843,#D97706)', label: 'Quinceañera' },
    corporate:     { image: '/images/event-types/corporate.jpg',   gradient: 'linear-gradient(135deg,#1E3A5F,#0369A1)', label: 'Corporativo' },
    baby_shower:   { image: '/images/event-types/baby_shower.jpg', gradient: 'linear-gradient(135deg,#0C4A6E,#A78BFA)', label: 'Baby Shower' },
    graduation:    { image: '/images/event-types/graduation.jpg',  gradient: 'linear-gradient(135deg,#064E3B,#D97706)', label: 'Graduación' },
    other:         { image: '/images/event-types/other.jpg',       gradient: 'linear-gradient(135deg,#78350F,#D4AF37)', label: 'Evento' },
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
  loading.value = false
})
</script>
