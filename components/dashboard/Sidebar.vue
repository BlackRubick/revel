<template>
  <aside
    :class="[
      'fixed top-0 left-0 h-screen flex flex-col bg-revel-gray-dark border-r border-white/6 transition-all duration-300 z-40',
      ui.sidebarOpen
        ? 'w-64 translate-x-0'
        : 'w-64 -translate-x-full lg:translate-x-0 lg:w-16',
    ]"
  >
    
    <div class="flex items-center gap-3 px-4 h-16 border-b border-white/6 flex-shrink-0">
      <div class="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center flex-shrink-0 shadow-gold">
        <span class="font-display font-bold text-revel-black text-sm">R</span>
      </div>
      <Transition name="fade-quick">
        <span v-if="ui.sidebarOpen" class="font-display text-lg font-semibold text-white tracking-wide">
          Rével
        </span>
      </Transition>
    </div>

    
    <nav class="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
      <template v-for="group in navGroups" :key="group.label">
        <template v-if="group.items.some(i => canAccess(i.roles))">
          <div v-if="ui.sidebarOpen" class="px-3 pt-4 pb-1">
            <p class="text-[10px] font-semibold uppercase tracking-widest text-white/25">
              {{ group.label }}
            </p>
          </div>
          <div v-else class="py-2">
            <div class="w-full h-px bg-white/6" />
          </div>

          <NuxtLink
            v-for="item in group.items.filter(i => canAccess(i.roles))"
            :key="item.to"
            :to="item.to"
            :class="['sidebar-link', $route.path.startsWith(item.to) && item.to !== '/dashboard' || $route.path === item.to ? 'active' : '']"
            :title="!ui.sidebarOpen ? item.label : undefined"
          >
            <component :is="item.icon" class="w-4.5 h-4.5 flex-shrink-0" />
            <Transition name="fade-quick">
              <span v-if="ui.sidebarOpen" class="truncate">{{ item.label }}</span>
            </Transition>
          </NuxtLink>
        </template>
      </template>
    </nav>

    
    <div class="border-t border-white/6 p-3">
      <div v-if="ui.sidebarOpen" class="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg">
        <div class="w-8 h-8 rounded-full bg-revel-gold/20 flex items-center justify-center flex-shrink-0">
          <span class="text-revel-gold text-xs font-bold">{{ initials }}</span>
        </div>
        <div class="min-w-0">
          <p class="text-sm font-medium text-white truncate">{{ auth.user?.name }}</p>
          <p class="text-xs text-white/40 truncate">{{ roleLabel }}</p>
        </div>
      </div>
      <button
        :class="['sidebar-link w-full text-red-400/70 hover:text-red-400 hover:bg-red-500/5', !ui.sidebarOpen ? 'justify-center' : '']"
        @click="handleLogout"
      >
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <Transition name="fade-quick">
          <span v-if="ui.sidebarOpen">Cerrar sesión</span>
        </Transition>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useUiStore } from '~/stores/ui'
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '~/composables/useAuth'

const ui = useUiStore()
const auth = useAuthStore()
const { logout } = useAuth()
const route = useRoute()

// Cerrar drawer al navegar en móvil
watch(() => route.path, () => {
  if (import.meta.client && window.innerWidth < 1024) {
    ui.sidebarOpen = false
  }
})

const initials = computed(() =>
  auth.user?.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('') ?? 'R',
)

const roleLabel = computed(() => {
  const map: Record<string, string> = {
    ADMIN: 'Administrador',
    ENCARGADO: 'Encargado',
    ORGANIZER: 'Organizador',
    SCANNER: 'Escáner',
    SCREEN: 'Pantalla',
  }
  return map[auth.user?.role ?? ''] ?? auth.user?.role ?? ''
})

function canAccess(roles?: string[]) {
  if (!roles) return true
  return roles.includes(auth.user?.role ?? '')
}

async function handleLogout() {
  await logout()
}

const IconHome = defineComponent({
  render: () =>
    h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' }),
    ]),
})
const IconCalendar = defineComponent({
  render: () =>
    h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }),
    ]),
})
const IconUsers = defineComponent({
  render: () =>
    h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }),
    ]),
})
const IconGrid = defineComponent({
  render: () =>
    h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' }),
    ]),
})
const IconPhoto = defineComponent({
  render: () =>
    h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' }),
    ]),
})
const IconQr = defineComponent({
  render: () =>
    h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z' }),
    ]),
})
const IconCog = defineComponent({
  render: () =>
    h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' }),
    ]),
})
const IconBox = defineComponent({
  render: () =>
    h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' }),
    ]),
})
const IconUsers2 = defineComponent({
  render: () =>
    h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' }),
    ]),
})
const IconBuilding = defineComponent({
  render: () =>
    h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }),
    ]),
})

const navGroups = [
  {
    label: 'Principal',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: IconHome, roles: ['ADMIN', 'ENCARGADO', 'ORGANIZER'] },
      { to: '/dashboard/events', label: 'Eventos', icon: IconCalendar, roles: ['ADMIN', 'ENCARGADO', 'ORGANIZER'] },
    ],
  },
  {
    label: 'Gestión',
    items: [
      { to: '/dashboard/guests', label: 'Invitados', icon: IconUsers, roles: ['ADMIN', 'ENCARGADO', 'ORGANIZER'] },
      { to: '/dashboard/tables', label: 'Mesas', icon: IconGrid, roles: ['ADMIN', 'ENCARGADO', 'ORGANIZER'] },
      { to: '/dashboard/album', label: 'Álbum', icon: IconPhoto, roles: ['ADMIN', 'ENCARGADO', 'ORGANIZER'] },
      { to: '/dashboard/qr', label: 'Escáner QR', icon: IconQr, roles: ['ADMIN', 'ENCARGADO', 'ORGANIZER', 'SCANNER'] },
      { to: '/dashboard/suppliers', label: 'Proveedores', icon: IconBox, roles: ['ADMIN', 'ENCARGADO', 'ORGANIZER'] },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { to: '/dashboard/companies', label: 'Empresas', icon: IconBuilding, roles: ['ADMIN'] },
      { to: '/dashboard/users', label: 'Usuarios', icon: IconUsers2, roles: ['ADMIN', 'ENCARGADO'] },
    ],
  },
]
</script>

<style scoped>
.fade-quick-enter-active,
.fade-quick-leave-active {
  transition: opacity 0.15s ease;
}
.fade-quick-enter-from,
.fade-quick-leave-to {
  opacity: 0;
}
</style>
