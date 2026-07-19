<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-12" style="background:#0D0D0D">
    <div class="w-full max-w-sm">
      <!-- Logo pequeño -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2">
          <div class="w-5 h-5 rounded flex items-center justify-center" style="background:#C9A84C">
            <span class="font-display font-bold text-black text-xs">R</span>
          </div>
          <span class="text-xs font-semibold tracking-[0.3em] uppercase" style="color:rgba(201,168,76,0.5)">Rével</span>
        </div>
      </div>

      <!-- Contenido minimalista -->
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.25em] mb-5" style="color:rgba(201,168,76,0.6)">Invitación</p>

        <!-- Línea dorada -->
        <div class="w-12 h-px mb-6" style="background:#C9A84C" />

        <h1 class="font-display text-3xl font-bold text-white leading-tight mb-2">{{ event.name }}</h1>
        <p class="text-sm mb-8" style="color:rgba(255,255,255,0.4)">{{ formatDate(event.date) }} · {{ event.time }}</p>

        <div class="mb-6 pb-6 border-b" style="border-color:rgba(255,255,255,0.08)">
          <p class="text-xs mb-1" style="color:rgba(255,255,255,0.3)">Para</p>
          <p class="font-display text-xl font-bold text-white">{{ guestName }}</p>
          <p class="text-xs mt-1" style="color:rgba(255,255,255,0.3)">{{ companionsText }}</p>
        </div>

        <div class="space-y-4 mb-6">
          <div>
            <p class="text-[10px] uppercase tracking-[0.2em] mb-1" style="color:rgba(201,168,76,0.5)">Lugar</p>
            <p class="text-sm text-white/70">{{ event.venue }}</p>
            <p v-if="event.venueAddress" class="text-xs text-white/35 mt-0.5">{{ event.venueAddress }}</p>
          </div>
          <div v-if="event.churchName">
            <p class="text-[10px] uppercase tracking-[0.2em] mb-1" style="color:rgba(201,168,76,0.5)">Ceremonia</p>
            <p class="text-sm text-white/70">{{ event.churchName }}</p>
            <p v-if="event.churchAddress" class="text-xs text-white/35 mt-0.5">{{ event.churchAddress }}</p>
          </div>
          <div v-if="guest?.table">
            <p class="text-[10px] uppercase tracking-[0.2em] mb-1" style="color:rgba(201,168,76,0.5)">Mesa asignada</p>
            <p class="text-sm font-bold" style="color:#C9A84C">{{ guest.table.name }}</p>
          </div>
        </div>

        <!-- Línea dorada -->
        <div class="w-12 h-px mb-6" style="background:#C9A84C" />

        <div class="flex flex-col gap-2">
          <slot name="actions" />
        </div>
      </div>

      <div v-if="code" class="mt-10 pt-6 border-t" style="border-color:rgba(255,255,255,0.06)">
        <p class="text-[10px] uppercase tracking-[0.2em]" style="color:rgba(255,255,255,0.2)">Código · {{ code }}</p>
      </div>
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
</script>
