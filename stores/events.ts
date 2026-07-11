import { defineStore } from 'pinia'
import type { Event, PaginatedResponse } from '~/types'

interface EventState {
  events: Event[]
  currentEvent: Event | null
  total: number
  page: number
  loading: boolean
  error: string | null
}

export const useEventsStore = defineStore('events', {
  state: (): EventState => ({
    events: [],
    currentEvent: null,
    total: 0,
    page: 1,
    loading: false,
    error: null,
  }),

  getters: {
    activeEvents: (state) => state.events.filter((e) => e.status === 'ACTIVE'),
    draftEvents: (state) => state.events.filter((e) => e.status === 'DRAFT'),
  },

  actions: {
    async fetchEvents(params: Record<string, unknown> = {}) {
      this.loading = true
      this.error = null
      try {
        const res = await apiFetch<PaginatedResponse<Event> & { success: boolean }>('/api/events', { query: params })
        this.events = res.data
        this.total = res.total
        this.page = res.page
      } catch (e: unknown) {
        this.error = (e as Error).message
      } finally {
        this.loading = false
      }
    },

    async fetchEvent(id: string) {
      this.loading = true
      this.error = null
      try {
        const res = await apiFetch<{ success: boolean; data: Event }>(`/api/events/${id}`)
        this.currentEvent = res.data
        return res.data
      } catch (e: unknown) {
        this.error = (e as Error).message
        return null
      } finally {
        this.loading = false
      }
    },

    async createEvent(data: Record<string, unknown>) {
      this.loading = true
      try {
        const res = await apiFetch<{ success: boolean; data: Event }>('/api/events', { method: 'POST', body: data })
        this.events.unshift(res.data)
        return res.data
      } finally {
        this.loading = false
      }
    },

    async updateEvent(id: string, data: Record<string, unknown>) {
      const res = await apiFetch<{ success: boolean; data: Event }>(`/api/events/${id}`, { method: 'PUT', body: data })
      const idx = this.events.findIndex((e) => e.id === id)
      if (idx !== -1) this.events[idx] = res.data
      if (this.currentEvent?.id === id) this.currentEvent = res.data
      return res.data
    },

    async deleteEvent(id: string) {
      await apiFetch(`/api/events/${id}`, { method: 'DELETE' })
      this.events = this.events.filter((e) => e.id !== id)
    },
  },
})
