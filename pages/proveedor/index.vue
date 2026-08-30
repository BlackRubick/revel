<template>
  <div class="h-screen flex flex-col bg-revel-black overflow-hidden">

    <!-- Header -->
    <header class="flex-shrink-0 border-b border-white/6 bg-revel-gray-dark px-5 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <!-- Back button on mobile when chat is open -->
        <button
          v-if="mobileShowChat"
          class="md:hidden w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all mr-1"
          @click="mobileShowChat = false"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div class="w-7 h-7 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold">
          <span class="font-display font-bold text-revel-black text-xs">R</span>
        </div>
        <span class="font-display text-base font-semibold text-white">Rével</span>
        <span class="hidden sm:inline text-white/25 text-sm">/ Portal Proveedor</span>
      </div>
      <div class="flex items-center gap-3">
        <!-- Unread badge total -->
        <div v-if="totalUnread > 0" class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/25">
          <span class="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"/>
          <span class="text-xs text-red-400 font-medium">{{ totalUnread }} sin leer</span>
        </div>
        <div class="text-right hidden sm:block">
          <p class="text-sm font-medium text-white leading-none">{{ auth.user?.name }}</p>
          <p class="text-xs text-white/40 mt-0.5">{{ profile?.category ?? 'Proveedor' }}</p>
        </div>
        <button
          class="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-red-400/70 hover:text-red-400 hover:border-red-500/30 transition-all"
          @click="handleLogout"
        >
          Salir
        </button>
      </div>
    </header>

    <!-- Body: sidebar + chat -->
    <div class="flex-1 flex overflow-hidden">

      <!-- LEFT SIDEBAR -->
      <div
        class="flex-shrink-0 border-r border-white/8 flex flex-col overflow-hidden bg-revel-gray-dark/50"
        :class="mobileShowChat ? 'hidden md:flex md:w-80' : 'flex w-full md:w-80'"
      >
        <!-- Profile compact -->
        <div v-if="profile" class="px-4 py-4 border-b border-white/6 flex-shrink-0">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white/80"
              :style="{ background: categoryColor(profile.category) }"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-white text-sm truncate">{{ profile.name }}</p>
              <p class="text-xs text-white/40 truncate">{{ profile.category }}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="text-sm font-bold text-revel-gold">{{ totalFormatted }}</p>
              <p class="text-[10px] text-white/30">{{ bookings.length }} evento{{ bookings.length !== 1 ? 's' : '' }}</p>
            </div>
          </div>
        </div>

        <!-- Sin perfil -->
        <div v-else-if="!loading" class="px-4 py-6 text-center border-b border-white/6 flex-shrink-0">
          <p class="text-white/50 text-xs">Sin perfil vinculado</p>
          <p class="text-white/25 text-[10px] mt-0.5">Contacta al administrador</p>
        </div>

        <!-- Conversaciones header -->
        <div class="px-4 py-3 flex items-center justify-between flex-shrink-0">
          <p class="text-xs font-semibold text-white/40 uppercase tracking-wider">Conversaciones</p>
          <button
            v-if="profile"
            class="flex items-center gap-1 px-2 py-1 rounded-lg bg-revel-gold/10 border border-revel-gold/20 text-revel-gold text-xs font-medium hover:bg-revel-gold/15 transition-all"
            @click="openAddModal"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Agregar
          </button>
        </div>

        <!-- Loading skeleton -->
        <div v-if="loading" class="px-3 space-y-2 flex-1">
          <div v-for="i in 3" :key="i" class="h-16 shimmer rounded-xl"/>
        </div>

        <!-- Sin bookings -->
        <div v-else-if="!bookings.length" class="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center">
          <svg class="w-8 h-8 text-white/15 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          <p class="text-white/40 text-xs">No tienes eventos asignados.</p>
        </div>

        <!-- Lista de bookings -->
        <div v-else class="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
          <button
            v-for="b in bookings"
            :key="b.id"
            class="w-full text-left px-3 py-3 rounded-xl transition-all group relative"
            :class="chatBooking?.id === b.id
              ? 'bg-revel-gold/10 border border-revel-gold/25'
              : 'hover:bg-white/[0.04] border border-transparent'"
            @click="openChat(b)"
          >
            <div class="flex items-start gap-2.5">
              <!-- Fecha compacta -->
              <div class="flex-shrink-0 w-10 text-center pt-0.5">
                <p class="text-base font-bold leading-none" :class="chatBooking?.id === b.id ? 'text-revel-gold' : 'text-white/70'">{{ dayOf(b.eventDate) }}</p>
                <p class="text-[9px] text-white/30 uppercase tracking-wide">{{ monthOf(b.eventDate) }}</p>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <p class="text-sm font-medium text-white truncate flex-1">{{ b.event?.name ?? 'Evento' }}</p>
                  <!-- Unread badge -->
                  <span
                    v-if="unreadCounts[b.id]"
                    class="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center"
                  >{{ unreadCounts[b.id] > 9 ? '9+' : unreadCounts[b.id] }}</span>
                </div>
                <div class="flex items-center gap-2 mt-0.5">
                  <span :class="statusClass(b.status)" class="inline-flex items-center px-1.5 py-px rounded text-[9px] font-medium">
                    {{ statusLabel(b.status) }}
                  </span>
                  <span class="text-[10px] text-white/30">{{ formatCost(b.cost) }} {{ b.currency }}</span>
                </div>
                <p v-if="b.event?.venue" class="text-[10px] text-white/25 mt-0.5 truncate">{{ b.event.venue }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- RIGHT: Chat area -->
      <div
        class="flex-1 flex flex-col overflow-hidden"
        :class="mobileShowChat ? 'flex' : 'hidden md:flex'"
      >
        <!-- Chat inline -->
        <template v-if="chatBooking">
          <!-- Booking actions bar -->
          <div class="flex-shrink-0 px-4 py-2 border-b border-white/6 bg-revel-gray-dark/30 flex items-center gap-3">
            <div class="flex-1 flex items-center gap-3 min-w-0">
              <span :class="supplierStatusClass(chatBooking.supplierStatus ?? 'PENDING')" class="text-xs px-2.5 py-1 rounded-xl border font-medium flex-shrink-0">
                {{ supplierStatusLabel(chatBooking.supplierStatus ?? 'PENDING') }}
              </span>
              <p class="text-xs text-white/30 truncate hidden sm:block">{{ chatBooking.event?.venue }}</p>
            </div>
            <!-- Toggle detalles -->
            <button
              class="p-1.5 rounded-lg transition-all flex-shrink-0"
              :class="showEventDetails ? 'bg-revel-gold/15 text-revel-gold' : 'bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70'"
              title="Ver detalles del evento"
              @click="showEventDetails = !showEventDetails"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
            <select
              :value="chatBooking.supplierStatus"
              class="px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-revel-gold/40 transition-all cursor-pointer flex-shrink-0"
              :class="supplierStatusClass(chatBooking.supplierStatus ?? 'PENDING')"
              @change="updateSupplierStatus(chatBooking!, ($event.target as HTMLSelectElement).value)"
            >
              <option value="PENDING" class="bg-revel-black text-white">Sin confirmar</option>
              <option value="CONFIRMED" class="bg-revel-black text-white">Confirmado</option>
              <option value="PREPARING" class="bg-revel-black text-white">Preparando</option>
              <option value="READY" class="bg-revel-black text-white">Listo</option>
              <option value="ON_THE_WAY" class="bg-revel-black text-white">En camino</option>
              <option value="AT_VENUE" class="bg-revel-black text-white">En el lugar</option>
            </select>
            <button
              class="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all flex-shrink-0"
              title="Editar"
              @click="openEditModal(chatBooking!)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
          </div>

          <!-- Panel de detalles del evento (desplegable) -->
          <Transition name="event-details">
            <div v-if="showEventDetails" class="flex-shrink-0 border-b border-white/6 bg-revel-black/40 overflow-hidden">
              <div class="px-4 py-3 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2.5">
                <!-- Nombre del evento -->
                <div class="col-span-2 sm:col-span-3">
                  <p class="text-[9px] font-semibold text-white/25 uppercase tracking-wider mb-0.5">Evento</p>
                  <p class="text-sm font-semibold text-white">{{ chatBooking.event?.name ?? '—' }}</p>
                </div>

                <!-- Fecha de asistencia -->
                <div>
                  <p class="text-[9px] font-semibold text-white/25 uppercase tracking-wider mb-0.5">Tu fecha</p>
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3 h-3 text-revel-gold/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <p class="text-xs text-white/70">{{ formatEventDate(chatBooking.eventDate) }}</p>
                  </div>
                </div>

                <!-- Lugar -->
                <div v-if="chatBooking.event?.venue">
                  <p class="text-[9px] font-semibold text-white/25 uppercase tracking-wider mb-0.5">Lugar</p>
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3 h-3 text-revel-gold/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <p class="text-xs text-white/70 truncate">{{ chatBooking.event.venue }}</p>
                  </div>
                </div>

                <!-- Tipo de evento -->
                <div v-if="chatBooking.event?.type">
                  <p class="text-[9px] font-semibold text-white/25 uppercase tracking-wider mb-0.5">Tipo</p>
                  <p class="text-xs text-white/70">{{ chatBooking.event.type }}</p>
                </div>

                <!-- Costo acordado -->
                <div>
                  <p class="text-[9px] font-semibold text-white/25 uppercase tracking-wider mb-0.5">Tu pago</p>
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3 h-3 text-revel-gold/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p class="text-xs text-revel-gold font-semibold">${{ formatCost(chatBooking.cost) }} {{ chatBooking.currency }}</p>
                  </div>
                </div>

                <!-- Estado del booking -->
                <div>
                  <p class="text-[9px] font-semibold text-white/25 uppercase tracking-wider mb-0.5">Estado</p>
                  <span :class="statusClass(chatBooking.status)" class="inline-flex items-center px-1.5 py-px rounded text-[9px] font-medium">
                    {{ statusLabel(chatBooking.status) }}
                  </span>
                </div>

                <!-- Dirección del venue -->
                <div v-if="chatBooking.event?.venueAddress" class="col-span-2 sm:col-span-3">
                  <p class="text-[9px] font-semibold text-white/25 uppercase tracking-wider mb-0.5">Dirección</p>
                  <a
                    v-if="chatBooking.event.venueMapUrl"
                    :href="chatBooking.event.venueMapUrl"
                    target="_blank"
                    class="flex items-center gap-1 text-xs text-blue-400/70 hover:text-blue-400 transition-colors"
                  >
                    {{ chatBooking.event.venueAddress }}
                    <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>
                  <p v-else class="text-xs text-white/50">{{ chatBooking.event.venueAddress }}</p>
                </div>

                <!-- Notas del organizador -->
                <div v-if="chatBooking.notes" class="col-span-2 sm:col-span-3">
                  <p class="text-[9px] font-semibold text-white/25 uppercase tracking-wider mb-0.5">Notas del organizador</p>
                  <p class="text-xs text-white/60 leading-relaxed bg-white/[0.03] border border-white/6 rounded-lg px-3 py-2">{{ chatBooking.notes }}</p>
                </div>
              </div>
            </div>
          </Transition>

          <SupplierChat
            :booking-id="chatBooking.id"
            :supplier-name="`Organizador · ${chatBooking.event?.name ?? 'evento'}`"
            :event-name="chatBooking.event?.name ?? ''"
            :inline="true"
          />
        </template>

        <!-- Empty state -->
        <div v-else class="flex-1 flex flex-col items-center justify-center text-center px-8">
          <div class="w-16 h-16 rounded-2xl bg-revel-gold/5 border border-revel-gold/10 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-revel-gold/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <p class="text-white/40 text-sm font-medium">Selecciona una conversación</p>
          <p class="text-white/20 text-xs mt-1">Elige un evento de la lista para chatear con el organizador</p>
        </div>
      </div>
    </div>

    <!-- Modal agregar/editar booking -->
    <UiModal v-model="showModal" :title="editingId ? 'Editar evento' : 'Agregar fecha de evento'">
      <div class="space-y-4">
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

        <div>
          <label class="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5">Fecha que estarás presente *</label>
          <input
            v-model="form.eventDate"
            type="date"
            class="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-revel-gold/40 focus:bg-white/[0.06] transition-all"
          />
        </div>

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
const chatBooking = ref<SupplierBooking | null>(null)
const mobileShowChat = ref(false)
const showEventDetails = ref(false)
const unreadCounts = ref<Record<string, number>>({})
let unreadTimer: ReturnType<typeof setInterval> | null = null
let unreadInitialized = false

function openChat(b: SupplierBooking) {
  chatBooking.value = b
  mobileShowChat.value = true
  if (unreadCounts.value[b.id]) unreadCounts.value[b.id] = 0
}

async function fetchUnread() {
  try {
    const res = await get<{ success: boolean; data: { bookingId: string; unreadCount: number }[] }>('/api/chat/unread')
    const newCounts: Record<string, number> = {}
    let hasNew = false

    for (const item of res.data) {
      newCounts[item.bookingId] = item.unreadCount
      if (unreadInitialized && item.bookingId !== chatBooking.value?.id) {
        const prev = unreadCounts.value[item.bookingId] ?? 0
        if (item.unreadCount > prev) hasNew = true
      }
    }

    unreadCounts.value = newCounts
    unreadInitialized = true

    if (hasNew) notifyNewMessage()
  } catch { /* silent */ }
}

function notifyNewMessage() {
  if (typeof window === 'undefined') return
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('¡Nuevo mensaje!', {
      body: 'Tienes mensajes nuevos de un organizador',
      icon: '/favicon.ico',
      tag: 'revel-chat',
      renotify: true,
    })
  }
  if ('vibrate' in navigator) navigator.vibrate([200, 100, 200])
}

const totalUnread = computed(() => Object.values(unreadCounts.value).reduce((a, b) => a + b, 0))

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

function supplierStatusClass(s: string) {
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

function supplierStatusLabel(s: string) {
  const map: Record<string, string> = {
    PENDING: 'Sin confirmar',
    CONFIRMED: 'Confirmado',
    PREPARING: 'Preparando',
    READY: 'Listo',
    ON_THE_WAY: 'En camino',
    AT_VENUE: 'En el lugar',
  }
  return map[s] ?? s
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

// Actualizar título de pestaña
watch(totalUnread, (count) => {
  if (typeof document !== 'undefined') {
    document.title = count > 0 ? `(${count}) Rével` : 'Rével'
  }
})

// Limpiar badge y detalles al cambiar de booking
watch(chatBooking, (b) => {
  if (b) {
    unreadCounts.value[b.id] = 0
    showEventDetails.value = false
  }
})

onMounted(async () => {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }

  try {
    const [bRes, eRes, meRes] = await Promise.all([
      get<{ success: boolean; data: SupplierBooking[] }>('/api/supplier-bookings'),
      get<{ success: boolean; data: Event[] }>('/api/events').catch(() => ({ data: [] as Event[] })),
      get<{ success: boolean; data: Supplier | null }>('/api/supplier-bookings/me'),
    ])
    bookings.value = bRes.data
    events.value = (eRes as { data: Event[] }).data.map(e => ({ id: e.id, name: e.name, date: e.date }))
    profile.value = meRes.data

    // Abrir el primer booking con mensajes automáticamente en desktop
    if (bRes.data.length && typeof window !== 'undefined' && window.innerWidth >= 768) {
      chatBooking.value = bRes.data[0]
    }
  } catch {
    ui.error('Error', 'No se pudo cargar tu información')
  } finally {
    loading.value = false
  }

  await fetchUnread()
  unreadTimer = setInterval(fetchUnread, 8000)
})

onUnmounted(() => {
  if (unreadTimer) clearInterval(unreadTimer)
  if (typeof document !== 'undefined') document.title = 'Rével'
})
</script>

<style scoped>
.event-details-enter-active, .event-details-leave-active {
  transition: max-height 0.25s ease, opacity 0.2s ease;
  max-height: 400px;
}
.event-details-enter-from, .event-details-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
