<template>
  <div class="min-h-screen bg-revel-black">
    <!-- Header -->
    <header class="border-b border-white/6 bg-revel-gray-dark px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold">
          <span class="font-display font-bold text-revel-black text-sm">R</span>
        </div>
        <span class="font-display text-lg font-semibold text-white">Rével</span>
        <span class="text-white/25 text-sm">/ Portal Proveedor</span>
      </div>
      <div class="flex items-center gap-3">
        <div class="text-right">
          <p class="text-sm font-medium text-white">{{ auth.user?.name }}</p>
          <p class="text-xs text-white/40">Proveedor</p>
        </div>
        <button
          class="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-red-400/70 hover:text-red-400 hover:border-red-500/30 transition-all"
          @click="handleLogout"
        >
          Salir
        </button>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-6 py-8">
      <!-- Perfil del proveedor -->
      <div v-if="profile" class="card-revel p-5 mb-6 flex items-start gap-4">
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white/70"
          :style="{ background: categoryColor(profile.category) }"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 flex-wrap">
            <h1 class="font-display text-xl font-bold text-white">{{ profile.name }}</h1>
            <span class="px-2 py-0.5 rounded-md bg-revel-gold/10 text-revel-gold text-xs font-medium border border-revel-gold/20">
              {{ profile.category }}
            </span>
          </div>
          <div class="flex flex-wrap gap-4 mt-2">
            <span v-if="profile.phone" class="flex items-center gap-1.5 text-xs text-white/50">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              {{ profile.phone }}
            </span>
            <span v-if="profile.email" class="flex items-center gap-1.5 text-xs text-white/50">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              {{ profile.email }}
            </span>
          </div>
        </div>
        <!-- Stats rápidos -->
        <div class="flex gap-4 flex-shrink-0">
          <div class="text-center">
            <p class="text-xl font-bold text-white">{{ bookings.length }}</p>
            <p class="text-xs text-white/40">Eventos</p>
          </div>
          <div class="text-center">
            <p class="text-xl font-bold text-revel-gold">{{ totalFormatted }}</p>
            <p class="text-xs text-white/40">Total</p>
          </div>
        </div>
      </div>

      <!-- Sin perfil vinculado -->
      <div v-else-if="!loading" class="card-revel p-8 text-center mb-6">
        <svg class="w-10 h-10 text-white/20 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-white/60 text-sm">Tu usuario aún no está vinculado a un perfil de proveedor.</p>
        <p class="text-white/30 text-xs mt-1">Contacta al administrador para que te asigne tu perfil.</p>
      </div>

      <!-- Header de agenda -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-lg font-semibold text-white">Mi agenda</h2>
          <p class="text-xs text-white/40 mt-0.5">Eventos en los que participas</p>
        </div>
        <button
          v-if="profile"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-revel-gold/10 border border-revel-gold/20 text-revel-gold text-sm font-medium hover:bg-revel-gold/15 transition-all"
          @click="openAddModal"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Agregar fecha
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="h-24 shimmer rounded-2xl"/>
      </div>

      <!-- Sin bookings -->
      <div v-else-if="!bookings.length" class="card-revel p-8 text-center">
        <svg class="w-10 h-10 text-white/20 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <p class="text-white/60 text-sm">No tienes eventos asignados aún.</p>
      </div>

      <!-- Lista de bookings -->
      <div v-else class="space-y-3">
        <div
          v-for="b in bookings"
          :key="b.id"
          class="card-revel p-5 flex items-center gap-4 group hover:border-white/12 transition-all"
        >
          <!-- Fecha -->
          <div class="flex-shrink-0 w-14 text-center">
            <p class="text-2xl font-bold text-white leading-none">{{ dayOf(b.eventDate) }}</p>
            <p class="text-xs text-white/40 uppercase tracking-wide mt-0.5">{{ monthOf(b.eventDate) }}</p>
            <p class="text-xs text-white/25">{{ yearOf(b.eventDate) }}</p>
          </div>

          <div class="w-px h-12 bg-white/8 flex-shrink-0"/>

          <!-- Evento -->
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-white text-sm truncate">{{ b.event?.name }}</p>
            <p class="text-xs text-white/50 mt-0.5 truncate">
              <svg class="w-3 h-3 inline mr-1 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ b.event?.venue }}
            </p>
            <p v-if="b.notes" class="text-xs text-white/35 mt-1 truncate">{{ b.notes }}</p>
          </div>

          <!-- Estado y costo -->
          <div class="flex-shrink-0 text-right">
            <p class="text-lg font-bold text-revel-gold">${{ formatCost(b.cost) }} <span class="text-xs font-normal text-white/40">{{ b.currency }}</span></p>
            <span :class="statusClass(b.status)" class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium mt-1">
              {{ statusLabel(b.status) }}
            </span>
          </div>

          <!-- Mi estado (proveedor) -->
          <div class="flex-shrink-0">
            <select
              :value="b.supplierStatus"
              class="px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-revel-gold/40 transition-all cursor-pointer"
              :class="supplierStatusClass(b.supplierStatus)"
              @change="updateSupplierStatus(b, ($event.target as HTMLSelectElement).value)"
            >
              <option value="PENDING" class="bg-revel-black text-white">Sin confirmar</option>
              <option value="CONFIRMED" class="bg-revel-black text-white">Confirmado</option>
              <option value="PREPARING" class="bg-revel-black text-white">Preparando</option>
              <option value="READY" class="bg-revel-black text-white">Listo</option>
              <option value="ON_THE_WAY" class="bg-revel-black text-white">En camino</option>
              <option value="AT_VENUE" class="bg-revel-black text-white">En el lugar</option>
            </select>
          </div>

          <!-- Acciones -->
          <div class="flex-shrink-0 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              class="p-1.5 rounded-lg bg-white/5 hover:bg-revel-gold/10 text-white/50 hover:text-revel-gold transition-all"
              title="Chat con organizador"
              @click="openChat(b)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </button>
            <button
              class="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
              title="Editar"
              @click="openEditModal(b)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat panel -->
    <SupplierChat
      v-if="chatBooking"
      v-model="showChat"
      :booking-id="chatBooking.id"
      :supplier-name="profile?.name ?? ''"
      :event-name="chatBooking.event?.name ?? ''"
    />

    <!-- Modal agregar/editar booking -->
    <UiModal v-model="showModal" :title="editingId ? 'Editar evento' : 'Agregar fecha de evento'">
      <div class="space-y-4">
        <!-- Evento (solo al crear) -->
        <div v-if="!editingId">
          <label class="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5">Evento *</label>
          <select
            v-model="form.eventId"
            class="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-revel-gold/40 focus:bg-white/[0.06] transition-all"
          >
            <option value="" disabled class="bg-revel-black">Selecciona un evento</option>
            <option v-for="ev in events" :key="ev.id" :value="ev.id" class="bg-revel-black">
              {{ ev.name }} — {{ formatEventDate(ev.date) }}
            </option>
          </select>
        </div>

        <!-- Fecha de asistencia -->
        <div>
          <label class="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5">Fecha que estarás presente *</label>
          <input
            v-model="form.eventDate"
            type="date"
            class="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-revel-gold/40 focus:bg-white/[0.06] transition-all"
          />
        </div>

        <!-- Costo -->
        <div>
          <label class="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5">Costo del servicio *</label>
          <div class="flex gap-2">
            <input
              v-model.number="form.cost"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              class="flex-1 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-revel-gold/40 focus:bg-white/[0.06] transition-all"
            />
            <select
              v-model="form.currency"
              class="w-24 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-revel-gold/40 transition-all"
            >
              <option class="bg-revel-black">MXN</option>
              <option class="bg-revel-black">USD</option>
            </select>
          </div>
        </div>

        <!-- Estado -->
        <div>
          <label class="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5">Estado</label>
          <select
            v-model="form.status"
            class="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-revel-gold/40 transition-all"
          >
            <option value="PENDING" class="bg-revel-black">Pendiente</option>
            <option value="CONFIRMED" class="bg-revel-black">Confirmado</option>
            <option value="CANCELLED" class="bg-revel-black">Cancelado</option>
          </select>
        </div>

        <!-- Notas -->
        <div>
          <label class="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5">Notas (opcional)</label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="Detalles del servicio, horario, etc."
            class="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-revel-gold/40 focus:bg-white/[0.06] transition-all resize-none"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton variant="ghost" @click="showModal = false">Cancelar</UiButton>
          <UiButton :loading="saving" @click="saveBooking">
            {{ editingId ? 'Guardar cambios' : 'Agregar' }}
          </UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import type { Supplier, SupplierBooking, Event, BookingStatus, SupplierStatusValue } from '~/types'
import { useAuthStore } from '~/stores/auth'
import { useUiStore } from '~/stores/ui'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const ui = useUiStore()
const { logout: doLogout } = useAuth()
const { get, post, put } = useApi()

const profile = ref<Supplier | null>(null)
const bookings = ref<SupplierBooking[]>([])
const events = ref<Pick<Event, 'id' | 'name' | 'date'>[]>([])
const loading = ref(true)

const showModal = ref(false)
const saving = ref(false)
const editingId = ref('')

// Chat
const showChat = ref(false)
const chatBooking = ref<SupplierBooking | null>(null)

function openChat(b: SupplierBooking) {
  chatBooking.value = b
  showChat.value = true
}

const emptyForm = () => ({ eventId: '', eventDate: '', cost: 0, currency: 'MXN', status: 'PENDING' as BookingStatus, notes: '' })
const form = reactive(emptyForm())

const totalFormatted = computed(() => {
  const total = bookings.value.reduce((sum, b) => sum + Number(b.cost), 0)
  return `$${total.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
})

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

function dayOf(d: string) { return new Date(d).getUTCDate() }
function monthOf(d: string) { return new Date(d).toLocaleString('es-MX', { month: 'short', timeZone: 'UTC' }) }
function yearOf(d: string) { return new Date(d).getUTCFullYear() }
function formatCost(c: number) { return Number(c).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
function formatEventDate(d: string) { return new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }) }

function statusClass(s: BookingStatus) {
  return {
    CONFIRMED: 'bg-green-500/10 text-green-400 border border-green-500/20',
    PENDING: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    CANCELLED: 'bg-red-500/10 text-red-400 border border-red-500/20',
  }[s] ?? ''
}
function statusLabel(s: BookingStatus) {
  return { CONFIRMED: 'Confirmado', PENDING: 'Pendiente', CANCELLED: 'Cancelado' }[s] ?? s
}

function supplierStatusClass(s: SupplierStatusValue | string) {
  const map: Record<string, string> = {
    PENDING:    'text-white/40 border-white/10',
    CONFIRMED:  'text-blue-400 border-blue-500/30',
    PREPARING:  'text-yellow-400 border-yellow-500/30',
    READY:      'text-green-400 border-green-500/30',
    ON_THE_WAY: 'text-purple-400 border-purple-500/30',
    AT_VENUE:   'text-revel-gold border-revel-gold/30',
  }
  return map[s] ?? ''
}

async function updateSupplierStatus(b: SupplierBooking, newStatus: string) {
  try {
    await put<{ success: boolean; data: SupplierBooking }>(`/api/supplier-bookings/${b.id}/supplier-status`, {
      supplierStatus: newStatus,
    })
    b.supplierStatus = newStatus as SupplierStatusValue
    ui.success('Actualizado', 'Tu estado fue actualizado')
  } catch {
    ui.error('Error', 'No se pudo actualizar el estado')
  }
}

function openAddModal() {
  editingId.value = ''
  Object.assign(form, emptyForm())
  showModal.value = true
}

function openEditModal(b: SupplierBooking) {
  editingId.value = b.id
  Object.assign(form, {
    eventId: b.eventId,
    eventDate: b.eventDate.split('T')[0],
    cost: Number(b.cost),
    currency: b.currency,
    status: b.status,
    notes: b.notes ?? '',
  })
  showModal.value = true
}

async function saveBooking() {
  if (!form.eventDate || form.cost < 0) return
  if (!editingId.value && !form.eventId) return
  saving.value = true
  try {
    const payload = {
      supplierId: profile.value!.id,
      eventId: form.eventId,
      eventDate: new Date(form.eventDate).toISOString(),
      cost: form.cost,
      currency: form.currency,
      status: form.status,
      notes: form.notes || undefined,
    }
    if (editingId.value) {
      const res = await put<{ success: boolean; data: SupplierBooking }>(`/api/supplier-bookings/${editingId.value}`, payload)
      const idx = bookings.value.findIndex(b => b.id === editingId.value)
      if (idx !== -1) bookings.value[idx] = res.data
      ui.success('Actualizado', 'Cambios guardados')
    } else {
      const res = await post<{ success: boolean; data: SupplierBooking }>('/api/supplier-bookings', payload)
      bookings.value.push(res.data)
      bookings.value.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
      ui.success('Agregado', 'Fecha de evento registrada')
    }
    showModal.value = false
  } catch (e: unknown) {
    ui.error('Error', (e as { data?: { message?: string } })?.data?.message ?? 'Error al guardar')
  } finally {
    saving.value = false
  }
}

async function handleLogout() {
  await doLogout()
}

onMounted(async () => {
  try {
    const [bRes, eRes, meRes] = await Promise.all([
      get<{ success: boolean; data: SupplierBooking[] }>('/api/supplier-bookings'),
      get<{ success: boolean; data: Event[] }>('/api/events').catch(() => ({ data: [] as Event[] })),
      get<{ success: boolean; data: Supplier | null }>('/api/supplier-bookings/me'),
    ])
    bookings.value = bRes.data
    events.value = (eRes as { data: Event[] }).data.map(e => ({ id: e.id, name: e.name, date: e.date }))
    profile.value = meRes.data
  } catch (e) {
    ui.error('Error', 'No se pudo cargar tu información')
  } finally {
    loading.value = false
  }
})
</script>
