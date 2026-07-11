<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-700',
      scrolled
        ? 'bg-[#0a0a0a]/80 backdrop-blur-2xl border-b border-white/[0.06] py-3'
        : 'py-6',
    ]"
  >
    <div class="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">

      
      <NuxtLink to="/" class="flex items-center gap-3 group">
        <div class="relative">
          <div class="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold transition-all duration-500 group-hover:shadow-gold-strong group-hover:scale-105">
            <span class="font-display font-bold text-[#0a0a0a] text-sm leading-none">R</span>
          </div>
          <div class="absolute -inset-1 bg-revel-gold/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <span class="font-display text-[1.1rem] font-semibold text-white tracking-[0.04em]">
          Rével
        </span>
      </NuxtLink>

      
      <div class="hidden md:flex items-center gap-1 bg-white/[0.04] border border-white/[0.07] rounded-full px-2 py-1.5 backdrop-blur-sm">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="px-4 py-1.5 rounded-full text-sm text-white/55 hover:text-white hover:bg-white/[0.07] transition-all duration-200 font-medium"
        >
          {{ link.label }}
        </a>
      </div>

      
      <div class="w-32" />
    </div>
  </nav>
</template>

<script setup lang="ts">
const scrolled = ref(false)

const navLinks = [
  { href: '#funcionalidades', label: 'Funcionalidades' },
  { href: '#invitaciones', label: 'Invitaciones' },
  { href: '#album', label: 'Álbum QR' },
  { href: '#planes', label: 'Precios' },
]

onMounted(() => {
  const handler = () => { scrolled.value = window.scrollY > 30 }
  window.addEventListener('scroll', handler, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', handler))
})
</script>
