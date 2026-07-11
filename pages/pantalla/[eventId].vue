<template>
  <div class="fixed inset-0 bg-revel-black overflow-hidden select-none" @dblclick="toggleFullscreen">
    
    <Transition name="bg-fade">
      <div
        v-if="currentPhoto"
        :key="'bg-' + currentPhoto.id"
        class="absolute inset-0 scale-110"
        :style="{ backgroundImage: `url(${currentPhoto.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
      />
    </Transition>
    <div class="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
    <div class="absolute inset-0 bg-hero-gradient opacity-30" />

    
    <div class="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-5">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold">
          <span class="font-display font-bold text-revel-black">R</span>
        </div>
        <div>
          <h1 class="font-display text-xl font-bold text-white">{{ eventName || 'Rével' }}</h1>
          <p class="text-revel-gold/60 text-xs">Álbum en tiempo real</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 glass-gold rounded-full px-4 py-1.5">
          <span class="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span class="text-xs text-revel-gold font-medium uppercase tracking-wider">En Vivo</span>
        </div>
        <div class="text-white/40 text-sm font-mono">{{ currentTime }}</div>
        <div class="badge-gold">{{ photos.length }} fotos</div>
      </div>
    </div>

    
    <div class="absolute inset-0 flex items-center justify-center z-10">
      <Transition :name="transitionName" mode="out-in">
        <div v-if="currentPhoto" :key="currentPhoto.id" class="relative flex items-center justify-center w-full h-full px-20 py-24">
          <img
            :src="currentPhoto.url"
            :alt="currentPhoto.caption || ''"
            class="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            style="filter: drop-shadow(0 0 60px rgba(0,0,0,0.8))"
            loading="eager"
          />
        </div>
        <div v-else :key="'empty'" class="flex flex-col items-center justify-center gap-6 text-white/30">
          <svg class="w-24 h-24" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <p class="text-xl font-display">Esperando fotos...</p>
        </div>
      </Transition>
    </div>

    
    <Transition name="info-fade">
      <div v-if="currentPhoto" :key="'info-' + currentPhoto.id" class="absolute bottom-20 left-0 right-0 z-20 px-8 flex flex-col items-center gap-1 pointer-events-none">
        <p v-if="currentPhoto.caption" class="text-white/90 text-lg font-medium text-center" style="text-shadow: 0 2px 10px rgba(0,0,0,0.8)">
          "{{ currentPhoto.caption }}"
        </p>
        <p v-if="currentPhoto.guest?.name" class="text-revel-gold/80 text-sm font-medium">
          — {{ currentPhoto.guest.name }}
        </p>
      </div>
    </Transition>

    
    <Transition name="new-photo-badge">
      <div v-if="showNewBadge" class="absolute top-20 right-8 z-30 glass-gold rounded-full px-5 py-2 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-revel-gold animate-ping" />
        <span class="text-revel-gold text-sm font-medium">Nueva foto</span>
      </div>
    </Transition>

    
    <div class="absolute bottom-0 left-0 right-0 z-20">
      
      <div v-if="messages.length" class="border-t border-white/5 px-8 py-2.5 bg-black/30">
        <div class="flex items-center gap-3">
          <svg class="w-4 h-4 text-revel-gold flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          <TransitionGroup name="ticker" tag="div" class="flex items-center gap-8 overflow-hidden">
            <span v-for="msg in messages.slice(0, 5)" :key="msg.id" class="text-sm text-white/60 whitespace-nowrap">
              <strong class="text-white/80">{{ msg.guestName }}:</strong> {{ msg.message }}
            </span>
          </TransitionGroup>
        </div>
      </div>

      
      <div class="flex items-center gap-4 px-8 py-3 bg-black/40">
        <span class="text-white/40 text-xs font-mono tabular-nums w-16">
          {{ currentIndex + 1 }} / {{ photos.length }}
        </span>
        <div class="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div
            class="h-full bg-revel-gold rounded-full transition-none"
            :style="{ width: progressWidth + '%' }"
          />
        </div>
        
        <div class="flex items-center gap-1">
          <button
            v-for="(_, i) in Math.min(photos.length, 15)"
            :key="i"
            :class="['w-1.5 h-1.5 rounded-full transition-all', i === currentIndex % 15 ? 'bg-revel-gold w-4' : 'bg-white/20 hover:bg-white/40']"
            @click.stop="goTo(i)"
          />
        </div>
      </div>
    </div>

    
    <div class="absolute top-6 right-6 z-30">
      <div :class="['w-2.5 h-2.5 rounded-full', connected ? 'bg-green-400' : 'bg-red-400']" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

import type { Photo, GuestMessage } from '~/types'

const route = useRoute()
const eventId = route.params.eventId as string

const SLIDE_DURATION = 6000

const photos = ref<Photo[]>([])
const messages = ref<GuestMessage[]>([])
const eventName = ref('')
const currentTime = ref('')
const connected = ref(false)
const currentIndex = ref(0)
const progressWidth = ref(0)
const showNewBadge = ref(false)
const transitionName = ref('slide-next')

let slideTimer: ReturnType<typeof setTimeout> | null = null
let progressTimer: ReturnType<typeof setInterval> | null = null
let progressStart = 0

const currentPhoto = computed(() => photos.value[currentIndex.value] ?? null)

function startProgress() {
  if (progressTimer) clearInterval(progressTimer)
  progressWidth.value = 0
  progressStart = Date.now()
  progressTimer = setInterval(() => {
    const elapsed = Date.now() - progressStart
    progressWidth.value = Math.min((elapsed / SLIDE_DURATION) * 100, 100)
  }, 50)
}

function scheduleNext() {
  if (slideTimer) clearTimeout(slideTimer)
  slideTimer = setTimeout(() => {
    if (photos.value.length > 1) {
      transitionName.value = 'slide-next'
      currentIndex.value = (currentIndex.value + 1) % photos.value.length
      startProgress()
      scheduleNext()
    }
  }, SLIDE_DURATION)
}

function goTo(i: number) {
  if (slideTimer) clearTimeout(slideTimer)
  transitionName.value = i > currentIndex.value ? 'slide-next' : 'slide-prev'
  currentIndex.value = i
  startProgress()
  scheduleNext()
}

import type { Socket } from 'socket.io-client'
let socket: Socket | null = null

async function loadInitialPhotos() {
  try {
    const res = await $fetch<{ success: boolean; data: Photo[] }>('/api/photos', {
      query: { eventId, limit: 50 },
    })
    photos.value = res.data.reverse()
  } catch {}
}

function updateTime() {
  currentTime.value = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
  await loadInitialPhotos()
  updateTime()
  setInterval(updateTime, 30000)

  if (photos.value.length > 0) {
    startProgress()
    scheduleNext()
  }

  if (import.meta.client) {
    const { io } = await import('socket.io-client')
    const config = useRuntimeConfig()

    socket = io(config.public.socketUrl, {
      query: { eventId },
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => { connected.value = true })
    socket.on('disconnect', () => { connected.value = false })

    socket.on('new-photo', (photo: Photo) => {
      photos.value.push(photo)

      showNewBadge.value = true
      setTimeout(() => { showNewBadge.value = false }, 3000)

      if (photos.value.length === 1) {
        startProgress()
        scheduleNext()
      }
    })

    socket.on('new-message', (msg: GuestMessage) => {
      messages.value.unshift(msg)
      if (messages.value.length > 10) messages.value.pop()
    })

    socket.emit('join-event', eventId)
  }
})

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}

onUnmounted(() => {
  if (socket) socket.disconnect()
  if (slideTimer) clearTimeout(slideTimer)
  if (progressTimer) clearInterval(progressTimer)
})
</script>

<style scoped>

.bg-fade-enter-active, .bg-fade-leave-active { transition: opacity 1.5s ease; }
.bg-fade-enter-from, .bg-fade-leave-to { opacity: 0; }

.slide-next-enter-active { transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-next-leave-active { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-next-enter-from { opacity: 0; transform: translateX(60px) scale(0.97); }
.slide-next-leave-to { opacity: 0; transform: translateX(-60px) scale(0.97); }

.slide-prev-enter-active { transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-prev-leave-active { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-prev-enter-from { opacity: 0; transform: translateX(-60px) scale(0.97); }
.slide-prev-leave-to { opacity: 0; transform: translateX(60px) scale(0.97); }

.info-fade-enter-active { transition: all 0.6s ease 0.4s; }
.info-fade-leave-active { transition: all 0.3s ease; }
.info-fade-enter-from { opacity: 0; transform: translateY(10px); }
.info-fade-leave-to { opacity: 0; }

.new-photo-badge-enter-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.new-photo-badge-leave-active { transition: all 0.3s ease; }
.new-photo-badge-enter-from { opacity: 0; transform: scale(0.7) translateY(-10px); }
.new-photo-badge-leave-to { opacity: 0; transform: scale(0.9); }

.ticker-enter-active { transition: all 0.4s ease; }
.ticker-enter-from { opacity: 0; transform: translateY(-8px); }
.ticker-leave-active { transition: all 0.3s ease; }
.ticker-leave-to { opacity: 0; }
</style>
