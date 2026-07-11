<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-white/70 mb-1.5">
      {{ label }}
      <span v-if="required" class="text-revel-gold ml-0.5">*</span>
    </label>
    <div class="relative">
      <div v-if="$slots.prefix" class="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
        <slot name="prefix" />
      </div>
      <input
        :id="id"
        v-bind="$attrs"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'input-revel',
          error ? 'error' : '',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
        ]"
        :style="{
          paddingLeft: $slots.prefix ? '2.75rem' : undefined,
          paddingRight: $slots.suffix ? '2.75rem' : undefined,
        }"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <div v-if="$slots.suffix" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
        <slot name="suffix" />
      </div>
    </div>
    <p v-if="error" class="mt-1.5 text-xs text-red-400">{{ error }}</p>
    <p v-else-if="hint" class="mt-1.5 text-xs text-white/40">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    modelValue?: string | number
    label?: string
    id?: string
    type?: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
    error?: string
    hint?: string
  }>(),
  { type: 'text' },
)

defineEmits(['update:modelValue'])
</script>
