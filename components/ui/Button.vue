<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[baseClasses, variantClasses, sizeClasses, { 'opacity-60 cursor-not-allowed': disabled || loading }]"
    v-bind="$attrs"
  >
    <span v-if="loading" class="inline-flex items-center gap-2">
      <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span>{{ loadingText || 'Cargando...' }}</span>
    </span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    loadingText?: string
  }>(),
  { variant: 'primary', size: 'md', type: 'button' },
)

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-revel-gold/50'

const variantClasses = computed(() => {
  const map = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger:
      'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40',
  }
  return map[props.variant]
})

const sizeClasses = computed(() => {
  const map = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
  }
  return map[props.size]
})
</script>
