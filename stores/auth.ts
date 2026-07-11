import { defineStore } from 'pinia'
import type { User } from '~/types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user && !!state.accessToken,
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isOrganizer: (state) => state.user?.role === 'ORGANIZER',
    isScanner: (state) => state.user?.role === 'SCANNER',
    isScreen: (state) => state.user?.role === 'SCREEN',
    hasRole: (state) => (role: string) => state.user?.role === role,
    hasAnyRole: (state) => (roles: string[]) => roles.includes(state.user?.role ?? ''),
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      try {
        const res = await $fetch<{ success: boolean; data: { user: User; accessToken: string; refreshToken: string } }>(
          '/api/auth/login',
          { method: 'POST', body: { email, password } },
        )
        this.user = res.data.user
        this.accessToken = res.data.accessToken
        this.refreshToken = res.data.refreshToken
        this.persist()
        return res
      } finally {
        this.loading = false
      }
    },

    async logout() {
      if (this.refreshToken) {
        await $fetch('/api/auth/logout', {
          method: 'POST',
          body: { refreshToken: this.refreshToken },
        }).catch(() => {})
      }
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      if (import.meta.client) {
        localStorage.removeItem('revel_auth')
        sessionStorage.removeItem('revel_auth')
      }
    },

    async refreshAccessToken() {
      if (!this.refreshToken) return false
      try {
        const res = await $fetch<{ success: boolean; data: { accessToken: string } }>(
          '/api/auth/refresh',
          { method: 'POST', body: { refreshToken: this.refreshToken } },
        )
        this.accessToken = res.data.accessToken
        this.persist()
        return true
      } catch {
        await this.logout()
        return false
      }
    },

    async fetchMe() {
      if (!this.accessToken) return
      try {
        const res = await $fetch<{ success: boolean; data: User }>('/api/auth/me', {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        })
        this.user = res.data
      } catch {
        await this.logout()
      }
    },

    persist() {
      if (import.meta.client) {
        const data = {
          user: this.user,
          accessToken: this.accessToken,
          refreshToken: this.refreshToken,
        }
        localStorage.setItem('revel_auth', JSON.stringify(data))
      }
    },

    restore() {
      if (import.meta.client) {
        const raw = localStorage.getItem('revel_auth')
        if (raw) {
          try {
            const data = JSON.parse(raw)
            this.user = data.user
            this.accessToken = data.accessToken
            this.refreshToken = data.refreshToken
          } catch {
            localStorage.removeItem('revel_auth')
          }
        }
      }
    },
  },
})
