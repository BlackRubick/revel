<template>
  <div class="bg-[#0a0a0a]">
    <LandingEffects />
    <LandingNavbar />
    <LandingHeroSection />
    <LandingFeaturesSection />
    <LandingInvitationsSection />
    <LandingAlbumSection />
    <LandingProjectionSection />
    <LandingPricingSection />
    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Rével — Organización Profesional de Eventos',
  description:
    'Gestión de invitados, mesas, confirmaciones y recuerdos — todo en una sola plataforma profesional diseñada para los momentos que importan.',
  ogTitle: 'Rével — Organización Profesional de Eventos',
  ogDescription:
    'La plataforma premium para organizar eventos únicos e irrepetibles.',
})

if (import.meta.client) {
  window.history.scrollRestoration = 'manual'
}

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'instant' })
})
</script>
