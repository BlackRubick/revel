import { onMounted, onUnmounted } from 'vue'

export function useScrollReveal() {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (import.meta.server) return
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer?.observe(el)
    })
  })

  onUnmounted(() => observer?.disconnect())
}

export function useCountUp(target: number, duration = 2000) {
  const current = ref(0)

  onMounted(() => {
    const start = performance.now()
    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      current.value = Math.floor(eased * target)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  })

  return current
}
