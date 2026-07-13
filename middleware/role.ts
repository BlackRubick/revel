import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const auth = useAuthStore()
  const role = auth.user?.role ?? ''

  if (role === 'SCANNER' && to.path.startsWith('/dashboard') && to.path !== '/dashboard/qr') {
    return navigateTo('/dashboard/qr')
  }

  const roleRoutes: Record<string, string[]> = {
    '/dashboard': ['ADMIN', 'ORGANIZER', 'SCANNER'],
    '/scanner': ['ADMIN', 'SCANNER'],
    '/pantalla': ['ADMIN', 'SCREEN', 'ORGANIZER'],
  }

  for (const [route, roles] of Object.entries(roleRoutes)) {
    if (to.path.startsWith(route) && !roles.includes(role)) {
      return navigateTo('/login-magic')
    }
  }
})
