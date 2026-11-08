"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInHero, setIsInHero] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [binaryChar, setBinaryChar] = useState("0");

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

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.12, ease: "power2.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.12, ease: "power2.out" });

    const handlePointerMove = (e: PointerEvent) => {
      gsap.to(cursor, { opacity: 1, duration: 0.15 });
      xTo(e.clientX);
      yTo(e.clientY);
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      setIsInHero(Boolean(target?.closest("#hero, [data-hero]")));
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
      setIsInHero(Boolean(target?.closest("#hero, [data-hero]")));
    };

    const handleMouseDown = () => {
      setIsClicked(true);
    };

    const handleMouseUp = () => {
      setIsClicked(false);
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("mouseover", handlePointerOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    const swapInterval = setInterval(() => {
      setBinaryChar((prev) => (prev === "0" ? "1" : "0"));
    }, 120);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mouseover", handlePointerOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearInterval(swapInterval);
    };
  }, []);

  if (!isEnabled) return null;

  return (
    <div
      ref={cursorRef}
      className={`pointer-events-none fixed top-0 left-0 z-[9999] rounded-full mix-blend-difference flex items-center justify-center transition-all duration-200 ease-out will-change-transform ${
        isHovered
          ? `h-[72px] w-[72px] bg-white border-0 ${isClicked ? "scale-90" : "scale-100"}`
          : isInHero
          ? `h-[40px] w-[40px] bg-transparent border border-white ${
              isClicked ? "scale-75 bg-white/10" : "scale-100"
            }`
          : `h-[14px] w-[14px] bg-white border-0 ${isClicked ? "scale-50" : "scale-100"}`
      }`}
    >
      {isInHero && !isHovered && (
        <span className="font-mono text-[11px] font-bold text-white leading-none select-none">
          {binaryChar}
        </span>
      )}
    </div>
  );
}
