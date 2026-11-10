"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { AnimatePresence, motion } from "framer-motion";

export function Footer() {
  const { social } = portfolioData;
  const [timeChars, setTimeChars] = useState<string[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);
      setTimeChars(`${formatted} IST`.split(""));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    const footer = footerRef.current;
    if (!track || !footer) return;

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
        });
      },
      { threshold: 0 }
    );
    observer.observe(footer);

    let xPos = 0;
    let direction = -1;
    const isMobile =
      window.innerWidth < 768 ||
      window.matchMedia("(pointer: coarse)").matches;
    const baseSpeed = isMobile ? 0.6 : 1.0;
    let currentSpeed = baseSpeed;

    const scrollTrigger = ScrollTrigger.create({
      onUpdate: (self) => {
        if (self.direction === 1) {
          direction = -1;
        } else if (self.direction === -1) {
          direction = 1;
        }
        const velocity = Math.abs(self.getVelocity());
        currentSpeed = baseSpeed + Math.min(velocity * 0.003, isMobile ? 3 : 6);
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

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse), (hover: none)").matches) return;
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 14;
    const y = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * 14;
    gsap.to(btn, { x, y, scale: 1.04, duration: 0.25, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    const btn = btnRef.current;
    if (!btn) return;
    gsap.to(btn, { x: 0, y: 0, scale: 1, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  };

  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, {
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const tickerItems = [
    "YASH SANDEEP SHINDE",
    "JAVA",
    "C++",
    "OPEN SOURCE",
    "HACKATHONS",
    "COMPUTER SCIENCE '27",
  ];

  const duplicated = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <footer
      ref={footerRef}
      className="relative bg-black text-white border-t border-white/10 overflow-hidden select-none pb-[calc(max(2rem,env(safe-area-inset-bottom)))]"
    >
      <div className="py-4 sm:py-6 border-b border-white/10 overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-6 sm:gap-8 whitespace-nowrap will-change-transform"
        >
          {duplicated.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="flex items-center gap-6 sm:gap-8 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-white/70"
            >
              <span>{item}</span>
              <span className="text-white/30">✦</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-12 py-12 sm:py-24 space-y-12 sm:space-y-16">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 sm:gap-8 text-center sm:text-left">
          <div className="flex flex-col items-center sm:items-start">
            <div className="font-mono text-xs uppercase tracking-widest text-white/70 mb-2 sm:mb-3">
              KOLHAPUR, MH, INDIA // 16.7050° N, 74.2433° E
            </div>
            <div className="font-mono text-2xl sm:text-4xl text-white font-bold tracking-tight flex items-center h-10">
              {timeChars.map((char, index) => (
                <span
                  key={`col-${index}`}
                  className="inline-block overflow-hidden relative"
                  style={{ width: char === " " ? "0.45em" : char === ":" ? "0.35em" : "0.62em" }}
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={`${char}-${index}`}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  </AnimatePresence>
                </span>
              ))}
            </div>
          </div>

          <button
            ref={btnRef}
            onClick={scrollToTop}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="self-center sm:self-auto min-h-[44px] px-6 py-3.5 rounded-full border border-white/20 bg-white/5 hover:border-white hover:bg-white hover:text-black transition-all duration-300 font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-3 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            aria-label="Back to top"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-8 sm:pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs uppercase tracking-widest text-white/70 text-center sm:text-left">
          <div className="text-[11px] sm:text-xs">
            © 2026 Yash Sandeep Shinde. Built with Next.js, GSAP & Tailwind.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6">
            <a
              href="/Yash_Shinde.pdf"
              download="Yash_Shinde_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Resume PDF"
              className="min-h-[44px] px-2 py-2 hover:text-white transition-colors flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-white focus-visible:outline-none link-hover"
            >
              <span>Resume</span>
              <ArrowUpRight className="w-3 h-3 text-white/50" />
            </a>
            {social.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="min-h-[44px] px-2 py-2 hover:text-white transition-colors flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-white focus-visible:outline-none link-hover"
              >
                <span>{link.name}</span>
                <ArrowUpRight className="w-3 h-3 text-white/50" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
