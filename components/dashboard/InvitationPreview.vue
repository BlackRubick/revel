<template>
  <div class="bg-revel-black relative overflow-hidden" style="min-height: 680px;">
    <div class="absolute inset-0">
      <img
        v-if="event.coverImage"
        :src="event.coverImage"
        alt=""
        class="w-full h-full object-cover"
      />
      <div
        v-else
        class="w-full h-full bg-cover bg-center"
        :style="`background-image: url('${eventTypeImage(event.type)}')`"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/90" />
      <div class="absolute inset-0 bg-hero-gradient opacity-60" />
    </div>

    <div class="relative z-10 flex flex-col items-center px-4 py-10" style="min-height: 680px;">
      <div class="text-center mb-5">
        <div class="w-10 h-10 rounded-xl bg-gold-gradient mx-auto mb-2 flex items-center justify-center shadow-gold">
          <span class="font-display font-bold text-revel-black text-lg">R</span>
        </div>
        <span class="font-display text-sm font-semibold text-white/60 tracking-widest uppercase">Rével</span>
      </div>

      <div class="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl w-full max-w-sm">
        <div class="px-6 pt-6 pb-4 text-center border-b border-white/8">
          <p class="text-revel-gold/70 text-xs font-semibold uppercase tracking-widest mb-3">Invitación especial</p>
          <h1 class="font-display text-2xl font-bold text-white leading-tight mb-1">{{ event.name }}</h1>
          <p class="text-revel-gold text-sm">{{ formatDate(event.date) }}</p>
        </div>

        <div class="px-6 py-5 text-center border-b border-white/8">
          <p class="text-white/50 text-xs mb-1">Estimado/a</p>
          <p class="font-display text-2xl font-bold text-white">Nombre del Invitado</p>
          <p class="text-white/40 text-xs mt-1">Invitación válida para 2 personas</p>
        </div>

        <div class="px-6 py-5 space-y-3">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-revel-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-4 h-4 text-revel-gold" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-white/35 uppercase tracking-wider">Fecha y hora</p>
              <p class="text-sm text-white/80">{{ formatDate(event.date) }}</p>
              <p class="text-sm text-white/80">{{ event.time }}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-revel-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-4 h-4 text-revel-gold" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-white/35 uppercase tracking-wider">Lugar</p>
              <p class="text-sm text-white/80">{{ event.venue }}</p>
              <p v-if="event.venueAddress" class="text-xs text-white/40">{{ event.venueAddress }}</p>
            </div>
          </div>

          <div v-if="event.churchName || event.churchAddress" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-revel-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-4 h-4 text-revel-gold" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-white/35 uppercase tracking-wider">Ceremonia religiosa</p>
              <p v-if="event.churchName" class="text-sm text-white/80">{{ event.churchName }}</p>
              <p v-if="event.churchAddress" class="text-xs text-white/40">{{ event.churchAddress }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 p-3 rounded-xl bg-revel-gold/8 border border-revel-gold/20">
            <svg class="w-4 h-4 text-revel-gold flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            <div>
              <p class="text-[10px] text-revel-gold/60 uppercase tracking-wider">Mesa asignada</p>
              <p class="text-sm font-bold text-revel-gold">Mesa 1</p>
            </div>
          </div>
        </div>

        <div class="px-6 pb-6 flex flex-col gap-2">
          <button class="btn-primary w-full text-center justify-center">
            Confirmar asistencia
          </button>
          <button v-if="event.venueMapUrl" class="btn-secondary w-full text-center justify-center text-sm flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            Ver ubicación
          </button>
        </div>
      </div>

      <div class="text-center mt-5">
        <p class="text-white/25 text-xs">Código de invitación</p>
        <p class="text-white/40 text-xs font-mono mt-0.5">XXXX-XXXX</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '~/types'

defineProps<{ event: Event }>()

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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}
</script>
