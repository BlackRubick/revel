<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-medium text-white/70 mb-1.5">
      {{ label }}
      <span v-if="required" class="text-revel-gold ml-0.5">*</span>
    </label>
    <select
      :value="modelValue"
      :disabled="disabled"
      :class="[
        'input-revel appearance-none cursor-pointer',
        error ? 'error' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ]"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
    <p v-if="error" class="mt-1.5 text-xs text-red-400">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string | number
  label?: string
  placeholder?: string
  options: { label: string; value: string | number }[]
  disabled?: boolean
  required?: boolean
  error?: string
}>()

defineEmits(['update:modelValue'])
</script>
