import { defineStore } from 'pinia'
import type { Guest } from '~/types'

interface GuestState {
  guests: Guest[]
  total: number
  loading: boolean
  error: string | null
}

export const useGuestsStore = defineStore('guests', {
  state: (): GuestState => ({
    guests: [],
    total: 0,
    loading: false,
    error: null,
  }),

  getters: {
    confirmed: (state) => state.guests.filter((g) => g.rsvpStatus === 'CONFIRMED'),
    pending: (state) => state.guests.filter((g) => g.rsvpStatus === 'PENDING'),
    declined: (state) => state.guests.filter((g) => g.rsvpStatus === 'DECLINED'),
    checkedIn: (state) => state.guests.filter((g) => g.checkedIn),
    totalAttendees: (state) =>
      state.guests
        .filter((g) => g.rsvpStatus === 'CONFIRMED')
        .reduce((sum, g) => sum + 1 + g.companions, 0),
  },

  actions: {
    async fetchGuests(eventId: string, params: Record<string, unknown> = {}) {
      this.loading = true
      this.error = null
      try {
        const res = await apiFetch<{ success: boolean; data: Guest[]; total: number }>(
          '/api/guests',
          { query: { eventId, ...params } },
        )
        this.guests = res.data
        this.total = res.total
      } catch (e: unknown) {
        this.error = (e as Error).message
      } finally {
        this.loading = false
      }
    },

    async createGuest(data: Record<string, unknown>) {
      const res = await apiFetch<{ success: boolean; data: Guest }>('/api/guests', { method: 'POST', body: data })
      this.guests.push(res.data)
      this.total++
      return res.data
    },

    async updateGuest(id: string, data: Record<string, unknown>) {
      const res = await apiFetch<{ success: boolean; data: Guest }>(`/api/guests/${id}`, { method: 'PUT', body: data })
      const idx = this.guests.findIndex((g) => g.id === id)
      if (idx !== -1) this.guests[idx] = res.data
      return res.data
    },

    async deleteGuest(id: string) {
      await apiFetch(`/api/guests/${id}`, { method: 'DELETE' })
      this.guests = this.guests.filter((g) => g.id !== id)
      this.total--
    },

    async assignTable(guestId: string, tableId: string | null) {
      const res = await apiFetch<{ success: boolean; data: Guest }>('/api/tables/assign', {
        method: 'POST',
        body: { guestId, tableId },
      })
      const idx = this.guests.findIndex((g) => g.id === guestId)
      if (idx !== -1) this.guests[idx] = res.data
      return res.data
    },
  },
})
