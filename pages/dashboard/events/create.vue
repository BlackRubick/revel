<template>
  <div class="max-w-5xl mx-auto">

    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <NuxtLink to="/dashboard/events" class="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <div>
        <h2 class="font-display text-2xl font-bold text-white">Crear evento</h2>
        <p class="text-white/45 text-sm">Configura los detalles y elige cómo se verá la invitación</p>
      </div>
    </div>

    <div class="xl:grid xl:grid-cols-[1fr_310px] xl:gap-8 xl:items-start">

      <!-- COLUMNA IZQUIERDA: formulario -->
      <form class="space-y-6" @submit.prevent="handleSubmit">

        <!-- 1. Imagen -->
        <div class="card-revel p-6">
          <h3 class="font-display text-base font-semibold text-white mb-5 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-revel-gold text-revel-black text-xs font-bold inline-flex items-center justify-center shrink-0">1</span>
            Imagen del evento
            <span class="text-xs text-revel-gold/60 font-normal ml-1">— se verá en la invitación</span>
          </h3>
          <div
            class="relative rounded-xl overflow-hidden border-2 border-dashed transition-all cursor-pointer"
            :class="form.coverImage ? 'border-revel-gold/40' : 'border-white/15 hover:border-revel-gold/30'"
            style="min-height:160px"
            @click="triggerFileInput"
            @dragover.prevent
            @drop.prevent="onDrop"
          >
            <img v-if="form.coverImage" :src="form.coverImage" class="w-full object-cover" style="max-height:220px" />
            <div v-else class="flex flex-col items-center justify-center gap-3 py-10 text-center px-6">
              <div class="w-12 h-12 rounded-2xl bg-revel-gold/8 border border-revel-gold/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-revel-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div><p class="text-white/70 text-sm font-medium">Sube la imagen del evento</p><p class="text-white/35 text-xs mt-1">Haz clic o arrastra · JPG, PNG, WebP</p></div>
            </div>
            <div v-if="form.coverImage" class="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span class="text-white text-sm font-medium">Cambiar imagen</span>
            </div>
            <div v-if="uploadingCover" class="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div class="w-8 h-8 border-2 border-revel-gold border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
        </div>

        <!-- 2. Diseño de invitación -->
        <div class="card-revel p-6">
          <h3 class="font-display text-base font-semibold text-white mb-2 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-revel-gold text-revel-black text-xs font-bold inline-flex items-center justify-center shrink-0">2</span>
            Diseño de la invitación
          </h3>
          <p class="text-white/40 text-xs mb-4 ml-8">Elige cómo verán la invitación tus invitados</p>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="tpl in invitationTemplates"
              :key="tpl.id"
              type="button"
              class="relative rounded-xl overflow-hidden border-2 transition-all h-20 flex flex-col items-center justify-center gap-1 px-2"
              :class="form.templateId === tpl.id ? 'border-revel-gold scale-[1.02] shadow-gold' : 'border-white/10 hover:border-white/25'"
              :style="`background:${tpl.bg}`"
              @click="form.templateId = tpl.id"
            >
              <span class="text-xs font-semibold leading-tight text-center" :style="`color:${tpl.text}`">{{ tpl.label }}</span>
              <span class="text-[9px] opacity-60 leading-none" :style="`color:${tpl.accent}`">{{ tpl.desc }}</span>
              <div v-if="form.templateId === tpl.id" class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-revel-gold flex items-center justify-center">
                <svg class="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" stroke-width="3.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
            </button>
          </div>
          <!-- Botón preview solo visible si el panel derecho no está visible (< xl) -->
          <button type="button" class="xl:hidden mt-4 w-full btn-secondary text-sm py-2.5 flex items-center justify-center gap-2" @click="showMobilePreview = true">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Ver cómo quedará la invitación
          </button>
        </div>

        <!-- 3. Información básica -->
        <div class="card-revel p-6">
          <h3 class="font-display text-base font-semibold text-white mb-5 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-revel-gold text-revel-black text-xs font-bold inline-flex items-center justify-center shrink-0">3</span>
            Información básica
          </h3>
          <div class="space-y-4">
            <UiInput v-model="form.name" label="Nombre del evento" placeholder="Boda García & Martínez" required :error="errors.name" />
            <div class="grid grid-cols-2 gap-4">
              <div>
                <UiSelect v-model="form.type" label="Tipo de evento" placeholder="Seleccionar tipo" :options="eventTypes" required :error="errors.type" />
              </div>
              <div>
                <UiSelect v-model="form.packageId" label="Paquete" placeholder="Seleccionar paquete" :options="packageOptions" required :error="errors.packageId" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-white/70 mb-1.5">Descripción</label>
              <textarea v-model="form.description" rows="3" placeholder="Describe el evento..." class="input-revel resize-none" />
            </div>
          </div>
        </div>

        <!-- 4. Fecha y lugar -->
        <div class="card-revel p-6">
          <h3 class="font-display text-base font-semibold text-white mb-5 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-revel-gold text-revel-black text-xs font-bold inline-flex items-center justify-center shrink-0">4</span>
            Fecha y lugar
          </h3>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <UiInput v-model="form.date" label="Fecha" type="date" required :error="errors.date" />
              <UiInput v-model="form.time" label="Hora" type="time" required />
            </div>
            <UiInput v-model="form.venue" label="Nombre del lugar" placeholder="Hacienda Las Palmas" required :error="errors.venue" />
            <UiInput v-model="form.venueAddress" label="Dirección completa" placeholder="Av. Principal 123, CDMX" />
            <UiInput v-model="form.venueMapUrl" label="URL de Google Maps" placeholder="https://maps.google.com/..." />
          </div>
        </div>

        <!-- 5. Mesas -->
        <div class="card-revel p-6">
          <h3 class="font-display text-base font-semibold text-white mb-5 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-revel-gold text-revel-black text-xs font-bold inline-flex items-center justify-center shrink-0">5</span>
            Configuración de mesas
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-white/70 mb-1.5">Número de mesas</label>
              <input v-model.number="form.tableCount" type="number" min="1" max="200" class="input-revel" />
            </div>
            <div>
              <label class="block text-sm font-medium text-white/70 mb-1.5">Capacidad por mesa</label>
              <input v-model.number="form.tableCapacity" type="number" min="1" max="50" class="input-revel" />
            </div>
          </div>
          <div class="mt-4 p-3 rounded-xl bg-revel-gold/5 border border-revel-gold/15">
            <p class="text-xs text-revel-gold/80">
              Se crearán <strong>{{ form.tableCount }}</strong> mesas · Capacidad total: <strong>{{ form.tableCount * form.tableCapacity }}</strong> invitados.
            </p>
          </div>
        </div>

        <!-- 6. Adicionales -->
        <div class="card-revel p-6">
          <h3 class="font-display text-base font-semibold text-white mb-5 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-revel-gold/30 text-revel-gold text-xs font-bold inline-flex items-center justify-center shrink-0">6</span>
            Opciones adicionales
          </h3>
          <UiInput v-model="form.giftListUrl" label="URL de mesa de regalos" placeholder="https://..." />

          <div class="mt-4">
            <label class="flex items-center gap-3 cursor-pointer select-none">
              <div
                class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0"
                :class="form.hasChurch ? 'bg-revel-gold border-revel-gold' : 'border-white/25 bg-white/5'"
                @click="form.hasChurch = !form.hasChurch"
              >
                <svg v-if="form.hasChurch" class="w-3 h-3 text-revel-black" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
              <span class="text-white/80 text-sm">El evento incluye ceremonia en iglesia</span>
            </label>
            <div v-if="form.hasChurch" class="space-y-4 mt-4">
              <UiInput v-model="form.churchName" label="Nombre de la iglesia" placeholder="Parroquia de San Juan Bautista" />
              <UiInput v-model="form.churchAddress" label="Dirección de la iglesia" placeholder="Calle Principal 123" />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pb-8">
          <NuxtLink to="/dashboard/events" class="btn-ghost px-6">Cancelar</NuxtLink>
          <UiButton type="submit" :loading="loading" loading-text="Creando..." size="lg">Crear evento</UiButton>
        </div>
      </form>

      <!-- COLUMNA DERECHA: preview en vivo (solo xl+) -->
      <div class="hidden xl:block">
        <div class="sticky top-6">
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-semibold text-white">Vista previa en vivo</p>
            <div class="flex items-center gap-1 glass rounded-lg p-0.5">
              <button
                :class="['px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1', previewMode === 'mobile' ? 'bg-revel-gold text-revel-black' : 'text-white/50 hover:text-white']"
                @click="previewMode = 'mobile'"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3"/></svg>
                Móvil
              </button>
              <button
                :class="['px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1', previewMode === 'desktop' ? 'bg-revel-gold text-revel-black' : 'text-white/50 hover:text-white']"
                @click="previewMode = 'desktop'"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"/></svg>
                Desktop
              </button>
            </div>
          </div>

          <!-- Mockup teléfono -->
          <div v-if="previewMode === 'mobile'" class="relative bg-revel-gray-dark rounded-[2rem] p-2 shadow-2xl border border-white/15">
            <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-revel-gray-mid rounded-full z-10" />
            <div class="rounded-[1.6rem] overflow-hidden" style="max-height:560px;overflow-y:auto">
              <ClientOnly>
                <InvitationInvitationCard :template-id="form.templateId" :event="previewEvent">
                  <template #actions>
                    <div class="py-2 px-1">
                      <div class="w-full rounded-xl py-3 text-center text-sm font-semibold text-revel-black" style="background:linear-gradient(135deg,#C9A84C,#E8D08A)">Confirmar asistencia</div>
                    </div>
                  </template>
                </InvitationInvitationCard>
                <template #fallback>
                  <div class="h-80 flex items-center justify-center bg-revel-black">
                    <div class="w-6 h-6 border-2 border-revel-gold/40 border-t-revel-gold rounded-full animate-spin" />
                  </div>
                </template>
              </ClientOnly>
            </div>
          </div>

          <!-- Mockup desktop -->
          <div v-else class="rounded-xl overflow-hidden border border-white/10 shadow-xl bg-revel-gray-dark">
            <div class="flex items-center gap-1.5 px-3 py-2 border-b border-white/8 bg-revel-gray-mid/50">
              <div class="w-2 h-2 rounded-full bg-red-500/50" />
              <div class="w-2 h-2 rounded-full bg-yellow-500/50" />
              <div class="w-2 h-2 rounded-full bg-green-500/50" />
              <div class="flex-1 mx-2 bg-revel-gray-dark/80 rounded px-2 py-0.5 text-[10px] text-white/25 text-center">revel-eventos.com/invitacion/...</div>
            </div>
            <div style="max-height:500px;overflow-y:auto">
              <ClientOnly>
                <InvitationInvitationCard :template-id="form.templateId" :event="previewEvent">
                  <template #actions>
                    <div class="py-2 px-1">
                      <div class="w-full rounded-xl py-3 text-center text-sm font-semibold text-revel-black" style="background:linear-gradient(135deg,#C9A84C,#E8D08A)">Confirmar asistencia</div>
                    </div>
                  </template>
                </InvitationInvitationCard>
                <template #fallback>
                  <div class="h-80 flex items-center justify-center bg-revel-black">
                    <div class="w-6 h-6 border-2 border-revel-gold/40 border-t-revel-gold rounded-full animate-spin" />
                  </div>
                </template>
              </ClientOnly>
            </div>
          </div>
          <p class="text-center text-xs text-white/20 mt-2">Se actualiza conforme escribes</p>
        </div>
      </div>

    </div>

    <!-- Modal preview fullscreen (móvil / pantallas medianas) -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showMobilePreview" class="fixed inset-0 z-50 flex flex-col bg-revel-black xl:hidden">
          <div class="flex items-center justify-between px-4 py-3 border-b border-white/8 flex-shrink-0">
            <p class="text-sm font-semibold text-white">Vista previa de la invitación</p>
            <button class="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white" @click="showMobilePreview = false">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="flex-1 overflow-y-auto">
            <ClientOnly>
              <InvitationInvitationCard :template-id="form.templateId" :event="previewEvent">
                <template #actions>
                  <div class="py-2 px-1">
                    <div class="w-full rounded-xl py-3 text-center text-sm font-semibold text-revel-black" style="background:linear-gradient(135deg,#C9A84C,#E8D08A)">Confirmar asistencia</div>
                  </div>
                </template>
              </InvitationInvitationCard>
            </ClientOnly>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { useEventsStore } from '~/stores/events'
import { useUiStore } from '~/stores/ui'

const eventsStore = useEventsStore()
const ui = useUiStore()
const router = useRouter()
const { get, post: apiPost } = useApi()

const loading = ref(false)
const uploadingCover = ref(false)
const fileInput = ref<HTMLInputElement>()
const packages = ref<{ id: string; name: string }[]>([])
const previewMode = ref<'mobile' | 'desktop'>('mobile')
const showMobilePreview = ref(false)

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
  templateId: 'classic',
})

const invitationTemplates = [
  { id: 'classic',     label: 'Clásico',     desc: 'Todos',       bg: '#0A0A0A', accent: '#C9A84C', text: '#fff' },
  { id: 'elegante',    label: 'Elegante',    desc: 'Bodas',       bg: '#F5F0E8', accent: '#B8953F', text: '#1C1C2E' },
  { id: 'fiesta',      label: 'Fiesta',      desc: 'Cumpleaños',  bg: '#2D0E5A', accent: '#FFD700', text: '#fff' },
  { id: 'romantico',   label: 'Romántico',   desc: 'Quinceañera', bg: '#5A1030', accent: '#E8A4B8', text: '#fff' },
  { id: 'minimalista', label: 'Minimalista', desc: 'Corporativo', bg: '#0D0D0D', accent: '#C9A84C', text: '#fff' },
  { id: 'esmeralda',   label: 'Esmeralda',   desc: 'Graduación',  bg: '#0A2618', accent: '#4CAF50', text: '#fff' },
]

const previewEvent = computed(() => ({
  name:         form.name        || 'Nombre del evento',
  date:         form.date        || '2026-07-18',
  time:         form.time        || '18:00',
  venue:        form.venue       || 'Nombre del lugar',
  venueAddress: form.venueAddress || null,
  venueMapUrl:  form.venueMapUrl  || null,
  coverImage:   form.coverImage   || null,
  type:         form.type         || 'other',
  churchName:   form.hasChurch && form.churchName  ? form.churchName  : null,
  churchAddress:form.hasChurch && form.churchAddress? form.churchAddress: null,
}))

const eventTypes = [
  { label: 'Boda',              value: 'wedding' },
  { label: 'Quinceañera (XV)', value: 'quinceañera' },
  { label: 'Bautizo',           value: 'bautizo' },
  { label: 'Cumpleaños',        value: 'birthday' },
  { label: 'Baby Shower',       value: 'baby_shower' },
  { label: 'Graduación',        value: 'graduation' },
  { label: 'Corporativo',       value: 'corporate' },
  { label: 'Otro',              value: 'other' },
]

const packageOptions = computed(() =>
  packages.value.map((p) => ({ label: p.name, value: p.id }))
)

const errors = reactive({
  name: '',
  type: '',
  packageId: '',
  date: '',
  venue: '',
})

function validate() {
  errors.name      = form.name.trim().length >= 3  ? '' : 'Mínimo 3 caracteres'
  errors.type      = form.type                      ? '' : 'Selecciona el tipo de evento'
  errors.packageId = form.packageId                 ? '' : 'Selecciona un paquete'
  errors.date      = form.date                      ? '' : 'La fecha es requerida'
  errors.venue     = form.venue.trim().length >= 2  ? '' : 'Escribe el nombre del lugar'
  return !Object.values(errors).some(Boolean)
}

function triggerFileInput() { fileInput.value?.click() }

async function uploadCover(file: File) {
  uploadingCover.value = true
  try {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
    const res = await apiPost<{ url: string }>('/api/upload/cover', { imageBase64: base64 })
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

async function handleSubmit() {
  if (!validate()) return

  loading.value = true
  try {
    const payload = {
      name:         form.name,
      description:  form.description,
      coverImage:   form.coverImage,
      type:         form.type,
      packageId:    form.packageId,
      date:         form.date,
      time:         form.time,
      venue:        form.venue,
      venueAddress: form.venueAddress || undefined,
      venueMapUrl:  form.venueMapUrl  || undefined,
      tableCount:   form.tableCount,
      tableCapacity:form.tableCapacity,
      giftListUrl:  form.giftListUrl  || undefined,
      churchName:   form.hasChurch ? form.churchName  : undefined,
      churchAddress:form.hasChurch ? form.churchAddress: undefined,
      templateId:   form.templateId,
    }
    const event = await eventsStore.createEvent(payload)
    ui.success('Evento creado', `"${event.name}" fue creado exitosamente`)
    await router.push(`/dashboard/events/${event.id}`)
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message ?? (e as Error).message ?? 'Error al crear'
    ui.error('Error', msg)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const res = await get<{ data: typeof packages.value }>('/api/packages')
    packages.value = res.data ?? []
    if (packages.value.length) form.packageId = packages.value[0]!.id
  } catch {
    // packages se quedan vacíos; el usuario puede seleccionarlo manualmente
  }
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
