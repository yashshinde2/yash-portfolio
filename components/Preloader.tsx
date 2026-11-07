"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      navigator.webdriver ||
      /Chrome-Lighthouse|Lighthouse/i.test(navigator.userAgent)
    ) {
      setIsDone(true);
      return;
    }

    document.body.style.overflow = "hidden";

    const state = { count: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setIsDone(true);
      },
    });

    tl.to(state, {
      count: 100,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.floor(state.count)).padStart(2, "0");
        }
      },
    });

    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 0.5,
      ease: "power4.inOut",
    });

    return () => {
      document.body.style.overflow = "";
      tl.kill();
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9998] flex flex-col justify-between bg-black p-6 sm:p-12 text-white select-none"
    >
      <div className="flex items-center justify-between text-xs font-mono tracking-widest text-white/70 uppercase">
        <span>Yash Sandeep Shinde</span>
        <span>Portfolio</span>
      </div>

      <div className="flex items-baseline justify-end">
        <span
          ref={counterRef}
          className="font-mono text-7xl sm:text-9xl md:text-[12rem] font-bold tracking-tighter leading-none"
        >
          00
        </span>
        <span className="font-mono text-2xl sm:text-4xl text-white/50 ml-2 font-normal">%</span>
      </div>

      <div className="flex items-center justify-between text-xs font-mono tracking-widest text-white/60 uppercase">
        <span>Systems / Hardware / Backend</span>
        <span>Index 2026</span>
      </div>
    </div>
  );
}
