<template>
  <div>

    <!-- Panel: link de registro -->
    <div class="card-revel p-4 mb-5 border border-revel-gold/20 bg-revel-gold/4">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-xl bg-revel-gold/15 flex items-center justify-center flex-shrink-0">
            <svg class="w-4.5 h-4.5 text-revel-gold" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-white mb-0.5">Link de registro</p>
            <p class="text-xs text-white/40 font-mono truncate max-w-xs">{{ registroUrl }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0">
          <button
            :class="['flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200',
              linkCopied
                ? 'border-green-500/40 bg-green-500/15 text-green-400'
                : 'border-white/10 text-white/70 hover:text-white hover:border-white/20']"
            @click="copyRegistroLink"
          >
            <Transition name="icon-swap" mode="out-in">
              <svg v-if="linkCopied" key="check" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else key="copy" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </Transition>
            {{ linkCopied ? '¡Copiado!' : 'Copiar link' }}
          </button>

          <button
            class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-green-500/15 border border-green-500/25 text-green-400 hover:bg-green-500/25 transition-all"
            @click="shareWhatsApp"
          >
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </button>
        </div>
      </div>
    </div>

    <!-- Barra de búsqueda y contador -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
      <div class="flex items-center gap-2 flex-wrap">
        <div class="relative flex-1 min-w-0">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="search" type="text" placeholder="Buscar invitado..." class="input-revel pl-9 py-2 text-sm w-full sm:w-56" />
        </div>
        <UiSelect
          v-model="rsvpFilter"
          :options="rsvpOptions"
          placeholder="Todos"
          class="w-32"
        />
      </div>

      <div class="flex items-center gap-3 flex-shrink-0">
        <div class="text-right">
          <p class="text-sm font-semibold text-white">{{ guestsStore.total }}</p>
          <p class="text-[10px] text-white/35 uppercase tracking-wider">{{ guestsStore.total === 1 ? 'invitado' : 'invitados' }}</p>
        </div>
        <div class="h-8 w-px bg-white/10" />
        <div class="text-right">
          <p class="text-sm font-semibold text-white">{{ totalPersonas }}</p>
          <p class="text-[10px] text-white/35 uppercase tracking-wider">personas en total</p>
        </div>
      </div>
    </div>

    <!-- Tabla de invitados -->
    <div class="card-revel overflow-hidden">
      <div v-if="guestsStore.loading" class="p-8 text-center">
        <div class="w-8 h-8 border-2 border-revel-gold/30 border-t-revel-gold rounded-full animate-spin mx-auto" />
      </div>

      <div v-else class="overflow-x-auto">
      <table class="table-revel">
        <thead>
          <tr>
            <th>Invitado</th>
            <th class="hidden sm:table-cell">Acompañantes</th>
            <th class="hidden md:table-cell">Mesa</th>
            <th>RSVP</th>
            <th class="hidden md:table-cell">Check-in</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="guest in filteredGuests"
            :key="guest.id"
            class="group"
          >
            <td>
              <div>
                <p class="font-medium text-white">{{ guest.name }}</p>
                <p v-if="guest.email" class="text-xs text-white/35">{{ guest.email }}</p>
              </div>
            </td>
            <td class="hidden sm:table-cell">
              <span class="text-white/60">
                {{ guest.companions > 0 ? `+${guest.companions}` : '—' }}
              </span>
            </td>
            <td class="hidden md:table-cell">
              <span v-if="guest.table" class="badge-gold text-xs">{{ guest.table.name }}</span>
              <span v-else class="text-white/25 text-xs">Sin asignar</span>
            </td>
            <td>
              <UiBadge :variant="rsvpVariant(guest.rsvpStatus)" dot>
                {{ rsvpLabel(guest.rsvpStatus) }}
              </UiBadge>
            </td>
            <td class="hidden md:table-cell">
              <span v-if="guest.checkedIn" class="badge-success text-xs inline-flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                Asistió
              </span>
              <span v-else class="text-white/25 text-xs">—</span>
            </td>
            <td>
              <div class="flex items-center justify-center gap-2">

                <button
                  class="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-revel-gold hover:bg-revel-gold/10 transition-all"
                  title="Ver QR"
                  @click="viewQr(guest)"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </button>

                <button
                  :class="['w-9 h-9 rounded-xl flex items-center justify-center transition-all', guest.qrCodes?.[0]?.code ? 'text-white/50 hover:text-blue-400 hover:bg-blue-500/10' : 'text-white/15 cursor-not-allowed']"
                  :title="guest.qrCodes?.[0]?.code ? 'Copiar link de invitación' : 'Sin código generado'"
                  @click="copyInvitacionLink(guest)"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>

                <button
                  class="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Eliminar"
                  @click="deleteGuest(guest.id)"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!filteredGuests.length">
            <td colspan="6" class="text-center py-12">
              <div class="flex flex-col items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-revel-gold/8 flex items-center justify-center text-revel-gold/40">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <p class="text-white/30 text-sm">
                  {{ search || rsvpFilter ? 'No se encontraron invitados con ese filtro' : 'Aún no hay invitados registrados' }}
                </p>
                <p v-if="!search && !rsvpFilter" class="text-white/20 text-xs">
                  Comparte el link de registro para que se vayan agregando aquí
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

    <!-- Modal: Ver QR del invitado -->
    <UiModal v-model="showQrModal" title="Código QR del invitado" size="sm">
      <div v-if="selectedGuest" class="text-center">
        <p class="text-white/70 text-sm font-medium mb-4">{{ selectedGuest.name }}</p>

        <div v-if="selectedGuest.qrCodes?.[0]?.code">
          <div class="flex justify-center mb-3">
            <div class="bg-white p-3 rounded-2xl shadow-lg">
              <canvas ref="qrModalCanvas" class="block w-52 h-52" />
            </div>
          </div>
          <p class="text-xs text-white/30 font-mono mb-4">{{ selectedGuest.qrCodes[0].code }}</p>
          <div class="flex gap-2">
            <button
              class="flex-1 text-xs text-revel-gold border border-revel-gold/30 rounded-lg py-2 hover:bg-revel-gold/10 transition-colors"
              @click="copyInvitacionLink(selectedGuest)"
            >
              Copiar link
            </button>
            <button
              class="flex-1 text-xs text-revel-black bg-revel-gold rounded-lg py-2 font-semibold hover:opacity-90 transition-opacity"
              @click="downloadQRModal"
            >
              Descargar QR
            </button>
          </div>
        </div>

        <div v-else class="py-4">
          <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3 text-white/30">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
            </svg>
          </div>
          <p class="text-white/40 text-sm mb-4">Este invitado no tiene QR generado</p>
          <UiButton size="sm" :loading="generatingQr" @click="generateQr(selectedGuest)">
            Generar QR
          </UiButton>
        </div>
      </div>
    </UiModal>

  </div>
</template>

<script setup lang="ts">
import { useGuestsStore } from '~/stores/guests'
import { useUiStore } from '~/stores/ui'
import { useEventFeatures, FEATURE_MIN_PLAN } from '~/composables/useEventFeatures'
import type { Guest } from '~/types'

const props = defineProps<{
  eventId: string
  eventName?: string
  packageType?: string
  eventSlug?: string
}>()

const guestsStore = useGuestsStore()
const ui = useUiStore()
const features = useEventFeatures(props.packageType)
const config = useRuntimeConfig()

const search = ref('')
const rsvpFilter = ref('')
const showQrModal = ref(false)
const selectedGuest = ref<Guest | null>(null)
const generatingQr = ref(false)
const qrModalCanvas = ref<HTMLCanvasElement | null>(null)
const linkCopied = ref(false)

const registroUrl = computed(() => {
  if (!props.eventSlug) return ''
  const base = typeof window !== 'undefined'
    ? window.location.origin
    : (config.public.appUrl || 'http://localhost:3000')
  return `${base}/registro/${props.eventSlug}`
})

const totalPersonas = computed(() =>
  guestsStore.guests.reduce((sum, g) => sum + 1 + g.companions, 0),
)

const rsvpOptions = [
  { label: 'Todos', value: '' },
  { label: 'Confirmados', value: 'CONFIRMED' },
  { label: 'Pendientes', value: 'PENDING' },
  { label: 'Rechazados', value: 'DECLINED' },
]

const filteredGuests = computed(() =>
  guestsStore.guests.filter((g) => {
    const matchSearch = !search.value || g.name.toLowerCase().includes(search.value.toLowerCase())
    const matchRsvp = !rsvpFilter.value || g.rsvpStatus === rsvpFilter.value
    return matchSearch && matchRsvp
  }),
)

function rsvpLabel(status: string) {
  const map: Record<string, string> = { CONFIRMED: 'Confirmado', PENDING: 'Pendiente', DECLINED: 'Rechazado' }
  return map[status] ?? status
}

function rsvpVariant(status: string): 'success' | 'warning' | 'danger' {
  const map: Record<string, 'success' | 'warning' | 'danger'> = { CONFIRMED: 'success', PENDING: 'warning', DECLINED: 'danger' }
  return map[status] ?? 'warning'
}

function getInvitacionUrl(guest: Guest): string | null {
  const code = guest.qrCodes?.[0]?.code
  return code ? `${config.public.appUrl}/invitacion/${code}` : null
}

async function copyRegistroLink() {
  const url = registroUrl.value
  if (!url) {
    ui.error('Sin link', 'No se pudo obtener el link de registro')
    return
  }

  const el = document.createElement('textarea')
  el.value = url
  el.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none'
  document.body.appendChild(el)
  el.focus()
  el.select()
  try {
    document.execCommand('copy')
  } catch {
    // si execCommand falla, intentar clipboard API
    try { await navigator.clipboard.writeText(url) } catch { /* nada */ }
  }
  document.body.removeChild(el)

  linkCopied.value = true
  setTimeout(() => { linkCopied.value = false }, 2000)
}

function shareWhatsApp() {
  if (!registroUrl.value) return
  const eventName = props.eventName ?? 'nuestro evento'
  const msg = `¡Estás invitado/a a *${eventName}*!\n\nRegístrate aquí para obtener tu invitación personalizada:\n${registroUrl.value}`
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
}

async function copyInvitacionLink(guest: Guest) {
  const url = getInvitacionUrl(guest)
  if (!url) return
  try {
    await navigator.clipboard.writeText(url)
  } catch {
    const el = document.createElement('textarea')
    el.value = url
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
  ui.success('Link copiado', `Invitación de ${guest.name}`)
}

function sendWhatsApp(guest: Guest) {
  if (!guest.phone) {
    ui.error('Sin teléfono', 'Este invitado no tiene número registrado')
    return
  }
  const phone = guest.phone.replace(/\D/g, '')
  const normalized = phone.startsWith('52') ? phone : `52${phone}`
  const invitacionUrl = getInvitacionUrl(guest) ?? `${config.public.appUrl}/confirmar`
  const eventName = props.eventName ?? 'nuestro evento'
  const lines = [
    `Hola, ${guest.name}.`,
    `Te enviamos tu invitación para *${eventName}*.`,
    `Accede a tu invitación personalizada aquí:`,
    invitacionUrl,
    `En tu invitación podrás confirmar tu asistencia, ver los detalles del evento y la ubicación.`,
    `Te esperamos.`,
  ]
  window.open(`https://wa.me/${normalized}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank')
}

async function viewQr(guest: Guest) {
  selectedGuest.value = guest
  showQrModal.value = true
}

async function renderQrCanvas(guest: Guest) {
  const code = guest.qrCodes?.[0]?.code
  if (!code || !qrModalCanvas.value) return
  const QRCode = await import('qrcode')
  const url = `${config.public.appUrl}/confirmar/${code}`
  await QRCode.toCanvas(qrModalCanvas.value, url, {
    width: 208,
    margin: 1,
    color: { dark: '#000000', light: '#ffffff' },
  })
}

async function generateQr(guest: Guest) {
  if (!guest) return
  generatingQr.value = true
  try {
    const { post } = useApi()
    const res = await post<{ success: boolean; data: { code: string } }>(`/api/guests/${guest.id}/generate-qr`, {})
    const idx = guestsStore.guests.findIndex(g => g.id === guest.id)
    if (idx !== -1) {
      guestsStore.guests[idx] = { ...guestsStore.guests[idx], qrCodes: [res.data] }
      selectedGuest.value = guestsStore.guests[idx]
    }
    await nextTick()
    await renderQrCanvas(selectedGuest.value!)
    ui.success('QR generado', guest.name)
  } catch {
    ui.error('Error', 'No se pudo generar el QR')
  } finally {
    generatingQr.value = false
  }
}

function downloadQRModal() {
  if (!qrModalCanvas.value || !selectedGuest.value) return
  const link = document.createElement('a')
  link.download = `qr-${selectedGuest.value.name.replace(/\s+/g, '-').toLowerCase()}.png`
  link.href = qrModalCanvas.value.toDataURL('image/png')
  link.click()
}

async function deleteGuest(id: string) {
  await guestsStore.deleteGuest(id)
  ui.success('Invitado eliminado')
}

watch(showQrModal, async (open) => {
  if (open && selectedGuest.value?.qrCodes?.[0]?.code) {
    await nextTick()
    setTimeout(() => renderQrCanvas(selectedGuest.value!), 100)
  }
})

onMounted(() => guestsStore.fetchGuests(props.eventId))
</script>

<style scoped>
.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.icon-swap-enter-from {
  opacity: 0;
  transform: scale(0.6) rotate(-10deg);
}
.icon-swap-leave-to {
  opacity: 0;
  transform: scale(0.6) rotate(10deg);
}
</style>
