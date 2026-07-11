<template>
  <div class="max-w-2xl mx-auto">
    
    <div class="flex items-center gap-4 mb-8">
      <NuxtLink to="/dashboard/events" class="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <div>
        <h2 class="font-display text-2xl font-bold text-white">Crear evento</h2>
        <p class="text-white/45 text-sm">Configura todos los detalles de tu evento</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      
      <div class="card-revel p-6">
        <h3 class="font-display text-base font-semibold text-white mb-5 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-revel-gold text-revel-black text-xs font-bold inline-flex items-center justify-center leading-none shrink-0 font-sans">1</span>
          Información básica
        </h3>

        <div class="space-y-4">
          <UiInput
            v-model="form.name"
            label="Nombre del evento"
            placeholder="Boda García & Martínez"
            required
            :error="errors.name"
          />

          <div class="grid grid-cols-2 gap-4">
            <UiSelect
              v-model="form.type"
              label="Tipo de evento"
              placeholder="Seleccionar tipo"
              :options="eventTypes"
              required
            />
            <UiSelect
              v-model="form.packageId"
              label="Paquete"
              placeholder="Seleccionar paquete"
              :options="packageOptions"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-white/70 mb-1.5">Descripción</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Describe el evento..."
              class="input-revel resize-none"
            />
          </div>
        </div>
      </div>

      
      <div class="card-revel p-6">
        <h3 class="font-display text-base font-semibold text-white mb-5 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-revel-gold text-revel-black text-xs font-bold inline-flex items-center justify-center leading-none shrink-0 font-sans">2</span>
          Fecha y lugar
        </h3>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <UiInput v-model="form.date" label="Fecha" type="date" required :error="errors.date" />
            <UiInput v-model="form.time" label="Hora" type="time" required />
          </div>
          <UiInput v-model="form.venue" label="Nombre del lugar" placeholder="Hacienda Las Palmas" required />
          <UiInput v-model="form.venueAddress" label="Dirección completa" placeholder="Av. Principal 123, CDMX" />
          <UiInput v-model="form.venueMapUrl" label="URL de Google Maps" placeholder="https://maps.google.com/..." />
        </div>
      </div>

      
      <div class="card-revel p-6">
        <h3 class="font-display text-base font-semibold text-white mb-5 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-revel-gold text-revel-black text-xs font-bold inline-flex items-center justify-center leading-none shrink-0 font-sans">3</span>
          Configuración de mesas
        </h3>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-white/70 mb-1.5">Número de mesas</label>
            <input
              v-model.number="form.tableCount"
              type="number"
              min="1"
              max="200"
              class="input-revel"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-white/70 mb-1.5">Capacidad por mesa</label>
            <input
              v-model.number="form.tableCapacity"
              type="number"
              min="1"
              max="50"
              class="input-revel"
            />
          </div>
        </div>

        <div class="mt-4 p-3 rounded-xl bg-revel-gold/5 border border-revel-gold/15">
          <p class="text-xs text-revel-gold/80">
            Se crearán <strong>{{ form.tableCount }}</strong> mesas con capacidad para
            <strong>{{ form.tableCapacity }}</strong> personas cada una.
            Capacidad total: <strong>{{ form.tableCount * form.tableCapacity }}</strong> invitados.
          </p>
        </div>
      </div>

      
      <div class="card-revel p-6">
        <h3 class="font-display text-base font-semibold text-white mb-5 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-revel-gold/30 text-revel-gold text-xs font-bold inline-flex items-center justify-center leading-none shrink-0 font-sans">4</span>
          Opciones adicionales
        </h3>
        <UiInput v-model="form.giftListUrl" label="URL de mesa de regalos" placeholder="https://..." />
      </div>

      
      <div class="flex items-center justify-end gap-3">
        <NuxtLink to="/dashboard/events" class="btn-ghost px-6">Cancelar</NuxtLink>
        <UiButton type="submit" :loading="loading" loading-text="Creando..." size="lg">
          Crear evento
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { useEventsStore } from '~/stores/events'
import { useUiStore } from '~/stores/ui'

const eventsStore = useEventsStore()
const ui = useUiStore()
const router = useRouter()
const { get } = useApi()

const loading = ref(false)
const packages = ref<{ id: string; name: string }[]>([])

const form = reactive({
  name: '',
  description: '',
  type: '',
  packageId: '',
  date: '',
  time: '18:00',
  venue: '',
  venueAddress: '',
  venueMapUrl: '',
  tableCount: 10,
  tableCapacity: 8,
  giftListUrl: '',
})

const errors = reactive({ name: '', date: '' })

const eventTypes = [
  { label: 'Boda', value: 'wedding' },
  { label: 'Cumpleaños', value: 'birthday' },
  { label: 'Quinceañera', value: 'quinceañera' },
  { label: 'Corporativo', value: 'corporate' },
  { label: 'Baby Shower', value: 'baby_shower' },
  { label: 'Graduación', value: 'graduation' },
  { label: 'Otro', value: 'other' },
]

const packageOptions = computed(() =>
  packages.value.map((p) => ({ label: p.name, value: p.id }))
)

async function handleSubmit() {
  errors.name = form.name ? '' : 'El nombre es requerido'
  errors.date = form.date ? '' : 'La fecha es requerida'
  if (errors.name || errors.date) return

  loading.value = true
  try {
    const event = await eventsStore.createEvent(form)
    ui.success('Evento creado', `"${event.name}" fue creado exitosamente`)
    await router.push(`/dashboard/events/${event.id}`)
  } catch (e: unknown) {
    ui.error('Error al crear', (e as Error).message)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const res = await get<{ data: typeof packages.value }>('/api/packages')
  packages.value = res.data
  if (packages.value.length) form.packageId = packages.value[0]!.id
})
</script>
