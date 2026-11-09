"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioData } from "@/lib/portfolio-data";
import { DecodeText } from "@/components/decode-text";
import { ArrowUpRight } from "lucide-react";

export function About() {
  const { hero } = portfolioData;
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const specTableRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  const specs = [
    { label: "Role", value: hero.headline },
    { label: "Location", value: hero.location },
    { label: "Degree", value: "B.Tech CSE '27" },
    { label: "Core Stack", value: "C++, Java, Go, Node.js, Python" },
  ];

  const quoteWords = "Bridging software with embedded hardware to solve practical challenges.".split(" ");

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      quoteRef.current?.querySelectorAll(".quote-word").forEach((w) => {
        (w as HTMLElement).style.opacity = "1";
      });
      specTableRef.current?.querySelectorAll(".spec-row-border").forEach((b) => {
        (b as HTMLElement).style.transform = "scaleX(1)";
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const words = quoteRef.current?.querySelectorAll(".quote-word");
    if (words && words.length > 0) {
      gsap.to(words, {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: quoteRef.current,
          start: "top 80%",
          end: "bottom 45%",
          scrub: true,
        },
      });
    }

    const borders = specTableRef.current?.querySelectorAll(".spec-row-border");
    if (borders && borders.length > 0) {
      gsap.to(borders, {
        scaleX: 1,
        duration: 0.45,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: specTableRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }
  }, []);

  const handleMagneticMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 14;
    const y = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * 14;
    gsap.to(btn, { x, y, duration: 0.25, ease: "power2.out" });
  };

  const handleMagneticLeave = () => {
    const btn = btnRef.current;
    if (!btn) return;
    gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <div className="py-24 sm:py-36 px-6 sm:px-12 lg:px-20 border-b border-white/10 bg-black text-white">
      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="font-mono text-xs uppercase tracking-widest text-white/70">
            <DecodeText text="[ 01 // ABOUT ]" />
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-white/70">
            Engineering Philosophy • Kolhapur, India
          </div>
        </div>

        <div className="space-y-10 max-w-6xl">
          <blockquote
            ref={quoteRef}
            className="font-serif italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.08] text-white font-normal tracking-tight"
          >
            &ldquo;
            {quoteWords.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="quote-word inline-block mr-[0.25em] will-change-[opacity]"
                style={{ opacity: 0.15 }}
              >
                {word}
              </span>
            ))}
            &rdquo;
          </blockquote>

          <div className="font-serif italic text-2xl sm:text-4xl text-white/80 font-normal leading-snug">
            Tested under pressure across national hackathons, building low-latency backend systems and connected hardware.
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 space-y-8">
          <div className="font-mono text-xs uppercase tracking-widest text-white/40">
            <DecodeText text="[ Specifications // Background ]" />
          </div>

          <div ref={specTableRef} className="divide-y divide-white/10 border-t border-white/10">
            {specs.map((spec) => (
              <div
                key={spec.label}
                data-cursor="view"
                data-cursor-label="SPEC"
                className="relative py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-hidden group hover:bg-white/[0.02] px-4 rounded-lg transition-colors"
              >
                <div className="font-mono text-xs uppercase tracking-widest text-white/50">
                  {spec.label}
                </div>
                <div className="font-mono text-sm sm:text-base text-white font-semibold">
                  <DecodeText text={spec.value} />
                </div>
                <div
                  className="spec-row-border absolute bottom-0 left-0 right-0 h-[1px] bg-white/20 origin-left"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <a
              ref={btnRef}
              href="#projects"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-white text-black font-mono text-xs uppercase tracking-widest font-semibold hover:bg-white/90 transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <span>Explore Projects</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
