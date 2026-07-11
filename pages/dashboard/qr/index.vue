<template>
  <div class="max-w-lg mx-auto">
    <div class="mb-6">
      <h2 class="font-display text-2xl font-bold text-white mb-1">Escáner QR</h2>
      <p class="text-white/45 text-sm">Escanea el código QR del invitado para registrar su entrada</p>
    </div>

    
    <div class="card-revel overflow-hidden mb-4">
      <div class="relative bg-black">
        <div id="qr-reader" class="w-full" style="min-height: 280px;" />

        
        <div v-if="cameraActive" class="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div class="relative w-52 h-52">
            <span class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-revel-gold rounded-tl-lg" />
            <span class="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-revel-gold rounded-tr-lg" />
            <span class="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-revel-gold rounded-bl-lg" />
            <span class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-revel-gold rounded-br-lg" />
            <span class="absolute top-1/2 left-0 right-0 h-0.5 bg-revel-gold/60 animate-scan-line" />
          </div>
        </div>

        
        <div v-if="!cameraActive" class="flex flex-col items-center justify-center py-14 gap-4">
          <div class="w-16 h-16 rounded-2xl bg-revel-gold/10 flex items-center justify-center text-revel-gold">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"/>
            </svg>
          </div>
          <div class="text-center">
            <p class="text-white/60 text-sm mb-3">Activa la cámara para escanear QR</p>
            <UiButton size="sm" @click="startCamera">Activar cámara</UiButton>
          </div>
        </div>
      </div>

      <div v-if="cameraActive" class="p-3 flex justify-center border-t border-white/5">
        <button class="text-xs text-white/40 hover:text-white/70 transition-colors" @click="stopCamera">
          Detener cámara
        </button>
      </div>
    </div>

    
    <div class="card-revel p-4">
      <p class="text-xs text-white/40 mb-2 font-medium uppercase tracking-wider">O ingresa el código manualmente</p>
      <div class="flex gap-2">
        <input
          v-model="manualCode"
          type="text"
          placeholder="Código del invitado..."
          class="input-revel flex-1 text-sm font-mono uppercase"
          @keyup.enter="validateCode(manualCode)"
        />
        <UiButton size="sm" :loading="validating" @click="validateCode(manualCode)">Validar</UiButton>
      </div>
    </div>
  </div>

  
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="result" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeResult">
        
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeResult" />

        
        <Transition name="modal-pop">
          <div v-if="result" class="relative w-full max-w-sm z-10">
            
            <div :class="['rounded-2xl overflow-hidden shadow-2xl border', result.valid ? 'border-green-500/30' : result.duplicate ? 'border-yellow-500/30' : 'border-red-500/30']" style="background: #121212;">

              
              <div :class="['px-6 py-5 flex flex-col items-center text-center gap-3', result.valid ? 'bg-green-500/10' : result.duplicate ? 'bg-yellow-500/10' : 'bg-red-500/10']">
                
                <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center', result.valid ? 'bg-green-500/20' : result.duplicate ? 'bg-yellow-500/20' : 'bg-red-500/20']">
                  <svg v-if="result.valid" class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <svg v-else-if="result.duplicate" class="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                  </svg>
                  <svg v-else class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p :class="['font-display text-xl font-bold', result.valid ? 'text-green-400' : result.duplicate ? 'text-yellow-400' : 'text-red-400']">
                    {{ result.message }}
                  </p>
                  <p class="text-white/50 text-sm mt-0.5">
                    {{ result.valid ? 'Check-in registrado exitosamente' : result.duplicate ? 'Este QR ya fue utilizado anteriormente' : 'El código no es válido' }}
                  </p>
                </div>
              </div>

              
              <div v-if="result.data?.guest" class="px-6 py-5 space-y-4">
                
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 rounded-full bg-revel-gold/15 flex items-center justify-center text-revel-gold text-2xl font-bold flex-shrink-0">
                    {{ result.data.guest.name?.[0]?.toUpperCase() }}
                  </div>
                  <div>
                    <p class="text-xs text-white/40 mb-0.5">Invitado</p>
                    <p class="font-display text-xl font-bold text-white leading-tight">{{ result.data.guest.name }}</p>
                  </div>
                </div>

                
                <div class="grid grid-cols-2 gap-3">
                  <div class="col-span-2 p-3 rounded-xl bg-white/4 border border-white/6">
                    <p class="text-[10px] text-white/35 uppercase tracking-wider mb-1">Evento</p>
                    <p class="text-sm font-semibold text-white">{{ result.data.guest.event?.name ?? '—' }}</p>
                  </div>
                  <div class="p-3 rounded-xl bg-revel-gold/8 border border-revel-gold/20">
                    <p class="text-[10px] text-white/35 uppercase tracking-wider mb-1">Mesa</p>
                    <p class="text-xl font-bold text-revel-gold">{{ result.data.guest.table?.name ?? 'Sin asignar' }}</p>
                  </div>
                  <div class="p-3 rounded-xl bg-white/4 border border-white/6">
                    <p class="text-[10px] text-white/35 uppercase tracking-wider mb-1">Total pases</p>
                    <p class="text-xl font-bold text-white">{{ (result.data.guest.companions ?? 0) + 1 }}</p>
                    <p class="text-[10px] text-white/30">{{ (result.data.guest.companions ?? 0) === 0 ? 'solo' : `+ ${result.data.guest.companions} acomp.` }}</p>
                  </div>
                </div>
              </div>

              
              <div class="px-6 pb-5">
                <button
                  :class="['w-full py-3 rounded-xl text-sm font-semibold transition-all', result.valid ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : result.duplicate ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30']"
                  @click="closeResult"
                >
                  Escanear siguiente
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { post } = useApi()
const manualCode = ref('')
const validating = ref(false)
const cameraActive = ref(false)

interface ScanResult {
  valid: boolean
  duplicate?: boolean
  message: string
  data?: {
    guest?: {
      name: string
      companions?: number
      table?: { name: string; number: number } | null
      event?: { name: string } | null
    }
  }
}

const result = ref<ScanResult | null>(null)
let scanner: { start: Function; stop: Function } | null = null

async function startCamera() {
  const { Html5Qrcode } = await import('html5-qrcode')
  scanner = new Html5Qrcode('qr-reader')
  try {
    await scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 220, height: 220 } },
      async (code: string) => {
        if (validating.value || result.value) return
        await validateCode(code)
      },
      () => {},
    )
    cameraActive.value = true
  } catch {
    cameraActive.value = false
  }
}

async function stopCamera() {
  if (scanner) { await scanner.stop().catch(() => {}); scanner = null }
  cameraActive.value = false
}

async function validateCode(code: string) {
  const trimmed = code.trim()
  if (!trimmed || validating.value) return
  validating.value = true
  result.value = null
  try {
    const res = await post<ScanResult>('/api/qr/validate', { code: trimmed })
    result.value = res
    manualCode.value = ''
    if (cameraActive.value) await stopCamera()
  } catch {
    result.value = { valid: false, message: 'Error al validar el código' }
  } finally {
    validating.value = false
  }
}

function closeResult() {
  result.value = null
  manualCode.value = ''
  startCamera()
}

onMounted(() => startCamera())
onUnmounted(() => { if (scanner && cameraActive.value) scanner.stop().catch(() => {}) })
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

.modal-pop-enter-active { transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-pop-enter-from { opacity: 0; transform: scale(0.85) translateY(20px); }
.modal-pop-leave-active { transition: all 0.2s ease; }
.modal-pop-leave-to { opacity: 0; transform: scale(0.95); }

@keyframes scan {
  0%, 100% { transform: translateY(-90px); opacity: 0.8; }
  50% { transform: translateY(90px); opacity: 0.4; }
}
.animate-scan-line { animation: scan 2s ease-in-out infinite; }
</style>
