<template>
  <div class="min-h-screen bg-revel-black flex items-center justify-center p-6">
    <div class="text-center max-w-md">
      <div class="font-display text-8xl font-bold text-gradient-gold mb-4">
        {{ error?.statusCode || '500' }}
      </div>
      <h1 class="font-display text-2xl font-bold text-white mb-3">
        {{ error?.statusCode === 404 ? 'Página no encontrada' : 'Algo salió mal' }}
      </h1>
      <p class="text-white/50 text-sm mb-8">
        {{ error?.message || 'Ha ocurrido un error inesperado. Inténtalo de nuevo.' }}
      </p>
      <button class="btn-primary" @click="clearError({ redirect: '/' })">
        Volver al inicio
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ error: { statusCode?: number; message?: string } | null }>()
</script>
