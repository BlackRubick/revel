<template>
  <div class="min-h-screen bg-revel-black flex items-center justify-center relative overflow-hidden">

    <!-- Efectos canvas: estrellas, brillantina dorada y estrellas fugaces -->
    <LandingEffects no-mobile />

    <!-- Gradiente de fondo -->
    <div class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 50% 100%, rgba(10,10,20,0.8) 0%, transparent 70%)"
    />

    <!-- Orbes dorados ambientales -->
    <div class="absolute top-1/3 -left-40 w-[28rem] h-[28rem] bg-revel-gold/4 rounded-full blur-[100px] pointer-events-none" />
    <div class="absolute bottom-1/3 -right-40 w-[28rem] h-[28rem] bg-revel-gold/3 rounded-full blur-[100px] pointer-events-none" />
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-revel-gold/20 to-transparent pointer-events-none" />

    <!-- Logo -->
    <NuxtLink to="/" class="absolute top-8 left-8 flex items-center gap-3 group z-20">
      <div class="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold group-hover:shadow-gold-strong transition-shadow duration-300">
        <span class="text-revel-black font-display font-bold text-sm">R</span>
      </div>
      <span class="font-display text-xl font-semibold text-white tracking-wide group-hover:text-revel-gold-light transition-colors duration-300">Rével</span>
    </NuxtLink>

    <div class="relative z-10 w-full max-w-md px-6">
      <slot />
    </div>
  </div>
</template>
