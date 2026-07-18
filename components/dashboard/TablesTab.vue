<template>
  <div>
    
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="card-gold p-4 text-center">
        <div class="stat-number text-3xl">{{ tables.length }}</div>
        <p class="text-xs text-white/40 mt-1">Total mesas</p>
      </div>
      <div class="card-gold p-4 text-center">
        <div class="stat-number text-3xl">{{ totalSeated }}</div>
        <p class="text-xs text-white/40 mt-1">Personas asignadas</p>
      </div>
      <div class="card-gold p-4 text-center">
        <div class="stat-number text-3xl">{{ totalCapacity - totalSeated }}</div>
        <p class="text-xs text-white/40 mt-1">Lugares disponibles</p>
      </div>
    </div>

    
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="table in tables"
        :key="table.id"
        class="card-revel p-4 cursor-pointer hover:border-revel-gold/25 transition-all"
        @click="selectTable(table)"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2 min-w-0">
            <span v-if="table.shape === 'ROUND'" class="text-white/30 flex-shrink-0" title="Redonda">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
            </span>
            <span v-else class="text-white/30 flex-shrink-0" title="Rectangular">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/></svg>
            </span>
            <h4 class="font-display font-semibold text-white text-sm truncate">{{ table.name }}</h4>
          </div>
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <span :class="['text-xs font-medium', occupancyColor(table)]">
              {{ headcount(table) }}/{{ table.capacity }}
            </span>
            <button
              class="w-6 h-6 rounded-lg flex items-center justify-center text-white/30 hover:text-revel-gold hover:bg-revel-gold/10 transition-all"
              title="Editar mesa"
              @click.stop="openEditTable(table)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="h-1 bg-white/8 rounded-full mb-3 overflow-hidden">
          <div
            :class="['h-full rounded-full transition-all duration-500', occupancyBarColor(table)]"
            :style="{ width: `${Math.min((headcount(table) / table.capacity) * 100, 100)}%` }"
          />
        </div>

        <div class="space-y-1">
          <div
            v-for="guest in tableGuests(table).slice(0, 3)"
            :key="guest.id"
            class="flex items-center gap-2 text-xs text-white/50"
          >
            <div class="w-4 h-4 rounded-full bg-revel-gold/15 flex items-center justify-center text-revel-gold text-[9px] font-bold flex-shrink-0">
              {{ guest.name[0] }}
            </div>
            <span class="truncate flex-1">{{ guest.name }}</span>
            <span v-if="guest.companions > 0" class="text-white/30 flex-shrink-0">+{{ guest.companions }}</span>
          </div>
          <p v-if="tableGuests(table).length > 3" class="text-xs text-white/30 pl-6">
            +{{ tableGuests(table).length - 3 }} más
          </p>
          <p v-if="!tableGuests(table).length" class="text-xs text-white/20 italic">
            Sin invitados
          </p>
        </div>
      </div>
    </div>


    <UiModal v-model="showEditTableModal" title="Editar mesa" size="sm">
      <form v-if="editingTable" class="space-y-4" @submit.prevent="saveEditTable">
        <UiInput v-model="editTableForm.name" label="Nombre de la mesa" required />
        <div>
          <label class="block text-sm font-medium text-white/70 mb-1.5">Capacidad (personas)</label>
          <input v-model.number="editTableForm.capacity" type="number" min="1" max="50" class="input-revel" />
        </div>
        <div>
          <label class="block text-sm font-medium text-white/70 mb-3">Forma / Orientación</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              :class="['flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all', editTableForm.shape === 'ROUND' ? 'border-revel-gold bg-revel-gold/10 text-revel-gold' : 'border-white/10 text-white/40 hover:border-white/25']"
              @click="editTableForm.shape = 'ROUND'"
            >
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>
              <span class="text-xs font-medium">Redonda</span>
            </button>
            <button
              type="button"
              :class="['flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all', editTableForm.shape === 'RECTANGULAR' ? 'border-revel-gold bg-revel-gold/10 text-revel-gold' : 'border-white/10 text-white/40 hover:border-white/25']"
              @click="editTableForm.shape = 'RECTANGULAR'"
            >
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/></svg>
              <span class="text-xs font-medium">Rectangular</span>
            </button>
          </div>
        </div>
      </form>
      <template #footer>
        <UiButton variant="ghost" size="sm" @click="showEditTableModal = false">Cancelar</UiButton>
        <UiButton size="sm" :loading="editTableLoading" @click="saveEditTable">Guardar</UiButton>
      </template>
    </UiModal>


    <UiModal v-model="showTableModal" :title="selectedTable?.name" size="lg">
      <div v-if="selectedTable">

        
        <div class="mb-6 p-4 rounded-2xl border border-white/[0.07]" style="background: rgba(255,255,255,0.02)">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-white/70">Ocupación</span>
            <div class="flex items-center gap-2">
              <span :class="['text-sm font-bold', occupancyColor(selectedTable)]">
                {{ headcount(selectedTable) }} / {{ selectedTable.capacity }} personas
              </span>
              <span v-if="availableSeats(selectedTable) > 0" class="text-xs text-white/35">
                ({{ availableSeats(selectedTable) }} libre{{ availableSeats(selectedTable) !== 1 ? 's' : '' }})
              </span>
              <span v-else class="text-xs text-red-400 font-semibold">Mesa llena</span>
            </div>
          </div>
          <div class="h-2 bg-white/8 rounded-full overflow-hidden">
            <div
              :class="['h-full rounded-full transition-all duration-500', occupancyBarColor(selectedTable)]"
              :style="{ width: `${Math.min((headcount(selectedTable) / selectedTable.capacity) * 100, 100)}%` }"
            />
          </div>
        </div>

        
        <div v-if="availableSeats(selectedTable) > 0 && unassignedGuests.length" class="mb-6">
          <h4 class="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider">Agregar invitado</h4>
          <div class="flex gap-2">
            <div class="flex-1 relative">
              <select
                v-model="selectedGuestId"
                class="input-revel w-full appearance-none pr-8 text-sm"
              >
                <option value="">Seleccionar invitado...</option>
                <option
                  v-for="g in assignableGuests"
                  :key="g.id"
                  :value="g.id"
                  :disabled="1 + g.companions > availableSeats(selectedTable)"
                >
                  {{ g.name }}{{ g.companions > 0 ? ` (+${g.companions} acomp.)` : '' }}
                  {{ 1 + g.companions > availableSeats(selectedTable) ? ' — sin espacio' : ` — ${1 + g.companions} lugar${1 + g.companions !== 1 ? 'es' : ''}` }}
                </option>
              </select>
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <UiButton size="sm" :loading="assigning" :disabled="!selectedGuestId" @click="assignGuest">
              Asignar
            </UiButton>
          </div>
          <p v-if="selectedGuestId && selectedGuestDetail" class="text-xs text-white/35 mt-2">
            Ocupa {{ 1 + selectedGuestDetail.companions }} de {{ availableSeats(selectedTable) }} lugares disponibles.
          </p>
        </div>

        <div v-else-if="availableSeats(selectedTable) > 0 && !unassignedGuests.length" class="mb-6 text-sm text-white/35 text-center py-3">
          Todos los invitados ya tienen mesa asignada.
        </div>

        
        <div>
          <h4 class="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider">
            Invitados en esta mesa ({{ tableGuests(selectedTable).length }})
          </h4>
          <div v-if="tableGuests(selectedTable).length" class="space-y-2">
            <div
              v-for="guest in tableGuests(selectedTable)"
              :key="guest.id"
              class="flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-all"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-revel-gold/15 flex items-center justify-center text-revel-gold text-sm font-bold flex-shrink-0">
                  {{ guest.name[0] }}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-medium text-white">{{ guest.name }}</p>
                    <span v-if="guest.companions > 0" class="text-xs text-white/40 bg-white/5 px-1.5 py-0.5 rounded-full">
                      +{{ guest.companions }} acomp.
                    </span>
                  </div>
                  <div class="flex items-center gap-2 mt-0.5">
                    <UiBadge :variant="rsvpVariant(guest.rsvpStatus)">{{ rsvpLabel(guest.rsvpStatus) }}</UiBadge>
                    <span class="text-[11px] text-white/30">
                      {{ 1 + guest.companions }} lugar{{ (1 + guest.companions) !== 1 ? 'es' : '' }}
                    </span>
                  </div>
                </div>
              </div>
              <button
                class="text-xs text-red-400/60 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/5"
                @click="removeFromTable(guest.id)"
              >
                Quitar
              </button>
            </div>
          </div>
          <p v-else class="text-white/30 text-sm text-center py-4">Mesa vacía — agrega invitados arriba</p>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { useGuestsStore } from '~/stores/guests'
import { useUiStore } from '~/stores/ui'
import type { EventTable, Guest, TableShape } from '~/types'

const props = defineProps<{ eventId: string; tables: EventTable[] }>()
const emit = defineEmits<{ (e: 'tableUpdated', table: EventTable): void }>()

const guestsStore = useGuestsStore()
const ui = useUiStore()
const { put } = useApi()

const showTableModal = ref(false)
const showEditTableModal = ref(false)
const selectedTable = ref<EventTable | null>(null)
const editingTable = ref<EventTable | null>(null)
const selectedGuestId = ref('')
const assigning = ref(false)
const editTableLoading = ref(false)

const editTableForm = reactive<{ name: string; capacity: number; shape: TableShape }>({
  name: '',
  capacity: 8,
  shape: 'ROUND',
})

const totalCapacity = computed(() => props.tables.reduce((s, t) => s + t.capacity, 0))
const totalSeated = computed(() => props.tables.reduce((s, t) => s + headcount(t), 0))

const unassignedGuests = computed(() =>
  guestsStore.guests.filter((g) => !g.tableId)
)

const assignableGuests = computed(() => unassignedGuests.value)

const selectedGuestDetail = computed(() =>
  selectedGuestId.value
    ? guestsStore.guests.find((g) => g.id === selectedGuestId.value) ?? null
    : null
)

function tableGuests(table: EventTable): Guest[] {
  return (table.guests as Guest[]) ?? []
}

function headcount(table: EventTable): number {
  return tableGuests(table).reduce((sum, g) => sum + 1 + g.companions, 0)
}

function availableSeats(table: EventTable): number {
  return table.capacity - headcount(table)
}

function occupancyColor(table: EventTable) {
  const pct = headcount(table) / table.capacity
  if (pct >= 1) return 'text-red-400'
  if (pct >= 0.8) return 'text-yellow-400'
  return 'text-green-400'
}

function occupancyBarColor(table: EventTable) {
  const pct = headcount(table) / table.capacity
  if (pct >= 1) return 'bg-red-400'
  if (pct >= 0.8) return 'bg-yellow-400'
  return 'bg-green-400'
}

function selectTable(table: EventTable) {
  selectedTable.value = table
  selectedGuestId.value = ''
  showTableModal.value = true
}

function openEditTable(table: EventTable) {
  editingTable.value = table
  Object.assign(editTableForm, {
    name: table.name,
    capacity: table.capacity,
    shape: table.shape ?? 'ROUND',
  })
  showEditTableModal.value = true
}

async function saveEditTable() {
  if (!editingTable.value) return
  editTableLoading.value = true
  try {
    const updated = await put<{ success: boolean; data: EventTable }>(`/api/tables/${editingTable.value.id}`, { ...editTableForm })
    Object.assign(editingTable.value, updated.data)
    if (selectedTable.value?.id === editingTable.value.id) {
      Object.assign(selectedTable.value, updated.data)
    }
    emit('tableUpdated', updated.data)
    ui.success('Mesa actualizada', editTableForm.name)
    showEditTableModal.value = false
  } catch {
    ui.error('Error', 'No se pudo actualizar la mesa')
  } finally {
    editTableLoading.value = false
  }
}

function rsvpLabel(status: string) {
  const map: Record<string, string> = { CONFIRMED: 'Confirmado', PENDING: 'Pendiente', DECLINED: 'Rechazado' }
  return map[status] ?? status
}

function rsvpVariant(status: string): 'success' | 'warning' | 'danger' {
  const map: Record<string, 'success' | 'warning' | 'danger'> = { CONFIRMED: 'success', PENDING: 'warning', DECLINED: 'danger' }
  return map[status] ?? 'warning'
}

async function assignGuest() {
  if (!selectedGuestId.value || !selectedTable.value) return
  assigning.value = true
  try {
    await guestsStore.assignTable(selectedGuestId.value, selectedTable.value.id)

    const guest = guestsStore.guests.find((g) => g.id === selectedGuestId.value)
    if (guest && selectedTable.value) {
      if (!selectedTable.value.guests) selectedTable.value.guests = []
      ;(selectedTable.value.guests as Guest[]).push({ ...guest, tableId: selectedTable.value.id })
    }
    selectedGuestId.value = ''
    ui.success('Invitado asignado', `Asignado a ${selectedTable.value.name}`)
  } catch (e: unknown) {
    ui.error('Sin espacio', (e as { data?: { message?: string } })?.data?.message ?? 'No se pudo asignar')
  } finally {
    assigning.value = false
  }
}

async function removeFromTable(guestId: string) {
  await guestsStore.assignTable(guestId, null)
  if (selectedTable.value?.guests) {
    selectedTable.value.guests = (selectedTable.value.guests as Guest[]).filter((g) => g.id !== guestId)
  }
  ui.success('Invitado removido de la mesa')
}

onMounted(() => {
  guestsStore.fetchGuests(props.eventId)
})
</script>
