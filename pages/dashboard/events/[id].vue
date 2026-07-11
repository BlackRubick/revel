<template>
  <div v-if="event">
    
    <div class="flex items-start justify-between mb-8">
      <div class="flex items-start gap-4">
        <NuxtLink to="/dashboard/events" class="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white transition-colors mt-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </NuxtLink>
        <div>
          <div class="flex items-center gap-3 mb-1">
            <h2 class="font-display text-2xl font-bold text-white">{{ event.name }}</h2>
            <UiBadge :variant="statusVariant(event.status)" dot>{{ statusLabel(event.status) }}</UiBadge>
          </div>
          <p class="text-white/45 text-sm">
            {{ formatDate(event.date) }} · {{ event.time }} · {{ event.venue }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <UiButton
          variant="secondary"
          size="sm"
          :loading="downloading"
          :disabled="(event._count?.photos ?? 0) === 0 || features.cannot('download')"
          :title="features.cannot('download') ? `Requiere plan ${FEATURE_MIN_PLAN['download']}` : ''"
          @click="downloadPhotos"
        >
          <svg v-if="features.can('download')" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
          </svg>
          Descargar fotos{{ features.can('download') && (event._count?.photos ?? 0) > 0 ? ` (${event._count?.photos})` : '' }}
        </UiButton>
        <UiButton variant="secondary" size="sm" @click="openEdit">
          Editar
        </UiButton>
        <UiButton
          v-if="event.status === 'DRAFT'"
          size="sm"
          @click="activateEvent"
        >
          Activar evento
        </UiButton>
      </div>
    </div>

    
    <div class="flex items-center gap-1 glass rounded-xl p-1 mb-6 w-fit">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all', activeTab === tab.key ? 'bg-revel-gold text-revel-black' : 'text-white/50 hover:text-white']"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
        <span v-if="tab.count !== undefined" class="ml-1.5 opacity-70 text-xs">{{ tab.count }}</span>
      </button>
    </div>

    
    <div v-if="activeTab === 'overview'">
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <UiStatsCard :value="event._count?.guests ?? 0" label="Invitados" icon-bg="bg-blue-500/10">
          <template #icon><svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg></template>
        </UiStatsCard>
        <UiStatsCard :value="event._count?.photos ?? 0" label="Fotos" icon-bg="bg-purple-500/10">
          <template #icon><svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></template>
        </UiStatsCard>
        <UiStatsCard :value="event.tableCount" label="Mesas" icon-bg="bg-green-500/10">
          <template #icon><svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></template>
        </UiStatsCard>
        <UiStatsCard :value="event._count?.messages ?? 0" label="Mensajes" icon-bg="bg-yellow-500/10">
          <template #icon><svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg></template>
        </UiStatsCard>
      </div>

      
      <div class="grid lg:grid-cols-2 gap-6">
        <div class="card-revel p-5">
          <h3 class="font-display text-base font-semibold text-white mb-4">Detalles del evento</h3>
          <dl class="space-y-3">
            <div class="flex gap-3">
              <dt class="text-xs text-white/35 w-28 flex-shrink-0 pt-0.5">Tipo</dt>
              <dd class="text-sm text-white/80">{{ eventTypeLabel(event.type) }}</dd>
            </div>
            <div class="flex gap-3">
              <dt class="text-xs text-white/35 w-28 flex-shrink-0 pt-0.5">Paquete</dt>
              <dd class="text-sm text-white/80">{{ event.package?.name }}</dd>
            </div>
            <div class="flex gap-3">
              <dt class="text-xs text-white/35 w-28 flex-shrink-0 pt-0.5">Dirección</dt>
              <dd class="text-sm text-white/80">{{ event.venueAddress || 'Sin dirección' }}</dd>
            </div>
            <div v-if="event.qrAlbumCode" class="flex gap-3">
              <dt class="text-xs text-white/35 w-28 flex-shrink-0 pt-0.5">QR Álbum</dt>
              <dd class="text-sm font-mono text-revel-gold">{{ event.qrAlbumCode }}</dd>
            </div>
          </dl>
        </div>

        
        <div class="card-revel p-5 flex flex-col gap-5">
          <h3 class="font-display text-base font-semibold text-white">Links del evento</h3>

          
          <div class="flex flex-col items-center gap-3 p-4 rounded-2xl border border-revel-gold/20 bg-revel-gold/5">
            <p class="text-xs text-revel-gold/70 font-medium uppercase tracking-wider">QR para mesas · Álbum digital</p>
            <div class="bg-white p-3 rounded-xl">
              <canvas ref="qrCanvas" class="w-40 h-40 block" />
            </div>
            <p class="text-xs text-white/40 text-center">Los invitados escanean este QR para subir sus fotos al álbum</p>
            <div class="flex items-center gap-2 w-full">
              <button
                class="flex-1 text-xs text-revel-gold border border-revel-gold/30 rounded-lg py-2 hover:bg-revel-gold/10 transition-colors"
                @click="copyLink(albumUrl)"
              >
                Copiar link
              </button>
              <button
                class="flex-1 text-xs text-revel-black bg-revel-gold rounded-lg py-2 font-semibold hover:opacity-90 transition-opacity"
                @click="downloadQR"
              >
                Descargar QR
              </button>
            </div>
          </div>

          
          <div class="space-y-2">
            <div
              v-for="link in eventLinks"
              :key="link.label"
              :class="['flex items-center justify-between p-3 rounded-xl border transition-all', link.locked ? 'border-white/5 opacity-50' : 'border-white/5 hover:border-revel-gold/20']"
            >
              <div class="flex items-center gap-3">
                <div class="text-revel-gold/70 flex-shrink-0" v-html="link.svg" />
                <div>
                  <span class="text-sm text-white/70">{{ link.label }}</span>
                  <p v-if="link.locked" class="text-[10px] text-revel-gold/60">Requiere plan {{ link.minPlan }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <svg v-if="link.locked" class="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                </svg>
                <button
                  v-else
                  class="text-xs text-revel-gold hover:text-revel-gold-light transition-colors"
                  @click="copyLink(link.url)"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <div v-if="activeTab === 'guests'">
      <DashboardGuestsTab :event-id="event.id" :event-name="event.name" :package-type="event.package?.type" />
    </div>

    
    <div v-if="activeTab === 'tables'">
      <UiFeatureLock
        v-if="features.cannot('tables')"
        :label="FEATURE_LABELS['tables']"
        :min-plan="FEATURE_MIN_PLAN['tables']"
        :blur-content="true"
      >
        <DashboardTablesTab :event-id="event.id" :tables="[]" />
      </UiFeatureLock>
      <DashboardTablesTab v-else :event-id="event.id" :tables="event.tables ?? []" />
    </div>
  </div>

  <!-- Modal: Editar evento -->
  <UiModal v-if="event" v-model="showEditModal" size="lg">
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-revel-gold/15 flex items-center justify-center flex-shrink-0">
          <svg class="w-4.5 h-4.5 text-revel-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div>
          <h2 class="font-display text-lg font-semibold text-white">Editar evento</h2>
          <p class="text-xs text-white/40 mt-0.5">{{ event.name }}</p>
        </div>
      </div>
    </template>

    <form class="space-y-5" @submit.prevent="saveEdit">
      <!-- Fila 1: nombre + estado -->
      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-2">
          <UiInput v-model="editForm.name" label="Nombre del evento" required />
        </div>
        <UiSelect
          v-model="editForm.status"
          label="Estado"
          :options="[
            { label: 'Borrador', value: 'DRAFT' },
            { label: 'Activo', value: 'ACTIVE' },
            { label: 'Finalizado', value: 'FINISHED' },
            { label: 'Cancelado', value: 'CANCELLED' },
          ]"
        />
      </div>

      <!-- Fila 2: tipo + fecha + hora -->
      <div class="grid grid-cols-3 gap-4">
        <UiSelect v-model="editForm.type" label="Tipo" :options="eventTypes" />
        <UiInput v-model="editForm.date" label="Fecha" type="date" required />
        <UiInput v-model="editForm.time" label="Hora" type="time" />
      </div>

      <!-- Fila 3: lugar -->
      <UiInput v-model="editForm.venue" label="Nombre del lugar" required />
      <div class="grid grid-cols-2 gap-4">
        <UiInput v-model="editForm.venueAddress" label="Dirección" />
        <UiInput v-model="editForm.venueMapUrl" label="URL Google Maps" />
      </div>

      <!-- Fila 4: mesas -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-white/70 mb-1.5">Número de mesas</label>
          <input v-model.number="editForm.tableCount" type="number" min="1" max="200" class="input-revel" />
        </div>
        <div>
          <label class="block text-sm font-medium text-white/70 mb-1.5">Capacidad por mesa</label>
          <input v-model.number="editForm.tableCapacity" type="number" min="1" max="50" class="input-revel" />
        </div>
      </div>

      <!-- Descripción + regalo -->
      <div>
        <label class="block text-sm font-medium text-white/70 mb-1.5">Descripción</label>
        <textarea v-model="editForm.description" rows="2" class="input-revel resize-none w-full" />
      </div>
      <UiInput v-model="editForm.giftListUrl" label="URL mesa de regalos" />
    </form>

    <template #footer>
      <UiButton variant="ghost" size="sm" @click="showEditModal = false">Cancelar</UiButton>
      <UiButton size="sm" :loading="saving" @click="saveEdit">Guardar cambios</UiButton>
    </template>
  </UiModal>

  <div v-else-if="loading" class="flex items-center justify-center py-32">
    <div class="text-center">
      <div class="w-12 h-12 border-2 border-revel-gold/30 border-t-revel-gold rounded-full animate-spin mx-auto mb-4" />
      <p class="text-white/40 text-sm">Cargando evento...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { useEventsStore } from '~/stores/events'
import { useUiStore } from '~/stores/ui'
import { useEventFeatures, FEATURE_LABELS, FEATURE_MIN_PLAN } from '~/composables/useEventFeatures'
import type { Event } from '~/types'

const route = useRoute()
const eventsStore = useEventsStore()
const ui = useUiStore()

const loading = ref(true)
const event = ref<Event | null>(null)
const activeTab = ref('overview')
const showEditModal = ref(false)
const saving = ref(false)
const downloading = ref(false)

const eventTypes = [
  { label: 'Boda', value: 'wedding' },
  { label: 'Cumpleaños', value: 'birthday' },
  { label: 'Quinceañera', value: 'quinceañera' },
  { label: 'Corporativo', value: 'corporate' },
  { label: 'Baby Shower', value: 'baby_shower' },
  { label: 'Graduación', value: 'graduation' },
  { label: 'Otro', value: 'other' },
]

const editForm = reactive({
  name: '',
  description: '',
  type: '',
  date: '',
  time: '',
  venue: '',
  venueAddress: '',
  venueMapUrl: '',
  tableCount: 10,
  tableCapacity: 8,
  giftListUrl: '',
  status: 'DRAFT',
})

function openEdit() {
  if (!event.value) return
  Object.assign(editForm, {
    name: event.value.name,
    description: event.value.description ?? '',
    type: event.value.type,
    date: event.value.date.slice(0, 10),
    time: event.value.time,
    venue: event.value.venue,
    venueAddress: event.value.venueAddress ?? '',
    venueMapUrl: event.value.venueMapUrl ?? '',
    tableCount: event.value.tableCount,
    tableCapacity: event.value.tableCapacity,
    giftListUrl: event.value.giftListUrl ?? '',
    status: event.value.status,
  })
  showEditModal.value = true
}

async function saveEdit() {
  if (!event.value) return
  saving.value = true
  try {
    const updated = await eventsStore.updateEvent(event.value.id, { ...editForm })
    event.value = updated
    ui.success('Evento actualizado', editForm.name)
    showEditModal.value = false
  } catch (e: unknown) {
    ui.error('Error', (e as { data?: { message?: string } })?.data?.message ?? 'No se pudo guardar')
  } finally {
    saving.value = false
  }
}

const features = computed(() => useEventFeatures(event.value?.package?.type))

const tabs = computed(() => [
  { key: 'overview', label: 'Resumen' },
  { key: 'guests', label: 'Invitados', count: event.value?._count?.guests },
  { key: 'tables', label: 'Mesas' },
])

const appUrl = useRuntimeConfig().public.appUrl
const albumUrl = computed(() => `${appUrl}/album/${event.value?.id}`)

const eventLinks = computed(() => [
  {
    svg: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>',
    label: 'Confirmación RSVP',
    url: `${appUrl}/confirmar`,
    locked: false,
    minPlan: '',
  },
  {
    svg: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
    label: 'Pantalla proyección',
    url: `${appUrl}/pantalla/${event.value?.id}`,
    locked: features.value.cannot('screen'),
    minPlan: FEATURE_MIN_PLAN['screen'],
  },
])

const qrCanvas = ref<HTMLCanvasElement | null>(null)

async function generateQR() {
  if (!qrCanvas.value || !event.value) return
  const QRCode = await import('qrcode')
  await QRCode.toCanvas(qrCanvas.value, albumUrl.value, {
    width: 160,
    margin: 0,
    color: { dark: '#000000', light: '#ffffff' },
  })
}

function downloadQR() {
  if (!qrCanvas.value || !event.value) return
  const link = document.createElement('a')
  link.download = `qr-album-${event.value.name.replace(/\s+/g, '-').toLowerCase()}.png`
  link.href = qrCanvas.value.toDataURL('image/png')
  link.click()
}

function copyLink(url: string) {
  navigator.clipboard.writeText(url)
  ui.success('Copiado', 'Enlace copiado al portapapeles')
}

function statusLabel(status: string) {
  const map: Record<string, string> = { DRAFT: 'Borrador', ACTIVE: 'Activo', FINISHED: 'Finalizado', CANCELLED: 'Cancelado' }
  return map[status] ?? status
}

function statusVariant(status: string): 'gold' | 'success' | 'neutral' | 'danger' {
  const map: Record<string, 'gold' | 'success' | 'neutral' | 'danger'> = { DRAFT: 'neutral', ACTIVE: 'success', FINISHED: 'gold', CANCELLED: 'danger' }
  return map[status] ?? 'neutral'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function eventTypeLabel(type: string) {
  const map: Record<string, string> = { wedding: 'Boda', birthday: 'Cumpleaños', quinceañera: 'Quinceañera', corporate: 'Corporativo', other: 'Otro' }
  return map[type] ?? type
}

async function downloadPhotos() {
  if (!event.value) return
  downloading.value = true
  try {
    const { getHeaders } = useApi()
    const res = await fetch(`/api/events/${event.value.id}/download-photos`, {
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
    a.download = `fotos-${event.value.name.replace(/\s+/g, '-').toLowerCase()}.zip`
    a.click()
    URL.revokeObjectURL(url)
    ui.success('Descarga lista', `${event.value._count?.photos} fotos empaquetadas`)
  } catch (e: unknown) {
    ui.error('Error', (e as Error).message ?? 'No se pudo descargar')
  } finally {
    downloading.value = false
  }
}

async function activateEvent() {
  if (!event.value) return
  await eventsStore.updateEvent(event.value.id, { status: 'ACTIVE' })
  event.value.status = 'ACTIVE'
  ui.success('Evento activado', 'El evento está ahora disponible para invitados')
}

onMounted(async () => {
  const data = await eventsStore.fetchEvent(route.params.id as string)
  event.value = data
  loading.value = false
  await nextTick()
  await generateQR()
})
</script>
