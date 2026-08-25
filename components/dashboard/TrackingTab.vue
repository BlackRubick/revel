<template>
  <div class="space-y-6">

    <!-- Link para el cliente -->
    <div class="card-revel p-5 flex items-center gap-4 flex-wrap">
      <div class="flex-1 min-w-0">
        <p class="text-xs text-white/40 font-semibold uppercase tracking-wide mb-1">Link de seguimiento para el cliente</p>
        <p class="text-sm text-white/60 font-mono truncate">{{ trackingUrl }}</p>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-revel-gold/10 border border-revel-gold/20 text-revel-gold text-sm font-medium hover:bg-revel-gold/15 transition-all flex-shrink-0"
        @click="copyLink"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
        Copiar link
      </button>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Etapas del evento -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-white/70 uppercase tracking-widest">Etapas del evento</h3>
          <button
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-revel-gold/10 border border-revel-gold/20 text-revel-gold text-xs font-medium hover:bg-revel-gold/15 transition-all"
            @click="showAddStage = true"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Agregar etapa
          </button>
        </div>

        <div v-if="loadingStages" class="space-y-2">
          <div v-for="i in 3" :key="i" class="h-14 shimmer rounded-xl"/>
        </div>

        <div v-else-if="!stages.length" class="card-revel p-8 text-center">
          <svg class="w-10 h-10 text-white/15 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
          </svg>
          <p class="text-white/35 text-sm">Sin etapas aún.</p>
          <p class="text-white/20 text-xs mt-1">Agrega las fases de preparación del evento.</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="(stage, idx) in stages"
            :key="stage.id"
            class="card-revel p-4 flex items-center gap-3 group hover:border-white/12 transition-all"
          >
            <!-- Toggle check -->
            <button
              class="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all"
              :class="stage.completedAt
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-white/20 hover:border-revel-gold/60'"
              @click="toggleStage(stage)"
            >
              <svg v-if="stage.completedAt" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </button>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium" :class="stage.completedAt ? 'text-white/40 line-through' : 'text-white'">
                {{ stage.title }}
              </p>
              <p v-if="stage.description" class="text-xs text-white/35 mt-0.5 truncate">{{ stage.description }}</p>
              <p v-if="stage.completedAt" class="text-xs text-green-400/70 mt-0.5">
                ✓ {{ formatDate(stage.completedAt) }}
              </p>
            </div>

            <!-- Número de orden -->
            <span class="text-xs text-white/20 flex-shrink-0">#{{ idx + 1 }}</span>

            <!-- Eliminar -->
            <button
              class="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all flex-shrink-0"
              @click="deleteStage(stage.id)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Barra de progreso -->
        <div v-if="stages.length" class="mt-4 p-3 card-revel">
          <div class="flex items-center justify-between text-xs text-white/40 mb-2">
            <span>Progreso del evento</span>
            <span class="font-semibold text-white/70">{{ completedCount }}/{{ stages.length }}</span>
          </div>
          <div class="h-2 bg-white/8 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-revel-gold to-green-400 rounded-full transition-all duration-500"
              :style="{ width: `${progressPercent}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Estado de proveedores -->
      <div>
        <h3 class="text-sm font-semibold text-white/70 uppercase tracking-widest mb-4">Estado de proveedores</h3>

        <div v-if="loadingBookings" class="space-y-2">
          <div v-for="i in 3" :key="i" class="h-14 shimmer rounded-xl"/>
        </div>

        <div v-else-if="!bookings.length" class="card-revel p-8 text-center">
          <svg class="w-10 h-10 text-white/15 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <p class="text-white/35 text-sm">Sin proveedores asignados.</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="b in bookings"
            :key="b.id"
            class="card-revel p-4 flex items-center gap-3"
          >
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
              :style="{ background: categoryColor(b.supplier?.category ?? '') }"
            >
              {{ (b.supplier?.category ?? '?')[0] }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">{{ b.supplier?.name }}</p>
              <p class="text-xs text-white/40 truncate">{{ b.supplier?.category }}</p>
            </div>
            <div
              class="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
              :class="supplierStatusStyle(b.supplierStatus).class"
            >
              <div class="w-1.5 h-1.5 rounded-full" :class="supplierStatusStyle(b.supplierStatus).dot"/>
              {{ supplierStatusStyle(b.supplierStatus).label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal agregar etapa -->
    <UiModal v-model="showAddStage" title="Agregar etapa">
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5">Título *</label>
          <input
            v-model="stageForm.title"
            type="text"
            placeholder="ej. Decoración lista"
            class="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-revel-gold/40 transition-all"
            @keydown.enter.prevent="addStage"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5">Descripción (opcional)</label>
          <input
            v-model="stageForm.description"
            type="text"
            placeholder="Detalle adicional..."
            class="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-revel-gold/40 transition-all"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton variant="ghost" @click="showAddStage = false">Cancelar</UiButton>
          <UiButton :loading="addingStage" :disabled="!stageForm.title.trim()" @click="addStage">Agregar</UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import type { Socket } from 'socket.io-client'
import type { EventStage, SupplierBooking, SupplierStatusValue } from '~/types'
import { useUiStore } from '~/stores/ui'

const props = defineProps<{
  eventId: string
  eventSlug: string
}>()

const ui = useUiStore()
const { get, post, put, del } = useApi()
const config = useRuntimeConfig()

const stages = ref<EventStage[]>([])
const bookings = ref<SupplierBooking[]>([])
const loadingStages = ref(true)
const loadingBookings = ref(true)
const showAddStage = ref(false)
const addingStage = ref(false)
const stageForm = reactive({ title: '', description: '' })
const socket = ref<Socket | null>(null)

const trackingUrl = computed(() => `${config.public.appUrl}/seguimiento/${props.eventSlug}`)

const completedCount = computed(() => stages.value.filter(s => s.completedAt).length)
const progressPercent = computed(() =>
  stages.value.length ? Math.round((completedCount.value / stages.value.length) * 100) : 0
)

function supplierStatusStyle(s: SupplierStatusValue | string) {
  const map: Record<string, { label: string; class: string; dot: string }> = {
    PENDING:    { label: 'Sin confirmar',  class: 'bg-white/5 text-white/40 border-white/10',        dot: 'bg-white/30' },
    CONFIRMED:  { label: 'Confirmado',     class: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dot: 'bg-blue-400' },
    PREPARING:  { label: 'Preparando',     class: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', dot: 'bg-yellow-400' },
    READY:      { label: 'Listo',          class: 'bg-green-500/10 text-green-400 border-green-500/20', dot: 'bg-green-400' },
    ON_THE_WAY: { label: 'En camino',      class: 'bg-purple-500/10 text-purple-400 border-purple-500/20', dot: 'bg-purple-400' },
    AT_VENUE:   { label: 'En el lugar',    class: 'bg-revel-gold/10 text-revel-gold border-revel-gold/20', dot: 'bg-revel-gold' },
  }
  return map[s] ?? map.PENDING
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function copyLink() {
  navigator.clipboard.writeText(trackingUrl.value)
  ui.success('Copiado', 'Link de seguimiento copiado')
}

async function toggleStage(stage: EventStage) {
  try {
    const res = await put<{ success: boolean; data: EventStage }>(`/api/event-stages/${stage.id}`, {
      completed: !stage.completedAt,
    })
    const idx = stages.value.findIndex(s => s.id === stage.id)
    if (idx !== -1) stages.value[idx] = res.data
  } catch {
    ui.error('Error', 'No se pudo actualizar la etapa')
  }
}

async function addStage() {
  if (!stageForm.title.trim()) return
  addingStage.value = true
  try {
    const res = await post<{ success: boolean; data: EventStage }>(`/api/events/${props.eventId}/stages`, {
      title: stageForm.title,
      description: stageForm.description,
    })
    stages.value.push(res.data)
    stageForm.title = ''
    stageForm.description = ''
    showAddStage.value = false
    ui.success('Agregada', 'Etapa creada')
  } catch {
    ui.error('Error', 'No se pudo agregar la etapa')
  } finally {
    addingStage.value = false
  }
}

async function deleteStage(id: string) {
  try {
    await del(`/api/event-stages/${id}`)
    stages.value = stages.value.filter(s => s.id !== id)
  } catch {
    ui.error('Error', 'No se pudo eliminar la etapa')
  }
}

onMounted(async () => {
  const [sRes, bRes] = await Promise.allSettled([
    get<{ success: boolean; data: EventStage[] }>(`/api/events/${props.eventId}/stages`),
    get<{ success: boolean; data: SupplierBooking[] }>(`/api/supplier-bookings?eventId=${props.eventId}`),
  ])
  if (sRes.status === 'fulfilled') stages.value = sRes.value.data
  if (bRes.status === 'fulfilled') bookings.value = bRes.value.data
  loadingStages.value = false
  loadingBookings.value = false

  // Socket.IO — actualizaciones en tiempo real para el organizador
  if (import.meta.client) {
    const { io } = await import('socket.io-client')
    socket.value = io(config.public.socketUrl, { transports: ['websocket', 'polling'] })
    socket.value.on('connect', () => socket.value?.emit('join-event', props.eventId))

    socket.value.on('stage-update', ({ type, stage, stageId }: { type: string; stage?: EventStage; stageId?: string }) => {
      if (type === 'created' && stage) {
        stages.value.push(stage)
      } else if (type === 'updated' && stage) {
        const idx = stages.value.findIndex(s => s.id === stage.id)
        if (idx !== -1) stages.value[idx] = stage
      } else if (type === 'deleted' && stageId) {
        stages.value = stages.value.filter(s => s.id !== stageId)
      }
    })

    socket.value.on('supplier-status-update', ({ bookingId, supplierStatus }: { bookingId: string; supplierStatus: string }) => {
      const b = bookings.value.find(b => b.id === bookingId)
      if (b) b.supplierStatus = supplierStatus as SupplierStatusValue
    })
  }
})

onUnmounted(() => {
  socket.value?.disconnect()
})
</script>
