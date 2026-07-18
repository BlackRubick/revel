<template>
  <div>
    
    <div class="mb-8">
      <h2 class="font-display text-2xl font-bold text-white mb-1">
        Buen día, {{ auth.user?.name?.split(' ')[0] }}
      </h2>
      <p class="text-white/45 text-sm">
        Aquí tienes un resumen de tus eventos y actividad reciente.
      </p>
    </div>

    
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <UiStatsCard
        :value="stats?.totalEvents ?? 0"
        label="Total eventos"
        sublabel="Todos los estados"
        icon-bg="bg-revel-gold/10"
      >
        <template #icon>
          <svg class="w-5 h-5 text-revel-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </template>
      </UiStatsCard>

      <UiStatsCard
        :value="stats?.totalGuests ?? 0"
        label="Total invitados"
        sublabel="Registrados"
        icon-bg="bg-blue-500/10"
      >
        <template #icon>
          <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </template>
      </UiStatsCard>

      <UiStatsCard
        :value="stats?.confirmedGuests ?? 0"
        label="Confirmados"
        :sublabel="`${confirmRate}% de confirmación`"
        icon-bg="bg-green-500/10"
      >
        <template #icon>
          <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </UiStatsCard>

      <UiStatsCard
        :value="stats?.totalPhotos ?? 0"
        label="Fotografías"
        sublabel="Subidas en total"
        icon-bg="bg-purple-500/10"
      >
        <template #icon>
          <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </template>
      </UiStatsCard>
    </div>

    
    <div class="grid lg:grid-cols-3 gap-6">
      
      <div class="lg:col-span-2 card-revel p-6">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-display text-lg font-semibold text-white">Eventos recientes</h3>
          <NuxtLink to="/dashboard/events" class="text-xs text-revel-gold hover:text-revel-gold-light transition-colors">
            Ver todos →
          </NuxtLink>
        </div>

        <div v-if="loading" class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-16 shimmer rounded-xl" />
        </div>

        <div v-else-if="stats?.recentEvents?.length" class="space-y-2">
          <div
            v-for="event in stats.recentEvents"
            :key="event.id"
            class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-all cursor-pointer"
            @click="$router.push(`/dashboard/events/${event.id}`)"
          >
            <div class="w-10 h-10 rounded-xl bg-revel-gold/10 flex items-center justify-center flex-shrink-0 text-lg">
              {{ eventEmoji(event.type) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">{{ event.name }}</p>
              <p class="text-xs text-white/40">
                {{ formatDate(event.date) }} · {{ event._count?.guests ?? 0 }} invitados
              </p>
            </div>
            <UiBadge :variant="statusVariant(event.status)">
              {{ statusLabel(event.status) }}
            </UiBadge>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <div class="w-12 h-12 rounded-2xl bg-revel-gold/10 flex items-center justify-center mx-auto mb-3 text-revel-gold">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="text-white/40 text-sm">No hay eventos todavía</p>
          <NuxtLink to="/dashboard/events/create" class="btn-primary text-sm px-4 py-2 mt-3 inline-flex">
            Crear primer evento
          </NuxtLink>
        </div>
      </div>

      
      <div class="space-y-4">
        <div class="card-revel p-5">
          <h3 class="font-display text-base font-semibold text-white mb-4">Acciones rápidas</h3>
          <div class="space-y-2">
            <NuxtLink
              v-for="action in quickActions"
              :key="action.to"
              :to="action.to"
              class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/4 border border-transparent hover:border-white/6 transition-all group"
            >
              <div class="w-8 h-8 rounded-lg bg-revel-gold/10 flex items-center justify-center text-revel-gold group-hover:bg-revel-gold/15 transition-all" v-html="action.svg" />
              <span class="text-sm text-white/70 group-hover:text-white transition-colors">
                {{ action.label }}
              </span>
            </NuxtLink>
          </div>
        </div>

        
        <div class="card-revel p-5">
          <h3 class="font-display text-base font-semibold text-white mb-4">Estado RSVP</h3>
          <div class="space-y-3">
            <div v-for="item in rsvpItems" :key="item.label">
              <div class="flex justify-between text-xs text-white/50 mb-1">
                <span>{{ item.label }}</span>
                <span>{{ item.count }}</span>
              </div>
              <div class="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  :class="['h-full rounded-full transition-all duration-1000', item.color]"
                  :style="{ width: `${item.pct}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { useAuthStore } from '~/stores/auth'
import type { DashboardStats } from '~/types'

const auth = useAuthStore()
const { get } = useApi()


const stats = ref<DashboardStats | null>(null)
const loading = ref(stats.value === null)

const confirmRate = computed(() => {
  if (!stats.value?.totalGuests) return 0
  return Math.round((stats.value.confirmedGuests / stats.value.totalGuests) * 100)
})

const rsvpItems = computed(() => {
  const total = stats.value?.totalGuests || 1
  const confirmed = stats.value?.confirmedGuests || 0
  const pending = stats.value?.pendingGuests || 0
  const declined = total - confirmed - pending
  return [
    { label: 'Confirmados', count: confirmed, pct: (confirmed / total) * 100, color: 'bg-green-400' },
    { label: 'Pendientes', count: pending, pct: (pending / total) * 100, color: 'bg-yellow-400' },
    { label: 'Rechazados', count: Math.max(0, declined), pct: (Math.max(0, declined) / total) * 100, color: 'bg-red-400' },
  ]
})

const quickActions = [
  { svg: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>', label: 'Crear nuevo evento', to: '/dashboard/events/create' },
  { svg: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>', label: 'Gestionar invitados', to: '/dashboard/guests' },
  { svg: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>', label: 'Organizar mesas', to: '/dashboard/tables' },
  { svg: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>', label: 'Ver álbum digital', to: '/dashboard/album' },
]

function eventEmoji(type: string) {
  const map: Record<string, string> = {
    wedding: '♥', birthday: '★', corporate: '◈', quinceañera: '✦',
    baby_shower: '♡', graduation: '◉',
  }
  return map[type] ?? '✦'
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

function statusVariant(status: string) {
  const map: Record<string, 'gold' | 'success' | 'neutral' | 'danger'> = {
    DRAFT: 'neutral', ACTIVE: 'success', FINISHED: 'gold', CANCELLED: 'danger',
  }
  return map[status] ?? 'neutral'
}

onMounted(async () => {
  try {
    const res = await get<{ success: boolean; data: DashboardStats }>('/api/dashboard/stats')
    stats.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>
