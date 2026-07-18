<template>
  <div class="min-h-screen bg-revel-black relative overflow-hidden">

    <!-- Fondo dinámico -->
    <div class="absolute inset-0">
      <img
        v-if="event?.coverImage"
        :src="event.coverImage"
        alt=""
        class="w-full h-full object-cover"
      />
      <img
        v-else-if="event?.type"
        :src="eventTypeImage(event.type)"
        alt=""
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/95" />
      <div class="absolute inset-0 bg-hero-gradient opacity-50" />
    </div>

    <div class="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">

      <!-- Loading inicial -->
      <Transition name="fade">
        <div v-if="pageLoading" class="text-center">
          <div class="w-10 h-10 border-2 border-revel-gold/30 border-t-revel-gold rounded-full animate-spin mx-auto mb-4" />
          <p class="text-white/40 text-sm">Cargando evento...</p>
        </div>
      </Transition>

      <!-- Error: evento no encontrado / finalizado -->
      <Transition name="fade">
        <div v-if="!pageLoading && pageError" class="glass rounded-3xl p-8 text-center max-w-sm w-full border border-white/10">
          <div class="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p class="text-white font-semibold mb-1">Invitación no disponible</p>
          <p class="text-white/50 text-sm">{{ pageError }}</p>
        </div>
      </Transition>

      <!-- PASO 1: Formulario -->
      <Transition name="slide-up">
        <div v-if="!pageLoading && !pageError && step === 'form'" class="w-full max-w-sm">

          <!-- Logo Rével -->
          <div class="text-center mb-6">
            <div class="w-11 h-11 rounded-xl bg-gold-gradient mx-auto mb-2 flex items-center justify-center shadow-gold">
              <span class="font-display font-bold text-revel-black text-xl">R</span>
            </div>
            <span class="font-display text-sm font-semibold text-white/50 tracking-widest uppercase">Rével</span>
          </div>

          <!-- Card del formulario -->
          <div class="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">

            <!-- Header del evento -->
            <div class="px-6 pt-6 pb-5 text-center border-b border-white/8">
              <p class="text-revel-gold/70 text-[11px] font-semibold uppercase tracking-widest mb-3">
                Estás invitado/a
              </p>
              <h1 class="font-display text-2xl font-bold text-white leading-tight mb-2">
                {{ event?.name }}
              </h1>
              <p class="text-revel-gold text-sm font-medium">{{ formatDate(event?.date) }}</p>
            </div>

            <!-- Mini-info del evento -->
            <div class="px-6 py-4 space-y-2.5 border-b border-white/8">
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 rounded-lg bg-revel-gold/10 flex items-center justify-center flex-shrink-0">
                  <svg class="w-3.5 h-3.5 text-revel-gold" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span class="text-sm text-white/65">{{ event?.time }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 rounded-lg bg-revel-gold/10 flex items-center justify-center flex-shrink-0">
                  <svg class="w-3.5 h-3.5 text-revel-gold" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <span class="text-sm text-white/65">{{ event?.venue }}</span>
              </div>
            </div>

            <!-- Campos del formulario -->
            <div class="px-6 py-5 space-y-5">
              <p class="text-xs text-white/40 text-center">Completa tus datos para obtener tu invitación</p>

              <!-- Nombre -->
              <div>
                <label class="block text-xs font-medium text-white/55 uppercase tracking-wider mb-2">
                  Tu nombre completo
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Ej. María García"
                  maxlength="100"
                  class="input-revel w-full"
                  @keydown.enter="register"
                />
              </div>

              <!-- Acompañantes -->
              <div>
                <label class="block text-xs font-medium text-white/55 uppercase tracking-wider mb-2">
                  Acompañantes
                </label>
                <div class="flex items-center justify-between p-1.5 rounded-xl border border-white/12 bg-white/4">
                  <button
                    type="button"
                    :disabled="form.companions === 0"
                    class="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                    @click="form.companions = Math.max(0, form.companions - 1)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                    </svg>
                  </button>

                  <div class="text-center">
                    <span class="font-display text-2xl font-bold text-white">{{ form.companions }}</span>
                    <p class="text-[10px] text-white/35 mt-0.5">
                      {{ form.companions === 0 ? 'solo yo' : form.companions === 1 ? 'persona más' : 'personas más' }}
                    </p>
                  </div>

                  <button
                    type="button"
                    :disabled="form.companions === 20"
                    class="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                    @click="form.companions = Math.min(20, form.companions + 1)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <p class="text-[11px] text-white/30 text-center mt-1.5">
                  Total: {{ form.companions + 1 }} {{ form.companions + 1 === 1 ? 'persona' : 'personas' }}
                </p>
              </div>

              <!-- Error de envío -->
              <Transition name="fade">
                <div v-if="submitError" class="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <svg class="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <p class="text-red-400 text-xs">{{ submitError }}</p>
                </div>
              </Transition>
            </div>

            <!-- Botón -->
            <div class="px-6 pb-6">
              <button
                type="button"
                :disabled="submitting || !form.name.trim() || form.name.trim().length < 2"
                class="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                @click="register"
              >
                <span v-if="submitting" class="flex items-center gap-2">
                  <span class="w-4 h-4 border-2 border-revel-black/30 border-t-revel-black rounded-full animate-spin" />
                  Generando tu invitación...
                </span>
                <span v-else>Obtener mi invitación</span>
              </button>
            </div>
          </div>

        </div>
      </Transition>

      <!-- PASO 2: Invitación generada -->
      <Transition name="slide-up">
        <div v-if="step === 'success' && result" class="w-full max-w-sm flex flex-col gap-5">

          <!-- Logo Rével -->
          <div class="text-center">
            <div class="w-11 h-11 rounded-xl bg-gold-gradient mx-auto mb-2 flex items-center justify-center shadow-gold">
              <span class="font-display font-bold text-revel-black text-xl">R</span>
            </div>
            <span class="font-display text-sm font-semibold text-white/50 tracking-widest uppercase">Rével</span>
          </div>

          <!-- Card de la invitación -->
          <div class="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">

            <!-- Header -->
            <div class="px-6 pt-6 pb-4 text-center border-b border-white/8">
              <p class="text-revel-gold/70 text-[11px] font-semibold uppercase tracking-widest mb-3">
                Invitación especial
              </p>
              <h1 class="font-display text-2xl font-bold text-white leading-tight mb-1">
                {{ result.event.name }}
              </h1>
              <p class="text-revel-gold text-sm">{{ formatDate(result.event.date) }}</p>
            </div>

            <!-- Nombre del invitado -->
            <div class="px-6 py-5 text-center border-b border-white/8">
              <p class="text-white/50 text-xs mb-1">Estimado/a</p>
              <p class="font-display text-2xl font-bold text-white">{{ result.guest.name }}</p>
              <p class="text-white/40 text-xs mt-1">
                {{ result.guest.companions > 0
                  ? `Invitación válida para ${result.guest.companions + 1} personas`
                  : 'Invitación personal' }}
              </p>
            </div>

            <!-- Detalles del evento -->
            <div class="px-6 py-5 space-y-3">

              <!-- Fecha y hora -->
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-revel-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-4 h-4 text-revel-gold" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-white/35 uppercase tracking-wider">Fecha y hora</p>
                  <p class="text-sm text-white/80">{{ formatDate(result.event.date) }}</p>
                  <p class="text-sm text-white/80">{{ result.event.time }}</p>
                </div>
              </div>

              <!-- Lugar -->
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-revel-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-4 h-4 text-revel-gold" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-white/35 uppercase tracking-wider">Lugar</p>
                  <p class="text-sm text-white/80">{{ result.event.venue }}</p>
                  <p v-if="result.event.venueAddress" class="text-xs text-white/40">{{ result.event.venueAddress }}</p>
                </div>
              </div>

              <!-- Iglesia (si aplica) -->
              <div v-if="result.event.churchName || result.event.churchAddress" class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-revel-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-4 h-4 text-revel-gold" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-white/35 uppercase tracking-wider">Ceremonia religiosa</p>
                  <p v-if="result.event.churchName" class="text-sm text-white/80">{{ result.event.churchName }}</p>
                  <p v-if="result.event.churchAddress" class="text-xs text-white/40">{{ result.event.churchAddress }}</p>
                </div>
              </div>

            </div>

            <!-- QR code -->
            <div class="px-6 pb-5">
              <div class="flex flex-col items-center gap-3 p-4 rounded-2xl bg-revel-gold/6 border border-revel-gold/20">
                <p class="text-[11px] text-revel-gold/60 font-semibold uppercase tracking-widest">Tu código de acceso</p>
                <div class="bg-revel-black p-3 rounded-2xl border border-revel-gold/20">
                  <img :src="result.qrImage" alt="QR code" class="w-44 h-44 block rounded-xl" />
                </div>
                <p class="text-[10px] text-white/25 font-mono">{{ result.code }}</p>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="px-6 pb-6 flex flex-col gap-2">
              <NuxtLink
                :to="`/confirmar/${result.code}`"
                class="btn-primary w-full text-center justify-center"
              >
                Confirmar asistencia
              </NuxtLink>
              <a
                v-if="result.event.venueMapUrl"
                :href="result.event.venueMapUrl"
                target="_blank"
                class="btn-secondary w-full text-center justify-center text-sm flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Ver ubicación
              </a>
            </div>
          </div>

          <!-- Nota de guardado -->
          <p class="text-center text-white/25 text-xs px-4">
            Guarda esta pantalla o toma una captura. Tu código QR es tu entrada al evento.
          </p>

        </div>
      </Transition>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const slug = route.params.slug as string

const pageLoading = ref(true)
const pageError = ref('')
const step = ref<'form' | 'success'>('form')
const submitting = ref(false)
const submitError = ref('')

interface PublicEvent {
  id: string
  name: string
  date: string
  time: string
  venue: string
  venueAddress?: string | null
  venueMapUrl?: string | null
  coverImage?: string | null
  type: string
  churchName?: string | null
  churchAddress?: string | null
  status: string
}

interface RegistrationResult {
  guest: { name: string; companions: number }
  event: PublicEvent
  code: string
  qrImage: string
}

const event = ref<PublicEvent | null>(null)
const result = ref<RegistrationResult | null>(null)

const form = reactive({
  name: '',
  companions: 0,
})

const EVENT_IMAGES: Record<string, string> = {
  wedding:       '/images/event-types/wedding.jpg',
  birthday:      '/images/event-types/birthday.jpg',
  'quinceañera': '/images/event-types/quinceanera.jpg',
  corporate:     '/images/event-types/corporate.jpg',
  baby_shower:   '/images/event-types/baby_shower.jpg',
  graduation:    '/images/event-types/graduation.jpg',
  other:         '/images/event-types/other.jpg',
}

function eventTypeImage(type?: string) {
  return EVENT_IMAGES[type ?? ''] ?? EVENT_IMAGES.other
}

function formatDate(date?: string | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

async function register() {
  if (submitting.value || !form.name.trim() || form.name.trim().length < 2) return
  submitError.value = ''
  submitting.value = true
  try {
    const res = await $fetch<{ success: boolean; data: RegistrationResult }>(
      `/api/registro/${slug}`,
      { method: 'POST', body: { name: form.name.trim(), companions: form.companions } },
    )
    result.value = res.data
    step.value = 'success'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (e: unknown) {
    const err = e as { data?: { message?: string }; statusCode?: number }
    if (err?.statusCode === 410) {
      pageError.value = err?.data?.message ?? 'Este evento ya finalizó'
    } else {
      submitError.value = err?.data?.message ?? 'Ocurrió un error. Intenta de nuevo.'
    }
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    const res = await $fetch<{ success: boolean; data: PublicEvent }>(`/api/registro/${slug}`)
    event.value = res.data
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    pageError.value = err?.data?.message ?? 'Evento no encontrado.'
  } finally {
    pageLoading.value = false
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.slide-up-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
