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
    if (!track) return;

    const isMobile = window.matchMedia("(max-width: 1023.98px)").matches;
    let xPos = 0;
    let direction = -1;
    let baseSpeed = isMobile ? 0.7 : 1.2;
    let currentSpeed = baseSpeed;

    const scrollTrigger = ScrollTrigger.create({
      onUpdate: (self) => {
        if (self.direction === 1) {
          direction = -1;
        } else if (self.direction === -1) {
          direction = 1;
        }
        const velocity = Math.abs(self.getVelocity());
        currentSpeed = baseSpeed + Math.min(velocity * 0.004, isMobile ? 4 : 8);
      },
    });

    const updateMarquee = () => {
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
      gsap.ticker.remove(updateMarquee);
      scrollTrigger.kill();
    };
  }, []);

  const items = [...SKILLS, ...SKILLS, ...SKILLS, ...SKILLS];

  return (
    <div
      ref={containerRef}
      id="skills"
      className="relative py-16 sm:py-24 overflow-hidden border-b border-white/10 bg-black text-white select-none max-lg:py-20 max-lg:px-5"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-6 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-white/40 max-lg:px-0 max-lg:mb-4 max-lg:flex-col max-lg:items-start max-lg:gap-1 max-lg:text-[11px]">
        <DecodeText text="[ 02 // CORE TECHNOLOGIES ]" />
        <span>Languages, tools and fundamentals</span>
      </div>

      <div
        className="relative overflow-hidden w-full"
        data-cursor="view"
        data-cursor-label="STACK"
      >
        <div className="pointer-events-none absolute left-0 inset-y-0 w-24 sm:w-40 bg-gradient-to-r from-black to-transparent z-10 max-lg:w-16" />
        <div className="pointer-events-none absolute right-0 inset-y-0 w-24 sm:w-40 bg-gradient-to-l from-black to-transparent z-10 max-lg:w-16" />

        <div
          ref={trackRef}
          className="flex items-center gap-12 sm:gap-16 whitespace-nowrap will-change-transform max-lg:gap-8"
        >
          {items.map((skill, index) => (
            <div
              key={`${skill}-${index}`}
              className="flex items-center gap-12 sm:gap-16 font-sans font-black text-6xl sm:text-8xl md:text-9xl lg:text-[10vw] tracking-tighter uppercase text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.7)] hover:[-webkit-text-stroke:1.5px_#fff] hover:text-white transition-colors duration-300 max-lg:gap-8 max-lg:text-4xl max-lg:[-webkit-text-stroke:1px_rgba(255,255,255,0.7)]"
            >
              <span>{skill}</span>
              <span className="text-xl sm:text-3xl text-white/30 font-light [-webkit-text-stroke:0px] max-lg:text-base">
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
