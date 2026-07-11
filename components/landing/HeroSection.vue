<template>
  <section class="relative min-h-screen flex flex-col items-center justify-center">

    
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full"
        style="background: radial-gradient(circle, rgba(212,175,55,0.09) 0%, transparent 70%); animation: glow-pulse 6s ease-in-out infinite;" />
      <div class="absolute top-1/3 -left-40 w-[600px] h-[600px] rounded-full"
        style="background: radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 60%); animation: orb-drift 20s ease-in-out infinite;" />
      <div class="absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full"
        style="background: radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 60%); animation: orb-drift 16s ease-in-out infinite reverse; animation-delay: 4s" />
      <div class="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full"
        style="background: radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 60%); animation: float2 10s ease-in-out infinite; animation-delay: 2s" />
    </div>

    
    <div class="absolute inset-0 opacity-[0.018] pointer-events-none"
      style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 512 512%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E'); background-size: 200px 200px" />

    
    <div class="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-20 text-center">

      
      <div ref="el0" class="inline-flex items-center gap-2.5 mb-10 opacity-0 translate-y-6">
        <div class="flex items-center gap-2 bg-white/[0.05] border border-revel-gold/25 rounded-full pl-1 pr-4 py-1">
          <span class="flex h-5 w-5 items-center justify-center rounded-full bg-revel-gold/20">
            <span class="w-1.5 h-1.5 rounded-full bg-revel-gold animate-pulse" />
          </span>
          <span class="text-xs font-semibold text-revel-gold tracking-widest uppercase">
            Plataforma de Eventos
          </span>
        </div>
      </div>

      
      <h1 ref="el1" class="opacity-0 translate-y-8">
        <span class="block font-display text-[clamp(3rem,8vw,6.5rem)] font-bold text-white leading-[1.02] tracking-[-0.02em] mb-2">
          Organiza el evento
        </span>
        <span class="block font-display text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[1.02] tracking-[-0.02em]"
          style="background: linear-gradient(135deg, #d4af37 0%, #f0d060 40%, #c49b20 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          que todos recordarán.
        </span>
      </h1>

      
      <p ref="el2" class="mt-8 text-[1.2rem] sm:text-[1.35rem] text-white/50 max-w-2xl mx-auto leading-[1.7] font-light opacity-0 translate-y-6">
        Gestión de invitados, mesas, confirmaciones y álbum digital 
        todo en una sola plataforma diseñada para los momentos que importan.
      </p>

      
      <div ref="el3" class="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 translate-y-6">
        <a
          href="#planes"
          class="group relative inline-flex items-center gap-3 font-semibold text-[#0a0a0a] text-[1rem] px-8 py-4 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-gold-strong"
          style="background: linear-gradient(135deg, #d4af37 0%, #f0d060 50%, #c49b20 100%)"
        >
          <span class="relative z-10">Comenzar ahora</span>
          <span class="relative z-10 w-5 h-5 rounded-full bg-[#0a0a0a]/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
            <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style="background: linear-gradient(135deg, #e8c84a 0%, #f5e070 50%, #d4af37 100%)" />
        </a>

        <a
          href="#funcionalidades"
          class="group inline-flex items-center gap-2.5 font-medium text-white/70 text-[1rem] px-7 py-4 rounded-2xl border border-white/[0.1] hover:border-white/25 hover:text-white hover:bg-white/[0.04] transition-all duration-300"
        >
          Ver funcionalidades
          <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>

      
      <div ref="el4" class="mt-20 opacity-0 translate-y-6">
        <div class="inline-flex flex-col sm:flex-row items-center gap-0 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08] bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden backdrop-blur-sm">
          <div v-for="(stat, i) in stats" :key="stat.label" class="flex flex-col items-center px-10 py-6">
            <span
              class="font-display text-4xl font-bold"
              style="background: linear-gradient(135deg, #d4af37, #f0d060); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"
            >
              {{ stat.value }}
            </span>
            <span class="mt-1 text-xs font-medium text-white/35 tracking-widest uppercase">
              {{ stat.label }}
            </span>
          </div>
        </div>
      </div>
    </div>

    
    <div ref="el5" class="relative z-10 w-full max-w-5xl mx-auto px-6 pb-28 opacity-0 translate-y-10">
      <div class="grid grid-cols-3 gap-4 sm:gap-6">
        <div
          v-for="(card, i) in floatingCards"
          :key="card.label"
          :class="['rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300 cursor-default', i === 1 ? '-mt-4 sm:-mt-8' : '']"
          :style="`background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%); border-color: rgba(212,175,55,${i===1?'0.25':'0.1'}); animation: float ${5 + i}s ease-in-out infinite; animation-delay: ${i * 0.8}s; box-shadow: 0 0 ${i===1?'30px':'0px'} rgba(212,175,55,${i===1?'0.08':'0'});`"
          @mousemove="tiltCard($event, i)"
          @mouseleave="resetCard(i)"
          :ref="el => cardRefs[i] = el as HTMLElement"
        >
          <div class="mb-3 text-revel-gold" v-html="card.svg" />
          <div class="text-xs font-semibold text-white/70 mb-0.5">{{ card.label }}</div>
          <div class="text-xs text-white/30">{{ card.sub }}</div>
          
          <div v-if="card.progress" class="mt-3 h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              class="h-full rounded-full"
              :style="`width: ${card.progress}%; background: linear-gradient(90deg, #d4af37, #f0d060);`"
            />
          </div>
          <div v-if="card.badge" class="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold text-green-400 bg-green-400/10 rounded-full px-2 py-0.5">
            <span class="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
            {{ card.badge }}
          </div>
        </div>
      </div>
    </div>

    
    <div class="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
      style="background: linear-gradient(to bottom, transparent, #0a0a0a)" />
  </section>
</template>

<script setup lang="ts">
const el0 = ref<HTMLElement>()
const el1 = ref<HTMLElement>()
const el2 = ref<HTMLElement>()
const el3 = ref<HTMLElement>()
const el4 = ref<HTMLElement>()
const el5 = ref<HTMLElement>()

const stats = [
  { value: '500+', label: 'Eventos realizados' },
  { value: '12k+', label: 'Invitados gestionados' },
  { value: '100%', label: 'Satisfacción' },
]

const floatingCards = [
  {
    svg: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    label: '248 confirmaciones', sub: 'RSVP en tiempo real', progress: 82,
  },
  {
    svg: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    label: 'Álbum digital activo', sub: '1,240 fotos subidas', badge: 'En vivo',
  },
  {
    svg: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',
    label: 'Mesas asignadas', sub: '28 de 30 mesas llenas', progress: 93,
  },
]

const cardRefs: HTMLElement[] = []

function tiltCard(e: MouseEvent, i: number) {
  const el = cardRefs[i]
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  el.style.transform = `perspective(600px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale(1.03)`
  el.style.boxShadow = `${-x * 20}px ${-y * 20}px 40px rgba(212,175,55,0.12)`
}

function resetCard(i: number) {
  const el = cardRefs[i]
  if (!el) return
  el.style.transform = ''
  el.style.boxShadow = ''
}

function animateIn(el: HTMLElement | undefined, delay: number) {
  if (!el) return
  el.style.transition = `opacity 1.4s ease ${delay}ms, transform 1.4s ease ${delay}ms`
  requestAnimationFrame(() => {
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
  })
}

onMounted(() => {
  const pairs: [HTMLElement | undefined, number][] = [
    [el0.value, 100],
    [el1.value, 280],
    [el2.value, 500],
    [el3.value, 680],
    [el4.value, 880],
    [el5.value, 1080],
  ]
  pairs.forEach(([el, delay]) => animateIn(el, delay))
})
</script>
