<template>
  <div class="pointer-events-none fixed inset-0 z-0">
    <div
      v-if="!isMobile"
      ref="spotlight"
      class="absolute w-[600px] h-[600px] rounded-full"
      style="background: radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%); transform: translate(-50%, -50%); will-change: left, top; transition: left 0.08s linear, top 0.08s linear;"
    />
    <canvas v-if="!isMobile" ref="canvas" class="absolute inset-0 w-full h-full" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ noMobile?: boolean }>()

const spotlight = ref<HTMLDivElement>()
const canvas = ref<HTMLCanvasElement>()
const isMobile = ref(false)

onMounted(() => {
  if (!import.meta.client) return

  isMobile.value = props.noMobile && (window.innerWidth < 768 || navigator.maxTouchPoints > 0)
  if (isMobile.value) return

  const onMove = (e: MouseEvent) => {
    if (!spotlight.value) return
    spotlight.value.style.left = e.clientX + 'px'
    spotlight.value.style.top = e.clientY + 'px'
  }
  window.addEventListener('mousemove', onMove)

  const cvs = canvas.value!
  const ctx = cvs.getContext('2d')!

  const resize = () => {
    cvs.width = window.innerWidth
    cvs.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const ambient = Array.from({ length: 60 }, () => ({
    x: Math.random() * cvs.width,
    y: Math.random() * cvs.height,
    r: Math.random() * 1.2 + 0.3,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    o: Math.random() * 0.5,
    vo: (Math.random() - 0.5) * 0.004,
  }))

  type Glitter = { x: number; y: number; size: number; speed: number; drift: number; driftAngle: number; spin: number; opacity: number; fadeDir: number; shape: number }
  const glitters: Glitter[] = Array.from({ length: 180 }, () => spawnGlitter(true))

  function spawnGlitter(init = false): Glitter {
    return {
      x: Math.random() * cvs.width,
      y: init ? Math.random() * cvs.height : -10,
      size: Math.random() * 2.8 + 0.6,
      speed: Math.random() * 0.7 + 0.2,
      drift: Math.random() * 0.4,
      driftAngle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.06,
      opacity: Math.random() * 0.7 + 0.3,
      fadeDir: Math.random() > 0.5 ? 1 : -1,
      shape: Math.floor(Math.random() * 3),
    }
  }

  type Shooting = { x: number; y: number; len: number; speed: number; angle: number; opacity: number; active: boolean; timer: number; width: number }
  const shootings: Shooting[] = Array.from({ length: 12 }, () => ({ x: 0, y: 0, len: 0, speed: 0, angle: 0, opacity: 0, active: false, timer: 0, width: 0 }))

  function spawnShooting(s: Shooting) {
    s.x = Math.random() * cvs.width * 0.8
    s.y = Math.random() * cvs.height * 0.5
    s.len = Math.random() * 200 + 100
    s.speed = Math.random() * 10 + 7
    s.angle = (Math.random() * 25 + 15) * Math.PI / 180
    s.opacity = 1
    s.active = true
    s.timer = 0
    s.width = Math.random() * 1.5 + 0.8
  }

  shootings.forEach((s, i) => {
    setTimeout(() => spawnShooting(s), 500 + i * 600)
  })

  function drawDiamond(x: number, y: number, r: number, angle: number) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle)
    ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(r * 0.6, 0); ctx.lineTo(0, r); ctx.lineTo(-r * 0.6, 0); ctx.closePath()
    ctx.restore()
  }

  function drawStar(x: number, y: number, r: number, angle: number) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle)
    ctx.beginPath()
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
      ctx.lineTo(Math.cos(a + Math.PI / 4) * r * 0.35, Math.sin(a + Math.PI / 4) * r * 0.35)
    }
    ctx.closePath(); ctx.restore()
  }

  let frame: number

  const draw = () => {
    ctx.clearRect(0, 0, cvs.width, cvs.height)

    for (const p of ambient) {
      p.x += p.vx; p.y += p.vy; p.o += p.vo
      if (p.x < 0) p.x = cvs.width; if (p.x > cvs.width) p.x = 0
      if (p.y < 0) p.y = cvs.height; if (p.y > cvs.height) p.y = 0
      if (p.o < 0.05 || p.o > 0.5) p.vo *= -1
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(212,175,55,${p.o})`; ctx.fill()
    }

    for (let i = 0; i < glitters.length; i++) {
      const g = glitters[i]
      g.y += g.speed
      g.driftAngle += 0.012
      g.x += Math.sin(g.driftAngle) * g.drift
      g.spin += 0.003
      g.opacity += g.fadeDir * 0.007
      if (g.opacity > 0.95) g.fadeDir = -1
      if (g.opacity < 0.1) g.fadeDir = 1

      if (g.y > cvs.height + 10) glitters[i] = spawnGlitter()

      const a = g.opacity * 0.85
      ctx.fillStyle = `rgba(212,175,55,${a})`
      ctx.strokeStyle = `rgba(240,208,96,${a})`
      ctx.lineWidth = 0.3

      if (g.shape === 0) {
        ctx.beginPath(); ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2); ctx.fill()
      } else if (g.shape === 1) {
        drawDiamond(g.x, g.y, g.size * 1.5, g.spin * 30); ctx.fill(); ctx.stroke()
      } else {
        drawStar(g.x, g.y, g.size * 1.6, g.spin * 20); ctx.fill()
      }
    }

    for (const s of shootings) {
      if (!s.active) continue
      s.timer += 1
      s.x += Math.cos(s.angle) * s.speed
      s.y += Math.sin(s.angle) * s.speed
      s.opacity = Math.max(0, 1 - s.timer / 45)

      if (s.opacity <= 0) {
        s.active = false
        setTimeout(() => spawnShooting(s), Math.random() * 3000 + 1500)
        continue
      }

      const tx = s.x - Math.cos(s.angle) * s.len
      const ty = s.y - Math.sin(s.angle) * s.len
      const grad = ctx.createLinearGradient(tx, ty, s.x, s.y)
      grad.addColorStop(0, `rgba(212,175,55,0)`)
      grad.addColorStop(0.5, `rgba(240,208,96,${s.opacity * 0.35})`)
      grad.addColorStop(1, `rgba(255,240,130,${s.opacity})`)
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y)
      ctx.strokeStyle = grad; ctx.lineWidth = s.width; ctx.lineCap = 'round'; ctx.stroke()

      const g2 = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 8)
      g2.addColorStop(0, `rgba(255,245,150,${s.opacity})`)
      g2.addColorStop(1, `rgba(212,175,55,0)`)
      ctx.beginPath(); ctx.arc(s.x, s.y, 8, 0, Math.PI * 2)
      ctx.fillStyle = g2; ctx.fill()
    }

    frame = requestAnimationFrame(draw)
  }
  draw()

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('resize', resize)
    cancelAnimationFrame(frame)
  })
})
</script>
