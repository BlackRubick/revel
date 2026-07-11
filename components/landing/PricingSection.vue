<template>
  <section id="planes" class="relative py-36 overflow-hidden">

    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-0 left-0 right-0 h-px" style="background: linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)" />
    </div>

    <div class="max-w-7xl mx-auto px-6 lg:px-8">

      
      <div class="text-center max-w-2xl mx-auto mb-16 animate-on-scroll">
        <div class="inline-flex items-center gap-2 mb-5">
          <div class="h-px w-8 bg-revel-gold" />
          <span class="text-xs font-bold text-revel-gold tracking-[0.18em] uppercase">Precios</span>
          <div class="h-px w-8 bg-revel-gold" />
        </div>
        <h2 class="font-display text-[clamp(2.5rem,5vw,4rem)] font-bold text-white leading-[1.1] tracking-tight mb-5">
          Precio justo para cada momento
        </h2>
        <p class="text-white/45 text-lg">Precios en MXN + IVA. Sin contratos. Sin sorpresas.</p>
      </div>

      
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        <div
          v-for="(plan, i) in plans"
          :key="plan.name"
          :class="[
            'relative rounded-3xl p-7 flex flex-col animate-on-scroll transition-all duration-500',
            plan.featured
              ? 'ring-1 ring-revel-gold/40 scale-[1.03] lg:scale-[1.06]'
              : 'border border-white/[0.07] hover:border-revel-gold/20'
          ]"
          :style="[
            `transition-delay: ${i * 80}ms`,
            plan.featured
              ? 'background: linear-gradient(145deg, #1e1a08 0%, #141008 100%)'
              : 'background: linear-gradient(145deg, rgba(28,28,28,0.95) 0%, rgba(10,10,10,0.98) 100%)'
          ]"
        >
          
          <div v-if="plan.featured" class="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span class="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0a0a0a] px-3.5 py-1.5 rounded-full"
              style="background: linear-gradient(135deg, #d4af37, #f0d060)">
              MÁS POPULAR
            </span>
          </div>

          
          <div v-if="plan.featured" class="absolute inset-0 rounded-3xl pointer-events-none"
            style="box-shadow: inset 0 1px 0 rgba(212,175,55,0.15), 0 0 60px rgba(212,175,55,0.08)" />

          
          <div class="mb-6">
            <h3 :class="['font-display text-lg font-bold mb-1', plan.featured ? 'text-revel-gold' : 'text-white']">
              {{ plan.name }}
            </h3>
            <p class="text-white/35 text-xs">{{ plan.desc }}</p>
          </div>

          
          <div class="mb-7">
            <div class="flex items-baseline gap-1">
              <span v-if="!plan.custom"
                :class="['font-display text-5xl font-bold', plan.featured ? 'text-gradient-gold' : 'text-white']">
                {{ plan.price }}
              </span>
              <span v-else class="font-display text-3xl font-bold text-white/60">A medida</span>
              <span v-if="!plan.custom" class="text-white/30 text-sm">MXN</span>
            </div>
            <p v-if="!plan.custom" class="text-white/25 text-xs mt-1">+ IVA · por evento</p>
          </div>

          
          <a
            :href="`https://wa.me/${WA}?text=${plan.waMsg}`"
            target="_blank"
            rel="noopener noreferrer"
            :class="[
              'mb-7 w-full py-3.5 rounded-2xl text-sm font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2',
              plan.featured
                ? 'text-[#0a0a0a] hover:shadow-gold-strong hover:scale-[1.02]'
                : 'text-white/70 border border-white/[0.1] hover:border-revel-gold/30 hover:text-white hover:bg-revel-gold/5'
            ]"
            :style="plan.featured ? 'background: linear-gradient(135deg, #d4af37, #f0d060)' : ''"
          >
            {{ plan.cta }}
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>

          
          <div class="mb-5 h-px" style="background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)" />

          
          <ul class="space-y-3 flex-1">
            <li v-for="feat in plan.features" :key="feat" class="flex items-start gap-3 text-sm">
              <div class="flex-shrink-0 w-4 h-4 mt-0.5 rounded-full flex items-center justify-center"
                :style="plan.featured ? 'background: rgba(212,175,55,0.15)' : 'background: rgba(255,255,255,0.07)'">
                <svg :class="['w-2.5 h-2.5', plan.featured ? 'text-revel-gold' : 'text-white/50']"
                  fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span :class="plan.featured ? 'text-white/80' : 'text-white/50'">{{ feat }}</span>
            </li>
          </ul>
        </div>
      </div>

      
      <p class="text-center text-white/25 text-sm mt-10 animate-on-scroll">
        *Los precios pueden variar según las necesidades específicas de cada evento. Contáctanos para una cotización personalizada.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '~/composables/useAnimations'
useScrollReveal()

const WA = '529611238020'

const plans = [
  {
    name: 'Básico',
    desc: 'Para eventos pequeños e íntimos',
    price: '$500',
    featured: false,
    cta: 'Quiero el plan Básico',
    custom: false,
    waMsg: 'Hola%2C+me+interesa+el+plan+*Básico*+de+Rével+%28%24500+MXN%29.+¿Me+pueden+dar+más+información%3F',
    features: ['Código QR del evento', 'Invitación digital', 'Confirmación de asistencia', 'Confirmación por WhatsApp', 'Galería digital'],
  },
  {
    name: 'Intermedio',
    desc: 'Para eventos medianos con más control',
    price: '$750',
    featured: false,
    cta: 'Quiero el plan Intermedio',
    custom: false,
    waMsg: 'Hola%2C+me+interesa+el+plan+*Intermedio*+de+Rével+%28%24750+MXN%29.+¿Me+pueden+dar+más+información%3F',
    features: ['QR personalizado', 'Invitación digital interactiva', 'Confirmación vía plataforma', 'Asignación de mesas', 'Pase digital QR', 'Galería digital'],
  },
  {
    name: 'All Inclusive',
    desc: 'La experiencia completa de Rével',
    price: '$1,500',
    featured: true,
    cta: 'Quiero el plan All Inclusive',
    custom: false,
    waMsg: 'Hola%2C+me+interesa+el+plan+*All+Inclusive*+de+Rével+%28%241%2C500+MXN%29.+¿Me+pueden+dar+más+información%3F',
    features: ['Todo el plan Intermedio', 'Proyección en tiempo real', 'Acceso completo a la plataforma', 'Experiencia personalizada', 'Soporte prioritario 24h'],
  },
  {
    name: 'Empresarial',
    desc: 'Para wedding planners y agencias',
    price: '',
    featured: false,
    cta: 'Contactar por WhatsApp',
    custom: true,
    waMsg: 'Hola%2C+me+interesa+el+plan+*Empresarial*+de+Rével.+¿Me+pueden+dar+más+información+y+un+presupuesto%3F',
    features: ['Todo el plan All Inclusive', 'Múltiples eventos simultáneos', 'API dedicada y white label', 'Panel multi-cuenta', 'Soporte VIP y SLA'],
  },
]
</script>
