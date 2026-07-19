<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="min-h-screen bg-revel-black flex items-center justify-center">
      <div class="text-center">
        <div class="w-10 h-10 border-2 border-revel-gold/30 border-t-revel-gold rounded-full animate-spin mx-auto mb-4" />
        <p class="text-white/40 text-sm">Cargando invitación...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="min-h-screen bg-revel-black flex items-center justify-center px-4">
      <div class="card-revel p-8 text-center max-w-sm w-full">
        <div class="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-3 text-red-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
        </div>
        <p class="text-white/60 text-sm">{{ error }}</p>
      </div>
    </div>

    <!-- Invitación con plantilla seleccionada -->
    <InvitationCard
      v-else-if="data"
      :template-id="data.guest.event.templateId"
      :event="data.guest.event"
      :guest="data.guest"
      :code="data.code"
    >
      <template #actions>
        <div v-if="data.guest.rsvpStatus === 'CONFIRMED'" class="text-center py-2">
          <UiBadge variant="success" dot>Ya confirmaste tu asistencia</UiBadge>
        </div>
        <div v-else-if="data.guest.rsvpStatus === 'DECLINED'" class="text-center py-2">
          <UiBadge variant="danger" dot>Registraste que no asistirás</UiBadge>
        </div>
        <NuxtLink v-else :to="`/confirmar/${data.code}`" class="btn-primary w-full text-center justify-center block">
          Confirmar asistencia
        </NuxtLink>
        <a v-if="data.guest.event.venueMapUrl" :href="data.guest.event.venueMapUrl" target="_blank" class="btn-secondary w-full text-center justify-center text-sm flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
          Ver ubicación
        </a>
      </template>
    </InvitationCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const code = route.params.code as string

const loading = ref(true)
const error = ref('')

interface InvitationData {
  code: string
  guest: {
    name: string
    companions: number
    rsvpStatus: string
    table?: { name: string; number: number } | null
    event: {
      id: string
      name: string
      date: string
      time: string
      venue: string
      venueAddress?: string | null
      venueMapUrl?: string | null
      coverImage?: string | null
      type: string
      churchName?: string | null
      churchAddress?: string | null
      templateId?: string | null
    }
  }
}

const data = ref<InvitationData | null>(null)

onMounted(async () => {
  try {
    const res = await $fetch<{ success: boolean; data: InvitationData }>(`/api/invitacion/${code}`)
    data.value = res.data
  } catch {
    error.value = 'Esta invitación no existe o no es válida.'
  } finally {
    loading.value = false
  }
})
</script>
