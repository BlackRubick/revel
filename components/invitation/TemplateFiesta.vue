<template>
  <div class="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-12" style="background: linear-gradient(135deg, #1A0840 0%, #3D0D6B 50%, #1A0840 100%)">
    <!-- Decoración: círculos de fondo -->
    <div class="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20" style="background: radial-gradient(circle, #FF6B9D, transparent); transform: translate(30%, -30%)" />
    <div class="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-15" style="background: radial-gradient(circle, #FFD700, transparent); transform: translate(-30%, 30%)" />
    <div class="absolute top-1/2 left-1/2 w-96 h-96 rounded-full opacity-10" style="background: radial-gradient(circle, #9B59B6, transparent); transform: translate(-50%,-50%)" />

    <!-- Puntos decorativos -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div v-for="dot in dots" :key="dot.id" class="absolute w-2 h-2 rounded-full opacity-40" :style="`background:${dot.color}; left:${dot.x}%; top:${dot.y}%; transform:scale(${dot.s})`" />
    </div>

    <div class="relative z-10 w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-5">
        <div class="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style="background: linear-gradient(135deg,#FFD700,#FF9500)">
          <span class="font-display font-bold text-white text-lg">R</span>
        </div>
        <span class="text-xs font-semibold tracking-widest uppercase text-white/50">Rével</span>
      </div>

      <!-- Card -->
      <div class="rounded-3xl overflow-hidden shadow-2xl" style="background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.15); backdrop-filter:blur(12px)">
        <div class="px-6 pt-6 pb-4 text-center border-b" style="border-color:rgba(255,255,255,0.1)">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-xs font-semibold" style="background:rgba(255,215,0,0.15); color:#FFD700; border:1px solid rgba(255,215,0,0.3)">¡Estás invitado!</div>
          <h1 class="font-display text-2xl font-bold text-white leading-tight mb-1">{{ event.name }}</h1>
          <p class="text-sm" style="color:#FFD700">{{ formatDate(event.date) }}</p>
        </div>

        <div class="px-6 py-4 text-center border-b" style="border-color:rgba(255,255,255,0.1)">
          <p class="text-white/50 text-xs mb-1">Hola,</p>
          <p class="font-display text-2xl font-bold text-white">{{ guestName }}</p>
          <p class="text-white/40 text-xs mt-1">{{ companionsText }}</p>
        </div>

        <div class="px-6 py-4 space-y-3">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(255,215,0,0.15)">
              <svg class="w-4 h-4" style="color:#FFD700" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"/></svg>
            </div>
            <div><p class="text-[10px] uppercase tracking-wider text-white/40">Fecha y hora</p><p class="text-sm text-white/80">{{ formatDate(event.date) }} · {{ event.time }}</p></div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(255,107,157,0.15)">
              <svg class="w-4 h-4" style="color:#FF6B9D" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
            </div>
            <div><p class="text-[10px] uppercase tracking-wider text-white/40">Lugar</p><p class="text-sm text-white/80">{{ event.venue }}</p><p v-if="event.venueAddress" class="text-xs text-white/40">{{ event.venueAddress }}</p></div>
          </div>
          <div v-if="event.churchName" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(255,255,255,0.08)">
              <svg class="w-4 h-4 text-white/60" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"/></svg>
            </div>
            <div><p class="text-[10px] uppercase tracking-wider text-white/40">Ceremonia</p><p class="text-sm text-white/80">{{ event.churchName }}</p><p v-if="event.churchAddress" class="text-xs text-white/40">{{ event.churchAddress }}</p></div>
          </div>
          <div v-if="guest?.table" class="flex items-center gap-3 p-3 rounded-xl" style="background:rgba(255,215,0,0.1); border:1px solid rgba(255,215,0,0.25)">
            <svg class="w-4 h-4 flex-shrink-0" style="color:#FFD700" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/></svg>
            <div><p class="text-[10px] uppercase tracking-wider" style="color:rgba(255,215,0,0.6)">Mesa asignada</p><p class="text-sm font-bold" style="color:#FFD700">{{ guest.table.name }}</p></div>
          </div>
        </div>

        <div class="px-6 pb-6 flex flex-col gap-2">
          <slot name="actions" />
        </div>
      </div>

      <div v-if="code" class="text-center mt-4"><p class="text-xs text-white/25">Código: {{ code }}</p></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  event: { name: string; date: string; time: string; venue: string; venueAddress?: string|null; churchName?: string|null; churchAddress?: string|null; coverImage?: string|null; type: string; venueMapUrl?: string|null }
  guest?: { name: string; companions: number; rsvpStatus: string; table?: { name: string; number: number }|null }
  code?: string
}>()
const guestName = computed(() => props.guest?.name ?? 'Nombre del Invitado')
const companionsText = computed(() => {
  if (!props.guest) return 'Invitación personal'
  return props.guest.companions > 0 ? `Válida para ${props.guest.companions + 1} personas` : 'Invitación personal'
})
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
const dots = Array.from({ length: 18 }, (_, i) => ({
  id: i, x: Math.round(Math.random() * 100), y: Math.round(Math.random() * 100),
  s: (0.5 + Math.random()).toFixed(1),
  color: ['#FFD700','#FF6B9D','#9B59B6','#FF9500'][i % 4],
}))
</script>
