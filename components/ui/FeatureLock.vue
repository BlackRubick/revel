<template>
  <div class="relative">
    <div class="pointer-events-none select-none" :class="blurContent ? 'blur-sm opacity-40' : 'opacity-40'">
      <slot />
    </div>
    <div class="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
      <div class="glass-dark rounded-2xl px-4 py-3 flex flex-col items-center gap-1.5 border border-revel-gold/20 shadow-lg">
        <svg class="w-5 h-5 text-revel-gold" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
        </svg>
        <p class="text-white text-xs font-semibold text-center">{{ label }}</p>
        <p class="text-white/50 text-[10px] text-center">Disponible desde el plan <strong class="text-revel-gold">{{ minPlan }}</strong></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  minPlan: string
  blurContent?: boolean
}>()
</script>
