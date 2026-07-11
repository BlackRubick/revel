import { useAuthStore } from '~/stores/auth'
import { useUiStore } from '~/stores/ui'

export function useAuth() {
  const auth = useAuthStore()
  const ui = useUiStore()
  const router = useRouter()

  async function login(email: string, password: string) {
    try {
      await auth.login(email, password)
      ui.success('Bienvenido', `Hola, ${auth.user?.name}`)

      const redirectMap: Record<string, string> = {
        ADMIN: '/dashboard',
        ORGANIZER: '/dashboard',
        SCANNER: '/dashboard/qr',
        SCREEN: '/pantalla',
      }
      const redirect = redirectMap[auth.user?.role ?? 'ORGANIZER'] ?? '/dashboard'
      await router.push(redirect)
    } catch (e: unknown) {
      ui.error('Error de acceso', (e as { data?: { message?: string } })?.data?.message ?? 'Credenciales incorrectas')
      throw e
    }
  }

  async function logout() {
    await auth.logout()
    await router.push('/login-magic')
  }

  return { auth, login, logout }
}
