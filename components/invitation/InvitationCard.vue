<template>
  <!-- New config-driven designs (IDs like w1, xv1, b1 ...) -->
  <TemplateUniversal
    v-if="isNewDesign"
    :design-id="props.templateId!"
    :event="event"
    :guest="guest"
    :code="code"
  >
    <template #actions><slot name="actions"/></template>
  </TemplateUniversal>

  <!-- Legacy designs (classic, elegante, fiesta, romantico, minimalista, esmeralda) -->
  <component
    v-else
    :is="legacyComponent"
    :event="event"
    :guest="guest"
    :code="code"
  >
    <template #actions><slot name="actions"/></template>
  </component>
</template>

<script setup lang="ts">
import TemplateClassic     from './TemplateClassic.vue'
import TemplateElegante    from './TemplateElegante.vue'
import TemplateFiesta      from './TemplateFiesta.vue'
import TemplateRomantico   from './TemplateRomantico.vue'
import TemplateMinimalista from './TemplateMinimalista.vue'
import TemplateEsmeralda   from './TemplateEsmeralda.vue'
import TemplateUniversal   from './TemplateUniversal.vue'
import { getDesignById }   from '~/utils/invitationDesigns'

const props = defineProps<{
  templateId?: string | null
  event: { name: string; date: string; time: string; venue: string; venueAddress?: string|null; venueMapUrl?: string|null; coverImage?: string|null; type: string; churchName?: string|null; churchAddress?: string|null }
  guest?: { name: string; companions: number; rsvpStatus: string; table?: { name: string; number: number }|null }
  code?: string
}>()

const LEGACY: Record<string, Component> = {
  classic: TemplateClassic, elegante: TemplateElegante, fiesta: TemplateFiesta,
  romantico: TemplateRomantico, minimalista: TemplateMinimalista, esmeralda: TemplateEsmeralda,
}

const isNewDesign = computed(() => !!props.templateId && !!getDesignById(props.templateId))
const legacyComponent = computed(() => LEGACY[props.templateId ?? 'classic'] ?? TemplateClassic)
</script>
