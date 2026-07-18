<template>
  <div class="min-h-screen bg-revel-black flex">

    <!-- Backdrop móvil: aparece cuando el drawer está abierto -->
    <Transition name="fade">
      <div
        v-if="ui.sidebarOpen"
        class="fixed inset-0 bg-black/60 z-30 lg:hidden"
        @click="ui.toggleSidebar()"
      />
    </Transition>

    <DashboardSidebar />

    <!-- Contenido: sin margen en móvil (sidebar es overlay), margen en desktop -->
    <div
      class="flex-1 flex flex-col min-h-screen transition-all duration-300"
      :class="ui.sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'"
    >
      <DashboardHeader />

      <main class="flex-1 p-4 lg:p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: ['auth', 'role'] })

const ui = useUiStore()

onMounted(() => {
  if (window.innerWidth >= 1024) {
    ui.sidebarOpen = true
  }
})
</script>
