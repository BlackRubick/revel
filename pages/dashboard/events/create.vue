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

      <!-- Imagen del evento -->
      <div class="card-revel p-6">
        <h3 class="font-display text-base font-semibold text-white mb-5 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-revel-gold text-revel-black text-xs font-bold inline-flex items-center justify-center leading-none shrink-0 font-sans">1</span>
          Imagen del evento
          <span class="text-xs text-revel-gold/60 font-sans font-normal ml-1">— se mostrará en la invitación</span>
        </h3>

        <div
          class="relative rounded-xl overflow-hidden border-2 border-dashed transition-all cursor-pointer"
          :class="form.coverImage ? 'border-revel-gold/40' : 'border-white/15 hover:border-revel-gold/30'"
          style="min-height: 200px;"
          @click="triggerFileInput"
          @dragover.prevent
          @drop.prevent="onDrop"
        >
          <!-- Preview -->
          <img
            v-if="form.coverImage"
            :src="form.coverImage"
            class="w-full object-cover"
            style="max-height: 280px;"
          />

          <!-- Placeholder -->
          <div v-else class="flex flex-col items-center justify-center gap-3 py-14 text-center px-6">
            <div class="w-14 h-14 rounded-2xl bg-revel-gold/8 border border-revel-gold/20 flex items-center justify-center">
              <svg class="w-6 h-6 text-revel-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-white/70 text-sm font-medium">Sube la imagen del evento</p>
              <p class="text-white/35 text-xs mt-1">Haz clic o arrastra una imagen aquí · JPG, PNG, WebP</p>
            </div>
          </div>

          <!-- Overlay al hacer hover cuando hay imagen -->
          <div
            v-if="form.coverImage"
            class="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
          >
            <span class="text-white text-sm font-medium">Cambiar imagen</span>
          </div>

          <!-- Loading -->
          <div v-if="uploadingCover" class="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div class="flex flex-col items-center gap-2">
              <div class="w-8 h-8 border-2 border-revel-gold border-t-transparent rounded-full animate-spin" />
              <span class="text-white/70 text-xs">Subiendo imagen...</span>
            </div>
          </div>
        </div>

        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

        <p v-if="form.coverImage" class="mt-3 text-xs text-white/40 text-center">
          Haz clic en la imagen para cambiarla
        </p>
      </div>

      <div class="card-revel p-6">
        <h3 class="font-display text-base font-semibold text-white mb-5 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-revel-gold text-revel-black text-xs font-bold inline-flex items-center justify-center leading-none shrink-0 font-sans">2</span>
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
          <span class="w-6 h-6 rounded-full bg-revel-gold text-revel-black text-xs font-bold inline-flex items-center justify-center leading-none shrink-0 font-sans">3</span>
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
          <span class="w-6 h-6 rounded-full bg-revel-gold text-revel-black text-xs font-bold inline-flex items-center justify-center leading-none shrink-0 font-sans">4</span>
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
          <span class="w-6 h-6 rounded-full bg-revel-gold/30 text-revel-gold text-xs font-bold inline-flex items-center justify-center leading-none shrink-0 font-sans">5</span>
          Opciones adicionales
        </h3>
        <UiInput v-model="form.giftListUrl" label="URL de mesa de regalos" placeholder="https://..." />
      </div>

      <!-- Iglesia (solo para bodas, XV y bautizos) -->
      <div v-if="showsChurch" class="card-revel p-6">
        <h3 class="font-display text-base font-semibold text-white mb-5 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-revel-gold/30 text-revel-gold text-xs font-bold inline-flex items-center justify-center leading-none shrink-0 font-sans">6</span>
          Ceremonia religiosa
        </h3>

        <label class="flex items-center gap-3 cursor-pointer mb-4 select-none">
          <div
            class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0"
            :class="form.hasChurch ? 'bg-revel-gold border-revel-gold' : 'border-white/25 bg-white/5'"
            @click="form.hasChurch = !form.hasChurch"
          >
            <svg v-if="form.hasChurch" class="w-3 h-3 text-revel-black" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span class="text-white/80 text-sm">El evento incluye ceremonia en iglesia</span>
        </label>

        <div v-if="form.hasChurch" class="space-y-4 mt-2">
          <UiInput
            v-model="form.churchName"
            label="Nombre de la iglesia"
            placeholder="Parroquia de San Juan Bautista"
          />
          <UiInput
            v-model="form.churchAddress"
            label="Dirección de la iglesia"
            placeholder="Calle Principal 123, Colonia Centro"
          />
        </div>
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
const uploadingCover = ref(false)
const fileInput = ref<HTMLInputElement>()
const packages = ref<{ id: string; name: string }[]>([])

const form = reactive({
  name: '',
  description: '',
  coverImage: '',
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
  hasChurch: false,
  churchName: '',
  churchAddress: '',
})

const CHURCH_TYPES = ['wedding', 'quinceañera', 'bautizo']
const showsChurch = computed(() => CHURCH_TYPES.includes(form.type))

function triggerFileInput() {
  fileInput.value?.click()
}

async function uploadCover(file: File) {
  uploadingCover.value = true
  try {
    const reader = new FileReader()
    const base64 = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
    const { post } = useApi()
    const res = await post<{ url: string }>('/api/upload/cover', { imageBase64: base64 })
    form.coverImage = res.url
  } catch {
    ui.error('Error', 'No se pudo subir la imagen')
  } finally {
    uploadingCover.value = false
  }
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) uploadCover(file)
}

function onDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) uploadCover(file)
}

const errors = reactive({ name: '', date: '' })

const eventTypes = [
  { label: 'Boda', value: 'wedding' },
  { label: 'Quinceañera (XV años)', value: 'quinceañera' },
  { label: 'Bautizo', value: 'bautizo' },
  { label: 'Cumpleaños', value: 'birthday' },
  { label: 'Baby Shower', value: 'baby_shower' },
  { label: 'Graduación', value: 'graduation' },
  { label: 'Corporativo', value: 'corporate' },
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
    const payload = {
      ...form,
      churchName: form.hasChurch ? form.churchName : undefined,
      churchAddress: form.hasChurch ? form.churchAddress : undefined,
    }
    const event = await eventsStore.createEvent(payload)
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
