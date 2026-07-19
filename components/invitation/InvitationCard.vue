<template>
  <component
    :is="templateComponent"
    :event="event"
    :guest="guest"
    :code="code"
  >
    <template #actions>
      <slot name="actions" />
    </template>
  </component>
</template>

<script setup lang="ts">
import TemplateClassic    from './TemplateClassic.vue'
import TemplateElegante   from './TemplateElegante.vue'
import TemplateFiesta     from './TemplateFiesta.vue'
import TemplateRomantico  from './TemplateRomantico.vue'
import TemplateMinimalista from './TemplateMinimalista.vue'
import TemplateEsmeralda  from './TemplateEsmeralda.vue'

const props = defineProps<{
  templateId?: string | null
  event: { name: string; date: string; time: string; venue: string; venueAddress?: string|null; venueMapUrl?: string|null; coverImage?: string|null; type: string; churchName?: string|null; churchAddress?: string|null }
  guest?: { name: string; companions: number; rsvpStatus: string; table?: { name: string; number: number }|null }
  code?: string
}>()

const TEMPLATES: Record<string, Component> = {
  classic:      TemplateClassic,
  elegante:     TemplateElegante,
  fiesta:       TemplateFiesta,
  romantico:    TemplateRomantico,
  minimalista:  TemplateMinimalista,
  esmeralda:    TemplateEsmeralda,
}

const templateComponent = computed(() => TEMPLATES[props.templateId ?? 'classic'] ?? TemplateClassic)
</script>
