<template>
  <!-- Art Déco / Lujo — ideal para Bodas -->
  <div class="min-h-screen relative overflow-hidden" style="background:linear-gradient(160deg,#1A1A2E 0%,#16213E 60%,#0F3460 100%)">
    <svg class="absolute top-0 left-0 w-full" viewBox="0 0 400 80" fill="none">
      <line x1="0" y1="8" x2="400" y2="8" stroke="#C9A84C" stroke-width="0.8" opacity="0.5"/>
      <line x1="0" y1="14" x2="400" y2="14" stroke="#C9A84C" stroke-width="2" opacity="0.8"/>
      <line x1="0" y1="20" x2="400" y2="20" stroke="#C9A84C" stroke-width="0.8" opacity="0.5"/>
      <polygon points="200,28 190,48 200,43 210,48" fill="#C9A84C" opacity="0.9"/>
      <rect x="60" y="32" width="12" height="12" fill="none" stroke="#C9A84C" stroke-width="1" transform="rotate(45 66 38)" opacity="0.7"/>
      <rect x="100" y="28" width="8" height="8" fill="#C9A84C" transform="rotate(45 104 32)" opacity="0.5"/>
      <rect x="328" y="32" width="12" height="12" fill="none" stroke="#C9A84C" stroke-width="1" transform="rotate(45 334 38)" opacity="0.7"/>
      <rect x="290" y="28" width="8" height="8" fill="#C9A84C" transform="rotate(45 294 32)" opacity="0.5"/>
      <line x1="30" y1="14" x2="30" y2="60" stroke="#C9A84C" stroke-width="0.8" opacity="0.4"/>
      <line x1="370" y1="14" x2="370" y2="60" stroke="#C9A84C" stroke-width="0.8" opacity="0.4"/>
    </svg>
    <svg class="absolute bottom-0 left-0 w-full" viewBox="0 0 400 80" fill="none" style="transform:scaleY(-1)">
      <line x1="0" y1="8" x2="400" y2="8" stroke="#C9A84C" stroke-width="0.8" opacity="0.5"/>
      <line x1="0" y1="14" x2="400" y2="14" stroke="#C9A84C" stroke-width="2" opacity="0.8"/>
      <line x1="0" y1="20" x2="400" y2="20" stroke="#C9A84C" stroke-width="0.8" opacity="0.5"/>
      <polygon points="200,28 190,48 200,43 210,48" fill="#C9A84C" opacity="0.9"/>
      <rect x="60" y="32" width="12" height="12" fill="none" stroke="#C9A84C" stroke-width="1" transform="rotate(45 66 38)" opacity="0.7"/>
      <rect x="328" y="32" width="12" height="12" fill="none" stroke="#C9A84C" stroke-width="1" transform="rotate(45 334 38)" opacity="0.7"/>
    </svg>

    <div class="relative z-10 flex flex-col items-center px-6 py-16 min-h-screen">
      <div v-if="event.coverImage" class="w-full max-w-sm rounded-xl overflow-hidden mb-8 shadow-2xl" style="height:200px;border:1px solid rgba(201,168,76,0.4)">
        <img :src="event.coverImage" class="w-full h-full object-cover" />
      </div>
      <svg v-else width="80" height="30" viewBox="0 0 80 30" fill="none" class="mb-6">
        <line x1="0" y1="15" x2="25" y2="15" stroke="#C9A84C" stroke-width="1"/>
        <rect x="32" y="7" width="16" height="16" stroke="#C9A84C" stroke-width="1" transform="rotate(45 40 15)"/>
        <rect x="36" y="11" width="8" height="8" fill="#C9A84C" transform="rotate(45 40 15)" opacity="0.5"/>
        <line x1="55" y1="15" x2="80" y2="15" stroke="#C9A84C" stroke-width="1"/>
      </svg>
      <p class="text-xs font-semibold uppercase tracking-[0.3em] mb-4" style="color:#C9A84C">{{ eventTypeLabel }}</p>
      <h1 class="text-3xl font-bold text-center leading-tight mb-1" style="color:#F5E6C8;letter-spacing:0.02em">{{ event.name }}</h1>
      <div class="flex items-center gap-2 my-5 w-full max-w-sm">
        <div class="h-px flex-1" style="background:linear-gradient(to right,transparent,#C9A84C)"/>
        <svg width="20" height="20" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" stroke="#C9A84C" stroke-width="1" fill="none" transform="rotate(45 12 12)"/><rect x="9" y="9" width="6" height="6" fill="#C9A84C" opacity="0.5" transform="rotate(45 12 12)"/></svg>
        <div class="h-px flex-1" style="background:linear-gradient(to left,transparent,#C9A84C)"/>
      </div>
      <p class="text-base text-center mb-1 italic" style="color:#E8D08A">{{ formatDate(event.date) }}</p>
      <p class="text-sm text-center mb-8" style="color:#C9A84C;letter-spacing:0.1em">{{ event.time }} HRS</p>
      <div class="w-full max-w-sm text-center px-6 py-5 mb-6 rounded-xl" style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.25)">
        <p class="text-xs uppercase tracking-[0.2em] mb-2" style="color:#C9A84C">Invitado de honor</p>
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
          <div><p class="text-xs uppercase tracking-wider mb-0.5" style="color:#C9A84C">Ceremonia</p><p class="text-sm font-semibold" style="color:#F5E6C8">{{ event.churchName }}</p><p v-if="event.churchAddress" class="text-xs" style="color:#9B8F7A">{{ event.churchAddress }}</p></div>
        </div>
        <div v-if="guest?.table" class="flex items-center gap-3 px-4 py-3 rounded-xl" style="background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.3)">
          <svg class="w-4 h-4" fill="none" stroke="#C9A84C" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z"/></svg>
          <div><p class="text-xs" style="color:#C9A84C">Mesa asignada</p><p class="text-sm font-bold" style="color:#F5E6C8">{{ guest.table.name }}</p></div>
        </div>
      </div>
      <div class="w-full max-w-sm flex flex-col gap-2"><slot name="actions" /></div>
      <p v-if="code" class="text-xs mt-6" style="color:rgba(201,168,76,0.35)">Código: {{ code }}</p>
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
