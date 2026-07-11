<template>
  <section class="relative py-28 overflow-hidden">

    <div class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 60%)" />

    <div class="max-w-7xl mx-auto px-6 lg:px-8">

      
      <div class="text-center mb-16 animate-on-scroll">
        <div class="inline-flex items-center gap-2 mb-5">
          <div class="h-px w-8 bg-revel-gold" />
          <span class="text-xs font-bold text-revel-gold tracking-[0.18em] uppercase">Testimonios</span>
          <div class="h-px w-8 bg-revel-gold" />
        </div>
        <h2 class="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-white leading-tight">
          Lo que dicen quienes<br>
          <span style="background: linear-gradient(135deg, #d4af37, #f0d060); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">confían en Rével</span>
        </h2>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="(t, i) in testimonials"
          :key="t.name"
          class="group rounded-3xl p-7 border border-white/[0.07] hover:border-revel-gold/15 transition-all duration-500 animate-on-scroll"
          :style="`transition-delay: ${i * 80}ms; background: linear-gradient(145deg, rgba(24,24,24,0.95) 0%, rgba(10,10,10,0.98) 100%)`"
        >
          
          <div class="flex gap-1 mb-4">
            <svg v-for="s in 5" :key="s" class="w-3.5 h-3.5 text-revel-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>

          <p class="text-white/60 text-sm leading-relaxed mb-6 italic">"{{ t.quote }}"</p>

          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0"
              :style="`background: ${t.color}15; color: ${t.color}`">
              {{ t.name[0] }}
            </div>
            <div>
              <p class="text-sm font-semibold text-white">{{ t.name }}</p>
              <p class="text-xs text-white/35">{{ t.role }}</p>
            </div>
          </div>
        </div>
      </div>

      
      <div class="mt-20 text-center animate-on-scroll">
        <p class="text-xs font-bold text-white/20 uppercase tracking-[0.18em] mb-8">
          Usado por organizadores de todo México
        </p>
        <div class="flex flex-wrap items-center justify-center gap-8 opacity-25">
          <div v-for="brand in brands" :key="brand" class="font-display text-2xl font-bold text-white tracking-tight">
            {{ brand }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '~/composables/useAnimations'
useScrollReveal()

const testimonials = [
  {
    quote: 'La proyección en tiempo real fue el wow del evento. Los invitados subían fotos y aparecían en la pantalla al instante. Todos quedaron asombrados.',
    name: 'Sofía Ramírez',
    role: 'Wedding Planner · CDMX',
    color: '#d4af37',
  },
  {
    quote: 'Gestionar 400 invitados nunca había sido tan sencillo. El sistema de mesas con drag & drop y los QR únicos me ahorraron horas de trabajo.',
    name: 'Roberto Herrera',
    role: 'Organizador de Eventos · Monterrey',
    color: '#4ade80',
  },
  {
    quote: 'El álbum digital fue un regalo adicional para los novios. Todas las fotos de los invitados en un solo lugar, automáticamente. Increíble.',
    name: 'Valentina Cruz',
    role: 'Event Manager · Guadalajara',
    color: '#a78bfa',
  },
]

const brands = ['Eventos GDL', 'Vía Celebra', 'Sueños & Eventos', 'Bocados Finos', 'Villa Real']
</script>
