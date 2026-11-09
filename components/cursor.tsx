"use client"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return
    const d = dot.current!
    const r = ring.current!
    const l = label.current!
    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 })
    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "power3" })
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "power3" })
    const rx = gsap.quickTo(r, "x", { duration: 0.4, ease: "power3" })
    const ry = gsap.quickTo(r, "y", { duration: 0.4, ease: "power3" })
    let timer = 0
    let shown = false

    const apply = (mode: string, text: string) => {
      window.clearInterval(timer)
      l.textContent = text
      const size = mode === "link" ? 76 : mode === "binary" ? 72 : mode === "view" ? 96 : 34
      gsap.to(r, {
        width: size,
        height: size,
        backgroundColor: mode === "link" ? "#fff" : "rgba(255,255,255,0)",
        duration: 0.35,
        ease: "power3.out",
      })
      gsap.to(d, { scale: mode === "link" ? 0 : 1, duration: 0.25 })
      if (mode === "binary") {
        timer = window.setInterval(() => {
          l.textContent = Math.random() > 0.5 ? "1" : "0"
        }, 90)
      }
    }

    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true
        gsap.set([d, r], { x: e.clientX, y: e.clientY })
        gsap.to([d, r], { opacity: 1, duration: 0.3 })
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor],a,button,[role=button]")
      if (!el) return apply("default", "")
      apply(el.dataset.cursor ?? "link", el.dataset.cursorLabel ?? "")
    }
    const onDown = () => gsap.to(r, { scale: 0.85, duration: 0.15 })
    const onUp = () => gsap.to(r, { scale: 1, duration: 0.3, ease: "back.out(3)" })
    const onLeave = () => gsap.to([d, r], { opacity: 0, duration: 0.2 })
    const onEnter = () => gsap.to([d, r], { opacity: 1, duration: 0.2 })

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerover", onOver)
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)
    document.documentElement.addEventListener("pointerleave", onLeave)
    document.documentElement.addEventListener("pointerenter", onEnter)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerover", onOver)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      document.documentElement.removeEventListener("pointerleave", onLeave)
      document.documentElement.removeEventListener("pointerenter", onEnter)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden mix-blend-difference [@media(pointer:fine)]:block">
      <div ref={ring} className="absolute left-0 top-0 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-white">
        <span ref={label} className="font-mono text-[11px] font-semibold text-white" />
      </div>
      <div ref={dot} className="absolute left-0 top-0 h-[7px] w-[7px] rounded-full bg-white" />
    </div>
  )
}

