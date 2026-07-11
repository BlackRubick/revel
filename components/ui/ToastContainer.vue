<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in ui.toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto min-w-72 max-w-sm glass-dark rounded-xl border shadow-card px-4 py-3.5 flex items-start gap-3',
            toastBorder(toast.type),
          ]"
        >
          <div :class="['w-5 h-5 mt-0.5 flex-shrink-0', iconColor(toast.type)]">
            <svg v-if="toast.type === 'success'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else-if="toast.type === 'error'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg v-else-if="toast.type === 'warning'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-white">{{ toast.title }}</p>
            <p v-if="toast.message" class="mt-0.5 text-xs text-white/60">{{ toast.message }}</p>
          </div>
          <button
            class="text-white/30 hover:text-white/70 transition-colors"
            @click="ui.removeToast(toast.id)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useUiStore } from '~/stores/ui'

const ui = useUiStore()

function toastBorder(type: string) {
  const map: Record<string, string> = {
    success: 'border-green-500/20',
    error: 'border-red-500/20',
    warning: 'border-yellow-500/20',
    info: 'border-blue-500/20',
  }
  return map[type] ?? 'border-white/8'
}

function iconColor(type: string) {
  const map: Record<string, string> = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  }
  return map[type] ?? 'text-white/60'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
