<template>
  <!-- Botánico / Floral — elegante para cualquier evento -->
  <div class="min-h-screen relative" style="background:#FAFAF5;font-family:'Georgia',serif">

    <!-- Rama superior izquierda -->
    <svg class="absolute top-0 left-0 w-48 h-48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 10 C40 50, 80 30, 100 80" stroke="#5C7A4E" stroke-width="2" fill="none" opacity="0.7"/>
      <ellipse cx="35" cy="38" rx="16" ry="10" fill="#7A9E68" transform="rotate(-30 35 38)" opacity="0.7"/>
      <ellipse cx="60" cy="25" rx="20" ry="11" fill="#5C7A4E" transform="rotate(-60 60 25)" opacity="0.6"/>
      <ellipse cx="90" cy="48" rx="18" ry="10" fill="#8DB87A" transform="rotate(15 90 48)" opacity="0.65"/>
      <ellipse cx="20" cy="65" rx="14" ry="8" fill="#6B8F5A" transform="rotate(-45 20 65)" opacity="0.5"/>
      <path d="M5 5 C20 60, 10 100, 30 140" stroke="#5C7A4E" stroke-width="1.5" fill="none" opacity="0.4"/>
      <ellipse cx="15" cy="90" rx="10" ry="6" fill="#7A9E68" transform="rotate(-70 15 90)" opacity="0.45"/>
      <ellipse cx="28" cy="120" rx="12" ry="7" fill="#5C7A4E" transform="rotate(-50 28 120)" opacity="0.4"/>
    </svg>

    <!-- Rama superior derecha (espejada) -->
    <svg class="absolute top-0 right-0 w-48 h-48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform:scaleX(-1)">
      <path d="M10 10 C40 50, 80 30, 100 80" stroke="#5C7A4E" stroke-width="2" fill="none" opacity="0.7"/>
      <ellipse cx="35" cy="38" rx="16" ry="10" fill="#7A9E68" transform="rotate(-30 35 38)" opacity="0.7"/>
      <ellipse cx="60" cy="25" rx="20" ry="11" fill="#5C7A4E" transform="rotate(-60 60 25)" opacity="0.6"/>
      <ellipse cx="90" cy="48" rx="18" ry="10" fill="#8DB87A" transform="rotate(15 90 48)" opacity="0.65"/>
      <ellipse cx="20" cy="65" rx="14" ry="8" fill="#6B8F5A" transform="rotate(-45 20 65)" opacity="0.5"/>
      <path d="M5 5 C20 60, 10 100, 30 140" stroke="#5C7A4E" stroke-width="1.5" fill="none" opacity="0.4"/>
      <ellipse cx="15" cy="90" rx="10" ry="6" fill="#7A9E68" transform="rotate(-70 15 90)" opacity="0.45"/>
      <ellipse cx="28" cy="120" rx="12" ry="7" fill="#5C7A4E" transform="rotate(-50 28 120)" opacity="0.4"/>
    </svg>

    <!-- Rama inferior izquierda -->
    <svg class="absolute bottom-0 left-0 w-40 h-40" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform:scaleY(-1)">
      <path d="M10 10 C40 50, 80 30, 100 80" stroke="#5C7A4E" stroke-width="2" fill="none" opacity="0.5"/>
      <ellipse cx="35" cy="38" rx="16" ry="10" fill="#7A9E68" transform="rotate(-30 35 38)" opacity="0.5"/>
      <ellipse cx="60" cy="25" rx="20" ry="11" fill="#5C7A4E" transform="rotate(-60 60 25)" opacity="0.45"/>
      <ellipse cx="90" cy="48" rx="18" ry="10" fill="#8DB87A" transform="rotate(15 90 48)" opacity="0.4"/>
    </svg>

    <!-- Rama inferior derecha -->
    <svg class="absolute bottom-0 right-0 w-40 h-40" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform:scale(-1,-1)">
      <path d="M10 10 C40 50, 80 30, 100 80" stroke="#5C7A4E" stroke-width="2" fill="none" opacity="0.5"/>
      <ellipse cx="35" cy="38" rx="16" ry="10" fill="#7A9E68" transform="rotate(-30 35 38)" opacity="0.5"/>
      <ellipse cx="60" cy="25" rx="20" ry="11" fill="#5C7A4E" transform="rotate(-60 60 25)" opacity="0.45"/>
      <ellipse cx="90" cy="48" rx="18" ry="10" fill="#8DB87A" transform="rotate(15 90 48)" opacity="0.4"/>
    </svg>

    <div class="relative z-10 flex flex-col items-center px-6 py-12 min-h-screen">
      <!-- Si hay foto de portada -->
      <div v-if="event.coverImage" class="w-full max-w-sm rounded-2xl overflow-hidden mb-8 shadow-lg" style="height:200px">
        <img :src="event.coverImage" class="w-full h-full object-cover" />
      </div>

      <!-- Etiqueta tipo de evento -->
      <p class="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style="color:#8B6914">{{ eventTypeLabel }}</p>

      <!-- Nombre del evento -->
      <h1 class="text-3xl font-bold text-center leading-tight mb-2" style="color:#2C3E1A;letter-spacing:-0.01em">{{ event.name }}</h1>

      <!-- Divisor floral -->
      <div class="flex items-center gap-3 my-4">
        <div class="h-px w-12" style="background:#C9A84C;opacity:0.6" />
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#C9A84C" opacity="0.8">
          <path d="M12 2C10.9 4.5 8 6 5 6c1 3 3.5 5.5 7 6.5C15.5 11.5 18 9 19 6c-3 0-5.9-1.5-7-4zm0 0c1.1 2.5 4 4 7 4-1 3-3.5 5.5-7 6.5C8.5 11.5 6 9 5 6c3 0 5.9-1.5 7-4z"/>
        </svg>
        <div class="h-px w-12" style="background:#C9A84C;opacity:0.6" />
      </div>

      <!-- Fecha -->
      <p class="text-base text-center mb-1" style="color:#5C7A4E;font-style:italic">{{ formatDate(event.date) }}</p>
      <p class="text-sm text-center mb-6" style="color:#8B6914">{{ event.time }} hrs</p>

      <!-- Invitado -->
      <div class="w-full max-w-sm text-center px-6 py-5 mb-6 rounded-xl" style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.3)">
        <p class="text-xs uppercase tracking-widest mb-2" style="color:#8B6914">Con mucho gusto invitamos a</p>
        <p class="text-2xl font-bold" style="color:#2C3E1A">{{ guestName }}</p>
        <p v-if="companionsText" class="text-xs mt-1" style="color:#6B6B5A">{{ companionsText }}</p>
      </div>

      <!-- Lugar -->
      <div class="w-full max-w-sm space-y-3 mb-6">
        <div class="flex items-start gap-3">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="#5C7A4E" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
          <div>
            <p class="text-sm font-semibold" style="color:#2C3E1A">{{ event.venue }}</p>
            <p v-if="event.venueAddress" class="text-xs" style="color:#6B6B5A">{{ event.venueAddress }}</p>
          </div>
        </div>
        <div v-if="event.churchName" class="flex items-start gap-3">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="#5C7A4E" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"/></svg>
          <div>
            <p class="text-xs uppercase tracking-wider mb-0.5" style="color:#8B6914">Ceremonia religiosa</p>
            <p class="text-sm font-semibold" style="color:#2C3E1A">{{ event.churchName }}</p>
            <p v-if="event.churchAddress" class="text-xs" style="color:#6B6B5A">{{ event.churchAddress }}</p>
          </div>
        </div>
        <div v-if="guest?.table" class="flex items-center gap-3 px-4 py-3 rounded-xl" style="background:rgba(92,122,78,0.12);border:1px solid rgba(92,122,78,0.3)">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="#5C7A4E" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z"/><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z"/></svg>
          <div>
            <p class="text-xs" style="color:#5C7A4E">Mesa asignada</p>
            <p class="text-sm font-bold" style="color:#2C3E1A">{{ guest.table.name }}</p>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="w-full max-w-sm flex flex-col gap-2">
        <slot name="actions" />
      </div>

      <p v-if="code" class="text-xs mt-6" style="color:#B0A890">Código: {{ code }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  event: { name: string; date: string; time: string; venue: string; venueAddress?: string|null; venueMapUrl?: string|null; coverImage?: string|null; type: string; churchName?: string|null; churchAddress?: string|null }
  guest?: { name: string; companions: number; rsvpStatus: string; table?: { name: string; number: number }|null }
  code?: string
}>()
const guestName = computed(() => props.guest?.name ?? 'Nombre del Invitado')
const companionsText = computed(() => {
  if (!props.guest) return ''
  return props.guest.companions > 0 ? `Válida para ${props.guest.companions + 1} personas` : 'Invitación personal'
})
const TYPE_LABELS: Record<string,string> = { wedding:'Boda', birthday:'Cumpleaños', 'quinceañera':'Quinceañera', corporate:'Evento corporativo', baby_shower:'Baby Shower', graduation:'Graduación', bautizo:'Bautizo', other:'Evento especial' }
const eventTypeLabel = computed(() => TYPE_LABELS[props.event.type] ?? 'Invitación especial')
function formatDate(d: string) {
  return new Date(d.slice(0, 10) + 'T12:00:00').toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
}
</script>
