<template>
  <div class="animate-fade-in">
    <!-- Encabezado -->
    <div class="text-center mb-8">
      <h1 class="font-display text-5xl font-bold mb-3 text-gradient-gold" style="letter-spacing: 0.06em;">Rével</h1>
      <p class="text-white/40 text-sm tracking-wide">Bienvenido de vuelta</p>
    </div>

    <!-- Tarjeta principal -->
    <div class="relative rounded-2xl overflow-hidden">
      <!-- Borde dorado superior -->
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-revel-gold/40 to-transparent" />
      <!-- Fondo glass -->
      <div class="bg-gradient-to-b from-white/4 to-black/60 backdrop-blur-xl border border-white/8 rounded-2xl p-8">

        <form @submit.prevent="handleSubmit">
          <div class="space-y-5">
            <UiInput
              v-model="form.email"
              label="Correo electrónico"
              type="email"
              placeholder="hola@revel.mx"
              required
              :error="errors.email"
              autocomplete="email"
            >
              <template #prefix>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </template>
            </UiInput>

            <UiInput
              v-model="form.password"
              label="Contraseña"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              required
              :error="errors.password"
              autocomplete="current-password"
            >
              <template #prefix>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </template>
              <template #suffix>
                <button type="button" @click="showPassword = !showPassword" class="flex items-center justify-center">
                  <svg class="w-4 h-4 text-white/40 hover:text-white/70 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </template>
            </UiInput>
          </div>

          <div v-if="loginError" class="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/20">
            <svg class="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-red-400">{{ loginError }}</p>
          </div>

          <UiButton
            type="submit"
            :loading="loading"
            loading-text="Iniciando sesión..."
            class="w-full mt-6"
            size="lg"
          >
            Iniciar sesión
          </UiButton>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

useSeoMeta({
  title: 'Iniciar sesión — Rével',
  robots: 'noindex',
})

const { login } = useAuth()

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const showPassword = ref(false)
const loading = ref(false)
const loginError = ref('')

async function handleSubmit() {
  errors.email = ''
  errors.password = ''
  loginError.value = ''

  if (!form.email) { errors.email = 'El correo es requerido'; return }
  if (!form.password) { errors.password = 'La contraseña es requerida'; return }

  loading.value = true
  try {
    await login(form.email, form.password)
  } catch {
    loginError.value = 'Credenciales incorrectas. Verifica tus datos.'
  } finally {
    loading.value = false
  }
}
</script>
