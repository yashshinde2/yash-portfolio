"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (barRef.current) barRef.current.style.transform = "scaleX(1)";
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const bar = barRef.current;
    if (!bar) return;

    const anim = gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.1,
        },
      }
    );

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-[1px] bg-white z-[99999] origin-left pointer-events-none will-change-transform"
      style={{ transform: "scaleX(0)" }}
    />
  );
}

