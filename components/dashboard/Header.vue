<template>
  <header class="h-16 border-b border-white/6 bg-revel-gray-dark/50 backdrop-blur-sm flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30">
    
    <button
      class="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all"
      @click="ui.toggleSidebar()"
    >
      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    
    <div class="flex-1">
      <h1 class="text-sm font-semibold text-white">{{ pageTitle }}</h1>
    </div>

    
    <div class="flex items-center gap-2">
      
      <button class="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all relative">
        <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </button>

      
      <div class="w-8 h-8 rounded-full bg-revel-gold/20 flex items-center justify-center cursor-pointer">
        <span class="text-revel-gold text-xs font-bold">{{ initials }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useUiStore } from '~/stores/ui'
import { useAuthStore } from '~/stores/auth'

const ui = useUiStore()
const auth = useAuthStore()
const route = useRoute()

const initials = computed(() =>
  auth.user?.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('') ?? 'R',
)

const pageTitles: Record<string, string> = {
  '/dashboard': 'Panel principal',
  '/dashboard/events': 'Eventos',
  '/dashboard/guests': 'Invitados',
  '/dashboard/tables': 'Mesas',
  '/dashboard/album': 'Álbum digital',
  '/dashboard/qr': 'Códigos QR',
  '/dashboard/users': 'Usuarios',
}

const pageTitle = computed(() => {
  for (const [path, title] of Object.entries(pageTitles)) {
    if (route.path === path || route.path.startsWith(path + '/')) return title
  }
  return 'Rével'
})
</script>
