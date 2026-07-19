<template>
  <!-- Academia / Laurel — ideal para Graduación -->
  <div class="min-h-screen relative overflow-hidden" style="background:linear-gradient(160deg,#0F1C3F 0%,#1A2F5A 60%,#0F2040 100%)">
    <!-- Laurel SVG decorativo -->
    <svg class="absolute top-12 left-1/2 -translate-x-1/2 w-64 opacity-25" viewBox="0 0 260 80" fill="none">
      <!-- Ramas de laurel izquierda -->
      <path d="M130 40 C110 40, 95 30, 80 20" stroke="#C9A84C" stroke-width="2"/>
      <ellipse cx="88" cy="23" rx="14" ry="7" fill="#5C7A4E" transform="rotate(-25 88 23)" opacity="0.8"/>
      <ellipse cx="74" cy="31" rx="13" ry="6.5" fill="#4A6B3E" transform="rotate(-40 74 31)" opacity="0.8"/>
      <ellipse cx="62" cy="40" rx="13" ry="6" fill="#5C7A4E" transform="rotate(-55 62 40)" opacity="0.8"/>
      <ellipse cx="52" cy="50" rx="12" ry="6" fill="#4A6B3E" transform="rotate(-65 52 50)" opacity="0.7"/>
      <!-- Ramas de laurel derecha -->
      <path d="M130 40 C150 40, 165 30, 180 20" stroke="#C9A84C" stroke-width="2"/>
      <ellipse cx="172" cy="23" rx="14" ry="7" fill="#5C7A4E" transform="rotate(25 172 23)" opacity="0.8"/>
      <ellipse cx="186" cy="31" rx="13" ry="6.5" fill="#4A6B3E" transform="rotate(40 186 31)" opacity="0.8"/>
      <ellipse cx="198" cy="40" rx="13" ry="6" fill="#5C7A4E" transform="rotate(55 198 40)" opacity="0.8"/>
      <ellipse cx="208" cy="50" rx="12" ry="6" fill="#4A6B3E" transform="rotate(65 208 50)" opacity="0.7"/>
      <!-- Lazo inferior -->
      <path d="M110 60 C120 70, 130 72, 140 70 C150 68, 155 60, 150 58" stroke="#C9A84C" stroke-width="1.5" fill="none"/>
      <path d="M150 58 C148 55, 140 54, 130 56 C120 58, 112 62, 110 60" stroke="#C9A84C" stroke-width="1.5" fill="none"/>
    </svg>

    <!-- Estrellas de fondo -->
    <div class="absolute inset-0" style="background-image:radial-gradient(circle,rgba(201,168,76,0.15) 1px,transparent 1px);background-size:30px 30px"/>

    <!-- Líneas superiores -->
    <svg class="absolute top-0 left-0 w-full" viewBox="0 0 400 40" fill="none">
      <line x1="0" y1="6" x2="400" y2="6" stroke="#C9A84C" stroke-width="0.8" opacity="0.6"/>
      <line x1="0" y1="12" x2="400" y2="12" stroke="#C9A84C" stroke-width="2" opacity="0.9"/>
      <line x1="0" y1="18" x2="400" y2="18" stroke="#C9A84C" stroke-width="0.8" opacity="0.6"/>
    </svg>
    <svg class="absolute bottom-0 left-0 w-full" viewBox="0 0 400 40" fill="none" style="transform:scaleY(-1)">
      <line x1="0" y1="6" x2="400" y2="6" stroke="#C9A84C" stroke-width="0.8" opacity="0.6"/>
      <line x1="0" y1="12" x2="400" y2="12" stroke="#C9A84C" stroke-width="2" opacity="0.9"/>
      <line x1="0" y1="18" x2="400" y2="18" stroke="#C9A84C" stroke-width="0.8" opacity="0.6"/>
    </svg>

    <div class="relative z-10 flex flex-col items-center px-6 py-14 min-h-screen">
      <div v-if="event.coverImage" class="w-full max-w-sm rounded-xl overflow-hidden mb-8 shadow-2xl" style="height:200px;border:1px solid rgba(201,168,76,0.3)">
        <img :src="event.coverImage" class="w-full h-full object-cover" />
      </div>
      <!-- Diploma SVG si no hay foto -->
      <svg v-else width="60" height="60" viewBox="0 0 60 60" fill="none" class="mb-6 opacity-70">
        <rect x="5" y="10" width="50" height="38" rx="3" stroke="#C9A84C" stroke-width="2" fill="none"/>
        <line x1="12" y1="22" x2="48" y2="22" stroke="#C9A84C" stroke-width="1.5" opacity="0.7"/>
        <line x1="12" y1="28" x2="40" y2="28" stroke="#C9A84C" stroke-width="1" opacity="0.5"/>
        <line x1="12" y1="34" x2="44" y2="34" stroke="#C9A84C" stroke-width="1" opacity="0.5"/>
        <circle cx="30" cy="52" r="6" fill="#C9A84C" opacity="0.8"/>
        <circle cx="30" cy="52" r="3" fill="#0F1C3F"/>
        <line x1="25" y1="48" x2="30" y2="46" stroke="#C9A84C" stroke-width="1.5"/>
        <line x1="35" y1="48" x2="30" y2="46" stroke="#C9A84C" stroke-width="1.5"/>
      </svg>
      <p class="text-xs font-bold uppercase tracking-[0.3em] mb-4" style="color:#C9A84C">— {{ eventTypeLabel }} —</p>
      <h1 class="text-3xl font-bold text-center leading-tight mb-2" style="color:#F5E6C8;letter-spacing:0.01em">{{ event.name }}</h1>
      <div class="flex items-center gap-3 my-4 w-full max-w-xs">
        <div class="h-px flex-1" style="background:linear-gradient(to right,transparent,#C9A84C)"/>
        <svg width="12" height="12" viewBox="0 0 12 12"><polygon points="6,0 7.5,4.5 12,4.5 8.5,7 9.5,12 6,9 2.5,12 3.5,7 0,4.5 4.5,4.5" fill="#C9A84C"/></svg>
        <div class="h-px flex-1" style="background:linear-gradient(to left,transparent,#C9A84C)"/>
      </div>
      <p class="text-base text-center italic mb-1" style="color:#E8D08A">{{ formatDate(event.date) }}</p>
      <p class="text-sm text-center mb-8" style="color:#C9A84C;letter-spacing:0.1em">{{ event.time }} HRS</p>
      <div class="w-full max-w-sm text-center px-6 py-5 mb-6 rounded-xl" style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.25)">
        <p class="text-xs uppercase tracking-[0.2em] mb-2" style="color:#C9A84C">Con gusto invitamos a</p>
        <p class="text-2xl font-bold mb-1" style="color:#F5E6C8">{{ guestName }}</p>
        <p v-if="companionsText" class="text-xs" style="color:#9B8F7A">{{ companionsText }}</p>
      </div>
      <div class="w-full max-w-sm space-y-3 mb-6">
        <div class="flex items-start gap-3">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="#C9A84C" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
          <div><p class="text-sm font-semibold" style="color:#F5E6C8">{{ event.venue }}</p><p v-if="event.venueAddress" class="text-xs" style="color:#9B8F7A">{{ event.venueAddress }}</p></div>
        </div>
        <div v-if="event.churchName" class="flex items-start gap-3">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="#C9A84C" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"/></svg>
          <div><p class="text-xs uppercase tracking-wider mb-0.5" style="color:#C9A84C">Ceremonia</p><p class="text-sm font-semibold" style="color:#F5E6C8">{{ event.churchName }}</p></div>
        </div>
        <div v-if="guest?.table" class="flex items-center gap-3 px-4 py-3 rounded-xl" style="background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.3)">
          <svg class="w-4 h-4" fill="none" stroke="#C9A84C" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z"/></svg>
          <div><p class="text-xs" style="color:#C9A84C">Mesa asignada</p><p class="text-sm font-bold" style="color:#F5E6C8">{{ guest.table.name }}</p></div>
        </div>
      </div>
      <div class="w-full max-w-sm flex flex-col gap-2"><slot name="actions" /></div>
      <p v-if="code" class="text-xs mt-6" style="color:rgba(201,168,76,0.3)">Código: {{ code }}</p>
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
function formatDate(d: string) { return new Date(d + 'T12:00:00').toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long', year:'numeric' }) }
</script>
