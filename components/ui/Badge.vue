<template>
  <span :class="['inline-flex items-center gap-1.5', variantClass, sizeClass]">
    <span v-if="dot" :class="['w-1.5 h-1.5 rounded-full', dotColor]" />
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'gold' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
    size?: 'sm' | 'md'
    dot?: boolean
  }>(),
  { variant: 'neutral', size: 'md' },
)

const variantClass = computed(() => {
  const map: Record<string, string> = {
    gold: 'badge-gold',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-medium uppercase tracking-wide',
    neutral:
      'bg-white/5 text-white/60 border border-white/10 px-2.5 py-0.5 rounded-full text-xs font-medium',
  }
  return map[props.variant]
})

const sizeClass = computed(() => (props.size === 'sm' ? 'text-xs' : 'text-xs'))

const dotColor = computed(() => {
  const map: Record<string, string> = {
    gold: 'bg-revel-gold',
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    danger: 'bg-red-400',
    info: 'bg-blue-400',
    neutral: 'bg-white/40',
  }
  return map[props.variant]
})
</script>
