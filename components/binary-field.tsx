"use client"
import { useEffect, useRef } from "react"

export function BinaryField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext("2d")!
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches
    const touch = matchMedia("(pointer: coarse)").matches
    const rowGap = touch ? 34 : 26
    const colGap = touch ? 22 : 17
    const gw = touch ? 7 : 8
    const gh = gw * 1.375
    const rnd = (a: number, b: number) => a + Math.random() * (b - a)
    const c1 = rnd(0.12, 0.26)
    const c2 = rnd(0.05, 0.12)
    const r1 = rnd(0, 6.28)
    const c3 = rnd(0.1, 0.22)
    const c4 = rnd(0.04, 0.1)
    const r2 = rnd(0, 6.28)
    const k1 = rnd(0.0028, 0.0045)
    const k2 = rnd(0.007, 0.011)
    const k3 = rnd(0.0012, 0.0021)
    const A1 = rnd(26, 38)
    const A2 = rnd(10, 18)
    const A3 = rnd(30, 48)

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

    let w = 0
    let h = 0
    let rows = 0
    let cols = 0
    let bits = new Uint8Array(0)
    let heat = new Float32Array(0)
    let p1 = new Float32Array(0)
    let p2 = new Float32Array(0)
    let tx = -9999
    let ty = -9999
    let mx = -9999
    let my = -9999
    let rad = 150
    let sy = 0
    let ripple = -1
    let rx = 0
    let ry = 0
    let raf = 0
    const t0 = performance.now()

    const draw = (now: number) => {
      const t = reduce ? 0 : (now - t0) / 1000
      if (touch && !reduce) {
        tx = w * (0.5 + 0.34 * Math.sin(t * 0.45))
        ty = h * (0.5 + 0.3 * Math.sin(t * 0.7 + 1))
      }
      if (mx < -9000) {
        mx = tx
        my = ty
      }
      const speed = Math.hypot(tx - mx, ty - my)
      mx += (tx - mx) * 0.14
      my += (ty - my) * 0.14
      rad += (150 + Math.min(speed, 140) * 1.1 - rad) * 0.08
      sy += (scrollY - sy) * 0.08
      const sp = reduce ? 0 : sy * 0.0035
      const rp = ripple >= 0 ? now - ripple : -1
      if (rp > 1000) ripple = -1
      const rr = rp >= 0 ? (rp / 1000) * Math.max(w, h) * 0.6 : 0
      const rad2 = rad * rad
      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < rows; i++) {
        const y0 = (i - 2) * rowGap
        const off = (i & 1) * colGap * 0.5
        const q1 = p1[i]
        const q2 = p2[i]
        for (let j = 0; j < cols; j++) {
          const k = i * cols + j
          const x0 = j * colGap + off - colGap
          let x = x0
          let y =
            y0 +
            A1 * Math.sin(x0 * k1 + q1 + t * 0.3 + sp) +
            A2 * Math.sin(x0 * k2 - q2 - t * 0.45) +
            A3 * Math.sin(x0 * k3 + q1 * 0.5 + t * 0.12 - sp * 0.5)
          let a = 0.04 + 0.05 * (0.5 + 0.5 * Math.sin(x0 * 0.006 + i * 0.35 - t * 0.6))
          let sc = 1
          let hv = heat[k] * 0.955
          const dx = x - mx
          const dy = y - my
          const d2 = dx * dx + dy * dy
          if (d2 < rad2 && d2 > 0.01) {
            const d = Math.sqrt(d2)
            const f = 1 - d / rad
            const e = f * f * (3 - 2 * f)
            const push = e * 64
            const swirl = e * 20
            x += (dx / d) * push - (dy / d) * swirl
            y += (dy / d) * push + (dx / d) * swirl
            if (e > hv) hv = e
            if (e > 0.5 && Math.random() < 0.03) bits[k] ^= 1
          }
          heat[k] = hv
          a += hv * 0.85
          sc += hv * 0.6
          if (rp >= 0) {
            const rdx = x - rx
            const rdy = y - ry
            const rd = Math.sqrt(rdx * rdx + rdy * rdy) || 1
            const diff = Math.abs(rd - rr)
            if (diff < 70) {
              const q = 1 - diff / 70
              const qq = q * q
              x += (rdx / rd) * qq * 26
              y += (rdy / rd) * qq * 26
              a += qq * 0.7
            }
          }
          if (x < -20 || x > w + 20 || y < -20 || y > h + 20) continue
          ctx.globalAlpha = a > 1 ? 1 : a
          ctx.drawImage(sprites[bits[k]], x - (gw * sc) / 2, y - (gh * sc) / 2, gw * sc, gh * sc)
        }
      }
      ctx.globalAlpha = 1
    }

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, touch ? 1.5 : 2)
      w = innerWidth
      h = innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + "px"
      canvas.style.height = h + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      rows = Math.ceil(h / rowGap) + 5
      cols = Math.ceil(w / colGap) + 3
      bits = new Uint8Array(rows * cols)
      heat = new Float32Array(rows * cols)
      p1 = new Float32Array(rows)
      p2 = new Float32Array(rows)
      for (let i = 0; i < bits.length; i++) bits[i] = Math.random() > 0.5 ? 1 : 0
      for (let i = 0; i < rows; i++) {
        p1[i] = i * c1 + 1.6 * Math.sin(i * c2 + r1)
        p2[i] = i * c3 + 1.2 * Math.sin(i * c4 + r2)
      }
      if (reduce) draw(performance.now())
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      draw(now)
    }
    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
    }
    const onDown = (e: PointerEvent) => {
      rx = e.clientX
      ry = e.clientY
      ripple = performance.now()
    }
    const onLeave = () => {
      tx = -9999
      ty = -9999
      mx = -9999
      my = -9999
    }

    resize()
    window.addEventListener("resize", resize)
    if (!reduce) {
      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerdown", onDown)
      document.documentElement.addEventListener("pointerleave", onLeave)
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      document.documentElement.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0" />
}

