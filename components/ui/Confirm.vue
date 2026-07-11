<template>
  <UiModal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" :title="title" size="sm">
    <p class="text-white/70 text-sm">{{ message }}</p>
    <template #footer>
      <UiButton variant="ghost" size="sm" @click="$emit('update:modelValue', false)">
        Cancelar
      </UiButton>
      <UiButton :variant="danger ? 'danger' : 'primary'" size="sm" :loading="loading" @click="$emit('confirm')">
        {{ confirmText || 'Confirmar' }}
      </UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title?: string
  message?: string
  confirmText?: string
  danger?: boolean
  loading?: boolean
}>()

defineEmits(['update:modelValue', 'confirm'])
</script>
