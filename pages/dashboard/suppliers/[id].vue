<template>
  <!-- Sin márgenes negativos. Height descuenta header + padding top + padding bottom del main -->
  <div class="flex flex-col overflow-hidden h-[calc(100dvh-6rem)] lg:h-[calc(100dvh-7rem)]">

    <!-- Top bar -->
    <div class="flex-shrink-0 px-4 lg:px-6 py-3 border-b border-white/8 bg-revel-gray-dark/80 flex items-center gap-3 flex-wrap min-w-0">
      <!-- Breadcrumb -->
      <NuxtLink to="/dashboard/suppliers" class="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors flex-shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        <span class="hidden sm:inline">Proveedores</span>
      </NuxtLink>

      <template v-if="supplier && !loading">
        <span class="text-white/15 flex-shrink-0 hidden sm:inline">/</span>

        <!-- Supplier identity -->
        <div class="flex items-center gap-2.5 flex-1 min-w-0">
          <div class="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-white/80" :style="{ background: categoryColor(supplier.category) }" v-html="categoryIcon(supplier.category)"/>
          <div class="min-w-0 flex items-center gap-2 flex-wrap">
            <span class="font-semibold text-white text-sm truncate">{{ supplier.name }}</span>
            <span class="px-2 py-0.5 rounded-md bg-revel-gold/10 text-revel-gold text-[10px] font-medium border border-revel-gold/20 flex-shrink-0">{{ supplier.category }}</span>
            <UiBadge :variant="supplier.isActive ? 'success' : 'neutral'" dot class="flex-shrink-0">{{ supplier.isActive ? 'Activo' : 'Inactivo' }}</UiBadge>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 flex-shrink-0 ml-auto">
          <div class="hidden md:flex gap-4 text-center mr-2">
            <div>
              <p class="text-sm font-bold text-white leading-none">{{ supplier.bookings?.length ?? 0 }}</p>
              <p class="text-[10px] text-white/35 mt-0.5">Eventos</p>
            </div>
            <div>
              <p class="text-sm font-bold text-revel-gold leading-none">${{ totalFormatted }}</p>
              <p class="text-[10px] text-white/35 mt-0.5">Total</p>
            </div>
          </div>
          <button class="text-[10px] text-white/35 hover:text-white/60 transition-colors underline underline-offset-2 hidden lg:block" @click="showLinkModal = true">
            {{ supplier.supplierUser ? 'Cambiar usuario' : 'Vincular usuario' }}
          </button>
          <UiButton size="sm" @click="openAddBooking">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span class="hidden sm:inline">Asignar</span>
          </UiButton>
        </div>
      </template>

      <!-- Loading -->
      <div v-else-if="loading" class="flex items-center gap-3 flex-1">
        <div class="w-7 h-7 shimmer rounded-lg flex-shrink-0"/>
        <div class="w-36 h-4 shimmer rounded"/>
      </div>
    </div>

    <!-- Two-column body -->
    <div class="flex-1 flex overflow-hidden min-h-0">

      <!-- LEFT: bookings sidebar -->
      <div class="w-64 lg:w-72 flex-shrink-0 border-r border-white/8 flex flex-col overflow-hidden bg-revel-gray-dark/30">

        <!-- Linked user -->
        <div v-if="supplier" class="px-3 py-3 border-b border-white/6 flex-shrink-0">
          <p class="text-[9px] font-semibold text-white/25 uppercase tracking-wider mb-1.5">Usuario de acceso</p>
          <div v-if="supplier.supplierUser" class="flex items-center gap-2">
            <div class="w-5 h-5 rounded-full bg-revel-gold/20 flex items-center justify-center text-revel-gold text-[9px] font-bold flex-shrink-0">
              {{ supplier.supplierUser.name[0] }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-xs text-white/70 truncate">{{ supplier.supplierUser.name }}</p>
              <p class="text-[9px] text-white/30 truncate">{{ supplier.supplierUser.email }}</p>
            </div>
            <UiBadge :variant="supplier.supplierUser.isActive ? 'success' : 'neutral'" dot class="flex-shrink-0"/>
          </div>
          <div v-else class="flex items-center justify-between">
            <p class="text-xs text-white/30 italic">Sin usuario vinculado</p>
            <button class="text-[10px] text-revel-gold/60 hover:text-revel-gold transition-colors" @click="showLinkModal = true">Vincular</button>
          </div>
        </div>

        <!-- Supplier contact (compact) -->
        <div v-if="supplier && (supplier.phone || supplier.email)" class="px-3 py-2 border-b border-white/6 flex-shrink-0 flex flex-wrap gap-x-3 gap-y-1">
          <a v-if="supplier.phone" :href="`https://wa.me/52${supplier.phone.replace(/\D/g,'')}`" target="_blank"
            class="flex items-center gap-1 text-[10px] text-white/35 hover:text-green-400 transition-colors">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.104.547 4.066 1.503 5.771L0 24l6.336-1.461A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.812 9.812 0 01-5.003-1.368l-.36-.214-3.76.866.9-3.646-.235-.374A9.795 9.795 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/></svg>
            {{ supplier.phone }}
          </a>
          <a v-if="supplier.email" :href="`mailto:${supplier.email}`" class="flex items-center gap-1 text-[10px] text-white/35 hover:text-white/60 transition-colors">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            {{ supplier.email }}
          </a>
        </div>

        <!-- Events label -->
        <div class="px-3 py-2 flex-shrink-0">
          <p class="text-[9px] font-semibold text-white/25 uppercase tracking-wider">Eventos asignados</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="px-3 space-y-2 flex-1">
          <div v-for="i in 4" :key="i" class="h-14 shimmer rounded-xl"/>
        </div>

        <!-- Empty -->
        <div v-else-if="!supplier?.bookings?.length" class="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center">
          <svg class="w-7 h-7 text-white/15 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <p class="text-white/30 text-xs">Sin eventos asignados</p>
          <button class="mt-2 text-xs text-revel-gold/60 hover:text-revel-gold transition-colors" @click="openAddBooking">+ Asignar evento</button>
        </div>

        <!-- Booking list -->
        <div v-else class="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
          <button
            v-for="b in supplier!.bookings"
            :key="b.id"
            class="w-full text-left px-3 py-2.5 rounded-xl transition-all group relative"
            :class="chatBooking?.id === b.id
              ? 'bg-revel-gold/10 border border-revel-gold/25'
              : 'hover:bg-white/[0.04] border border-transparent'"
            @click="openChat(b)"
          >
            <div class="flex items-start gap-2">
              <div class="flex-shrink-0 w-8 text-center pt-0.5">
                <p class="text-sm font-bold leading-none" :class="chatBooking?.id === b.id ? 'text-revel-gold' : 'text-white/60'">{{ dayOf(b.eventDate) }}</p>
                <p class="text-[9px] text-white/30 uppercase">{{ monthOf(b.eventDate) }}</p>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-white truncate">{{ b.event?.name ?? 'Evento' }}</p>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span :class="statusClass(b.status)" class="inline-flex items-center px-1.5 py-px rounded text-[9px] font-medium">{{ statusLabel(b.status) }}</span>
                  <span class="text-[9px] text-white/30">{{ formatCost(b.cost) }} {{ b.currency }}</span>
                </div>
              </div>
              <!-- Hover actions -->
              <div class="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button class="p-1 rounded-md hover:bg-white/10 text-white/30 hover:text-white/70 transition-all" @click.stop="openEditBooking(b)">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button class="p-1 rounded-md hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all" @click.stop="confirmDeleteBooking(b)">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
          </button>
        </div>

        <!-- Stats (bottom) -->
        <div v-if="supplier?.bookings?.length" class="flex-shrink-0 px-3 py-2.5 border-t border-white/6 flex items-center justify-between">
          <span class="text-[10px] text-white/30">{{ supplier!.bookings!.length }} evento{{ supplier!.bookings!.length !== 1 ? 's' : '' }}</span>
          <span class="text-[10px] font-semibold text-revel-gold">${{ totalFormatted }}</span>
        </div>
      </div>

      <!-- RIGHT: Chat -->
      <div class="flex-1 flex flex-col overflow-hidden min-w-0">
        <template v-if="chatBooking && supplier">
          <SupplierChat
            :booking-id="chatBooking.id"
            :supplier-name="supplier.name"
            :event-name="chatBooking.event?.name ?? ''"
            :inline="true"
          />
        </template>

        <div v-else class="flex-1 flex flex-col items-center justify-center text-center px-8">
          <div class="w-14 h-14 rounded-2xl bg-revel-gold/5 border border-revel-gold/10 flex items-center justify-center mb-4">
            <svg class="w-7 h-7 text-revel-gold/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <p class="text-white/35 text-sm font-medium">Selecciona un evento</p>
          <p class="text-white/20 text-xs mt-1">Elige un evento para chatear con el proveedor</p>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <UiModal v-model="showBookingModal" :title="editingBookingId ? 'Editar evento asignado' : 'Asignar evento al proveedor'">
      <div class="space-y-4">
        <div v-if="!editingBookingId">
          <label class="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5">Evento *</label>
          <select v-model="bookingForm.eventId" class="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-revel-gold/40 transition-all">
            <option value="" disabled class="bg-revel-black">Selecciona un evento</option>
            <option v-for="ev in events" :key="ev.id" :value="ev.id" class="bg-revel-black">{{ ev.name }} — {{ formatEventDate(ev.date) }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5">Fecha de asistencia *</label>
          <input v-model="bookingForm.eventDate" type="date" class="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-revel-gold/40 transition-all"/>
        </div>
        <div>
          <label class="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5">Costo del servicio *</label>
          <div class="flex gap-2">
            <input v-model.number="bookingForm.cost" type="number" min="0" step="0.01" placeholder="0.00" class="flex-1 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-revel-gold/40 transition-all"/>
            <select v-model="bookingForm.currency" class="w-24 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-revel-gold/40 transition-all">
              <option class="bg-revel-black">MXN</option>
              <option class="bg-revel-black">USD</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5">Estado</label>
          <select v-model="bookingForm.status" class="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-revel-gold/40 transition-all">
            <option value="PENDING" class="bg-revel-black">Pendiente</option>
            <option value="CONFIRMED" class="bg-revel-black">Confirmado</option>
            <option value="CANCELLED" class="bg-revel-black">Cancelado</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5">Notas</label>
          <textarea v-model="bookingForm.notes" rows="2" placeholder="Detalles del servicio..." class="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-revel-gold/40 transition-all resize-none"/>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton variant="ghost" @click="showBookingModal = false">Cancelar</UiButton>
          <UiButton :loading="savingBooking" @click="saveBooking">{{ editingBookingId ? 'Guardar' : 'Asignar' }}</UiButton>
        </div>
      </template>
    </UiModal>

    <UiModal v-model="showLinkModal" title="Vincular usuario proveedor">
      <p class="text-sm text-white/60 mb-4">Selecciona un usuario con rol <span class="text-revel-gold font-medium">SUPPLIER</span> para que este proveedor pueda acceder al portal.</p>
      <div>
        <label class="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5">Usuario</label>
        <select v-model="linkUserId" class="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-revel-gold/40 transition-all">
          <option value="" class="bg-revel-black">Sin usuario (quitar acceso)</option>
          <option v-for="u in supplierUsers" :key="u.id" :value="u.id" class="bg-revel-black">{{ u.name }} — {{ u.email }}</option>
        </select>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton variant="ghost" @click="showLinkModal = false">Cancelar</UiButton>
          <UiButton :loading="linkingSaving" @click="linkUser">Guardar</UiButton>
        </div>
      </template>
    </UiModal>

    <UiConfirm
      v-model="showDeleteModal"
      title="Eliminar evento asignado"
      message="¿Seguro que deseas quitar este evento del proveedor?"
      confirm-label="Eliminar"
      :loading="deletingBooking"
      @confirm="deleteBooking"
    />
  </div>
</template>

<script setup lang="ts">
import type { Supplier, SupplierBooking, Event, BookingStatus, User } from '~/types'
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const ui = useUiStore()
const { get, post, put, del } = useApi()

const supplierId = route.params.id as string
const supplier = ref<Supplier | null>(null)
const events = ref<Pick<Event, 'id' | 'name' | 'date'>[]>([])
const supplierUsers = ref<Pick<User, 'id' | 'name' | 'email'>[]>([])
const loading = ref(true)

const showBookingModal = ref(false)
const savingBooking = ref(false)
const editingBookingId = ref('')
const emptyBookingForm = () => ({ eventId: '', eventDate: '', cost: 0, currency: 'MXN', status: 'PENDING' as BookingStatus, notes: '' })
const bookingForm = reactive(emptyBookingForm())

const showLinkModal = ref(false)
const linkingSaving = ref(false)
const linkUserId = ref<string>('')

const showDeleteModal = ref(false)
const deletingBooking = ref(false)
const bookingToDelete = ref<SupplierBooking | null>(null)

const chatBooking = ref<SupplierBooking | null>(null)

function openChat(b: SupplierBooking) { chatBooking.value = b }

const totalFormatted = computed(() => {
  const total = (supplier.value?.bookings ?? []).reduce((sum, b) => sum + Number(b.cost), 0)
  return total.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
})

function categoryColor(cat: string) {
  const colors: Record<string, string> = {
    Fotografía: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', Video: 'linear-gradient(135deg,#EF4444,#DC2626)',
    Música: 'linear-gradient(135deg,#F59E0B,#D97706)', Decoración: 'linear-gradient(135deg,#10B981,#059669)',
    Catering: 'linear-gradient(135deg,#F97316,#EA580C)', Iluminación: 'linear-gradient(135deg,#FBBF24,#F59E0B)',
    Sonido: 'linear-gradient(135deg,#3B82F6,#2563EB)',
  }
  return colors[cat] ?? 'linear-gradient(135deg,#6B7280,#4B5563)'
}

function categoryIcon(cat: string) {
  const icons: Record<string, string> = {
    Fotografía: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
    Música: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>`,
  }
  return icons[cat] ?? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/></svg>`
}

function dayOf(d: string) { return new Date(d).getUTCDate() }
function monthOf(d: string) { return new Date(d).toLocaleString('es-MX', { month: 'short', timeZone: 'UTC' }) }
function formatCost(c: number) { return Number(c).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }
function formatEventDate(d: string) { return new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }) }

function statusClass(s: BookingStatus) {
  return { CONFIRMED: 'bg-green-500/10 text-green-400 border border-green-500/20', PENDING: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20', CANCELLED: 'bg-red-500/10 text-red-400 border border-red-500/20' }[s] ?? ''
}
function statusLabel(s: BookingStatus) {
  return { CONFIRMED: 'Confirmado', PENDING: 'Pendiente', CANCELLED: 'Cancelado' }[s] ?? s
}

function openAddBooking() { editingBookingId.value = ''; Object.assign(bookingForm, emptyBookingForm()); showBookingModal.value = true }
function openEditBooking(b: SupplierBooking) {
  editingBookingId.value = b.id
  Object.assign(bookingForm, { eventId: b.eventId, eventDate: b.eventDate.split('T')[0], cost: Number(b.cost), currency: b.currency, status: b.status, notes: b.notes ?? '' })
  showBookingModal.value = true
}
function confirmDeleteBooking(b: SupplierBooking) { bookingToDelete.value = b; showDeleteModal.value = true }

async function saveBooking() {
  if (!bookingForm.eventDate || bookingForm.cost < 0) return
  if (!editingBookingId.value && !bookingForm.eventId) return
  savingBooking.value = true
  try {
    const payload = { supplierId, eventId: bookingForm.eventId, eventDate: new Date(bookingForm.eventDate).toISOString(), cost: bookingForm.cost, currency: bookingForm.currency, status: bookingForm.status, notes: bookingForm.notes || undefined }
    if (editingBookingId.value) {
      const res = await put<{ success: boolean; data: SupplierBooking }>(`/api/supplier-bookings/${editingBookingId.value}`, payload)
      const idx = supplier.value!.bookings!.findIndex(b => b.id === editingBookingId.value)
      if (idx !== -1) supplier.value!.bookings![idx] = res.data
      ui.success('Actualizado', 'Evento actualizado')
    } else {
      const res = await post<{ success: boolean; data: SupplierBooking }>('/api/supplier-bookings', payload)
      supplier.value!.bookings = [...(supplier.value!.bookings ?? []), res.data].sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
      ui.success('Asignado', 'Evento asignado al proveedor')
    }
    showBookingModal.value = false
  } catch (e: unknown) {
    ui.error('Error', (e as { data?: { message?: string } })?.data?.message ?? 'Error al guardar')
  } finally { savingBooking.value = false }
}

async function deleteBooking() {
  if (!bookingToDelete.value) return
  deletingBooking.value = true
  try {
    await del(`/api/supplier-bookings/${bookingToDelete.value.id}`)
    supplier.value!.bookings = supplier.value!.bookings!.filter(b => b.id !== bookingToDelete.value!.id)
    if (chatBooking.value?.id === bookingToDelete.value.id) chatBooking.value = null
    ui.success('Eliminado', 'Evento quitado del proveedor')
    showDeleteModal.value = false
  } catch { ui.error('Error', 'No se pudo eliminar') }
  finally { deletingBooking.value = false }
}

async function linkUser() {
  linkingSaving.value = true
  try {
    const res = await put<{ success: boolean; data: Supplier }>(`/api/suppliers/${supplierId}`, { supplierUserId: linkUserId.value || null })
    if (supplier.value) { supplier.value.supplierUserId = res.data.supplierUserId; supplier.value.supplierUser = res.data.supplierUser }
    ui.success('Guardado', linkUserId.value ? 'Usuario vinculado' : 'Acceso removido')
    showLinkModal.value = false
  } catch (e: unknown) {
    ui.error('Error', (e as { data?: { message?: string } })?.data?.message ?? 'Error al vincular')
  } finally { linkingSaving.value = false }
}

onMounted(async () => {
  try {
    const [sRes, eRes, uRes] = await Promise.all([
      get<{ success: boolean; data: Supplier }>(`/api/suppliers/${supplierId}`),
      get<{ success: boolean; data: Event[] }>('/api/events'),
      get<{ success: boolean; data: User[] }>('/api/users'),
    ])
    supplier.value = sRes.data
    events.value = eRes.data.map(e => ({ id: e.id, name: e.name, date: e.date }))
    supplierUsers.value = uRes.data.filter(u => u.role === 'SUPPLIER').map(u => ({ id: u.id, name: u.name, email: u.email }))
    linkUserId.value = supplier.value.supplierUserId ?? ''
    if (sRes.data.bookings?.length) chatBooking.value = sRes.data.bookings[0]
  } catch { ui.error('Error', 'No se pudo cargar el proveedor') }
  finally { loading.value = false }
})
</script>
