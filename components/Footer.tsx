"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";

export function Footer() {
  const { social } = portfolioData;
  const [kolhapurTime, setKolhapurTime] = useState("");
  const btnRef = useRef<HTMLButtonElement>(null);

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
      setKolhapurTime(`${formatted} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
    gsap.to(btn, { x, y, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    const btn = btnRef.current;
    if (!btn) return;
    gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tickerItems = [
    "YASH SANDEEP SHINDE",
    "SYSTEMS ARCHITECTURE",
    "EMBEDDED HARDWARE",
    "BACKEND PROTOCOLS",
    "IOT SENSORS",
    "COMPUTER SCIENCE '27",
  ];

  const duplicated = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <footer className="relative bg-black text-white border-t border-white/10 overflow-hidden select-none">
      <div className="py-6 border-b border-white/10 overflow-hidden">
        <div className="flex gap-8 whitespace-nowrap animate-[marquee_30s_linear_infinite] will-change-transform">
          {duplicated.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-white/70"
            >
              <span>{item}</span>
              <span className="text-white/30">✦</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-white/70 mb-3">
              KOLHAPUR, MH, INDIA // 16.7050° N, 74.2433° E
            </div>
            <div className="font-mono text-2xl sm:text-4xl text-white font-bold tracking-tight">
              {kolhapurTime || "LOCAL TIME"}
            </div>
          </div>

          <button
            ref={btnRef}
            onClick={scrollToTop}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="self-start md:self-auto px-6 py-4 rounded-full border border-white/20 bg-white/5 hover:border-white hover:bg-white hover:text-black transition-all duration-300 font-mono text-xs uppercase tracking-widest flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            aria-label="Back to top"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs uppercase tracking-widest text-white/70">
          <div>© 2026 Yash Sandeep Shinde. Built with Next.js, GSAP & Tailwind.</div>

          <div className="flex items-center gap-6">
            {social.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="hover:text-white transition-colors flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-white focus-visible:outline-none"
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
