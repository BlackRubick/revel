<template>
  <div>
    
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-3">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="search" type="text" placeholder="Buscar invitado..." class="input-revel pl-9 py-2 text-sm w-64" />
        </div>
        <UiSelect
          v-model="rsvpFilter"
          :options="rsvpOptions"
          placeholder="Todos"
          class="w-36"
        />
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs text-white/40">{{ guestsStore.total }} invitados</span>
        <UiButton size="sm" @click="showAddModal = true">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Agregar invitado
        </UiButton>
      </div>
    </div>

    
    <div class="card-revel overflow-hidden">
      <div v-if="guestsStore.loading" class="p-8 text-center">
        <div class="w-8 h-8 border-2 border-revel-gold/30 border-t-revel-gold rounded-full animate-spin mx-auto" />
      </div>

      <table v-else class="table-revel">
        <thead>
          <tr>
            <th>Invitado</th>
            <th>Contacto</th>
            <th>Mesa</th>
            <th>Acompañantes</th>
            <th>RSVP</th>
            <th>Check-in</th>
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
            <td>
              <span class="text-white/60">{{ guest.phone || '—' }}</span>
            </td>
            <td>
              <span v-if="guest.table" class="badge-gold text-xs">{{ guest.table.name }}</span>
              <span v-else class="text-white/25 text-xs">Sin asignar</span>
            </td>
            <td>
              <span class="text-white/60">+{{ guest.companions }}</span>
            </td>
            <td>
              <UiBadge :variant="rsvpVariant(guest.rsvpStatus)" dot>
                {{ rsvpLabel(guest.rsvpStatus) }}
              </UiBadge>
            </td>
            <td>
              <span v-if="guest.checkedIn" class="badge-success text-xs inline-flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
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
                  :class="['w-9 h-9 rounded-xl flex items-center justify-center transition-all', (!guest.phone || features.cannot('whatsapp')) ? 'text-white/15 cursor-not-allowed' : 'text-white/50 hover:text-green-400 hover:bg-green-500/10']"
                  :title="!guest.phone ? 'Sin número de teléfono' : features.cannot('whatsapp') ? `Requiere plan ${FEATURE_MIN_PLAN['whatsapp']}` : 'Enviar invitación por WhatsApp'"
                  @click="features.can('whatsapp') && sendWhatsApp(guest)"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </button>
                
                <button
                  :class="['w-9 h-9 rounded-xl flex items-center justify-center transition-all', guest.qrCodes?.[0]?.code ? 'text-white/50 hover:text-blue-400 hover:bg-blue-500/10' : 'text-white/15 cursor-not-allowed']"
                  :title="guest.qrCodes?.[0]?.code ? 'Copiar link de confirmación' : 'Sin código generado'"
                  @click="copyRsvpLink(guest)"
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
            <td colspan="7" class="text-center py-8 text-white/30 text-sm">
              No se encontraron invitados
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    
    <UiModal v-model="showAddModal" title="Agregar invitado">
      <form @submit.prevent="addGuest" class="space-y-4">
        <UiInput v-model="newGuest.name" label="Nombre completo" required />
        <div class="grid grid-cols-2 gap-4">
          <UiInput v-model="newGuest.phone" label="Teléfono" type="tel" />
          <UiInput v-model="newGuest.email" label="Correo" type="email" />
        </div>
        <div>
          <label class="block text-sm font-medium text-white/70 mb-1.5">Acompañantes</label>
          <input v-model.number="newGuest.companions" type="number" min="0" max="20" class="input-revel" />
        </div>
        <UiInput v-model="newGuest.notes" label="Notas" />
      </form>
      <template #footer>
        <UiButton variant="ghost" size="sm" @click="showAddModal = false">Cancelar</UiButton>
        <UiButton size="sm" :loading="addLoading" @click="addGuest">Agregar</UiButton>
      </template>
    </UiModal>

    
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
              @click="copyRsvpLink(selectedGuest)"
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

const props = defineProps<{ eventId: string; eventName?: string; packageType?: string }>()

const guestsStore = useGuestsStore()
const ui = useUiStore()
const features = useEventFeatures(props.packageType)

const search = ref('')
const rsvpFilter = ref('')
const showAddModal = ref(false)
const showQrModal = ref(false)
const selectedGuest = ref<Guest | null>(null)
const addLoading = ref(false)
const generatingQr = ref(false)
const qrModalCanvas = ref<HTMLCanvasElement | null>(null)

const newGuest = reactive({
  name: '', phone: '', email: '', companions: 0, notes: '',
})

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

const config = useRuntimeConfig()

function getInvitacionUrl(guest: Guest): string | null {
  const code = guest.qrCodes?.[0]?.code
  return code ? `${config.public.appUrl}/invitacion/${code}` : null
}

function getRsvpUrl(guest: Guest): string | null {
  const code = guest.qrCodes?.[0]?.code
  return code ? `${config.public.appUrl}/confirmar/${code}` : null
}

function copyRsvpLink(guest: Guest) {
  const url = getInvitacionUrl(guest) ?? getRsvpUrl(guest)
  if (!url) return
  navigator.clipboard.writeText(url)
  ui.success('Link copiado', `Invitación de ${guest.name} copiada al portapapeles`)
}

function sendWhatsApp(guest: Guest) {
  if (!guest.phone) {
    ui.error('Sin teléfono', 'Este invitado no tiene número registrado')
    return
  }
  const phone = guest.phone.replace(/\D/g, '')
  const normalized = phone.startsWith('52') ? phone : `52${phone}`
  const invitacionUrl = getInvitacionUrl(guest) ?? getRsvpUrl(guest) ?? `${config.public.appUrl}/confirmar`
  const eventName = props.eventName ?? 'nuestro evento'

  const lines = [
    `Hola, ${guest.name}.`,
    ``,
    `Te enviamos tu invitación para *${eventName}*.`,
    ``,
    `Accede a tu invitación personalizada aquí:`,
    invitacionUrl,
    ``,
    `En tu invitación podrás confirmar tu asistencia, ver los detalles del evento y la ubicación.`,
    ``,
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

async function addGuest() {
  if (!newGuest.name) return
  addLoading.value = true
  try {
    await guestsStore.createGuest({ ...newGuest, eventId: props.eventId })
    ui.success('Invitado agregado', newGuest.name)
    Object.assign(newGuest, { name: '', phone: '', email: '', companions: 0, notes: '' })
    showAddModal.value = false
  } catch {
    ui.error('Error', 'No se pudo agregar el invitado')
  } finally {
    addLoading.value = false
  }
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
