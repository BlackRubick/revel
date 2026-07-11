<template>
  <footer class="relative pt-24 pb-12 overflow-hidden">

    <div class="absolute top-0 left-0 right-0 h-px"
      style="background: linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)" />

    <div class="max-w-7xl mx-auto px-6 lg:px-8">

      
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-16">
        
        <div class="col-span-2 sm:col-span-1">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold">
              <span class="font-display font-bold text-[#0a0a0a] text-sm">R</span>
            </div>
            <span class="font-display text-lg font-semibold text-white tracking-wide">Rével</span>
          </div>
          <p class="text-white/35 text-sm leading-relaxed max-w-[200px]">
            Plataforma para organización profesional de eventos.
          </p>
        </div>

        <div v-for="group in linkGroups" :key="group.title">
          <h4 class="text-white/60 text-xs font-bold uppercase tracking-[0.12em] mb-4">{{ group.title }}</h4>
          <ul class="space-y-3">
            <li v-for="link in group.links" :key="link.label">
              <a :href="link.href" class="text-white/35 text-sm hover:text-revel-gold transition-colors duration-200">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
        style="border-top: 1px solid rgba(255,255,255,0.05)">
        <p class="text-white/20 text-sm">
          © {{ new Date().getFullYear() }} Rével. Todos los derechos reservados.
        </p>
        <p class="text-white/15 text-xs">
          Hecho  por Sieeg y equipo
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const linkGroups = [
  {
    title: 'Plataforma',
    links: [
      { href: '#funcionalidades', label: 'Funcionalidades' },
      { href: '#planes', label: 'Precios' },
      { href: '/login-magic', label: 'Iniciar sesión' },
      { href: '/login-magic', label: 'Registro' },
    ],
  },
  {
    title: 'Producto',
    links: [
      { href: '#invitaciones', label: 'Invitaciones' },
      { href: '#album', label: 'Álbum QR' },
      { href: '#', label: 'Proyección en vivo' },
      { href: '#', label: 'Gestión de mesas' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '#', label: 'Términos de uso' },
      { href: '#', label: 'Privacidad' },
      { href: '#', label: 'Cookies' },
    ],
  },
]
</script>
