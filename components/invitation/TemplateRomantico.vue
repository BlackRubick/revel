<template>
  <!-- Rosa Garden — ideal para Quinceañera / Boda -->
  <div class="min-h-screen relative overflow-hidden" style="background:linear-gradient(160deg,#FFF0F5 0%,#FFE4EF 50%,#F9D0E6 100%)">
    <!-- Rosas decorativas SVG -->
    <svg class="absolute top-0 left-0 w-56 h-56 opacity-40" viewBox="0 0 220 220" fill="none">
      <!-- Rosa principal -->
      <circle cx="80" cy="80" r="30" fill="#E8849A" opacity="0.4"/>
      <circle cx="80" cy="80" r="22" fill="#E8849A" opacity="0.5"/>
      <circle cx="80" cy="80" r="14" fill="#D4607A" opacity="0.6"/>
      <circle cx="80" cy="80" r="7" fill="#B03060" opacity="0.7"/>
      <!-- Pétalos -->
      <ellipse cx="80" cy="52" rx="10" ry="18" fill="#E8849A" opacity="0.5" transform="rotate(0 80 80)"/>
      <ellipse cx="80" cy="52" rx="10" ry="18" fill="#E8849A" opacity="0.4" transform="rotate(45 80 80)"/>
      <ellipse cx="80" cy="52" rx="10" ry="18" fill="#E8849A" opacity="0.4" transform="rotate(90 80 80)"/>
      <ellipse cx="80" cy="52" rx="10" ry="18" fill="#E8849A" opacity="0.4" transform="rotate(135 80 80)"/>
      <ellipse cx="80" cy="52" rx="10" ry="18" fill="#E8849A" opacity="0.3" transform="rotate(180 80 80)"/>
      <ellipse cx="80" cy="52" rx="10" ry="18" fill="#E8849A" opacity="0.3" transform="rotate(225 80 80)"/>
      <ellipse cx="80" cy="52" rx="10" ry="18" fill="#E8849A" opacity="0.3" transform="rotate(270 80 80)"/>
      <ellipse cx="80" cy="52" rx="10" ry="18" fill="#E8849A" opacity="0.35" transform="rotate(315 80 80)"/>
      <!-- Hojas -->
      <ellipse cx="30" cy="120" rx="8" ry="20" fill="#7A9E68" opacity="0.4" transform="rotate(-30 30 120)"/>
      <ellipse cx="15" cy="80" rx="6" ry="16" fill="#7A9E68" opacity="0.35" transform="rotate(20 15 80)"/>
    </svg>
    <!-- Rosa esquina superior derecha -->
    <svg class="absolute top-0 right-0 w-48 h-48 opacity-40" viewBox="0 0 200 200" fill="none" style="transform:scaleX(-1)">
      <circle cx="70" cy="70" r="28" fill="#C4607A" opacity="0.35"/>
      <circle cx="70" cy="70" r="20" fill="#D4607A" opacity="0.45"/>
      <circle cx="70" cy="70" r="12" fill="#B03060" opacity="0.55"/>
      <ellipse cx="70" cy="44" rx="9" ry="16" fill="#E8849A" opacity="0.4" transform="rotate(0 70 70)"/>
      <ellipse cx="70" cy="44" rx="9" ry="16" fill="#E8849A" opacity="0.35" transform="rotate(60 70 70)"/>
      <ellipse cx="70" cy="44" rx="9" ry="16" fill="#E8849A" opacity="0.35" transform="rotate(120 70 70)"/>
      <ellipse cx="70" cy="44" rx="9" ry="16" fill="#E8849A" opacity="0.3" transform="rotate(180 70 70)"/>
      <ellipse cx="70" cy="44" rx="9" ry="16" fill="#E8849A" opacity="0.3" transform="rotate(240 70 70)"/>
      <ellipse cx="70" cy="44" rx="9" ry="16" fill="#E8849A" opacity="0.3" transform="rotate(300 70 70)"/>
      <ellipse cx="20" cy="110" rx="6" ry="14" fill="#7A9E68" opacity="0.35" transform="rotate(30 20 110)"/>
    </svg>
    <!-- Corona SVG central superior -->
    <svg class="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-16 opacity-60" viewBox="0 0 100 60" fill="none">
      <path d="M5 55 L5 30 L25 10 L50 35 L75 10 L95 30 L95 55 Z" fill="none" stroke="#C9A84C" stroke-width="2"/>
      <path d="M5 55 L5 30 L25 10 L50 35 L75 10 L95 30 L95 55 Z" fill="#C9A84C" opacity="0.15"/>
      <circle cx="5" cy="30" r="4" fill="#C9A84C"/>
      <circle cx="25" cy="10" r="4" fill="#C9A84C"/>
      <circle cx="50" cy="35" r="4" fill="#B03060"/>
      <circle cx="75" cy="10" r="4" fill="#C9A84C"/>
      <circle cx="95" cy="30" r="4" fill="#C9A84C"/>
      <!-- Joyas -->
      <rect x="22" y="38" width="8" height="10" fill="#C9A84C" opacity="0.6" rx="1"/>
      <rect x="46" y="38" width="8" height="10" fill="#E8849A" opacity="0.6" rx="1"/>
      <rect x="70" y="38" width="8" height="10" fill="#C9A84C" opacity="0.6" rx="1"/>
    </svg>

    <div class="relative z-10 flex flex-col items-center px-6 py-16 min-h-screen">
      <div v-if="event.coverImage" class="w-full max-w-sm rounded-2xl overflow-hidden mb-8 shadow-xl" style="height:200px;border:3px solid #E8849A;border-opacity:0.5">
        <img :src="event.coverImage" class="w-full h-full object-cover" />
      </div>
      <p class="text-xs font-bold uppercase tracking-[0.25em] mb-3" style="color:#B03060">✦ {{ eventTypeLabel }} ✦</p>
      <h1 class="text-3xl font-bold text-center leading-tight mb-2" style="color:#5C1A30;letter-spacing:0.01em">{{ event.name }}</h1>
      <!-- Divisor floral -->
      <div class="flex items-center gap-2 my-4 w-full max-w-xs">
        <div class="h-px flex-1" style="background:linear-gradient(to right,transparent,#E8849A)"/>
        <svg width="16" height="16" viewBox="0 0 20 20"><circle cx="10" cy="10" r="4" fill="#E8849A"/><circle cx="10" cy="4" r="2" fill="#D4607A"/><circle cx="10" cy="16" r="2" fill="#D4607A"/><circle cx="4" cy="10" r="2" fill="#D4607A"/><circle cx="16" cy="10" r="2" fill="#D4607A"/></svg>
        <div class="h-px flex-1" style="background:linear-gradient(to left,transparent,#E8849A)"/>
      </div>
      <p class="text-base text-center italic mb-1" style="color:#B03060">{{ formatDate(event.date) }}</p>
      <p class="text-sm text-center mb-8" style="color:#C9A84C">{{ event.time }} hrs</p>
      <div class="w-full max-w-sm text-center px-6 py-5 mb-6 rounded-2xl" style="background:rgba(232,132,154,0.12);border:1.5px solid rgba(232,132,154,0.4)">
        <p class="text-xs uppercase tracking-widest mb-2" style="color:#B03060">Con mucho cariño invitamos a</p>
        <p class="text-2xl font-bold mb-1" style="color:#5C1A30">{{ guestName }}</p>
        <p v-if="companionsText" class="text-xs" style="color:#8B6B7A">{{ companionsText }}</p>
      </div>
      <div class="w-full max-w-sm space-y-3 mb-6">
        <div class="flex items-start gap-3">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="#B03060" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
          <div><p class="text-sm font-semibold" style="color:#5C1A30">{{ event.venue }}</p><p v-if="event.venueAddress" class="text-xs" style="color:#8B6B7A">{{ event.venueAddress }}</p></div>
        </div>
        <div v-if="event.churchName" class="flex items-start gap-3">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="#B03060" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"/></svg>
          <div><p class="text-xs uppercase tracking-wider mb-0.5" style="color:#B03060">Ceremonia</p><p class="text-sm font-semibold" style="color:#5C1A30">{{ event.churchName }}</p><p v-if="event.churchAddress" class="text-xs" style="color:#8B6B7A">{{ event.churchAddress }}</p></div>
        </div>
        <div v-if="guest?.table" class="flex items-center gap-3 px-4 py-3 rounded-xl" style="background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.35)">
          <svg class="w-4 h-4" fill="none" stroke="#C9A84C" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z"/></svg>
          <div><p class="text-xs" style="color:#C9A84C">Mesa asignada</p><p class="text-sm font-bold" style="color:#5C1A30">{{ guest.table.name }}</p></div>
        </div>
      </div>
      <div class="w-full max-w-sm flex flex-col gap-2">      <!-- QR -->
      <div class="w-full max-w-sm flex flex-col items-center gap-2 mb-5">
        <img v-if="qrImage" :src="qrImage" class="w-36 h-36 rounded-2xl object-contain" style="border:2px solid rgba(201,168,76,0.4);background:#fff;padding:6px" />
        <div v-else class="w-36 h-36 rounded-2xl flex items-center justify-center" style="border:2px solid rgba(201,168,76,0.3);background:rgba(201,168,76,0.04)"><svg width="100" height="100" viewBox="0 0 100 100" fill="#C9A84C"><rect x="4" y="4" width="28" height="28" rx="3" fill="none" stroke="#C9A84C" stroke-width="3"/><rect x="10" y="10" width="16" height="16" rx="1"/><rect x="68" y="4" width="28" height="28" rx="3" fill="none" stroke="#C9A84C" stroke-width="3"/><rect x="74" y="10" width="16" height="16" rx="1"/><rect x="4" y="68" width="28" height="28" rx="3" fill="none" stroke="#C9A84C" stroke-width="3"/><rect x="10" y="74" width="16" height="16" rx="1"/><rect x="40" y="4" width="4" height="4"/><rect x="48" y="4" width="4" height="4"/><rect x="56" y="4" width="4" height="4"/><rect x="40" y="12" width="4" height="4"/><rect x="56" y="12" width="8" height="4"/><rect x="40" y="20" width="8" height="4"/><rect x="56" y="20" width="4" height="4"/><rect x="40" y="40" width="4" height="4"/><rect x="48" y="36" width="4" height="4"/><rect x="56" y="40" width="4" height="4"/><rect x="40" y="48" width="8" height="4"/><rect x="68" y="36" width="4" height="4"/><rect x="76" y="36" width="8" height="4"/><rect x="68" y="44" width="8" height="4"/><rect x="4" y="40" width="4" height="4"/><rect x="12" y="36" width="8" height="4"/><rect x="4" y="48" width="8" height="4"/><rect x="40" y="68" width="4" height="4"/><rect x="48" y="68" width="8" height="4"/><rect x="44" y="76" width="4" height="4"/><rect x="60" y="76" width="4" height="4"/><rect x="40" y="84" width="8" height="4"/><rect x="40" y="92" width="4" height="4"/></svg></div>
        <p class="text-xs text-center font-medium" style="color:#C9A84C">Muestra este código en la entrada</p>
      </div>

<slot name="actions" /></div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  event: { name: string; date: string; time: string; venue: string; venueAddress?: string|null; venueMapUrl?: string|null; coverImage?: string|null; type: string; churchName?: string|null; churchAddress?: string|null }
  guest?: { name: string; companions: number; rsvpStatus: string; table?: { name: string; number: number }|null }
  code?: string
  qrImage?: string | null
}>()
const guestName = computed(() => props.guest?.name ?? 'Nombre del Invitado')
const companionsText = computed(() => { if (!props.guest) return ''; return props.guest.companions > 0 ? `Válida para ${props.guest.companions + 1} personas` : 'Invitación personal' })
const TYPE_LABELS: Record<string,string> = { wedding:'Nuestra Boda', birthday:'Mi Cumpleaños', 'quinceañera':'Mis XV Años', corporate:'Evento corporativo', baby_shower:'Baby Shower', graduation:'Mi Graduación', bautizo:'Bautizo', other:'Evento especial' }
const eventTypeLabel = computed(() => TYPE_LABELS[props.event.type] ?? 'Invitación especial')
function formatDate(d: string) { return new Date(d.slice(0, 10) + 'T12:00:00').toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long', year:'numeric' }) }
</script>
