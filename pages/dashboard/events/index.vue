<template>
  <div>
    
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="font-display text-2xl font-bold text-white mb-1">Eventos</h2>
        <p class="text-white/45 text-sm">Gestiona todos tus eventos</p>
      </div>
      <NuxtLink to="/dashboard/events/create" class="btn-primary">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo evento
      </NuxtLink>
    </div>

    
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <div class="flex items-center gap-1 glass rounded-xl p-1">
        <button
          v-for="filter in statusFilters"
          :key="filter.value"
          :class="['px-3 py-1.5 rounded-lg text-sm font-medium transition-all', activeFilter === filter.value ? 'bg-revel-gold text-revel-black' : 'text-white/50 hover:text-white']"
          @click="setFilter(filter.value)"
        >
          {{ filter.label }}
        </button>
      </div>

      <div class="flex-1 max-w-xs">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="Buscar evento..."
            class="input-revel pl-9 py-2 text-sm"
          />
        </div>
      </div>
    </div>

    
    <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="i in 6" :key="i" class="h-52 shimmer rounded-2xl" />
    </div>

    <div v-else-if="filteredEvents.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="event in filteredEvents"
        :key="event.id"
        class="card-revel overflow-hidden cursor-pointer group"
        @click="$router.push(`/dashboard/events/${event.id}`)"
      >
        
        <div class="h-36 relative overflow-hidden">
          <img
            v-if="event.coverImage"
            :src="event.coverImage"
            :alt="event.name"
            class="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
          />
          <div v-else class="w-full h-full relative overflow-hidden">
            <img
              :src="eventConfig(event.type).image"
              :alt="eventConfig(event.type).label"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
            <span class="absolute bottom-2 left-3 text-[10px] font-semibold uppercase tracking-widest text-white/80">{{ eventConfig(event.type).label }}</span>
          </div>

          
          <div class="absolute top-3 right-3">
            <UiBadge :variant="statusVariant(event.status)" dot>
              {{ statusLabel(event.status) }}
            </UiBadge>
          </div>
        </div>

        
        <div class="p-4">
          <h3 class="font-display text-base font-semibold text-white mb-1 truncate">{{ event.name }}</h3>
          <p class="text-xs text-white/40 mb-3">
            {{ formatDate(event.date) }} · {{ event.venue }}
          </p>

          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-3 text-white/40">
              <span class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ event._count?.guests ?? 0 }}
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ event._count?.photos ?? 0 }}
              </span>
            </div>
            <UiBadge variant="neutral">{{ event.package?.name }}</UiBadge>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <div class="w-16 h-16 rounded-2xl bg-revel-gold/10 flex items-center justify-center mx-auto mb-4 text-revel-gold">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="font-display text-xl font-semibold text-white mb-2">Sin eventos</h3>
      <p class="text-white/40 text-sm mb-6">
        {{ activeFilter === 'ALL' ? 'Crea tu primer evento para comenzar.' : `No hay eventos con estado "${activeFilter}".` }}
      </p>
      <NuxtLink v-if="activeFilter === 'ALL'" to="/dashboard/events/create" class="btn-primary">
        Crear primer evento
      </NuxtLink>
    </div>

    
    <UiConfirm
      v-model="showDeleteConfirm"
      title="Eliminar evento"
      :message="`¿Eliminar el evento '${eventToDelete?.name}'? Esta acción no se puede deshacer.`"
      confirm-text="Eliminar"
      danger
      :loading="deleteLoading"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { useEventsStore } from '~/stores/events'
import type { Event } from '~/types'

const eventsStore = useEventsStore()
const loading = ref(true)
const search = ref('')
const activeFilter = ref('ALL')
const showDeleteConfirm = ref(false)
const eventToDelete = ref<Event | null>(null)
const deleteLoading = ref(false)

const statusFilters = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Activos', value: 'ACTIVE' },
  { label: 'Borrador', value: 'DRAFT' },
  { label: 'Finalizados', value: 'FINISHED' },
]

const filteredEvents = computed(() =>
  eventsStore.events.filter((e) => {
    const matchStatus = activeFilter.value === 'ALL' || e.status === activeFilter.value
    const matchSearch = !search.value || e.name.toLowerCase().includes(search.value.toLowerCase())
    return matchStatus && matchSearch
  }),
)

function setFilter(value: string) {
  activeFilter.value = value
}

function eventConfig(type: string): { image: string; label: string } {
  const map: Record<string, { image: string; label: string }> = {
    wedding:      { image: '/images/event-types/wedding.jpg',     label: 'Boda' },
    birthday:     { image: '/images/event-types/birthday.jpg',    label: 'Cumpleaños' },
    'quinceañera':{ image: '/images/event-types/quinceanera.jpg', label: 'Quinceañera' },
    corporate:    { image: '/images/event-types/corporate.jpg',   label: 'Corporativo' },
    baby_shower:  { image: '/images/event-types/baby_shower.jpg', label: 'Baby Shower' },
    graduation:   { image: '/images/event-types/graduation.jpg',  label: 'Graduación' },
    other:        { image: '/images/event-types/other.jpg',       label: 'Evento' },
  }
  return map[type] ?? map.other
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    DRAFT: 'Borrador', ACTIVE: 'Activo', FINISHED: 'Finalizado', CANCELLED: 'Cancelado',
  }
  return map[status] ?? status
}

function statusVariant(status: string): 'gold' | 'success' | 'neutral' | 'danger' {
  const map: Record<string, 'gold' | 'success' | 'neutral' | 'danger'> = {
    DRAFT: 'neutral', ACTIVE: 'success', FINISHED: 'gold', CANCELLED: 'danger',
  }
  return map[status] ?? 'neutral'
}

async function confirmDelete() {
  if (!eventToDelete.value) return
  deleteLoading.value = true
  try {
    await eventsStore.deleteEvent(eventToDelete.value.id)
    showDeleteConfirm.value = false
  } finally {
    deleteLoading.value = false
  }
}

onMounted(async () => {
  await eventsStore.fetchEvents()
  loading.value = false
})
</script>
