"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DecodeText } from "@/components/decode-text";

const SKILLS = [
  "Java",
  "C++",
  "MySQL",
  "Git",
  "GitHub",
  "Linux",
  "REST APIs",
  "DSA",
  "DBMS",
  "OOP",
  "Operating Systems",
];

export function GiantSkillsMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
        });
      },
      { threshold: 0 }
    );
    observer.observe(container);

    const isMobile =
      window.innerWidth < 768 ||
      window.matchMedia("(pointer: coarse)").matches;

    let xPos = 0;
    let direction = -1;
    const baseSpeed = isMobile ? 0.6 : 1.2;
    let currentSpeed = baseSpeed;

    const scrollTrigger = ScrollTrigger.create({
      onUpdate: (self) => {
        if (self.direction === 1) {
          direction = -1;
        } else if (self.direction === -1) {
          direction = 1;
        }
        const velocity = Math.abs(self.getVelocity());
        currentSpeed = baseSpeed + Math.min(velocity * 0.003, isMobile ? 4 : 8);
      },
    });

    const updateMarquee = () => {
      if (!isVisible) return;
      currentSpeed += (baseSpeed - currentSpeed) * 0.05;
      xPos += direction * currentSpeed;

      const halfWidth = track.scrollWidth / 2;
      if (xPos <= -halfWidth) {
        xPos += halfWidth;
      } else if (xPos > 0) {
        xPos -= halfWidth;
      }

      gsap.set(track, { x: xPos });
    };

    gsap.ticker.add(updateMarquee);

    return () => {
      observer.disconnect();
      gsap.ticker.remove(updateMarquee);
      scrollTrigger.kill();
    };
  }, []);

  const items = [...SKILLS, ...SKILLS, ...SKILLS, ...SKILLS];

  return (
    <div
      ref={containerRef}
      className="relative py-12 sm:py-24 overflow-hidden border-b border-white/10 bg-black text-white select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-12 mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-white/40">
        <DecodeText text="[ 02 // CORE TECHNOLOGIES ]" />
        <span>Languages, tools and fundamentals</span>
      </div>

      <div
        className="relative overflow-hidden w-full"
        data-cursor="view"
        data-cursor-label="STACK"
      >
        <div className="pointer-events-none absolute left-0 inset-y-0 w-16 sm:w-40 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 inset-y-0 w-16 sm:w-40 bg-gradient-to-l from-black to-transparent z-10" />

        <div
          ref={trackRef}
          className="flex items-center gap-8 sm:gap-16 whitespace-nowrap will-change-transform"
        >
          {items.map((skill, index) => (
            <div
              key={`${skill}-${index}`}
              className="flex items-center gap-8 sm:gap-16 font-sans font-black text-4xl sm:text-8xl md:text-9xl lg:text-[10vw] tracking-tighter uppercase text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.7)] sm:[-webkit-text-stroke:1.5px_rgba(255,255,255,0.7)] hover:[-webkit-text-stroke:1.5px_#fff] hover:text-white transition-colors duration-300"
            >
              <span>{skill}</span>
              <span className="text-base sm:text-3xl text-white/30 font-light [-webkit-text-stroke:0px]">
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
