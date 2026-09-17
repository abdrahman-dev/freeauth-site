import { useEffect, useRef } from 'react'
import type { ReactElement } from 'react'

/*
  Aurora — lightweight Canvas 2D mesh-gradient.
  5 additive radial blobs on solid #0D0B1A, plus faint SVG grain.
  No WebGL, no three.js.

  Palette mirrors DimensionalField distribution:
    2 indigo #5A5680 dominant, 1 silver #DDD9F0 subtle,
    1 warm #C9A66B rare, 1 teal #6AAFA5 rare.
*/

interface Blob {
  hex: string
  alpha: number
  radius: number // fraction of min(canvas width, height)
  baseX: number // 0-1 fraction of width
  baseY: number // 0-1 fraction of height
  phase: number
  speedX: number
  speedY: number
  ampX: number // fraction of width
  ampY: number
}

const BLOBS: Blob[] = [
  // Indigo dominant — larger, sweeps right through center
  {
    hex: '#5A5680',
    alpha: 0.30,
    radius: 0.52,
    baseX: 0.62,
    baseY: 0.60,
    phase: 0.0,
    speedX: 0.10,
    speedY: 0.07,
    ampX: 0.10,
    ampY: 0.07,
  },
  // Indigo second — left-side presence
  {
    hex: '#5A5680',
    alpha: 0.25,
    radius: 0.48,
    baseX: 0.24,
    baseY: 0.72,
    phase: 2.1,
    speedX: 0.07,
    speedY: 0.09,
    ampX: 0.09,
    ampY: 0.06,
  },
  // Silver subtle highlight — upper-center drift
  {
    hex: '#DDD9F0',
    alpha: 0.10,
    radius: 0.32,
    baseX: 0.42,
    baseY: 0.34,
    phase: 4.2,
    speedX: 0.06,
    speedY: 0.05,
    ampX: 0.06,
    ampY: 0.06,
  },
  // Warm rare accent — right edge
  {
    hex: '#C9A66B',
    alpha: 0.16,
    radius: 0.36,
    baseX: 0.78,
    baseY: 0.56,
    phase: 1.3,
    speedX: 0.08,
    speedY: 0.10,
    ampX: 0.07,
    ampY: 0.06,
  },
  // Teal rare accent — bottom-center drift
  {
    hex: '#6AAFA5',
    alpha: 0.16,
    radius: 0.34,
    baseX: 0.58,
    baseY: 0.70,
    phase: 5.5,
    speedX: 0.11,
    speedY: 0.08,
    ampX: 0.09,
    ampY: 0.07,
  },
]

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export default function Aurora({ className = '' }: { className?: string }): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dpr = 1

    const resize = (): void => {
      const rect = container.getBoundingClientRect()
      const nextDpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const nextWidth = Math.max(1, Math.round(rect.width * nextDpr))
      const nextHeight = Math.max(1, Math.round(rect.height * nextDpr))
      if (nextWidth === width && nextHeight === height && nextDpr === dpr) return
      width = nextWidth
      height = nextHeight
      dpr = nextDpr
      canvas.width = width
      canvas.height = height
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      if (!prefersReduced) draw(performance.now() / 1000)
      else draw(0)
    }

    const draw = (t: number): void => {
      // Background solid #0D0B1A
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = '#0D0B1A'
      ctx.fillRect(0, 0, width, height)

      ctx.globalCompositeOperation = 'lighter'

      const minSide = Math.min(width, height)

      for (const blob of BLOBS) {
        const [r, g, b] = hexToRgb(blob.hex)
        const cx = (blob.baseX + Math.sin(t * blob.speedX + blob.phase) * blob.ampX) * width
        const cy = (blob.baseY + Math.cos(t * blob.speedY + blob.phase) * blob.ampY) * height
        const radius = blob.radius * minSide

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        gradient.addColorStop(0, `rgba(${r},${g},${b},${blob.alpha})`)
        gradient.addColorStop(0.35, `rgba(${r},${g},${b},${blob.alpha * 0.55})`)
        gradient.addColorStop(0.65, `rgba(${r},${g},${b},${blob.alpha * 0.15})`)
        gradient.addColorStop(1, `rgba(${r},${g},${b},0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const tick = (now: number): void => {
      draw(now / 1000)
      rafRef.current = window.requestAnimationFrame(tick)
    }

    resize()

    if (prefersReduced) {
      draw(0)
    } else {
      rafRef.current = window.requestAnimationFrame(tick)
    }

    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={['pointer-events-none', 'absolute', 'inset-0', 'overflow-hidden', className].join(' ')}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* Faint SVG grain — static noise to avoid flat banding, ~0.035 opacity */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
