"use client"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return
    const el = dot.current!
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 })
    const qx = gsap.quickTo(el, "x", { duration: 0.18, ease: "power3" })
    const qy = gsap.quickTo(el, "y", { duration: 0.18, ease: "power3" })
    let shown = false

    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true
        gsap.set(el, { x: e.clientX, y: e.clientY })
        gsap.to(el, { opacity: 1, duration: 0.25 })
      }
      qx(e.clientX)
      qy(e.clientY)
    }
    const onOver = (e: PointerEvent) => {
      const hit = (e.target as HTMLElement).closest("a,button,[role=button],input,textarea,[data-cursor]")
      gsap.to(el, { width: hit ? 52 : 10, height: hit ? 52 : 10, duration: 0.3, ease: "power3.out" })
    }
    const onDown = () => gsap.to(el, { scale: 0.8, duration: 0.15 })
    const onUp = () => gsap.to(el, { scale: 1, duration: 0.3, ease: "back.out(3)" })
    const onLeave = () => gsap.to(el, { opacity: 0, duration: 0.2 })
    const onEnter = () => gsap.to(el, { opacity: 1, duration: 0.2 })

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerover", onOver)
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)
    document.documentElement.addEventListener("pointerleave", onLeave)
    document.documentElement.addEventListener("pointerenter", onEnter)
    return () => {
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
      <div ref={dot} className="absolute left-0 top-0 h-[10px] w-[10px] rounded-full bg-white" />
    </div>
  )
}
