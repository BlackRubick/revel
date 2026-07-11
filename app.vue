<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UiToastContainer />
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: { class: 'dark', lang: 'es' },
})
</script>
