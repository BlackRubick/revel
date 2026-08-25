<template>
  <div class="min-h-screen bg-revel-black">
    <!-- Header -->
    <header class="border-b border-white/6 bg-revel-gray-dark px-6 py-4">
      <div class="max-w-2xl mx-auto flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold flex-shrink-0">
          <span class="font-display font-bold text-revel-black text-sm">R</span>
        </div>
        <div class="flex-1 min-w-0">
          <span class="font-display text-lg font-semibold text-white">Rével</span>
          <span class="text-white/25 text-sm ml-2">/ Seguimiento del evento</span>
        </div>
        <!-- Indicador live -->
        <div class="flex items-center gap-1.5">
          <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
          <span class="text-xs text-white/40">En vivo</span>
        </div>
      </div>
    </header>

    <div class="max-w-2xl mx-auto px-6 py-8">
      <!-- Loading -->
      <div v-if="loading" class="space-y-4">
        <div class="h-28 shimmer rounded-2xl"/>
        <div class="h-48 shimmer rounded-2xl"/>
        <div class="h-36 shimmer rounded-2xl"/>
      </div>

      <!-- Error -->
      <div v-else-if="!data" class="text-center py-20">
        <svg class="w-16 h-16 text-white/10 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-white/40 text-lg">Evento no encontrado</p>
        <p class="text-white/20 text-sm mt-2">Verifica el link que te compartieron</p>
      </div>

      <template v-else>
        <!-- Info del evento -->
        <div class="card-revel p-6 mb-6">
          <div class="flex items-start gap-4">
            <div class="flex-1 min-w-0">
              <h1 class="font-display text-2xl font-bold text-white mb-1">{{ data.name }}</h1>
              <div class="flex flex-wrap gap-4 text-sm text-white/50">
                <span class="flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-revel-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {{ formatDate(data.date) }} · {{ data.time }}
                </span>
                <span class="flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-revel-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {{ data.venue }}
                </span>
              </div>
            </div>
            <!-- Porcentaje global -->
            <div class="text-center flex-shrink-0">
              <div class="relative w-16 h-16">
                <svg class="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="6"/>
                  <circle
                    cx="32" cy="32" r="28" fill="none"
                    stroke="url(#goldGradient)" stroke-width="6"
                    stroke-linecap="round"
                    :stroke-dasharray="`${progressCircle} 175.9`"
                    style="transition: stroke-dasharray 0.6s ease"
                  />
                  <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#C9A84C"/>
                      <stop offset="100%" stop-color="#4ade80"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-sm font-bold text-white">{{ progressPercent }}%</span>
                </div>
              </div>
              <p class="text-[10px] text-white/30 mt-1">Listo</p>
            </div>
          </div>
        </div>

        <!-- Timeline de etapas -->
        <div class="mb-6">
          <h2 class="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Etapas de preparación</h2>

          <div v-if="!data.stages?.length" class="card-revel p-6 text-center">
            <p class="text-white/30 text-sm">El equipo aún está configurando las etapas del evento.</p>
          </div>

          <div v-else class="relative">
            <!-- Línea vertical -->
            <div class="absolute left-5 top-5 bottom-5 w-px bg-white/8"/>

            <div class="space-y-2">
              <div
                v-for="(stage, idx) in data.stages"
                :key="stage.id"
                class="relative flex items-start gap-4 pl-0"
              >
                <!-- Ícono de estado -->
                <div
                  class="relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all"
                  :class="stage.completedAt
                    ? 'bg-green-500 border-green-500'
                    : idx === firstPendingIdx
                      ? 'bg-revel-gold/15 border-revel-gold animate-pulse'
                      : 'bg-revel-gray-dark border-white/15'"
                >
                  <svg v-if="stage.completedAt" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                  </svg>
                  <svg v-else-if="idx === firstPendingIdx" class="w-5 h-5 text-revel-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"/>
                  </svg>
                  <span v-else class="text-xs text-white/20 font-semibold">{{ idx + 1 }}</span>
                </div>

                <!-- Contenido -->
                <div
                  class="flex-1 min-w-0 rounded-2xl px-4 py-3 mb-2 border transition-all"
                  :class="stage.completedAt
                    ? 'bg-green-500/5 border-green-500/15'
                    : idx === firstPendingIdx
                      ? 'bg-revel-gold/5 border-revel-gold/20'
                      : 'bg-white/[0.02] border-white/6'"
                >
                  <div class="flex items-center justify-between gap-2 flex-wrap">
                    <p
                      class="text-sm font-semibold"
                      :class="stage.completedAt ? 'text-white/50 line-through' : idx === firstPendingIdx ? 'text-revel-gold' : 'text-white/60'"
                    >
                      {{ stage.title }}
                    </p>
                    <span
                      v-if="stage.completedAt"
                      class="text-[10px] text-green-400/70 font-medium"
                    >✓ Completado</span>
                    <span
                      v-else-if="idx === firstPendingIdx"
                      class="text-[10px] text-revel-gold/70 font-semibold uppercase tracking-wide"
                    >En proceso</span>
                  </div>
                  <p v-if="stage.description" class="text-xs text-white/35 mt-0.5">{{ stage.description }}</p>
                  <p v-if="stage.completedAt" class="text-[10px] text-white/25 mt-1">{{ formatDateTime(stage.completedAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado de proveedores -->
        <div v-if="data.supplierBookings?.length">
          <h2 class="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Proveedores del evento</h2>
          <div class="space-y-2">
            <div
              v-for="b in data.supplierBookings"
              :key="b.id"
              class="card-revel p-4 flex items-center gap-3"
            >
              <div
                class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-white/70"
                :style="{ background: categoryColor(b.supplier?.category ?? '') }"
              >
                {{ (b.supplier?.name ?? '?')[0] }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white truncate">{{ b.supplier?.name }}</p>
                <p class="text-xs text-white/40">{{ b.supplier?.category }}</p>
              </div>
              <div
                class="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                :class="statusStyle(b.supplierStatus).class"
              >
                <div class="w-1.5 h-1.5 rounded-full" :class="statusStyle(b.supplierStatus).dot"/>
                {{ statusStyle(b.supplierStatus).label }}
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-10 text-center">
          <p class="text-xs text-white/20">Esta página se actualiza automáticamente en tiempo real</p>
          <p class="text-xs text-white/15 mt-1">Powered by Rével · revel-eventos.com.mx</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Socket } from 'socket.io-client'

definePageMeta({ layout: false })

interface TrackingStage {
  id: string
  title: string
  description?: string
  order: number
  completedAt: string | null
}

interface TrackingBooking {
  id: string
  supplierStatus: string
  supplier: { name: string; category: string }
}

interface TrackingData {
  id: string
  name: string
  date: string
  time: string
  venue: string
  type: string
  stages: TrackingStage[]
  supplierBookings: TrackingBooking[]
}

const route = useRoute()
const slug = route.params.slug as string

const data = ref<TrackingData | null>(null)
const loading = ref(true)
const socket = ref<Socket | null>(null)

const completedCount = computed(() => (data.value?.stages ?? []).filter(s => s.completedAt).length)
const totalStages = computed(() => data.value?.stages?.length ?? 0)
const progressPercent = computed(() => totalStages.value ? Math.round((completedCount.value / totalStages.value) * 100) : 0)
const progressCircle = computed(() => Math.round((progressPercent.value / 100) * 175.9))
const firstPendingIdx = computed(() => (data.value?.stages ?? []).findIndex(s => !s.completedAt))

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function categoryColor(cat: string) {
  const colors: Record<string, string> = {
    Fotografía: 'linear-gradient(135deg,#8B5CF6,#6D28D9)',
    Video: 'linear-gradient(135deg,#EF4444,#DC2626)',
    Música: 'linear-gradient(135deg,#F59E0B,#D97706)',
    Decoración: 'linear-gradient(135deg,#10B981,#059669)',
    Catering: 'linear-gradient(135deg,#F97316,#EA580C)',
    Iluminación: 'linear-gradient(135deg,#FBBF24,#F59E0B)',
    Sonido: 'linear-gradient(135deg,#3B82F6,#2563EB)',
  }
  return colors[cat] ?? 'linear-gradient(135deg,#6B7280,#4B5563)'
}

function statusStyle(s: string) {
  const map: Record<string, { label: string; class: string; dot: string }> = {
    PENDING:    { label: 'Sin confirmar',  class: 'bg-white/5 text-white/40 border-white/10',           dot: 'bg-white/30' },
    CONFIRMED:  { label: 'Confirmado',     class: 'bg-blue-500/10 text-blue-400 border-blue-500/20',   dot: 'bg-blue-400' },
    PREPARING:  { label: 'Preparando',     class: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', dot: 'bg-yellow-400' },
    READY:      { label: 'Listo',          class: 'bg-green-500/10 text-green-400 border-green-500/20', dot: 'bg-green-400' },
    ON_THE_WAY: { label: 'En camino',      class: 'bg-purple-500/10 text-purple-400 border-purple-500/20', dot: 'bg-purple-400' },
    AT_VENUE:   { label: 'En el lugar',    class: 'bg-yellow-400/10 text-yellow-300 border-yellow-400/20', dot: 'bg-yellow-300' },
  }
  return map[s] ?? map.PENDING
}

async function loadData() {
  try {
    const res = await $fetch<{ success: boolean; data: TrackingData }>(`/api/tracking/${slug}`)
    data.value = res.data
  } catch {
    data.value = null
  } finally {
    loading.value = false
  }
}

async function connectSocket() {
  if (import.meta.server || !data.value) return
  const { io } = await import('socket.io-client')
  const config = useRuntimeConfig()
  socket.value = io(config.public.socketUrl, { transports: ['websocket', 'polling'] })

  socket.value.on('connect', () => {
    socket.value?.emit('join-event', data.value!.id)
  })

  socket.value.on('stage-update', ({ type, stage, stageId }: { type: string; stage?: TrackingStage; stageId?: string }) => {
    if (!data.value) return
    if (type === 'created' && stage) {
      data.value.stages.push(stage)
    } else if (type === 'updated' && stage) {
      const idx = data.value.stages.findIndex(s => s.id === stage.id)
      if (idx !== -1) data.value.stages[idx] = stage
    } else if (type === 'deleted' && stageId) {
      data.value.stages = data.value.stages.filter(s => s.id !== stageId)
    }
  })

  socket.value.on('supplier-status-update', ({ bookingId, supplierStatus }: { bookingId: string; supplierStatus: string }) => {
    if (!data.value) return
    const b = data.value.supplierBookings.find(b => b.id === bookingId)
    if (b) b.supplierStatus = supplierStatus
  })
}

onMounted(async () => {
  await loadData()
  await connectSocket()
})

onUnmounted(() => {
  socket.value?.disconnect()
})

useHead({
  title: () => data.value ? `Seguimiento — ${data.value.name}` : 'Seguimiento de evento',
})
</script>
