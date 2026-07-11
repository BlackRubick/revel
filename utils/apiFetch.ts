import { useAuthStore } from '~/stores/auth'

let _refreshing: Promise<boolean> | null = null

export async function apiFetch<T>(url: string, options: Parameters<typeof $fetch>[1] = {}): Promise<T> {
  const auth = useAuthStore()

  const headers = () =>
    auth.accessToken
      ? { Authorization: `Bearer ${auth.accessToken}`, ...(options.headers as Record<string, string> || {}) }
      : { ...(options.headers as Record<string, string> || {}) }

  try {
    return await $fetch<T>(url, { ...options, headers: headers() })
  } catch (err: unknown) {
    const status =
      (err as { status?: number })?.status ??
      (err as { statusCode?: number })?.statusCode

    if (status === 401 && auth.refreshToken) {
      if (!_refreshing) {
        _refreshing = auth.refreshAccessToken().finally(() => { _refreshing = null })
      }
      const ok = await _refreshing
      if (ok) {
        return await $fetch<T>(url, { ...options, headers: headers() })
      }
      await navigateTo('/login-magic')
    }
    throw err
  }
}
