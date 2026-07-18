import { defineStore } from 'pinia'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

interface UiState {
  sidebarOpen: boolean
  toasts: Toast[]
  loading: Record<string, boolean>
  modals: Record<string, boolean>
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    sidebarOpen: false,
    toasts: [],
    loading: {},
    modals: {},
  }),

  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    showToast(toast: Omit<Toast, 'id'>) {
      const id = Math.random().toString(36).slice(2)
      this.toasts.push({ ...toast, id })
      setTimeout(() => this.removeToast(id), toast.duration ?? 4000)
    },

    removeToast(id: string) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    },

    success(title: string, message?: string) {
      this.showToast({ type: 'success', title, message })
    },

    error(title: string, message?: string) {
      this.showToast({ type: 'error', title, message, duration: 6000 })
    },

    warning(title: string, message?: string) {
      this.showToast({ type: 'warning', title, message })
    },

    setLoading(key: string, value: boolean) {
      this.loading[key] = value
    },

    openModal(key: string) {
      this.modals[key] = true
    },

    closeModal(key: string) {
      this.modals[key] = false
    },

    isModalOpen(key: string) {
      return this.modals[key] ?? false
    },
  },
})
