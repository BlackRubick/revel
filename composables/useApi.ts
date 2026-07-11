import { useAuthStore } from '~/stores/auth'

export function useApi() {
  const auth = useAuthStore()

  function getHeaders(): Record<string, string> {
    return auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}
  }

  async function get<T>(url: string, query?: Record<string, unknown>): Promise<T> {
    return apiFetch<T>(url, { query })
  }

  async function post<T>(url: string, body: unknown): Promise<T> {
    return apiFetch<T>(url, { method: 'POST', body: body as Record<string, unknown> })
  }

  async function put<T>(url: string, body: unknown): Promise<T> {
    return apiFetch<T>(url, { method: 'PUT', body: body as Record<string, unknown> })
  }

  async function del<T>(url: string): Promise<T> {
    return apiFetch<T>(url, { method: 'DELETE' })
  }

  return { get, post, put, del, getHeaders }
}
