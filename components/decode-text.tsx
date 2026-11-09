"use client"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type Props = { text: string; className?: string; duration?: number; on?: "scroll" | "hover" }

export function DecodeText({ text, className, duration = 0.9, on = "scroll" }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current!
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const state = { p: 0 }
    const render = () => {
      const reveal = Math.floor(state.p * text.length)
      let out = ""
      for (let i = 0; i < text.length; i++) {
        const c = text[i]
        out += c === " " || i < reveal ? c : Math.random() > 0.5 ? "1" : "0"
      }
      el.textContent = out
    }
    const run = () => {
      state.p = 0
      gsap.to(state, { p: 1, duration, ease: "none", onUpdate: render, overwrite: true })
    }
    if (on === "hover") {
      const parent = el.parentElement!
      parent.addEventListener("pointerenter", run)
      return () => parent.removeEventListener("pointerenter", run)
    }
    el.textContent = text.replace(/\S/g, "0")
    const st = ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: run })
    return () => st.kill()
  }, [text, duration, on])

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  )
}

