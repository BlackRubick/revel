<template>
  <div class="fixed inset-0 z-[60] bg-revel-black flex flex-col">
    <!-- Barra superior -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-white/8">
      <button class="text-white/60 hover:text-white text-sm" :disabled="saving" @click="emit('close')">Cancelar</button>
      <p class="font-display text-white text-sm font-semibold">{{ local ? 'Editar foto' : 'Dibuja y escribe' }}</p>
      <UiButton size="sm" :loading="saving" loading-text="Revisando..." :disabled="!actions.length || !!textWarning || !!nameWarning" @click="save">
        {{ local ? 'Listo' : 'Publicar' }}
      </UiButton>
    </div>

    <!-- Lienzo -->
    <div ref="stage" class="flex-1 min-h-0 flex items-center justify-center p-3 overflow-hidden">
      <div v-if="loadError" class="text-center text-white/50 text-sm max-w-xs">{{ loadError }}</div>
      <div v-else class="relative max-w-full max-h-full" :style="canvasBoxStyle">
        <canvas ref="baseCanvas" class="absolute inset-0 w-full h-full rounded-xl" />
        <canvas
          ref="drawCanvas"
          class="absolute inset-0 w-full h-full rounded-xl touch-none"
          :class="tool === 'text' ? 'cursor-text' : 'cursor-crosshair'"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @pointerleave="onPointerUp"
        />
        <div v-if="!imageReady" class="absolute inset-0 shimmer rounded-xl" />
      </div>
    </div>

    <!-- Entrada de texto -->
    <div v-if="pendingText" class="px-4 pb-2">
      <div class="flex gap-2">
        <input
          ref="textInput"
          v-model="pendingText.value"
          maxlength="120"
          placeholder="Escribe tu mensaje..."
          class="input-revel flex-1 text-sm py-2"
          @keydown.enter.prevent="commitText"
        />
        <UiButton size="sm" :disabled="!pendingText.value.trim() || !!textWarning" @click="commitText">Agregar</UiButton>
        <UiButton size="sm" variant="ghost" @click="pendingText = null">✕</UiButton>
      </div>
      <p v-if="textWarning" class="text-xs text-red-400 mt-1">{{ textWarning }}</p>
    </div>

    <!-- Herramientas -->
    <div class="border-t border-white/8 px-4 pt-3 pb-4 space-y-3">
      <div class="flex items-center gap-2 overflow-x-auto">
        <button
          v-for="t in tools"
          :key="t.id"
          :class="['px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors', tool === t.id ? 'bg-revel-gold text-revel-black' : 'bg-white/5 text-white/70 hover:bg-white/10']"
          @click="selectTool(t.id)"
        >
          {{ t.label }}
        </button>
        <div class="w-px h-6 bg-white/10 mx-1" />
        <button class="px-3 py-1.5 rounded-lg text-xs bg-white/5 text-white/70 hover:bg-white/10 disabled:opacity-30" :disabled="!actions.length" @click="undo">Deshacer</button>
        <button class="px-3 py-1.5 rounded-lg text-xs bg-white/5 text-white/70 hover:bg-white/10 disabled:opacity-30" :disabled="!actions.length" @click="clearAll">Borrar todo</button>
      </div>

      <div class="flex items-center gap-2 overflow-x-auto">
        <button
          v-for="c in palette"
          :key="c"
          :aria-label="`Color ${c}`"
          :class="['w-7 h-7 rounded-full flex-shrink-0 border-2 transition-transform', color === c ? 'border-white scale-110' : 'border-white/20']"
          :style="{ background: c }"
          @click="color = c"
        />
        <label class="w-7 h-7 rounded-full flex-shrink-0 border-2 border-white/20 overflow-hidden cursor-pointer relative" title="Otro color">
          <span class="absolute inset-0" style="background: conic-gradient(red, yellow, lime, cyan, blue, magenta, red)" />
          <input v-model="color" type="color" class="opacity-0 w-full h-full cursor-pointer" />
        </label>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-xs text-white/40 w-12">Grosor</span>
        <input v-model.number="size" type="range" min="2" max="40" class="flex-1 accent-[#d4af37]" />
        <span class="rounded-full flex-shrink-0" :style="{ width: `${Math.max(4, size / 1.5)}px`, height: `${Math.max(4, size / 1.5)}px`, background: color }" />
      </div>

      <div v-if="!local">
        <input v-model="authorName" maxlength="60" placeholder="Tu nombre (opcional)" class="input-revel w-full text-sm py-2" />
        <p v-if="nameWarning" class="text-xs text-red-400 mt-1">{{ nameWarning }}</p>
      </div>

      <p v-if="errorMsg" class="text-xs text-red-400">{{ errorMsg }}</p>
      <p v-if="!local" class="text-[11px] text-white/30">Todas las ediciones se revisan antes de publicarse. No se permiten groserías, insultos ni dibujos obscenos.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Photo } from '~/types'
import { findProfanity } from '~/utils/profanity'

// Con `photo` publica una dedicatoria sobre una foto del álbum; con `src` edita una foto
// local (antes de subirla) y devuelve el resultado en `edited`.
const props = defineProps<{ photo?: Photo; src?: string; guestCode?: string }>()
const emit = defineEmits<{ close: []; saved: [message: string]; edited: [imageBase64: string] }>()
const local = computed(() => !props.photo)

type Tool = 'brush' | 'highlighter' | 'eraser' | 'text'
type Point = { x: number; y: number }
type Action =
  | { kind: 'stroke'; tool: 'brush' | 'highlighter' | 'eraser'; color: string; size: number; points: Point[] }
  | { kind: 'text'; text: string; color: string; size: number; at: Point }

const tools: { id: Tool; label: string }[] = [
  { id: 'brush', label: '✏️ Pincel' },
  { id: 'highlighter', label: '🖍️ Marcador' },
  { id: 'text', label: '🔤 Texto' },
  { id: 'eraser', label: '🧽 Borrador' },
]
const palette = ['#ffffff', '#000000', '#d4af37', '#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']

const stage = ref<HTMLDivElement>()
const baseCanvas = ref<HTMLCanvasElement>()
const drawCanvas = ref<HTMLCanvasElement>()
const textInput = ref<HTMLInputElement>()

const tool = ref<Tool>('brush')
const color = ref('#ef4444')
const size = ref(8)
const actions = ref<Action[]>([])
const authorName = ref('')
const imageReady = ref(false)
const loadError = ref('')
const saving = ref(false)
const errorMsg = ref('')
const pendingText = ref<{ value: string; at: Point } | null>(null)
const imgSize = ref({ w: 1, h: 1 })
const stageSize = ref({ w: 1, h: 1 })

let current: Extract<Action, { kind: 'stroke' }> | null = null
let resizeObserver: ResizeObserver | null = null

const textWarning = computed(() =>
  pendingText.value && findProfanity(pendingText.value.value) ? 'Ese texto no está permitido. Escribe algo bonito 💛' : '',
)
const nameWarning = computed(() => (findProfanity(authorName.value) ? 'Ese nombre no está permitido.' : ''))

// Ajusta el lienzo al espacio disponible conservando la proporción de la foto
const canvasBoxStyle = computed(() => {
  const { w, h } = imgSize.value
  const scale = Math.min(stageSize.value.w / w, stageSize.value.h / h)
  return { width: `${Math.floor(w * scale)}px`, height: `${Math.floor(h * scale)}px` }
})

function selectTool(t: Tool) {
  tool.value = t
  if (t !== 'text') pendingText.value = null
}

function toImageCoords(e: PointerEvent): Point {
  const canvas = drawCanvas.value!
  const rect = canvas.getBoundingClientRect()
  return {
    x: ((e.clientX - rect.left) / rect.width) * canvas.width,
    y: ((e.clientY - rect.top) / rect.height) * canvas.height,
  }
}

// El grosor se expresa relativo a ~1000px para que se vea igual en cualquier resolución
function scaled(n: number) {
  return n * (Math.max(imgSize.value.w, imgSize.value.h) / 1000)
}

function drawAction(ctx: CanvasRenderingContext2D, a: Action) {
  ctx.save()
  if (a.kind === 'stroke') {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = scaled(a.tool === 'highlighter' ? a.size * 2.5 : a.size)
    ctx.strokeStyle = a.color
    ctx.globalAlpha = a.tool === 'highlighter' ? 0.35 : 1
    ctx.globalCompositeOperation = a.tool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.beginPath()
    a.points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
    if (a.points.length === 1) ctx.lineTo(a.points[0].x + 0.1, a.points[0].y)
    ctx.stroke()
  } else {
    const fontSize = scaled(a.size * 4 + 16)
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.lineWidth = fontSize / 7
    ctx.lineJoin = 'round'
    ctx.strokeStyle = isLight(a.color) ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.85)'
    ctx.strokeText(a.text, a.at.x, a.at.y)
    ctx.fillStyle = a.color
    ctx.fillText(a.text, a.at.x, a.at.y)
  }
  ctx.restore()
}

function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return r * 0.299 + g * 0.587 + b * 0.114 > 150
}

function redraw() {
  const canvas = drawCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (const a of actions.value) drawAction(ctx, a)
  if (current) drawAction(ctx, current)
}

function onPointerDown(e: PointerEvent) {
  if (!imageReady.value || saving.value) return
  const p = toImageCoords(e)
  if (tool.value === 'text') {
    pendingText.value = { value: pendingText.value?.value ?? '', at: p }
    nextTick(() => textInput.value?.focus())
    return
  }
  drawCanvas.value!.setPointerCapture(e.pointerId)
  current = { kind: 'stroke', tool: tool.value, color: color.value, size: size.value, points: [p] }
  redraw()
}

function onPointerMove(e: PointerEvent) {
  if (!current) return
  current.points.push(toImageCoords(e))
  redraw()
}

function onPointerUp() {
  if (!current) return
  actions.value.push(current)
  current = null
  redraw()
}

function commitText() {
  if (!pendingText.value || textWarning.value) return
  const text = pendingText.value.value.trim()
  if (!text) return
  actions.value.push({ kind: 'text', text, color: color.value, size: size.value, at: pendingText.value.at })
  pendingText.value = null
  redraw()
}

function undo() {
  actions.value.pop()
  redraw()
}

function clearAll() {
  actions.value = []
  redraw()
}

async function save() {
  if (pendingText.value?.value.trim()) commitText()
  if (!actions.value.length || textWarning.value || nameWarning.value) return

  saving.value = true
  errorMsg.value = ''
  try {
    const out = document.createElement('canvas')
    out.width = baseCanvas.value!.width
    out.height = baseCanvas.value!.height
    const ctx = out.getContext('2d')!
    ctx.drawImage(baseCanvas.value!, 0, 0)
    ctx.drawImage(drawCanvas.value!, 0, 0)
    const imageBase64 = out.toDataURL('image/jpeg', 0.85)
    if (local.value) {
      emit('edited', imageBase64)
      return
    }

    const texts = actions.value.filter((a): a is Extract<Action, { kind: 'text' }> => a.kind === 'text').map((a) => a.text)
    const res = await $fetch<{ message: string }>(`/api/photos/${props.photo!.id}/annotations`, {
      method: 'POST',
      body: { imageBase64, texts, authorName: authorName.value.trim() || undefined, guestCode: props.guestCode || undefined },
    })
    emit('saved', res.message)
  } catch (e: unknown) {
    errorMsg.value = (e as { data?: { message?: string } })?.data?.message ?? 'No se pudo publicar tu edición. Intenta de nuevo.'
  } finally {
    saving.value = false
  }
}

function measureStage() {
  if (!stage.value) return
  stageSize.value = { w: stage.value.clientWidth - 24, h: stage.value.clientHeight - 24 }
}

onMounted(() => {
  measureStage()
  resizeObserver = new ResizeObserver(measureStage)
  if (stage.value) resizeObserver.observe(stage.value)

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const MAX = 1600
    let { naturalWidth: w, naturalHeight: h } = img
    if (w > MAX || h > MAX) {
      const r = Math.min(MAX / w, MAX / h)
      w = Math.round(w * r)
      h = Math.round(h * r)
    }
    imgSize.value = { w, h }
    nextTick(() => {
      for (const c of [baseCanvas.value!, drawCanvas.value!]) {
        c.width = w
        c.height = h
      }
      baseCanvas.value!.getContext('2d')!.drawImage(img, 0, 0, w, h)
      imageReady.value = true
    })
  }
  img.onerror = () => {
    loadError.value = 'No se pudo cargar la foto para editarla.'
  }
  img.src = props.src ?? props.photo!.url
})

onUnmounted(() => resizeObserver?.disconnect())
</script>
