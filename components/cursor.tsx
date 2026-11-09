"use client"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const ticksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return
    const d = dot.current!
    const r = ring.current!
    const l = label.current!
    const ticks = ticksRef.current
    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 })
    const dx = gsap.quickTo(d, "x", { duration: 0.05, ease: "power3" })
    const dy = gsap.quickTo(d, "y", { duration: 0.05, ease: "power3" })
    const rx = gsap.quickTo(r, "x", { duration: 0.28, ease: "power3.out" })
    const ry = gsap.quickTo(r, "y", { duration: 0.28, ease: "power3.out" })
    let timer = 0
    let shown = false

    const apply = (mode: string, text: string) => {
      window.clearInterval(timer)
      l.textContent = text
      const isLink = mode === "link"
      const isBinary = mode === "binary"
      const isView = mode === "view"
      const isScope = mode === "scope"

      const size = isLink ? 76 : isBinary ? 72 : isView ? 96 : isScope ? 56 : 34

      gsap.to(r, {
        width: size,
        height: size,
        backgroundColor: isLink ? "#ffffff" : isView ? "rgba(255,255,255,0.06)" : isBinary ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0)",
        borderColor: isLink ? "transparent" : "rgba(255,255,255,0.9)",
        duration: 0.32,
        ease: "power3.out",
      })

      gsap.to(d, {
        scale: isLink || isView ? 0 : 1,
        duration: 0.2,
      })

      if (ticks) {
        gsap.to(ticks, {
          opacity: isLink ? 0 : 0.85,
          duration: 0.2,
        })
      }

      if (isBinary) {
        timer = window.setInterval(() => {
          l.textContent = Math.random() > 0.5 ? "1" : "0"
        }, 85)
      }
    }

    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true
        gsap.set([d, r], { x: e.clientX, y: e.clientY })
        gsap.to([d, r], { opacity: 1, duration: 0.25 })
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }

    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor],a,button,[role=button],input,textarea")
      if (!el) return apply("default", "")
      const mode = el.dataset.cursor ?? (el.tagName === "INPUT" || el.tagName === "TEXTAREA" ? "scope" : "link")
      apply(mode, el.dataset.cursorLabel ?? "")
    }

    const onDown = () => {
      gsap.to(r, { scale: 0.86, duration: 0.12, ease: "power2.out" })
      gsap.to(d, { scale: 0.65, duration: 0.12 })
    }

    const onUp = () => {
      gsap.to(r, { scale: 1, duration: 0.35, ease: "back.out(2.5)" })
      gsap.to(d, { scale: 1, duration: 0.25 })
    }

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
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden mix-blend-difference [@media(pointer:fine)]:block select-none">
      <div
        ref={ring}
        className="absolute left-0 top-0 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-white/90 will-change-transform"
      >
        <span ref={label} className="font-mono text-[11px] font-bold tracking-widest text-white uppercase select-none pointer-events-none" />
        <div ref={ticksRef} className="pointer-events-none absolute inset-0">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[1.5px] h-1.5 bg-white/70" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-[1.5px] h-1.5 bg-white/70" />
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-[1.5px] w-1.5 bg-white/70" />
          <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-[1.5px] w-1.5 bg-white/70" />
        </div>
      </div>
      <div ref={dot} className="absolute left-0 top-0 h-[7px] w-[7px] rounded-full bg-white will-change-transform pointer-events-none" />
    </div>
  )
}
