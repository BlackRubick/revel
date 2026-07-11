<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="$emit('update:modelValue', false)"
      >
        <div class="modal-overlay absolute inset-0" />
        <div
          :class="[
            'relative glass-dark rounded-2xl border border-white/8 shadow-card w-full max-h-[90vh] flex flex-col overflow-hidden',
            sizeClasses,
          ]"
        >
          
          <div
            v-if="title || $slots.header"
            class="flex items-center justify-between px-6 py-4 border-b border-white/6"
          >
            <slot name="header">
              <h2 class="font-display text-lg font-semibold text-white">{{ title }}</h2>
            </slot>
            <button
              class="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
              @click="$emit('update:modelValue', false)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          
          <div class="flex-1 overflow-y-auto px-6 py-5">
            <slot />
          </div>

          
          <div
            v-if="$slots.footer"
            class="px-6 py-4 border-t border-white/6 flex justify-end gap-3"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  { size: 'md' },
)

defineEmits(['update:modelValue'])

const sizeClasses = computed(() => {
  const map = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }
  return map[props.size]
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from :deep(.relative),
.modal-leave-to :deep(.relative) {
  transform: scale(0.96) translateY(8px);
}
</style>
