"use client"
import { useEffect, useRef } from "react"

type P = { x: number; y: number; vx: number; vy: number; age: number; life: number; bit: number; size: number; curl: number }

export function BinaryTrail({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const canvas = ref.current!
    const host = canvas.parentElement!
    const ctx = canvas.getContext("2d")!

    const sprite = (ch: string) => {
      const s = document.createElement("canvas")
      s.width = 48
      s.height = 66
      const c = s.getContext("2d")!
      c.fillStyle = "#fff"
      c.font = '600 46px ui-monospace, Menlo, Consolas, monospace'
      c.textAlign = "center"
      c.textBaseline = "middle"
      c.fillText(ch, 24, 35)
      return s
    }
    const sprites = [sprite("0"), sprite("1")]

    const ps: P[] = []
    let w = 0
    let h = 0
    let lx = 0
    let ly = 0
    let has = false
    let phase = 0
    let raf = 0
    let last = 0
    let running = false

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      w = host.clientWidth
      h = host.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + "px"
      canvas.style.height = h + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 16.667, 3)
      last = now
      ctx.clearRect(0, 0, w, h)
      let n = 0
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i]
        p.age += dt * 16.667
        if (p.age >= p.life) continue
        const c = Math.cos(p.curl * dt)
        const s = Math.sin(p.curl * dt)
        const vx = p.vx * c - p.vy * s
        const vy = p.vx * s + p.vy * c
        p.vx = vx * 0.992
        p.vy = vy * 0.992
        p.x += p.vx * dt
        p.y += p.vy * dt
        const t = p.age / p.life
        const a = (1 - t) * (1 - t) * 0.95
        const sz = p.size * (1 - t * 0.35)
        ctx.globalAlpha = a
        ctx.drawImage(sprites[p.bit], p.x - sz * 0.364, p.y - sz / 2, sz * 0.727, sz)
        ps[n++] = p
      }
      ps.length = n
      ctx.globalAlpha = 1
      if (n > 0) {
        raf = requestAnimationFrame(loop)
      } else {
        running = false
        ctx.clearRect(0, 0, w, h)
      }
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      const r = host.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      if (!has) {
        lx = x
        ly = y
        has = true
        return
      }
      const dx = x - lx
      const dy = y - ly
      const dist = Math.hypot(dx, dy)
      if (dist < 2) return
      const nx = -dy / dist
      const ny = dx / dist
      const amp = 12 + Math.min(dist, 70) * 0.35
      const steps = Math.ceil(dist / 7)
      for (let s = 1; s <= steps; s++) {
        const px = lx + (dx * s) / steps
        const py = ly + (dy * s) / steps
        phase += 0.3
        for (let k = 0; k < 3; k++) {
          if (ps.length >= 1400) break
          const a = phase + k * 2.0944
          const off = Math.sin(a) * amp
          const drift = Math.cos(a) * 0.9
          ps.push({
            x: px + nx * off,
            y: py + ny * off,
            vx: nx * drift,
            vy: ny * drift,
            age: 0,
            life: 1100 + Math.random() * 800,
            bit: Math.random() > 0.5 ? 1 : 0,
            size: 9 + Math.random() * 6,
            curl: (Math.random() - 0.5) * 0.05,
          })
        }
      }
      lx = x
      ly = y
      if (!running) {
        running = true
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    }

    const onLeave = () => {
      has = false
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)
    host.addEventListener("pointermove", onMove)
    host.addEventListener("pointerleave", onLeave)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      host.removeEventListener("pointermove", onMove)
      host.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className={className} />
}
