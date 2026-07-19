<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-12" style="background:#F5F0E8">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-6">
        <div class="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style="background:#B8953F">
          <span class="font-display font-bold text-white text-lg">R</span>
        </div>
        <span class="text-xs font-semibold tracking-widest uppercase" style="color:#B8953F">Rével</span>
      </div>

      <!-- Card -->
      <div class="rounded-2xl overflow-hidden shadow-xl border" style="background:#FEFCF7; border-color:#E5D9C3">
        <!-- Línea dorada superior -->
        <div class="h-1" style="background: linear-gradient(90deg,#B8953F,#E8D08A,#B8953F)" />

        <div class="px-7 pt-7 pb-5 text-center border-b" style="border-color:#EDE4D3">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style="color:#B8953F">Con gran alegría te invitamos a</p>
          <h1 class="font-display text-2xl font-bold leading-tight mb-2" style="color:#1C1C2E">{{ event.name }}</h1>
          <!-- Ornamento -->
          <div class="flex items-center gap-2 justify-center my-3">
            <div class="h-px flex-1" style="background:#D4C5A9" />
            <svg class="w-4 h-4 flex-shrink-0" style="color:#B8953F" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
            <div class="h-px flex-1" style="background:#D4C5A9" />
          </div>
          <p class="text-sm font-medium" style="color:#B8953F">{{ formatDate(event.date) }}</p>
        </div>

        <div class="px-7 py-5 text-center border-b" style="border-color:#EDE4D3">
          <p class="text-xs uppercase tracking-wider mb-1" style="color:#9A8B7A">Estimado/a</p>
          <p class="font-display text-xl font-bold" style="color:#1C1C2E">{{ guestName }}</p>
          <p class="text-xs mt-1" style="color:#A89880">{{ companionsText }}</p>
        </div>

        <div class="px-7 py-5 space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style="background:#F0E8D8">
              <svg class="w-3.5 h-3.5" style="color:#B8953F" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"/></svg>
            </div>
            <div><p class="text-[10px] uppercase tracking-wider" style="color:#9A8B7A">Fecha y hora</p><p class="text-sm" style="color:#3A3A4A">{{ formatDate(event.date) }} · {{ event.time }}</p></div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style="background:#F0E8D8">
              <svg class="w-3.5 h-3.5" style="color:#B8953F" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
            </div>
            <div><p class="text-[10px] uppercase tracking-wider" style="color:#9A8B7A">Lugar</p><p class="text-sm" style="color:#3A3A4A">{{ event.venue }}</p><p v-if="event.venueAddress" class="text-xs" style="color:#9A8B7A">{{ event.venueAddress }}</p></div>
          </div>
          <div v-if="event.churchName" class="flex items-start gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style="background:#F0E8D8">
              <svg class="w-3.5 h-3.5" style="color:#B8953F" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"/></svg>
            </div>
            <div><p class="text-[10px] uppercase tracking-wider" style="color:#9A8B7A">Ceremonia</p><p class="text-sm" style="color:#3A3A4A">{{ event.churchName }}</p><p v-if="event.churchAddress" class="text-xs" style="color:#9A8B7A">{{ event.churchAddress }}</p></div>
          </div>
          <div v-if="guest?.table" class="flex items-center gap-3 p-3 rounded-xl" style="background:#F5EDD9; border:1px solid #D4C5A9">
            <svg class="w-4 h-4 flex-shrink-0" style="color:#B8953F" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/></svg>
            <div><p class="text-[10px] uppercase tracking-wider" style="color:#9A8B7A">Mesa asignada</p><p class="text-sm font-bold" style="color:#B8953F">{{ guest.table.name }}</p></div>
          </div>
        </div>

        <div class="px-7 pb-7 flex flex-col gap-2">
          <slot name="actions" />
        </div>

        <!-- Línea dorada inferior -->
        <div class="h-1" style="background: linear-gradient(90deg,#B8953F,#E8D08A,#B8953F)" />
      </div>

      <div v-if="code" class="text-center mt-4"><p class="text-xs" style="color:#C4B49A">Código: {{ code }}</p></div>
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
