"use client"
import { useEffect, useRef } from "react"

export function BinaryTrail({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return
    const canvas = ref.current!
    const host = canvas.parentElement!
    const ctx = canvas.getContext("2d")!
    const gap = 19

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

    const hash = (i: number, j: number, s: number) => {
      const v = Math.sin(i * 127.1 + j * 311.7 + s * 74.7) * 43758.5453
      return v - Math.floor(v)
    }

    let dpr = 1
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let act = 0
    let has = false
    let running = false
    let raf = 0
    const t0 = performance.now()

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2)
      canvas.width = host.clientWidth * dpr
      canvas.height = host.clientHeight * dpr
      canvas.style.width = host.clientWidth + "px"
      canvas.style.height = host.clientHeight + "px"
    }

    const loop = (now: number) => {
      const t = (now - t0) / 1000
      act *= 0.985
      cx += (tx - cx) * 0.18
      cy += (ty - cy) * 0.18
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (act < 0.01) {
        running = false
        return
      }
      const rad = 95 + act * 55
      const i0 = Math.floor((cx - rad) / gap) - 1
      const i1 = Math.ceil((cx + rad) / gap) + 1
      const j0 = Math.floor((cy - rad) / gap) - 1
      const j1 = Math.ceil((cy + rad) / gap) + 1

      for (let j = j0; j <= j1; j++) {
        for (let i = i0; i <= i1; i++) {
          const hx = hash(i, j, 1)
          if (hx > 0.8) continue
          const x0 = i * gap + (hash(i, j, 2) - 0.5) * gap * 0.7
          const y0 = j * gap + (hash(i, j, 3) - 0.5) * gap * 0.7
          const dx = x0 - cx
          const dy = y0 - cy
          const d = Math.hypot(dx, dy)
          if (d >= rad || d < 4) continue
          const f = 1 - d / rad
          const e = f * f * (3 - 2 * f)
          const a = e * act * 0.95
          if (a < 0.03) continue
          const th = Math.atan2(dy, dx) + e * act * 0.5
          const dd = d + Math.sin(d * 0.1 - t * 2.4) * 4 * e
          const x = cx + Math.cos(th) * dd
          const y = cy + Math.sin(th) * dd
          let r = th + Math.PI / 2 + (1 - f) * 0.6
          r = ((((r + Math.PI / 2) % Math.PI) + Math.PI) % Math.PI) - Math.PI / 2
          const bit = hash(i, j, 4 + Math.floor(t * 1.6 + hx * 10)) > 0.5 ? 1 : 0
          const sz = 8 + e * 7
          const c = Math.cos(r)
          const s = Math.sin(r)
          ctx.globalAlpha = a
          ctx.setTransform(dpr * c, dpr * s, -dpr * s, dpr * c, dpr * x, dpr * y)
          ctx.drawImage(sprites[bit], -sz * 0.364, -sz / 2, sz * 0.727, sz)
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      if (!has) {
        cx = x
        cy = y
        tx = x
        ty = y
        has = true
      }
      const d = Math.hypot(x - tx, y - ty)
      tx = x
      ty = y
      act = Math.min(1, Math.max(act, 0.3 + d / 28))
      if (!running) {
        running = true
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
