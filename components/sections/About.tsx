"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DecodeText } from "@/components/decode-text";
import { ArrowUpRight } from "lucide-react";

export function About() {
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const specTableRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  const specs = [
    { label: "Role", value: "Computer Science Engineering Student" },
    { label: "Location", value: "Kolhapur, India" },
    { label: "Degree", value: "B.Tech CSE, 2027" },
    { label: "CGPA", value: "8.7 / 10" },
    { label: "Languages", value: "Java, C++" },
    { label: "Databases", value: "MySQL" },
    { label: "Tools", value: "Git, GitHub, Linux" },
    { label: "Core Subjects", value: "DSA, DBMS, OOP, Operating Systems" },
  ];

  const statementWords =
    "Bridging software with embedded hardware to solve practical challenges.".split(
      " "
    );

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
    if (window.matchMedia("(hover: none)").matches) return;
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
    <div id="about" className="py-24 sm:py-36 px-6 sm:px-12 lg:px-20 border-b border-white/10 bg-black text-white max-lg:py-20 max-lg:px-5">
      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-24 max-lg:space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 max-lg:pb-4 max-lg:gap-2">
          <div className="font-mono text-xs uppercase tracking-widest text-white/70">
            <DecodeText text="[ 01 // ABOUT ]" />
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-white/70">
            Profile • Kolhapur, India
          </div>
        </div>

        <div className="space-y-10 max-w-6xl max-lg:space-y-8">
          <blockquote
            ref={quoteRef}
            className="font-serif italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.08] text-white font-normal tracking-tight max-lg:text-[clamp(1.75rem,7vw,4.5rem)] max-lg:leading-[1.12] max-lg:break-words"
          >
            {statementWords.map((word, i) => {
              const isFirst = i === 0;
              const isLast = i === statementWords.length - 1;
              return (
                <span
                  key={`${word}-${i}`}
                  className={`quote-word inline-block will-change-[opacity] ${
                    isLast ? "" : "mr-[0.25em]"
                  }`}
                  style={{ opacity: 0.15 }}
                >
                  {isFirst ? `“${word}` : isLast ? `${word}”` : word}
                </span>
              );
            })}
          </blockquote>

          <div className="font-serif italic text-2xl sm:text-4xl text-white/80 font-normal leading-snug max-lg:text-[clamp(1.2rem,4vw,2.25rem)] max-lg:break-words">
            Winner of an internal Smart India Hackathon, TrackShift finalist, and open-source contributor through GSSoC 2026.
          </div>
        </div>

        <div className="space-y-4 max-w-4xl pt-4 max-lg:pt-2">
          <div className="font-mono text-xs uppercase tracking-widest text-white/40">
            <DecodeText text="[ Summary ]" />
          </div>
          <p className="font-sans text-base sm:text-lg text-white/80 font-light leading-relaxed max-lg:text-sm">
            I am a B.Tech Computer Science and Engineering student at D. Y. Patil School of Engineering and Management, Kolhapur. I have hands-on programming experience in Java and C++. I regularly participate in hackathons, where I build complete working systems with teams under tight deadlines. I also contribute to open-source projects through GitHub issues and pull requests.
          </p>
        </div>

        <div className="pt-8 border-t border-white/10 space-y-8 max-lg:pt-6 max-lg:space-y-6">
          <div className="font-mono text-xs uppercase tracking-widest text-white/40">
            <DecodeText text="[ Specifications // Background ]" />
          </div>

          <div ref={specTableRef} className="divide-y divide-white/10 border-t border-white/10">
            {specs.map((spec) => (
              <div
                key={spec.label}
                data-cursor="view"
                data-cursor-label="SPEC"
                className="relative py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-hidden group hover:bg-white/[0.02] px-4 rounded-lg transition-colors max-lg:py-4 max-lg:px-2 max-lg:flex-col max-lg:items-start max-lg:gap-1"
              >
                <div className="font-mono text-xs uppercase tracking-widest text-white/50 max-lg:text-[11px] shrink-0">
                  {spec.label}
                </div>
                <div className="font-mono text-sm sm:text-base text-white font-semibold max-lg:break-words">
                  <DecodeText text={spec.value} />
                </div>
                <div
                  className="spec-row-border absolute bottom-0 left-0 right-0 h-[1px] bg-white/20 origin-left"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 space-y-3 font-mono text-xs text-white/70 max-lg:pt-4 max-lg:space-y-2">
            <div className="text-white/40 uppercase tracking-widest text-[11px]">
              <DecodeText text="[ Certificates ]" />
            </div>
            <div className="space-y-1.5 max-lg:space-y-2">
              <div className="text-white/80 max-lg:text-xs max-lg:leading-relaxed max-lg:break-words">C and C++ Programming — DISHA Computer Institute — Grade A++ — 2023</div>
              <div className="text-white/80 max-lg:text-xs max-lg:leading-relaxed max-lg:break-words">Java Programming — NPTEL, IIT Bombay (Spoken Tutorial) — 2025</div>
            </div>
          </div>

          <div className="flex justify-end pt-4 max-lg:pt-2">
            <a
              ref={btnRef}
              href="#projects"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-white text-black font-mono text-xs uppercase tracking-widest font-semibold hover:bg-white/90 transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none max-lg:w-full max-lg:justify-center max-lg:min-h-[44px]"
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
