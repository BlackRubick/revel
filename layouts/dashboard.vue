<template>
  <div class="min-h-screen bg-revel-black flex">
    
    <DashboardSidebar />

    
    <div
      class="flex-1 flex flex-col min-h-screen transition-all duration-300"
      :class="ui.sidebarOpen ? 'ml-64' : 'ml-16'"
    >
      
      <DashboardHeader />

      
      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

definePageMeta({ middleware: ['auth', 'role'] })

const ui = useUiStore()
</script>
