<template>
  <div class="min-h-screen bg-revel-black flex items-center justify-center p-4 relative overflow-hidden">
    
    <div class="absolute inset-0 bg-hero-gradient" />
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-revel-gold/5 rounded-full blur-3xl" />

    <div class="relative z-10 w-full max-w-sm">
      
      <div class="text-center mb-8">
        <div class="w-12 h-12 rounded-2xl bg-gold-gradient mx-auto mb-3 flex items-center justify-center shadow-gold">
          <span class="font-display font-bold text-revel-black text-xl">R</span>
        </div>
        <span class="font-display text-xl font-semibold text-white tracking-wide">Rével</span>
      </div>

      
      <div v-if="loading" class="card-revel p-8 text-center">
        <div class="w-10 h-10 border-2 border-revel-gold/30 border-t-revel-gold rounded-full animate-spin mx-auto mb-4" />
        <p class="text-white/50 text-sm">Cargando invitación...</p>
      </div>

      
      <div v-else-if="error" class="card-revel p-8 text-center">
        <div class="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-3 text-red-400">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h2 class="font-display text-xl font-bold text-white mb-2">Código inválido</h2>
        <p class="text-white/50 text-sm">{{ error }}</p>
      </div>

      
      <div v-else-if="data">
        
        <div class="card-revel overflow-hidden mb-4">
          
          <div class="bg-gradient-to-br from-revel-gray-mid to-revel-black p-6 text-center border-b border-white/6">
            <p class="badge-gold inline-flex mb-3">Invitación especial</p>
            <h1 class="font-display text-2xl font-bold text-white mb-1">{{ data.guest.event.name }}</h1>
            <p class="text-revel-gold text-sm">{{ formatDate(data.guest.event.date) }}</p>
          </div>

          
          <div class="p-6">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-12 h-12 rounded-full bg-revel-gold/15 flex items-center justify-center text-revel-gold text-xl font-bold">
                {{ data.guest.name[0] }}
              </div>
              <div>
                <p class="text-xs text-white/40">Invitación para</p>
                <h2 class="font-display text-lg font-semibold text-white">{{ data.guest.name }}</h2>
              </div>
            </div>

            
            <div v-if="data.guest.table" class="p-3 rounded-xl bg-revel-gold/5 border border-revel-gold/15 mb-5">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-revel-gold flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                <span class="text-sm text-revel-gold/80">Tu mesa: <strong>{{ data.guest.table.name }}</strong></span>
              </div>
            </div>

            
            <div v-if="confirmed" class="text-center py-4">
              <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-2', rsvpStatus === 'CONFIRMED' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400']">
                <svg v-if="rsvpStatus === 'CONFIRMED'" class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 class="font-display text-lg font-bold text-white mb-1">
                {{ rsvpStatus === 'CONFIRMED' ? '¡Confirmación registrada!' : 'Ausencia registrada' }}
              </h3>
              <p class="text-white/50 text-sm">
                {{ rsvpStatus === 'CONFIRMED' ? 'Te esperamos. ¡Será una noche increíble!' : 'Gracias por hacernos saber.' }}
              </p>
            </div>

            
            <div v-else-if="data.guest.rsvpStatus === 'PENDING'">
              <h3 class="text-sm font-semibold text-white/70 mb-3">¿Asistirás al evento?</h3>

              <div class="grid grid-cols-2 gap-3 mb-4">
                <button
                  :class="['p-4 rounded-xl border transition-all text-center', selectedStatus === 'CONFIRMED' ? 'border-green-400 bg-green-400/10' : 'border-white/8 hover:border-white/20']"
                  @click="selectedStatus = 'CONFIRMED'"
                >
                  <div class="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center mx-auto mb-2 text-green-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <span class="text-sm font-medium" :class="selectedStatus === 'CONFIRMED' ? 'text-green-400' : 'text-white/70'">Sí asistiré</span>
                </button>
                <button
                  :class="['p-4 rounded-xl border transition-all text-center', selectedStatus === 'DECLINED' ? 'border-red-400 bg-red-400/10' : 'border-white/8 hover:border-white/20']"
                  @click="selectedStatus = 'DECLINED'"
                >
                  <div class="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center mx-auto mb-2 text-red-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </div>
                  <span class="text-sm font-medium" :class="selectedStatus === 'DECLINED' ? 'text-red-400' : 'text-white/70'">No podré asistir</span>
                </button>
              </div>

              
              <Transition name="slide-down">
                <div v-if="selectedStatus === 'CONFIRMED'" class="mb-4 p-4 rounded-xl bg-white/3 border border-white/8">
                  <div class="flex items-center justify-between mb-3">
                    <p class="text-sm font-medium text-white/70">¿Cuántos acompañantes llevarás?</p>
                    <span class="text-xs text-white/35">máximo {{ data.guest.companions }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <button
                      class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all disabled:opacity-30"
                      :disabled="companions <= 0"
                      @click="companions = Math.max(0, companions - 1)"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4"/></svg>
                    </button>
                    <div class="text-center">
                      <span class="font-display text-3xl font-bold text-white">{{ companions }}</span>
                      <p class="text-white/35 text-xs mt-0.5">{{ companions === 1 ? 'acompañante' : 'acompañantes' }}</p>
                    </div>
                    <button
                      class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all disabled:opacity-30"
                      :disabled="companions >= data.guest.companions"
                      @click="companions = Math.min(data.guest.companions, companions + 1)"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                    </button>
                  </div>
                  <div v-if="data.guest.companions === 0" class="mt-3 text-center text-xs text-white/40">
                    Tu invitación no incluye acompañantes
                  </div>
                </div>
              </Transition>

              <div>
                <label class="block text-sm font-medium text-white/60 mb-1.5">Deja un mensaje (opcional)</label>
                <textarea
                  v-model="message"
                  rows="3"
                  placeholder="Un deseo para los novios..."
                  class="input-revel resize-none text-sm"
                />
              </div>

              <UiButton
                class="w-full mt-4"
                :disabled="!selectedStatus"
                :loading="confirming"
                @click="confirmRsvp"
              >
                Confirmar
              </UiButton>
            </div>

            <div v-else class="text-center py-2">
              <UiBadge :variant="data.guest.rsvpStatus === 'CONFIRMED' ? 'success' : 'danger'" dot class="text-sm">
                {{ data.guest.rsvpStatus === 'CONFIRMED' ? 'Ya confirmaste tu asistencia' : 'Registraste que no asistirás' }}
              </UiBadge>
            </div>
          </div>
        </div>

        
        <div class="card-revel p-4">
          <div class="space-y-1">
            <a
              v-if="data.guest.event.venueMapUrl"
              :href="data.guest.event.venueMapUrl"
              target="_blank"
              class="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/4 transition-all"
            >
              <svg class="w-4 h-4 text-white/50 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span class="text-sm text-white/70">Ver ubicación</span>
              <svg class="w-3.5 h-3.5 text-white/20 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
            <NuxtLink
              :to="`/album/${data.guest.event.id}?code=${$route.params.code}`"
              class="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/4 transition-all"
            >
              <svg class="w-4 h-4 text-white/50 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span class="text-sm text-white/70">Subir fotos al álbum</span>
              <svg class="w-3.5 h-3.5 text-white/20 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

interface RsvpGuest {
  id: string
  name: string
  rsvpStatus: string
  companions: number
  table?: { id: string; name: string; number: number } | null
  event: {
    id: string
    name: string
    date: string
    venueMapUrl?: string | null
  }
}

interface RsvpData {
  guest: RsvpGuest
}

const route = useRoute()
const code = route.params.code as string

const loading = ref(true)
const error = ref('')
const data = ref<RsvpData | null>(null)
const selectedStatus = ref<'CONFIRMED' | 'DECLINED' | ''>('')
const companions = ref(0)
const message = ref('')
const confirming = ref(false)
const confirmed = ref(false)
const rsvpStatus = ref('')

async function loadData() {
  try {
    const res = await $fetch<{ success: boolean; data: RsvpData }>(`/api/rsvp/${code}`)
    data.value = res.data
  } catch {
    error.value = 'El enlace de invitación no es válido o ha expirado.'
  } finally {
    loading.value = false
  }
}

async function confirmRsvp() {
  if (!selectedStatus.value) return
  confirming.value = true
  try {
    await $fetch('/api/rsvp/confirm', {
      method: 'POST',
      body: {
        code,
        status: selectedStatus.value,
        message: message.value,
        companions: selectedStatus.value === 'CONFIRMED' ? companions.value : 0,
      },
    })
    rsvpStatus.value = selectedStatus.value
    confirmed.value = true
  } catch {

  } finally {
    confirming.value = false
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

onMounted(loadData)
</script>

<style scoped>
.slide-down-enter-active { transition: all 0.3s ease; }
.slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from { opacity: 0; transform: translateY(-8px); }
.slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
