<template>
  <div class="card-revel p-5">
    <div class="flex items-start justify-between mb-4">
      <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', iconBg]">
        <slot name="icon" />
      </div>
      <UiBadge v-if="trend !== undefined" :variant="trend >= 0 ? 'success' : 'danger'">
        {{ trend >= 0 ? '+' : '' }}{{ trend }}%
      </UiBadge>
    </div>
    <div class="stat-number mb-1">{{ formattedValue }}</div>
    <p class="text-sm text-white/50">{{ label }}</p>
    <p v-if="sublabel" class="text-xs text-white/30 mt-0.5">{{ sublabel }}</p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: number | string
    label: string
    sublabel?: string
    trend?: number
    prefix?: string
    suffix?: string
    iconBg?: string
  }>(),
  { iconBg: 'bg-revel-gold/10' },
)

const formattedValue = computed(() => {
  const v = typeof props.value === 'number' ? props.value.toLocaleString('es-MX') : props.value
  return `${props.prefix ?? ''}${v}${props.suffix ?? ''}`
})
</script>
