<template>
  <!-- Confetti Party — ideal para Cumpleaños / Baby Shower -->
  <div class="min-h-screen relative overflow-hidden" style="background:linear-gradient(135deg,#FF6B9D 0%,#C44BF0 40%,#4B6CF0 100%)">
    <!-- Confetti SVG decorativo -->
    <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 700" fill="none" preserveAspectRatio="xMidYMid slice">
      <circle cx="30" cy="60" r="6" fill="#FFE066" opacity="0.8"/>
      <rect x="360" y="40" width="10" height="10" fill="#FF6B6B" transform="rotate(30 365 45)" opacity="0.7"/>
      <circle cx="380" cy="130" r="4" fill="#66FFD6" opacity="0.6"/>
      <rect x="15" y="200" width="8" height="8" fill="#FFB347" transform="rotate(15 19 204)" opacity="0.7"/>
      <circle cx="370" cy="250" r="5" fill="#FFE066" opacity="0.5"/>
      <rect x="25" y="350" width="12" height="6" fill="#FF6B9D" transform="rotate(-20 31 353)" opacity="0.6"/>
      <circle cx="390" cy="380" r="7" fill="#66FFD6" opacity="0.5"/>
      <rect x="10" y="480" width="9" height="9" fill="#C44BF0" transform="rotate(45 14 484)" opacity="0.6"/>
      <circle cx="375" cy="520" r="5" fill="#FFE066" opacity="0.7"/>
      <rect x="340" y="600" width="10" height="10" fill="#FF6B6B" transform="rotate(-30 345 605)" opacity="0.5"/>
      <circle cx="50" cy="600" r="6" fill="#66FFD6" opacity="0.6"/>
      <!-- Estrellas -->
      <path d="M350 80 L353 88 L362 88 L355 93 L358 102 L350 97 L342 102 L345 93 L338 88 L347 88 Z" fill="#FFE066" opacity="0.7"/>
      <path d="M50 300 L52 306 L58 306 L53 310 L55 316 L50 312 L45 316 L47 310 L42 306 L48 306 Z" fill="#fff" opacity="0.5"/>
      <path d="M380 450 L382 456 L388 456 L383 460 L385 466 L380 462 L375 466 L377 460 L372 456 L378 456 Z" fill="#FFE066" opacity="0.6"/>
    </svg>

    <div class="relative z-10 flex flex-col items-center px-6 py-12 min-h-screen">
      <!-- Banner superior -->
      <div class="flex items-center gap-1 mb-6">
        <span class="text-2xl">🎉</span>
        <div class="px-4 py-1 rounded-full" style="background:rgba(255,255,255,0.2);backdrop-filter:blur(10px)">
          <p class="text-xs font-bold uppercase tracking-widest text-white">{{ eventTypeLabel }}</p>
        </div>
        <span class="text-2xl">🎊</span>
      </div>

      <div v-if="event.coverImage" class="w-full max-w-sm rounded-2xl overflow-hidden mb-6 shadow-2xl" style="height:200px;border:3px solid rgba(255,255,255,0.4)">
        <img :src="event.coverImage" class="w-full h-full object-cover" />
      </div>

      <h1 class="text-3xl font-bold text-center leading-tight mb-4 text-white" style="text-shadow:0 2px 20px rgba(0,0,0,0.3);letter-spacing:-0.01em">{{ event.name }}</h1>

      <!-- Fecha en píldora -->
      <div class="px-6 py-3 rounded-full mb-6" style="background:rgba(255,255,255,0.25);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.4)">
        <p class="text-sm font-bold text-white text-center">{{ formatDate(event.date) }} · {{ event.time }}</p>
      </div>

      <!-- Invitado -->
      <div class="w-full max-w-sm text-center px-6 py-5 mb-6 rounded-2xl" style="background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);border:2px solid rgba(255,255,255,0.35)">
        <p class="text-xs font-bold uppercase tracking-widest text-white/80 mb-2">¡Te invitamos!</p>
        <p class="text-2xl font-bold text-white">{{ guestName }}</p>
        <p v-if="companionsText" class="text-xs mt-1 text-white/70">{{ companionsText }}</p>
      </div>

      <!-- Lugar -->
      <div class="w-full max-w-sm space-y-3 mb-6">
        <div class="flex items-start gap-3 px-4 py-3 rounded-xl" style="background:rgba(255,255,255,0.12)">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="#FFE066" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
          <div><p class="text-sm font-bold text-white">{{ event.venue }}</p><p v-if="event.venueAddress" class="text-xs text-white/70">{{ event.venueAddress }}</p></div>
        </div>
        <div v-if="event.churchName" class="flex items-start gap-3 px-4 py-3 rounded-xl" style="background:rgba(255,255,255,0.12)">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="#FFE066" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"/></svg>
          <div><p class="text-xs font-bold text-white/80 mb-0.5">Ceremonia</p><p class="text-sm font-bold text-white">{{ event.churchName }}</p></div>
        </div>
        <div v-if="guest?.table" class="flex items-center gap-3 px-4 py-3 rounded-xl" style="background:rgba(255,224,102,0.2);border:1px solid rgba(255,224,102,0.5)">
          <svg class="w-4 h-4" fill="none" stroke="#FFE066" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z"/></svg>
          <div><p class="text-xs text-yellow-200">Mesa asignada</p><p class="text-sm font-bold text-white">{{ guest.table.name }}</p></div>
        </div>
      </div>

      <div class="w-full max-w-sm flex flex-col gap-2"><slot name="actions" /></div>
      <p v-if="code" class="text-xs mt-6 text-white/30">Código: {{ code }}</p>
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
const companionsText = computed(() => { if (!props.guest) return ''; return props.guest.companions > 0 ? `Válida para ${props.guest.companions + 1} personas` : 'Invitación personal' })
const TYPE_LABELS: Record<string,string> = { wedding:'Boda', birthday:'Cumpleaños', 'quinceañera':'Quinceañera', corporate:'Evento corporativo', baby_shower:'Baby Shower', graduation:'Graduación', bautizo:'Bautizo', other:'Evento especial' }
const eventTypeLabel = computed(() => TYPE_LABELS[props.event.type] ?? 'Invitación especial')
function formatDate(d: string) { return new Date(d.slice(0, 10) + 'T12:00:00').toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long', year:'numeric' }) }
</script>
