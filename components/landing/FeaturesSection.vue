<template>
  <section id="funcionalidades" class="relative py-36 overflow-hidden">

    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
        style="background: radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 65%)" />
    </div>

    <div class="max-w-7xl mx-auto px-6 lg:px-8">

      <div class="max-w-2xl mb-20 animate-on-scroll">
        <div class="inline-flex items-center gap-2 mb-5">
          <div class="h-px w-8 bg-revel-gold" />
          <span class="text-xs font-bold text-revel-gold tracking-[0.18em] uppercase">Funcionalidades</span>
        </div>
        <h2 class="font-display text-[clamp(2.5rem,5vw,4rem)] font-bold text-white leading-[1.1] tracking-tight mb-5">
          Todo lo que necesitas para un evento perfecto
        </h2>
        <p class="text-white/45 text-lg leading-relaxed">
          Herramientas diseñadas por organizadores de eventos, para organizadores de eventos.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

        
        <div class="lg:col-span-2 group relative rounded-3xl overflow-hidden border border-white/[0.07] p-8 lg:p-10 flex flex-col justify-between min-h-80 animate-on-scroll"
          style="background: linear-gradient(145deg, rgba(30,30,30,0.95) 0%, rgba(10,10,10,0.98) 100%)">

          <div class="absolute top-0 right-0 w-72 h-72 opacity-50 pointer-events-none"
            style="background: radial-gradient(circle at top right, rgba(212,175,55,0.08) 0%, transparent 60%)" />

          <div>
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 text-revel-gold"
              style="background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.2)">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 class="font-display text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
              Gestión visual de invitados
            </h3>
            <p class="text-white/50 text-base leading-relaxed max-w-lg">
              Importa tu lista, controla confirmaciones, asigna mesas y envía invitaciones personalizadas.
              Toda la información de cada invitado en un solo lugar.
            </p>
          </div>

          <div class="mt-8 flex flex-col gap-2">
            <div v-for="guest in mockGuests" :key="guest.name"
              class="flex items-center gap-3 rounded-xl px-4 py-3 bg-white/[0.04] border border-white/[0.05] group-hover:border-revel-gold/10 transition-colors duration-500">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                :style="`background: ${guest.color}20; color: ${guest.color}`">
                {{ guest.name[0] }}
              </div>
              <span class="text-sm text-white/70 flex-1">{{ guest.name }}</span>
              <span class="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                :style="`background: ${guest.color}15; color: ${guest.color}`">
                {{ guest.status }}
              </span>
            </div>
          </div>
        </div>

        
        <div class="flex flex-col gap-5">
          <div v-for="(feat, i) in sideFeatures" :key="feat.title"
            class="group relative rounded-3xl border border-white/[0.07] p-7 flex-1 overflow-hidden animate-on-scroll transition-all duration-300"
            :style="`transition-delay: ${i * 80}ms; background: linear-gradient(145deg, rgba(28,28,28,0.95) 0%, rgba(10,10,10,0.98) 100%)`"
            @mousemove="tilt($event, $el)" @mouseleave="resetTilt($event, $el)">
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style="background: radial-gradient(circle at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%)" />
            <div class="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style="box-shadow: inset 0 0 0 1px rgba(212,175,55,0.15)" />
            <div class="mb-4 text-revel-gold transition-transform duration-300 group-hover:scale-110" v-html="feat.svg" />
            <h3 class="font-display text-lg font-bold text-white mb-2">{{ feat.title }}</h3>
            <p class="text-white/45 text-sm leading-relaxed">{{ feat.desc }}</p>
          </div>
        </div>

        
        <div v-for="(feat, i) in bottomFeatures" :key="feat.title"
          class="group relative rounded-3xl border border-white/[0.07] p-7 overflow-hidden animate-on-scroll transition-all duration-300"
          :style="`transition-delay: ${(i + 2) * 80}ms; background: linear-gradient(145deg, rgba(28,28,28,0.95) 0%, rgba(10,10,10,0.98) 100%)`"
          @mousemove="tilt($event, $el)" @mouseleave="resetTilt($event, $el)">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style="background: radial-gradient(circle at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 60%)" />
          <div class="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style="box-shadow: inset 0 0 0 1px rgba(212,175,55,0.2)" />
          <div class="mb-4 text-revel-gold transition-transform duration-300 group-hover:scale-110" v-html="feat.svg" />
          <h3 class="font-display text-lg font-bold text-white mb-2">{{ feat.title }}</h3>
          <p class="text-white/45 text-sm leading-relaxed">{{ feat.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '~/composables/useAnimations'
useScrollReveal()

function tilt(e: MouseEvent, el: Element | null) {
  if (!el || !(el instanceof HTMLElement)) return
  const rect = el.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  el.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateZ(4px)`
}
function resetTilt(_e: MouseEvent, el: Element | null) {
  if (!el || !(el instanceof HTMLElement)) return
  el.style.transform = ''
}

const mockGuests = [
  { name: 'María García', status: 'Confirmada', color: '#4ade80' },
  { name: 'Carlos López', status: 'Pendiente', color: '#facc15' },
  { name: 'Ana Martínez', status: 'Confirmada', color: '#4ade80' },
]

const gridSvg = '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>'
const checkSvg = '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
const docSvg = '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>'
const cameraSvg = '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'
const lockSvg = '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>'

const sideFeatures = [
  { svg: gridSvg, title: 'Asignación de mesas', desc: 'Asigna invitados a mesas fácilmente desde el panel de gestión.' },
  { svg: checkSvg, title: 'RSVP en tiempo real', desc: 'Los invitados confirman asistencia y acompañantes desde su invitación.' },
]

const bottomFeatures = [
  { svg: docSvg, title: 'Invitación digital personalizada', desc: 'Cada invitado recibe su link único con los datos del evento y su código QR.' },
  { svg: cameraSvg, title: 'Álbum colaborativo QR', desc: 'Los invitados suben fotos escaneando el QR. El álbum se forma solo.' },
  { svg: lockSvg, title: 'Roles y permisos', desc: 'Admin, Organizador, Escáner y Pantalla — cada quien ve lo suyo.' },
]
</script>
