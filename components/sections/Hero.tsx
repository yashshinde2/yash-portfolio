"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import gsap from "gsap";
import { portfolioData } from "@/lib/portfolio-data";
import { ArrowDown, ArrowUpRight, Download, Mail } from "lucide-react";

const BinaryPhoto = dynamic(
  () => import("@/components/binary-photo").then((m) => m.BinaryPhoto),
  { ssr: false }
);

const BinaryTrail = dynamic(
  () => import("@/components/binary-trail").then((m) => m.BinaryTrail),
  { ssr: false }
);

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function MagneticAnchor({
  children,
  className,
  href,
  ariaLabel,
  download,
  target,
  rel,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
  ariaLabel?: string;
  download?: boolean | string;
  target?: string;
  rel?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse), (hover: none)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
    gsap.to(el, { x, y, scale: 1.04, duration: 0.25, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, scale: 1, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      download={download}
      target={target}
      rel={rel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </a>
  );
}

export function Hero() {
  const { hero, social } = portfolioData;
  const [istTime, setIstTime] = useState("");
  const [mounted, setMounted] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const frontTextRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

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
      setIstTime(`${formatted} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse), (hover: none)").matches) return;
    const { innerWidth, innerHeight } = window;
    const normX = (e.clientX / innerWidth - 0.5) * 2;
    const normY = (e.clientY / innerHeight - 0.5) * 2;

    const textTargets = [textRef.current, frontTextRef.current].filter(Boolean);
    if (textTargets.length > 0) {
      gsap.to(textTargets, {
        x: normX * -16,
        y: normY * -10,
        duration: 0.6,
        ease: "power2.out",
      });
    }

    if (photoRef.current) {
      gsap.to(photoRef.current, {
        x: normX * 12,
        y: normY * 8,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  };

  const line1 = "YASH".split("");
  const line2 = "SHINDE".split("");

  const socialIcons: Record<string, React.ReactNode> = {
    GitHub: <GithubIcon className="w-4 h-4" />,
    LinkedIn: <LinkedinIcon className="w-4 h-4" />,
    Email: <Mail className="w-4 h-4" />,
  };

  return (
    <section
      data-hero
      data-cursor="binary"
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative h-[100svh] min-h-[580px] w-full overflow-hidden bg-black text-white select-none flex flex-col justify-between pt-16 pb-6 px-4 sm:px-12 border-b border-white/10"
    >
      <div className="pointer-events-none absolute inset-0 z-[15] mix-blend-difference">
        {mounted && <BinaryTrail />}
      </div>

      <div className="relative z-30 flex items-center justify-between w-full font-mono text-[11px] sm:text-xs uppercase tracking-widest text-white/70 pointer-events-none pt-[calc(max(0.5rem,env(safe-area-inset-top)))]">
        <div>B.Tech CSE &apos;27 <span className="hidden sm:inline">• Kolhapur, IN</span></div>
        <div className="tabular-nums">{istTime || "LIVE IST"}</div>
      </div>

      <div
        ref={textRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
      >
        <div className="text-center font-sans font-black tracking-tighter uppercase leading-[0.85] sm:leading-[0.82] text-[clamp(2.75rem,14vw,18vw)] text-white">
          <div className="overflow-hidden">
            {line1.map((char, i) => (
              <motion.span
                key={`l1-${i}`}
                initial={{ y: "115%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.9,
                  delay: 0.2 + i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </div>

          <div className="overflow-hidden">
            {line2.map((char, i) => (
              <motion.span
                key={`l2-${i}`}
                initial={{ y: "115%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.9,
                  delay: 0.4 + i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={photoRef}
        className="absolute bottom-0 inset-x-0 z-20 pointer-events-none flex justify-center items-end h-[58vh] sm:h-[80vh] w-full"
      >
        <div className="relative h-full w-full max-w-4xl flex items-end justify-center pointer-events-none [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]">
          {mounted && (
            <BinaryPhoto
              src="/yash.png"
              alt={hero.name}
              className="pointer-events-auto filter grayscale contrast-[1.15] w-[clamp(200px,60vw,520px)] sm:w-[min(520px,88vw)] max-w-full"
            />
          )}
        </div>
      </div>

      <div
        ref={frontTextRef}
        className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
      >
        <div
          className="text-center font-sans font-black tracking-tighter uppercase leading-[0.85] sm:leading-[0.82] text-[clamp(2.75rem,14vw,18vw)] pointer-events-none"
          style={{
            WebkitTextStroke: "1px rgba(255, 255, 255, 0.35)",
            color: "transparent",
          }}
        >
          <div className="overflow-hidden pointer-events-none">
            {line1.map((char, i) => (
              <motion.span
                key={`fl1-${i}`}
                initial={{ y: "115%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.9,
                  delay: 0.2 + i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block pointer-events-none"
              >
                {char}
              </motion.span>
            ))}
          </div>

          <div className="overflow-hidden pointer-events-none">
            {line2.map((char, i) => (
              <motion.span
                key={`fl2-${i}`}
                initial={{ y: "115%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.9,
                  delay: 0.4 + i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block pointer-events-none"
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-3 sm:mt-4 font-serif italic text-lg sm:text-3xl md:text-4xl text-white/90 font-normal tracking-wide pointer-events-none px-4 text-center"
        >
          {hero.headline}
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-25" />

      <div className="relative z-40 w-full flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 sm:gap-6 pointer-events-none pb-[calc(max(0.5rem,env(safe-area-inset-bottom)))]">
        <div className="hidden sm:flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/70">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>Kolhapur, IN</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <div className="flex flex-col min-[480px]:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <MagneticAnchor
              href="#projects"
              className="pointer-events-auto w-full min-[480px]:w-auto min-h-[44px] px-6 py-3 rounded-full bg-white text-black font-mono text-xs uppercase tracking-widest font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-1.5"
            >
              <span>View Projects</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </MagneticAnchor>

            <MagneticAnchor
              href={hero.resumeLink}
              download="Yash_Shinde_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel="Download Yash Shinde Resume PDF"
              className="pointer-events-auto w-full min-[480px]:w-auto min-h-[44px] px-6 py-3 rounded-full border border-white/20 text-white font-mono text-xs uppercase tracking-widest hover:border-white hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <span>Download Resume</span>
              <Download className="w-3.5 h-3.5" />
            </MagneticAnchor>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1 sm:pt-0 sm:pl-2">
            {social.map((link) => (
              <MagneticAnchor
                key={link.name}
                href={link.url}
                ariaLabel={link.name}
                className="pointer-events-auto w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white hover:bg-white/10 transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                {socialIcons[link.name] || <ArrowUpRight className="w-3.5 h-3.5" />}
              </MagneticAnchor>
            ))}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/70">
          <span>Scroll</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
