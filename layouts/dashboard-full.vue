<template>
  <!-- h-screen overflow-hidden fija la altura exacta del viewport para que flex-1 en cada nivel quede acotado -->
  <div class="h-screen bg-revel-black flex overflow-hidden">

    <Transition name="fade">
      <div
        v-if="ui.sidebarOpen"
        class="fixed inset-0 bg-black/60 z-30 lg:hidden"
        @click="ui.toggleSidebar()"
      />
    </Transition>

    <DashboardSidebar />

    <div
      class="flex-1 flex flex-col transition-all duration-300"
      :class="ui.sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'"
    >
      <DashboardHeader />

      <main class="flex-1 flex flex-col overflow-hidden">
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
