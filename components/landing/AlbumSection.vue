<template>
  <section id="album" class="relative py-36 overflow-hidden">
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -left-40 top-1/2 w-[500px] h-[500px] rounded-full"
        style="background: radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 65%); animation: orb-drift 22s ease-in-out infinite;" />
      <div class="absolute -right-40 top-1/3 w-[400px] h-[400px] rounded-full"
        style="background: radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 65%); animation: orb-drift 17s ease-in-out infinite reverse;" />
    </div>

    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        
        <div class="animate-on-scroll order-2 lg:order-1">
          <div class="relative">
            
          <div class="absolute inset-0 -z-10 blur-3xl opacity-25 scale-75"
            style="background: radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%); animation: glow-pulse 5s ease-in-out infinite;" />

          <div class="grid grid-cols-3 grid-rows-3 gap-2.5 aspect-square max-w-sm mx-auto">
              <div
                v-for="(photo, i) in photos"
                :key="i"
                :class="['rounded-2xl overflow-hidden relative', photo.span ? 'col-span-2 row-span-2' : '']"
                :style="`min-height: ${photo.span ? '160px' : '70px'}`"
              >
                <img
                  :src="photo.src"
                  :alt="photo.label"
                  class="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div v-if="i === 0" class="absolute top-2 right-2 text-[9px] font-bold text-[#0a0a0a] px-1.5 py-0.5 rounded-full"
                  style="background: linear-gradient(135deg, #d4af37, #f0d060)">
                  NUEVA
                </div>
              </div>
            </div>

            
            <div class="mt-4 flex items-center justify-center gap-3 py-3 px-5 rounded-2xl mx-auto w-fit"
              style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07)">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span class="text-xs text-white/50">En vivo</span>
              </div>
              <div class="w-px h-3 bg-white/10" />
              <span class="text-xs font-semibold text-white">{{ photoCount }} fotos subidas</span>
              <div class="w-px h-3 bg-white/10" />
              <span class="text-xs text-white/50">Actualización automática</span>
            </div>

            
            <div class="absolute -top-5 -left-5 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-card animate-float"
              style="background: rgba(10,10,10,0.92); border: 1px solid rgba(255,255,255,0.09); backdrop-filter: blur(16px)">
              <div class="w-9 h-9 rounded-xl bg-revel-gold/15 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-revel-gold" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-semibold text-white">Carlos subió una foto</p>
                <p class="text-[10px] text-white/35">Mesa 5 · hace 30s</p>
              </div>
            </div>

            
            <div class="absolute -bottom-3 -right-5 flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-card animate-float"
              style="background: rgba(10,10,10,0.92); border: 1px solid rgba(212,175,55,0.18); backdrop-filter: blur(16px); animation-delay: 1.5s">
              <div class="w-8 h-8 rounded-xl bg-revel-gold/10 flex items-center justify-center text-revel-gold">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-semibold text-white">Escanea y sube</p>
                <p class="text-[10px] text-revel-gold/60">Sin app necesaria</p>
              </div>
            </div>

            <div class="absolute inset-0 -z-10 blur-3xl opacity-15 scale-90 translate-y-8"
              style="background: radial-gradient(circle, #d4af37 0%, transparent 70%)" />
          </div>
        </div>

        
        <div class="animate-on-scroll order-1 lg:order-2">
          <div class="inline-flex items-center gap-2 mb-6">
            <div class="h-px w-8 bg-revel-gold" />
            <span class="text-xs font-bold text-revel-gold tracking-[0.18em] uppercase">Álbum Digital QR</span>
          </div>

          <h2 class="font-display text-[clamp(2.2rem,4.5vw,3.5rem)] font-bold text-white leading-[1.1] tracking-tight mb-6">
            Cada momento capturado,<br>
            <span style="background: linear-gradient(135deg, #d4af37, #f0d060); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">para siempre.</span>
          </h2>

          <p class="text-white/50 text-lg leading-relaxed mb-10">
            Los invitados escanean el QR del evento, suben sus fotos y videos al instante.
            Rével genera automáticamente un álbum digital hermoso que dura para siempre.
          </p>

          <div class="space-y-6">
            <div v-for="(step, i) in steps" :key="step.title"
              class="flex items-start gap-5 group">
              <div class="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-revel-gold transition-all duration-300 group-hover:scale-110"
                style="background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.18)">
                <div v-html="step.svg" />
              </div>
              <div class="pt-0.5">
                <h4 class="text-sm font-semibold text-white mb-1">{{ step.title }}</h4>
                <p class="text-sm text-white/40 leading-relaxed">{{ step.desc }}</p>
              </div>
            </div>
          </div>

          <NuxtLink
            to="/login-magic"
            class="group mt-10 inline-flex items-center gap-3 font-semibold text-[#0a0a0a] text-[0.95rem] px-7 py-3.5 rounded-2xl transition-all duration-400 hover:scale-[1.02] hover:shadow-gold-strong"
            style="background: linear-gradient(135deg, #d4af37, #f0d060)"
          >
            Crear álbum digital
            <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '~/composables/useAnimations'
useScrollReveal()

const photoCount = ref(1240)
onMounted(() => {
  setInterval(() => { photoCount.value++ }, 8000)
})

const photos = [
  { src: '/images/event-types/wedding.jpg',     label: 'Boda',         span: true },
  { src: '/images/event-types/birthday.jpg',    label: 'Cumpleaños' },
  { src: '/images/event-types/quinceanera.jpg', label: 'Quinceañera' },
  { src: '/images/event-types/corporate.jpg',   label: 'Corporativo' },
  { src: '/images/event-types/baby_shower.jpg', label: 'Baby Shower' },
  { src: '/images/event-types/graduation.jpg',  label: 'Graduación' },
  { src: '/images/event-types/other.jpg',       label: 'Evento' },
]

const steps = [
  { svg: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>', title: 'Invitados toman fotos', desc: 'Desde cualquier móvil, sin descargar apps.' },
  { svg: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>', title: 'Escanean el QR del evento', desc: 'Un QR único por evento, disponible en mesas y entrada.' },
  { svg: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>', title: 'Suben fotos al álbum', desc: 'Cloudinary las procesa y optimiza automáticamente.' },
  { svg: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>', title: 'Álbum listo al instante', desc: 'Compartible con todos los invitados y descargable.' },
]
</script>
