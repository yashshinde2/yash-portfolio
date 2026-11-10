"use client"
import { useEffect, useRef } from "react"

type Props = { src: string; alt: string; className?: string; radius?: number; cellW?: number; cellH?: number }

export function BinaryPhoto({ src, alt, className = "", radius = 160, cellW = 9, cellH = 14 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current!
    const img = imgRef.current!
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches
    const touch = !matchMedia("(hover: hover) and (pointer: fine)").matches

    let cols = 0, rows = 0, w = 0, h = 0
    let lum = new Float32Array(0)
    let alpha = new Float32Array(0)
    let heat = new Float32Array(0)
    let bits = new Uint8Array(0)
    let tx = 0, ty = 0, x = 0, y = 0
    let hover = false, visible = true, started = false
    let raf = 0, ripple = -1, rx = 0, ry = 0
    const t0 = performance.now()

    const build = () => {
      if (!img.complete || !img.clientWidth) return
      const dpr = Math.min(devicePixelRatio || 1, 2)
      w = img.clientWidth
      h = img.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + "px"
      canvas.style.height = h + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = `600 ${cellH - 2}px ui-monospace, "JetBrains Mono", monospace`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      cols = Math.ceil(w / cellW)
      rows = Math.ceil(h / cellH)
      const off = document.createElement("canvas")
      off.width = cols
      off.height = rows
      const octx = off.getContext("2d", { willReadFrequently: true })!
      octx.drawImage(img, 0, 0, cols, rows)
      const data = octx.getImageData(0, 0, cols, rows).data
      const n = cols * rows
      lum = new Float32Array(n)
      alpha = new Float32Array(n)
      heat = new Float32Array(n)
      bits = new Uint8Array(n)
      for (let i = 0; i < n; i++) {
        const p = i * 4
        lum[i] = (0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2]) / 255
        alpha[i] = data[p + 3] / 255
        bits[i] = Math.random() > 0.5 ? 1 : 0
      }
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible || !cols) return
      if (touch || reduce) {
        const t = (now - t0) / 1000
        tx = w * (0.5 + 0.3 * Math.sin(t * 0.7))
        ty = h * (0.45 + 0.28 * Math.sin(t * 1.1 + 1))
        hover = !reduce
      }
      x += (tx - x) * 0.2
      y += (ty - y) * 0.2
      ctx.clearRect(0, 0, w, h)
      const rp = ripple >= 0 ? now - ripple : -1
      if (rp > 900) ripple = -1
      const rad = rp >= 0 ? (rp / 900) * Math.max(w, h) * 0.7 : 0

      for (let j = 0; j < rows; j++) {
        const cy = j * cellH + cellH / 2
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i
          const cx = i * cellW + cellW / 2
          let hv = heat[k] * 0.93
          if (hover) {
            const dx = cx - x
            const dy = cy - y
            const d = Math.sqrt(dx * dx + dy * dy)
            if (d < radius) {
              const f = 1 - d / radius
              hv = Math.max(hv, f * f * (3 - 2 * f))
            }
          }
          if (rp >= 0) {
            const dx = cx - rx
            const dy = cy - ry
            const diff = Math.abs(Math.sqrt(dx * dx + dy * dy) - rad)
            if (diff < 50) hv = Math.max(hv, (1 - diff / 50) * 0.95)
          }
          heat[k] = hv
          if (hv < 0.03 || alpha[k] <= 0.5) continue
          if (Math.random() < 0.05) bits[k] ^= 1
          ctx.fillStyle = `rgba(0,0,0,${hv * 0.72})`
          ctx.fillRect(i * cellW, j * cellH, cellW, cellH)
          ctx.fillStyle = `rgba(255,255,255,${hv * (0.45 + 0.55 * lum[k])})`
          ctx.fillText(bits[k] ? "1" : "0", cx, cy)
        }
      }
    }

    const local = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      return [e.clientX - r.left, e.clientY - r.top]
    }
    const onEnter = (e: PointerEvent) => {
      const [px, py] = local(e)
      if (!started) { x = px; y = py; started = true }
      tx = px
      ty = py
      hover = true
    }
    const onMove = (e: PointerEvent) => {
      const [px, py] = local(e)
      tx = px
      ty = py
    }
    const onLeave = () => { hover = false }
    const onDown = (e: PointerEvent) => {
      const [px, py] = local(e)
      rx = px
      ry = py
      ripple = performance.now()
    }

    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting })
    const ro = new ResizeObserver(build)
    io.observe(wrap)
    ro.observe(img)
    img.addEventListener("load", build)
    build()

    if (!touch) {
      wrap.addEventListener("pointerenter", onEnter)
      wrap.addEventListener("pointermove", onMove)
      wrap.addEventListener("pointerleave", onLeave)
      wrap.addEventListener("pointerdown", onDown)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      img.removeEventListener("load", build)
      wrap.removeEventListener("pointerenter", onEnter)
      wrap.removeEventListener("pointermove", onMove)
      wrap.removeEventListener("pointerleave", onLeave)
      wrap.removeEventListener("pointerdown", onDown)
    }
  }, [radius, cellW, cellH])

  return (
    <div ref={wrapRef} data-cursor="binary" className={`relative select-none ${className}`}>
      <img ref={imgRef} src={src} alt={alt} draggable={false} className="block h-auto w-full" />
      <canvas ref={canvasRef} className="pointer-events-none absolute left-0 top-0" />
    </div>
  )
}
