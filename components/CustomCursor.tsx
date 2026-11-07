"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    setIsEnabled(true);

    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power2.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power2.out" });

    const handlePointerMove = (e: PointerEvent) => {
      gsap.to(cursor, { opacity: 1, duration: 0.2 });
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest(
          "a, button, [role='button'], input, textarea, select, [data-cursor-expand]"
        )
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("mouseover", handlePointerOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mouseover", handlePointerOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!isEnabled) return null;

  return (
    <div
      ref={cursorRef}
      className={`pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-white mix-blend-difference transition-[width,height] duration-200 ease-out ${
        isHovered ? "h-[72px] w-[72px]" : "h-[14px] w-[14px]"
      }`}
    />
  );
}

