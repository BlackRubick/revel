<template>
  <!-- Clean Modern — ideal para Corporativo / Conferencias -->
  <div class="min-h-screen relative" style="background:#FFFFFF">
    <!-- Línea lateral izquierda -->
    <div class="absolute left-0 top-0 bottom-0 w-1" style="background:linear-gradient(to bottom,#C9A84C,#E8D08A,#C9A84C)"/>
    <!-- Línea superior -->
    <div class="absolute top-0 left-0 right-0 h-0.5" style="background:linear-gradient(to right,#C9A84C,#E8D08A,transparent)"/>

    <div class="relative z-10 flex flex-col px-8 py-12 min-h-screen">
      <!-- Tipo de evento -->
      <div class="mb-10">
        <p class="text-xs font-bold uppercase tracking-[0.4em]" style="color:#C9A84C">{{ eventTypeLabel }}</p>
        <div class="w-8 h-px mt-2" style="background:#C9A84C"/>
      </div>

      <!-- Foto -->
      <div v-if="event.coverImage" class="w-full rounded-lg overflow-hidden mb-8 shadow-md" style="height:180px">
        <img :src="event.coverImage" class="w-full h-full object-cover" />
      </div>

      <!-- Nombre -->
      <h1 class="text-4xl font-black leading-none mb-1" style="color:#111111;letter-spacing:-0.03em">{{ event.name }}</h1>
      <div class="w-16 h-1 mb-6 mt-3" style="background:#C9A84C"/>

      <!-- Fecha y hora -->
      <div class="mb-8">
        <p class="text-sm font-semibold" style="color:#555555">{{ formatDate(event.date) }}</p>
        <p class="text-sm" style="color:#888888">{{ event.time }} hrs</p>
      </div>

      <!-- Invitado -->
      <div class="mb-8 pl-4" style="border-left:3px solid #C9A84C">
        <p class="text-xs uppercase tracking-widest mb-1" style="color:#C9A84C">Invitado</p>
        <p class="text-2xl font-bold" style="color:#111111">{{ guestName }}</p>
        <p v-if="companionsText" class="text-xs mt-1" style="color:#888888">{{ companionsText }}</p>
      </div>

      <!-- Lugar -->
      <div class="space-y-4 mb-8">
        <div>
          <p class="text-xs uppercase tracking-widest mb-1" style="color:#888888">Lugar</p>
          <p class="text-sm font-semibold" style="color:#111111">{{ event.venue }}</p>
          <p v-if="event.venueAddress" class="text-xs" style="color:#888888">{{ event.venueAddress }}</p>
        </div>
        <div v-if="event.churchName">
          <p class="text-xs uppercase tracking-widest mb-1" style="color:#888888">Ceremonia</p>
          <p class="text-sm font-semibold" style="color:#111111">{{ event.churchName }}</p>
          <p v-if="event.churchAddress" class="text-xs" style="color:#888888">{{ event.churchAddress }}</p>
        </div>
        <div v-if="guest?.table" class="flex items-center gap-3 px-4 py-3" style="background:#F8F8F4;border-left:3px solid #C9A84C">
          <div>
            <p class="text-xs uppercase tracking-widest" style="color:#888888">Mesa</p>
            <p class="text-sm font-bold" style="color:#111111">{{ guest.table.name }}</p>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2">      <!-- QR -->
      <div class="w-full max-w-sm flex flex-col items-center gap-2 mb-5">
        <img v-if="qrImage" :src="qrImage" class="w-36 h-36 rounded-2xl object-contain" style="border:2px solid rgba(201,168,76,0.4);background:#fff;padding:6px" />
        <div v-else class="w-36 h-36 rounded-2xl flex items-center justify-center" style="border:2px solid rgba(201,168,76,0.3);background:rgba(201,168,76,0.04)"><svg width="100" height="100" viewBox="0 0 100 100" fill="#C9A84C"><rect x="4" y="4" width="28" height="28" rx="3" fill="none" stroke="#C9A84C" stroke-width="3"/><rect x="10" y="10" width="16" height="16" rx="1"/><rect x="68" y="4" width="28" height="28" rx="3" fill="none" stroke="#C9A84C" stroke-width="3"/><rect x="74" y="10" width="16" height="16" rx="1"/><rect x="4" y="68" width="28" height="28" rx="3" fill="none" stroke="#C9A84C" stroke-width="3"/><rect x="10" y="74" width="16" height="16" rx="1"/><rect x="40" y="4" width="4" height="4"/><rect x="48" y="4" width="4" height="4"/><rect x="56" y="4" width="4" height="4"/><rect x="40" y="12" width="4" height="4"/><rect x="56" y="12" width="8" height="4"/><rect x="40" y="20" width="8" height="4"/><rect x="56" y="20" width="4" height="4"/><rect x="40" y="40" width="4" height="4"/><rect x="48" y="36" width="4" height="4"/><rect x="56" y="40" width="4" height="4"/><rect x="40" y="48" width="8" height="4"/><rect x="68" y="36" width="4" height="4"/><rect x="76" y="36" width="8" height="4"/><rect x="68" y="44" width="8" height="4"/><rect x="4" y="40" width="4" height="4"/><rect x="12" y="36" width="8" height="4"/><rect x="4" y="48" width="8" height="4"/><rect x="40" y="68" width="4" height="4"/><rect x="48" y="68" width="8" height="4"/><rect x="44" y="76" width="4" height="4"/><rect x="60" y="76" width="4" height="4"/><rect x="40" y="84" width="8" height="4"/><rect x="40" y="92" width="4" height="4"/></svg></div>
        <p class="text-xs text-center font-medium" style="color:#C9A84C">Muestra este código en la entrada</p>
      </div>

<slot name="actions" /></div>
      <p v-if="code" class="text-xs mt-8" style="color:#CCCCCC">{{ code }}</p>
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
