<template>
  <div class="max-w-2xl mx-auto">

    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <NuxtLink to="/dashboard/events" class="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <div>
        <h2 class="font-display text-2xl font-bold text-white">Crear evento</h2>
        <p class="text-white/45 text-sm">Llena los datos y previsualiza la invitación antes de crear</p>
      </div>
    </div>

    <form class="space-y-6" @submit.prevent="handleSubmit">

      <!-- ── 1. Fondo de la invitación ───────────────────────────── -->
      <div class="card-revel p-6">
        <h3 class="font-display text-base font-semibold text-white mb-1 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-revel-gold text-revel-black text-xs font-bold inline-flex items-center justify-center shrink-0">1</span>
          Fondo de la invitación
        </h3>
        <p class="text-white/40 text-xs mb-4 ml-8">¿Qué quieres que se vea de fondo?</p>

        <!-- Elección -->
        <div class="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            class="relative rounded-xl border-2 p-4 transition-all text-left"
            :class="bgMode === 'photo' ? 'border-revel-gold bg-revel-gold/5' : 'border-white/10 hover:border-white/20'"
            @click="bgMode = 'photo'"
          >
            <div v-if="bgMode === 'photo'" class="absolute top-2 right-2 w-4 h-4 rounded-full bg-revel-gold flex items-center justify-center">
              <svg class="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <svg class="w-6 h-6 mb-2" :class="bgMode === 'photo' ? 'text-revel-gold' : 'text-white/40'" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
            <p class="text-sm font-semibold" :class="bgMode === 'photo' ? 'text-white' : 'text-white/60'">Mi foto</p>
            <p class="text-xs mt-0.5" :class="bgMode === 'photo' ? 'text-white/50' : 'text-white/30'">Sube la foto del evento</p>
          </button>
          <button
            type="button"
            class="relative rounded-xl border-2 p-4 transition-all text-left"
            :class="bgMode === 'template' ? 'border-revel-gold bg-revel-gold/5' : 'border-white/10 hover:border-white/20'"
            @click="bgMode = 'template'"
          >
            <div v-if="bgMode === 'template'" class="absolute top-2 right-2 w-4 h-4 rounded-full bg-revel-gold flex items-center justify-center">
              <svg class="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <svg class="w-6 h-6 mb-2" :class="bgMode === 'template' ? 'text-revel-gold' : 'text-white/40'" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/></svg>
            <p class="text-sm font-semibold" :class="bgMode === 'template' ? 'text-white' : 'text-white/60'">Diseño predefinido</p>
            <p class="text-xs mt-0.5" :class="bgMode === 'template' ? 'text-white/50' : 'text-white/30'">Elige entre 6 diseños</p>
          </button>
        </div>

        <!-- Si eligió foto -->
        <div v-if="bgMode === 'photo'">
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
              <div>
                <p class="text-white/70 text-sm font-medium">Sube la foto del evento</p>
                <p class="text-white/35 text-xs mt-1">Clic o arrastra · JPG, PNG, WebP</p>
              </div>
            </div>
            <div v-if="form.coverImage" class="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span class="text-white text-sm font-medium">Cambiar foto</span>
            </div>
            <div v-if="uploadingCover" class="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div class="w-8 h-8 border-2 border-revel-gold border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
        </div>

        <!-- Si eligió diseño -->
        <div v-else>
          <p class="text-xs text-white/35 mb-3">{{ availableDesigns.length }} diseños para {{ form.type ? eventTypes.find(e=>e.value===form.type)?.label : 'el tipo de evento' }}</p>
          <div class="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
            <button
              v-for="d in availableDesigns"
              :key="d.id"
              type="button"
              class="relative rounded-xl overflow-hidden border-2 transition-all h-16 flex items-center justify-between px-3 gap-2 text-left"
              :class="form.templateId === d.id ? 'border-revel-gold scale-[1.02]' : 'border-white/10 hover:border-white/25'"
              :style="`background:${d.bg.includes('gradient') ? d.bg : d.bg}`"
              @click="form.templateId = d.id"
            >
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold truncate" :style="`color:${d.titleColor}`">{{ d.name }}</p>
                <div class="w-full h-0.5 mt-1 rounded-full" :style="`background:${d.accentColor}`"/>
              </div>
              <div v-if="form.templateId === d.id" class="w-4 h-4 rounded-full bg-revel-gold flex items-center justify-center flex-shrink-0">
                <svg class="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" stroke-width="3.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- ── 2. Información básica ───────────────────────────────── -->
      <div class="card-revel p-6">
        <h3 class="font-display text-base font-semibold text-white mb-5 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-revel-gold text-revel-black text-xs font-bold inline-flex items-center justify-center shrink-0">2</span>
          Información básica
        </h3>
        <div class="space-y-4">
          <UiInput v-model="form.name" label="Nombre del evento" placeholder="Boda García & Martínez" required :error="errors.name" />
          <div class="grid grid-cols-2 gap-4">
            <UiSelect v-model="form.type" label="Tipo de evento" placeholder="Seleccionar" :options="eventTypes" required :error="errors.type" />
            <UiSelect v-model="form.packageId" label="Paquete" placeholder="Seleccionar" :options="packageOptions" required :error="errors.packageId" />
          </div>
          <div>
            <label class="block text-sm font-medium text-white/70 mb-1.5">Descripción <span class="text-white/30 font-normal">(opcional)</span></label>
            <textarea v-model="form.description" rows="2" placeholder="Describe el evento..." class="input-revel resize-none" />
          </div>
        </div>
      </div>

      <!-- ── 3. Fecha y lugar ────────────────────────────────────── -->
      <div class="card-revel p-6">
        <h3 class="font-display text-base font-semibold text-white mb-5 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-revel-gold text-revel-black text-xs font-bold inline-flex items-center justify-center shrink-0">3</span>
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

      <!-- ── 4. Mesas ───────────────────────────────────────────── -->
      <div class="card-revel p-6">
        <h3 class="font-display text-base font-semibold text-white mb-5 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-revel-gold text-revel-black text-xs font-bold inline-flex items-center justify-center shrink-0">4</span>
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
            Se crearán <strong>{{ form.tableCount }}</strong> mesas · Capacidad total: <strong>{{ form.tableCount * form.tableCapacity }}</strong> invitados
          </p>
        </div>
      </div>

      <!-- ── 5. Opciones extra ───────────────────────────────────── -->
      <div class="card-revel p-6">
        <h3 class="font-display text-base font-semibold text-white mb-5 flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-white/10 text-white/50 text-xs font-bold inline-flex items-center justify-center shrink-0">5</span>
          Opciones adicionales
        </h3>
        <UiInput v-model="form.giftListUrl" label="URL mesa de regalos" placeholder="https://..." />
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

      <!-- ── Botones finales ────────────────────────────────────── -->
      <div class="flex flex-col gap-3 pb-8">
        <!-- Vista previa -->
        <button
          type="button"
          class="w-full btn-secondary py-3 flex items-center justify-center gap-2 text-sm font-medium"
          @click="openPreviewModal"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Ver cómo quedará la invitación
        </button>
        <!-- Crear -->
        <div class="flex items-center gap-3">
          <NuxtLink to="/dashboard/events" class="btn-ghost px-6 py-3 text-sm">Cancelar</NuxtLink>
          <UiButton type="submit" :loading="loading" loading-text="Creando..." size="lg" class="flex-1">
            Crear evento
          </UiButton>
        </div>
      </div>
    </form>

    <!-- ── MODAL DE VISTA PREVIA ──────────────────────────────── -->
    <Teleport to="body">
      <Transition name="preview-modal">
        <div v-if="showPreviewModal" class="fixed inset-0 z-50 flex flex-col bg-revel-black">

          <!-- Header del modal -->
          <div class="border-b border-white/8 bg-revel-gray-dark flex-shrink-0">
            <!-- Fila superior: título + toggles + cerrar -->
            <div class="flex items-center justify-between px-5 py-3">
              <div class="flex items-center gap-3">
                <h2 class="font-display text-base font-semibold text-white">Vista previa</h2>
                <div class="flex items-center gap-0.5 glass rounded-lg p-0.5">
                  <button
                    :class="['flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all', previewDevice === 'mobile' ? 'bg-revel-gold text-revel-black' : 'text-white/50 hover:text-white']"
                    @click="previewDevice = 'mobile'"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3"/></svg>
                    Móvil
                  </button>
                  <button
                    :class="['flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all', previewDevice === 'desktop' ? 'bg-revel-gold text-revel-black' : 'text-white/50 hover:text-white']"
                    @click="previewDevice = 'desktop'"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"/></svg>
                    Desktop
                  </button>
                </div>
              </div>
              <button class="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all" @click="showPreviewModal = false">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <!-- Fila de diseños (solo si bgMode === 'template') -->
            <div v-if="bgMode === 'template'" class="flex items-center gap-2 px-5 pb-3 overflow-x-auto no-scrollbar">
              <span class="text-[11px] text-white/30 flex-shrink-0 mr-1">Diseño:</span>
              <button
                v-for="d in availableDesigns"
                :key="d.id"
                type="button"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex-shrink-0"
                :class="form.templateId === d.id ? 'border-revel-gold text-white' : 'border-white/10 text-white/45 hover:border-white/25 hover:text-white/70'"
                @click="form.templateId = d.id"
              >
                <span class="w-3 h-3 rounded-full flex-shrink-0" :style="`background:${d.accentColor}`"/>
                {{ d.name }}
              </button>
            </div>
          </div>

          <!-- Área del preview -->
          <div class="flex-1 overflow-auto flex items-start justify-center p-4 lg:p-8 bg-revel-gray-dark/30">

            <!-- Mockup teléfono -->
            <div v-if="previewDevice === 'mobile'" class="w-full max-w-[390px] flex-shrink-0">
              <div class="relative bg-revel-gray-dark rounded-[2.8rem] p-2.5 shadow-2xl border border-white/15">
                <div class="absolute top-3.5 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-revel-gray-mid rounded-full" />
                <div class="rounded-[2.2rem] overflow-hidden" style="max-height:78vh;overflow-y:auto">
                  <ClientOnly>
                    <InvitationCard :key="form.templateId" :template-id="form.templateId" :event="previewEvent">
                      <template #actions>
                        <div class="py-2 px-1">
                          <div class="w-full rounded-xl py-3 text-center text-sm font-semibold text-revel-black" style="background:linear-gradient(135deg,#C9A84C,#E8D08A)">
                            Confirmar asistencia
                          </div>
                        </div>
                      </template>
                    </InvitationCard>
                  </ClientOnly>
                </div>
              </div>
              <p class="text-center text-xs text-white/20 mt-3">390 px · iPhone</p>
            </div>

            <!-- Mockup desktop -->
            <div v-else class="w-full max-w-4xl flex-shrink-0">
              <div class="bg-revel-gray-dark rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                <div class="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/8 bg-revel-gray-mid/50">
                  <div class="w-3 h-3 rounded-full bg-red-500/50" />
                  <div class="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div class="w-3 h-3 rounded-full bg-green-500/50" />
                  <div class="flex-1 mx-3 bg-revel-gray-dark/80 rounded px-3 py-1 text-xs text-white/30 text-center max-w-xs mx-auto">
                    revel-eventos.com/invitacion/XXXX
                  </div>
                </div>
                <div style="max-height:75vh;overflow-y:auto">
                  <ClientOnly>
                    <InvitationCard :key="form.templateId" :template-id="form.templateId" :event="previewEvent">
                      <template #actions>
                        <div class="py-2 px-1">
                          <div class="w-full rounded-xl py-3 text-center text-sm font-semibold text-revel-black" style="background:linear-gradient(135deg,#C9A84C,#E8D08A)">
                            Confirmar asistencia
                          </div>
                        </div>
                      </template>
                    </InvitationCard>
                  </ClientOnly>
                </div>
              </div>
              <p class="text-center text-xs text-white/20 mt-3">Vista escritorio</p>
            </div>
          </div>

          <!-- Pie del modal -->
          <div class="flex items-center justify-between px-5 py-3 border-t border-white/8 bg-revel-gray-dark flex-shrink-0">
            <p class="text-xs text-white/30">Los datos del invitado son de ejemplo</p>
            <button type="button" class="btn-secondary text-sm px-5 py-2" @click="showPreviewModal = false">
              Cerrar y seguir editando
            </button>
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
import { getDesignsByEventType } from '~/utils/invitationDesigns'

const eventsStore = useEventsStore()
const ui = useUiStore()
const router = useRouter()
const { get, post: apiPost } = useApi()

const loading = ref(false)
const uploadingCover = ref(false)
const fileInput = ref<HTMLInputElement>()
const packages = ref<{ id: string; name: string }[]>([])
const showPreviewModal = ref(false)
const previewDevice = ref<'mobile' | 'desktop'>('mobile')

// Modo de fondo: 'photo' | 'template'
const bgMode = ref<'photo' | 'template'>('template')

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
  templateId: 'w1',
})

// Cuando cambia el modo, limpia el dato del otro
watch(bgMode, (mode) => {
  if (mode === 'photo') form.templateId = 'classic'
  if (mode === 'template') form.coverImage = ''
})

// Cuando cambia el tipo de evento, seleccionar el primer diseño disponible
watch(() => form.type, (newType) => {
  if (bgMode.value === 'template' && newType) {
    const designs = getDesignsByEventType(newType)
    if (designs.length) form.templateId = designs[0]!.id
  }
})

const availableDesigns = computed(() => {
  const t = form.type || 'wedding'
  const designs = getDesignsByEventType(t)
  return designs.length ? designs : getDesignsByEventType('wedding')
})

const previewEvent = computed(() => ({
  name:          form.name.trim()         || 'Boda García & Martínez',
  date:          form.date                || '2026-06-21',
  time:          form.time                || '18:00',
  venue:         form.venue.trim()        || 'Hacienda Las Palmas',
  venueAddress:  form.venueAddress.trim() || 'Av. Principal 123, CDMX',
  venueMapUrl:   form.venueMapUrl         || null,
  coverImage:    bgMode.value === 'photo' ? (form.coverImage || null) : null,
  type:          form.type                || 'wedding',
  churchName:    form.hasChurch && form.churchName    ? form.churchName    : null,
  churchAddress: form.hasChurch && form.churchAddress ? form.churchAddress : null,
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

const errors = reactive({ name: '', type: '', packageId: '', date: '', venue: '' })

function validate() {
  errors.name      = form.name.trim().length >= 3 ? '' : 'Mínimo 3 caracteres'
  errors.type      = form.type                     ? '' : 'Selecciona el tipo de evento'
  errors.packageId = form.packageId                ? '' : 'Selecciona un paquete'
  errors.date      = form.date                     ? '' : 'La fecha es requerida'
  errors.venue     = form.venue.trim().length >= 2 ? '' : 'Escribe el nombre del lugar'
  return !Object.values(errors).some(Boolean)
}

function openPreviewModal() {
  showPreviewModal.value = true
}

function triggerFileInput() { fileInput.value?.click() }

async function uploadCover(file: File) {
  uploadingCover.value = true
  try {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload  = () => resolve(reader.result as string)
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
    const payload: Record<string, unknown> = {
      name:          form.name,
      description:   form.description   || undefined,
      coverImage:    bgMode.value === 'photo' ? (form.coverImage || undefined) : undefined,
      type:          form.type,
      packageId:     form.packageId,
      date:          form.date,
      time:          form.time,
      venue:         form.venue,
      venueAddress:  form.venueAddress  || undefined,
      venueMapUrl:   form.venueMapUrl   || undefined,
      tableCount:    form.tableCount,
      tableCapacity: form.tableCapacity,
      giftListUrl:   form.giftListUrl   || undefined,
      churchName:    form.hasChurch ? form.churchName    : undefined,
      churchAddress: form.hasChurch ? form.churchAddress : undefined,
      templateId:    bgMode.value === 'template' ? form.templateId : 'classic',
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
    // el usuario seleccionará el paquete manualmente
  }
})
</script>

<style scoped>
.preview-modal-enter-active,
.preview-modal-leave-active { transition: opacity 0.2s ease; }
.preview-modal-enter-from,
.preview-modal-leave-to   { opacity: 0; }
</style>
