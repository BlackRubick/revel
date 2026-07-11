<template>
  <div class="min-h-screen bg-revel-black flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute inset-0 bg-hero-gradient" />
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-revel-gold/5 rounded-full blur-3xl" />

    <div class="relative z-10 w-full max-w-sm">
      
      <div class="text-center mb-8">
        <div class="w-14 h-14 rounded-2xl bg-gold-gradient mx-auto mb-3 flex items-center justify-center shadow-gold">
          <span class="font-display font-bold text-revel-black text-2xl">R</span>
        </div>
        <span class="font-display text-2xl font-semibold text-white tracking-wide">Rével</span>
        <p class="text-white/40 text-sm mt-1">Confirmación de asistencia</p>
      </div>

      <div class="card-revel p-6">
        <div class="text-center mb-6">
          <div class="w-12 h-12 rounded-xl bg-revel-gold/10 flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-revel-gold" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.17-.789 3.376 3.376 0 016.34 0z"/>
            </svg>
          </div>
          <h2 class="font-display text-lg font-bold text-white">Ingresa tu código</h2>
          <p class="text-white/45 text-sm mt-1">Encuentra tu código en la invitación que recibiste</p>
        </div>

        <form @submit.prevent="buscar">
          <div class="mb-4">
            <input
              v-model="codigo"
              type="text"
              placeholder="Ej: RVL-2847"
              class="input-revel text-center text-lg font-mono tracking-widest uppercase"
              :class="{ 'border-red-400/50': error }"
              autocomplete="off"
              autofocus
              @input="error = ''"
            />
            <p v-if="error" class="text-red-400 text-xs mt-1.5 text-center">{{ error }}</p>
          </div>

          <UiButton
            type="submit"
            class="w-full"
            :loading="loading"
            :disabled="!codigo.trim()"
          >
            Ver mi invitación
          </UiButton>
        </form>

        <p class="text-white/25 text-xs text-center mt-5">
          Si escaneaste el QR de tu invitación, serás redirigido automáticamente.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const router = useRouter()
const codigo = ref('')
const loading = ref(false)
const error = ref('')

async function buscar() {
  const code = codigo.value.trim()
  if (!code) return

  loading.value = true
  error.value = ''

  try {
    await $fetch(`/api/rsvp/${encodeURIComponent(code)}`)
    await router.push(`/confirmar/${encodeURIComponent(code)}`)
  } catch {
    error.value = 'Código no encontrado. Verifica que lo escribiste correctamente.'
  } finally {
    loading.value = false
  }
}
</script>
