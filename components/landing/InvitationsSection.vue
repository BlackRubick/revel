<template>
  <section id="invitaciones" class="relative py-36 overflow-hidden">

    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute bottom-0 left-0 right-0 h-px"
        style="background: linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)" />
    </div>

    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        
        <div class="animate-on-scroll">
          <div class="inline-flex items-center gap-2 mb-6">
            <div class="h-px w-8 bg-revel-gold" />
            <span class="text-xs font-bold text-revel-gold tracking-[0.18em] uppercase">Invitaciones Digitales</span>
          </div>

          <h2 class="font-display text-[clamp(2.2rem,4.5vw,3.5rem)] font-bold text-white leading-[1.1] tracking-tight mb-6">
            Invitaciones que<br>
            <span style="background: linear-gradient(135deg, #d4af37, #f0d060); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">enamoran desde el primer clic</span>
          </h2>

          <p class="text-white/50 text-lg leading-relaxed mb-10">
            Olvida el papel. Crea invitaciones digitales interactivas que se comparten por
            WhatsApp en segundos y gestionan el RSVP de forma completamente automática.
          </p>

          
          <div class="relative space-y-0">
            <div class="absolute left-4 top-5 bottom-5 w-px"
              style="background: linear-gradient(to bottom, rgba(212,175,55,0.5), rgba(212,175,55,0.05))" />

            <div v-for="(step, i) in steps" :key="step.title"
              class="group relative flex items-start gap-5 py-4 cursor-default"
              @mouseenter="activeStep = i"
            >
              <div :class="[
                'relative z-10 flex-shrink-0 w-9 h-9 rounded-full border flex items-center justify-center text-sm font-bold transition-all duration-400',
                activeStep === i
                  ? 'bg-revel-gold border-revel-gold text-[#0a0a0a] scale-110 shadow-gold'
                  : 'bg-[#0a0a0a] border-white/15 text-white/40 group-hover:border-revel-gold/40 group-hover:text-revel-gold/60'
              ]">
                {{ i + 1 }}
              </div>
              <div class="pb-2">
                <h4 :class="['font-semibold text-sm mb-0.5 transition-colors duration-300', activeStep === i ? 'text-white' : 'text-white/60']">
                  {{ step.title }}
                </h4>
                <p class="text-white/35 text-sm leading-relaxed">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        
        <div class="animate-on-scroll flex items-center justify-center">
          <div class="relative">
            <div class="relative w-72 rounded-[2.5rem] overflow-hidden border border-white/15 shadow-card"
              style="background: linear-gradient(180deg, #1a1a1a 0%, #111 100%)">

              
              <div class="flex items-center justify-between px-6 py-3 text-[11px] text-white/40">
                <span>9:41</span>
                <div class="w-20 h-5 rounded-full bg-black flex items-center justify-center">
                  <div class="w-2 h-2 rounded-full bg-white/20" />
                </div>
                <div class="flex items-center gap-1">
                  <div class="w-3.5 h-2 border border-white/30 rounded-sm relative">
                    <div class="absolute right-0 top-0 bottom-0 w-1/2 bg-white/40 rounded-sm" />
                  </div>
                </div>
              </div>

              
              <div class="px-4 pb-6 space-y-3">
                
                <div class="rounded-2xl overflow-hidden"
                  style="background: linear-gradient(135deg, #1e1a0a 0%, #2a2210 100%); border: 1px solid rgba(212,175,55,0.2)">
                  <div class="px-5 pt-5 pb-4 text-center">
                    <div class="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-revel-gold"
                      style="background: rgba(212,175,55,0.1)">
                      <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <p class="text-[10px] text-revel-gold/60 uppercase tracking-widest mb-1">Con alegría te invitamos a</p>
                    <h3 class="font-display text-lg font-bold text-white leading-tight">Boda García & Martínez</h3>
                    <p class="text-revel-gold text-sm mt-1">15 de Febrero · 7:00 PM</p>
                    <p class="text-white/40 text-[11px] mt-0.5">Hacienda Las Palmas, Chiapas</p>
                  </div>
                </div>

                
                <div class="rounded-xl px-4 py-2.5 flex items-center gap-2"
                  style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07)">
                  <span class="text-xs text-white/35">Para:</span>
                  <span class="text-xs font-semibold text-white">María González</span>
                </div>

                
                <div class="grid grid-cols-2 gap-2">
                  <button class="py-2.5 rounded-xl text-xs font-semibold text-[#0a0a0a] flex items-center justify-center gap-1.5"
                    style="background: linear-gradient(135deg, #d4af37, #f0d060)">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Confirmar
                  </button>
                  <button class="py-2.5 rounded-xl text-xs font-semibold text-white/60"
                    style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08)">
                    No asistiré
                  </button>
                </div>

                
                <div class="space-y-1">
                  <div v-for="opt in phoneOptions" :key="opt.label"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer hover:bg-white/[0.04]"
                    style="border: 1px solid rgba(255,255,255,0.05)">
                    <div class="text-revel-gold/70 flex-shrink-0" v-html="opt.svg" />
                    <span class="text-xs text-white/60 flex-1">{{ opt.label }}</span>
                    <svg class="w-3 h-3 text-white/20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            
            <div class="absolute -top-4 -right-8 flex items-center gap-2.5 rounded-2xl px-4 py-2.5 shadow-card animate-float"
              style="background: rgba(10,10,10,0.9); border: 1px solid rgba(212,175,55,0.2); backdrop-filter: blur(12px); animation-delay: 0.5s">
              <div class="w-7 h-7 rounded-full bg-green-400/15 flex items-center justify-center text-green-400">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-semibold text-white">+1 confirmación</p>
                <p class="text-[10px] text-white/35">hace 2 min</p>
              </div>
            </div>

            
            <div class="absolute -bottom-4 -left-6 flex items-center gap-2 rounded-2xl px-4 py-2.5 shadow-card animate-float"
              style="background: rgba(10,10,10,0.9); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(12px); animation-delay: 2s">
              <div class="text-white/50">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p class="text-xs font-medium text-white/60">Ver ubicación →</p>
            </div>

            <div class="absolute inset-0 -z-10 blur-3xl opacity-20 scale-75"
              style="background: radial-gradient(circle, #d4af37 0%, transparent 70%)" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '~/composables/useAnimations'
useScrollReveal()

const activeStep = ref(0)

const steps = [
  { title: 'Diseña y personaliza', desc: 'Elige el diseño, agrega los datos del evento y el nombre de cada invitado.' },
  { title: 'Envía por WhatsApp', desc: 'Comparte el enlace directamente desde la plataforma con un clic.' },
  { title: 'Invitado confirma', desc: 'Desde su teléfono, sin apps ni registros. Solo un clic.' },
  { title: 'RSVP automático', desc: 'Rével actualiza el dashboard al instante con la confirmación.' },
]

const phoneOptions = [
  { svg: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>', label: 'Ver ubicación del evento' },
  { svg: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>', label: 'Consultar mi mesa asignada' },
  { svg: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>', label: 'Mesa de regalos' },
  { svg: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>', label: 'Descargar invitación PDF' },
]

let interval: ReturnType<typeof setInterval>
onMounted(() => {
  interval = setInterval(() => {
    activeStep.value = (activeStep.value + 1) % steps.length
  }, 2500)
})
onUnmounted(() => clearInterval(interval))
</script>
