<template>
  <section class="relative py-36 overflow-hidden">

    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute inset-0" style="background: radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 65%)" />
      <div class="absolute top-0 left-0 right-0 h-px" style="background: linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)" />
      <div class="absolute bottom-0 left-0 right-0 h-px" style="background: linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)" />
    </div>

    <div class="max-w-6xl mx-auto px-6 lg:px-8">

      <div class="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
        <div class="inline-flex items-center gap-2 mb-6">
          <div class="h-px w-8 bg-revel-gold" />
          <span class="text-xs font-bold text-revel-gold tracking-[0.18em] uppercase">Proyección en Vivo</span>
          <div class="h-px w-8 bg-revel-gold" />
        </div>
        <h2 class="font-display text-[clamp(2.5rem,5vw,4rem)] font-bold text-white leading-[1.1] tracking-tight mb-6">
          Las fotos aparecen<br>
          <span style="background: linear-gradient(135deg, #d4af37, #f0d060); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">al instante en pantalla grande.</span>
        </h2>
        <p class="text-white/45 text-lg leading-relaxed">
          Conecta un proyector o televisor y las fotos de los invitados aparecen automáticamente.
        </p>
      </div>

      
      <div class="animate-on-scroll relative max-w-4xl mx-auto">

        <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-6 rounded-b-lg"
          style="background: linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.02)); border: 1px solid rgba(255,255,255,0.07); border-top: none" />
        <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 w-44 h-3 rounded-full opacity-40"
          style="background: radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, transparent 70%)" />

        <div class="rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)]"
          style="background: #111">

          
          <div class="flex items-center justify-between px-5 py-3"
            style="background: #0a0a0a; border-bottom: 1px solid rgba(255,255,255,0.05)">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-red-500/50" />
              <div class="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div class="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div class="flex-1 mx-5 h-6 rounded-full flex items-center justify-center gap-2"
              style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06)">
              <div class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span class="text-[11px] text-white/25">revel.mx/pantalla/boda-garcia-martinez</span>
            </div>
            <div class="flex items-center gap-2 pl-3">
              <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style="background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.2)">
                <span class="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span class="text-[10px] font-semibold text-revel-gold uppercase tracking-wider">En Vivo</span>
              </div>
            </div>
          </div>

          
          <div class="relative p-6" style="background: #0d0d0d; min-height: 380px">

            <div class="absolute top-5 left-1/2 -translate-x-1/2 text-center z-10">
              <p class="font-display text-2xl font-bold text-white/90">Boda García & Martínez</p>
              <div class="flex items-center justify-center gap-1.5 mt-0.5 text-revel-gold/60 text-sm">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{{ photoCount }} fotos compartidas esta noche</span>
              </div>
            </div>

            
            <div class="grid grid-cols-4 gap-2.5 pt-16">
              <div v-for="(photo, i) in screenPhotos" :key="i"
                :class="['rounded-xl overflow-hidden relative', photo.span ? 'col-span-2 row-span-2' : '']"
                :style="`min-height: ${photo.span ? '160px' : '72px'}`"
              >
                <img :src="photo.src" :alt="photo.label" class="w-full h-full object-cover" />

                <div v-if="photo.isNew" class="absolute top-2 left-2 text-[9px] font-bold text-[#0a0a0a] px-1.5 py-0.5 rounded-full animate-pulse"
                  style="background: linear-gradient(135deg, #d4af37, #f0d060)">
                  NUEVA
                </div>

                <div v-if="photo.span" class="absolute bottom-0 left-0 right-0 p-3"
                  style="background: linear-gradient(to top, rgba(0,0,0,0.5), transparent)">
                  <div class="flex items-center gap-1.5 text-white/60 text-[11px]">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Ana M. · Mesa 3
                  </div>
                </div>
              </div>
            </div>

            <div class="absolute bottom-4 right-4 flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span class="text-[10px] text-white/25">Conectado · última foto hace 12s</span>
            </div>
          </div>
        </div>

        <div class="absolute inset-0 -z-10 blur-3xl opacity-20 scale-90 translate-y-12"
          style="background: radial-gradient(ellipse, #d4af37 0%, transparent 65%)" />
      </div>

      
      <div class="grid sm:grid-cols-3 gap-5 mt-16 animate-on-scroll">
        <div v-for="feat in projectionFeats" :key="feat.title"
          class="text-center p-6 rounded-2xl border border-white/[0.06]"
          style="background: rgba(255,255,255,0.02)">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-revel-gold mx-auto mb-3"
            style="background: rgba(212,175,55,0.08)">
            <div v-html="feat.svg" />
          </div>
          <h4 class="font-semibold text-white text-sm mb-1">{{ feat.title }}</h4>
          <p class="text-white/35 text-xs leading-relaxed">{{ feat.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '~/composables/useAnimations'
useScrollReveal()

const photoCount = ref(248)
onMounted(() => {
  setInterval(() => { if (Math.random() > 0.4) photoCount.value++ }, 5000)
})

const screenPhotos = [
  { src: '/images/event-types/imagen1.png', label: 'Foto 1', span: true, isNew: false },
  { src: '/images/event-types/imagen2.png', label: 'Foto 2', isNew: true },
  { src: '/images/event-types/imagen3.png', label: 'Foto 3' },
  { src: '/images/event-types/imagen4.png', label: 'Foto 4' },
  { src: '/images/event-types/imagen5.png', label: 'Foto 5' },
  { src: '/images/event-types/imagen6.png', label: 'Foto 6' },
]

const projectionFeats = [
  { svg: '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>', title: 'Actualización instantánea', desc: 'transmite cada foto en menos de 1 segundo.' },
  { svg: '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>', title: 'Cualquier pantalla', desc: 'Compatible con proyectores, TVs y monitores.' },
  { svg: '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>', title: 'Sin configuración', desc: 'Solo abre la URL en pantalla completa y listo.' },
]
</script>
