"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function InvertingSection({
  children,
  className,
  id,
  bg = "black",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  bg?: "black" | "white";
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const el = sectionRef.current;
    if (!el) return;

    const anim = gsap.fromTo(
      el,
      { clipPath: "inset(8% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
          end: "top 30%",
          scrub: 0.4,
        },
      }
    );

    return () => {
      anim.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative w-full ${
        bg === "white" ? "bg-white text-black" : "bg-black text-white"
      } ${className || ""}`}
    >
      {children}
    </section>
  );
}

