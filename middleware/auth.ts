import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  if (import.meta.client) {
    auth.restore()
  }

  const publicRoutes = ['/', '/login-magic', '/confirmar', '/evento', '/album', '/scanner-public']
  const isPublic = publicRoutes.some((r) => to.path === r || to.path.startsWith(r + '/'))

  if (!isPublic && !auth.isAuthenticated) {
    return navigateTo('/login-magic')
  }

  if (auth.isAuthenticated && to.path === '/login-magic') {
    const redirectMap: Record<string, string> = {
      ADMIN: '/dashboard',
      ENCARGADO: '/dashboard',
      ORGANIZER: '/dashboard',
      SCANNER: '/scanner',
      SCREEN: '/pantalla',
    }
    return navigateTo(redirectMap[auth.user?.role ?? ''] ?? '/dashboard')
  }
})
