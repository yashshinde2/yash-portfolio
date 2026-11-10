"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioData } from "@/lib/portfolio-data";
import { DecodeText } from "@/components/decode-text";
import { Flag, Trophy, Users, Zap } from "lucide-react";

function ChequeredFlagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4 2v20H2V2h2zm2 2h4v3H6V4zm4 0h4v3h-4V4zm4 0h4v3h-4V4zm-8 3h4v3H6V7zm4 0h4v3h-4V7zm4 0h4v3h-4V7zm-8 3h4v3H6v-3zm4 0h4v3h-4v-3zm4 0h4v3h-4v-3zm4-6v10H6V4h14z" />
    </svg>
  );
}

const desktopPositions = [
  "lg:top-[40px] lg:left-[4%]",
  "lg:top-[230px] lg:left-[54%]",
  "lg:top-[420px] lg:left-[4%]",
  "lg:top-[610px] lg:left-[54%]",
  "lg:top-[800px] lg:left-[4%]",
  "lg:top-[990px] lg:left-[54%]",
  "lg:top-[1180px] lg:left-[4%]",
  "lg:top-[1370px] lg:left-[54%]",
];

interface Particle {
  id: number;
  x: number;
  y: number;
  char: string;
  createdAt: number;
}

export function Hackathons() {
  const { hackathons } = portfolioData;
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopPathRef = useRef<SVGPathElement>(null);
  const mobilePathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const mobileDotRef = useRef<SVGCircleElement>(null);
  const mobilePulseRef = useRef<SVGCircleElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const [activeLap, setActiveLap] = useState<number>(0);

  const totalLaps = hackathons.length;

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      cardsRef.current.forEach((c) => {
        if (c) {
          c.style.clipPath = "inset(0% 0 0 0)";
          c.style.opacity = "1";
          c.style.transform = "none";
        }
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 1024;
    const path = isMobile ? mobilePathRef.current : desktopPathRef.current;
    if (!path || !containerRef.current) return;

    const totalLength = path.getTotalLength();
    path.style.strokeDasharray = `${totalLength}`;
    path.style.strokeDashoffset = `${totalLength}`;

    let lastEmit = 0;
    let rafId: number;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 65%",
      end: "bottom 75%",
      scrub: 0.3,
      onUpdate: (self) => {
        const progress = Math.min(Math.max(self.progress, 0), 1);
        path.style.strokeDashoffset = `${totalLength * (1 - progress)}`;

        const point = path.getPointAtLength(progress * totalLength);
        const activeDot = isMobile ? mobileDotRef.current : dotRef.current;
        const activePulse = isMobile ? mobilePulseRef.current : pulseRef.current;

        if (activeDot) {
          activeDot.setAttribute("cx", `${point.x}`);
          activeDot.setAttribute("cy", `${point.y}`);
        }
        if (activePulse) {
          activePulse.setAttribute("cx", `${point.x}`);
          activePulse.setAttribute("cy", `${point.y}`);
        }

        const now = performance.now();
        if (now - lastEmit > 75) {
          lastEmit = now;
          particlesRef.current.push({
            id: Math.random(),
            x: point.x + (Math.random() - 0.5) * 12,
            y: point.y + (Math.random() - 0.5) * 12,
            char: Math.random() > 0.5 ? "1" : "0",
            createdAt: now,
          });
        }

        const currentLapIndex = Math.floor(progress * totalLaps);
        setActiveLap(Math.min(currentLapIndex, totalLaps - 1));
      },
    });

    const updateParticles = () => {
      const now = performance.now();
      particlesRef.current = particlesRef.current.filter((p) => now - p.createdAt < 600);
      setParticles([...particlesRef.current]);
      rafId = requestAnimationFrame(updateParticles);
    };
    rafId = requestAnimationFrame(updateParticles);

    cardsRef.current.forEach((card, idx) => {
      if (!card) return;
      const isLeft = idx % 2 === 0;
      gsap.fromTo(
        card,
        {
          clipPath: isLeft ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
          x: isLeft ? -40 : 40,
          opacity: 0,
        },
        {
          clipPath: "inset(0 0% 0 0)",
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true,
            onEnter: () => {
              const badge = card.querySelector(".winner-badge");
              if (badge) {
                gsap.fromTo(
                  badge,
                  { scale: 1 },
                  { scale: 1.18, duration: 0.22, yoyo: true, repeat: 1, ease: "power2.out" }
                );
              }
            },
          },
        }
      );
    });

    return () => {
      trigger.kill();
      cancelAnimationFrame(rafId);
    };
  }, [totalLaps]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateX = -py * 4;
    const rotateY = px * 4;
    gsap.to(target, {
      rotateX,
      rotateY,
      borderColor: "rgba(255, 255, 255, 0.6)",
      duration: 0.25,
      ease: "power2.out",
      transformPerspective: 900,
    });
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    gsap.to(target, {
      rotateX: 0,
      rotateY: 0,
      borderColor: "rgba(255, 255, 255, 0.1)",
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  };

  const desktopD =
    "M 400 0 C 400 50, 360 50, 360 100 C 360 200, 440 200, 440 300 C 440 400, 360 400, 360 500 C 360 600, 440 600, 440 700 C 440 800, 360 800, 360 900 C 360 1000, 440 1000, 440 1100 C 440 1200, 360 1200, 360 1300 C 360 1380, 420 1380, 420 1460 C 420 1540, 400 1580, 400 1650";

  const mobileD = "M 24 0 L 24 1650";

  return (
    <div
      ref={containerRef}
      className="py-24 sm:py-36 px-4 sm:px-8 lg:px-16 border-b border-white/10 bg-black text-white relative overflow-hidden max-lg:py-20 max-lg:px-5"
    >
      <div className="max-w-7xl mx-auto mb-16 sm:mb-24 text-center space-y-4">
        <div className="font-mono text-xs uppercase tracking-widest text-white/70">
          <DecodeText text="[ 04 // HACKATHONS & EXPERIENCE ]" />
        </div>
        <DecodeText
          text="GRAND PRIX // COMPETITIONS"
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter uppercase font-sans text-white block max-lg:text-3xl"
        />
        <div className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest text-white/70 max-lg:flex-col max-lg:gap-1.5">
          <span>Circuit Telemetry</span>
          <span className="max-lg:hidden">✦</span>
          <span>8 Laps // Competitions, Organizing, Open Source</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative lg:min-h-[1760px]">
        <svg
          viewBox="0 0 800 1650"
          className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-10"
          preserveAspectRatio="none"
        >
          <path
            d={desktopD}
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
          <path
            ref={desktopPathRef}
            d={desktopD}
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {particles.map((p) => {
            const age = performance.now() - p.createdAt;
            const opacity = Math.max(0, 1 - age / 600);
            return (
              <text
                key={p.id}
                x={p.x}
                y={p.y}
                fill="#ffffff"
                opacity={opacity}
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {p.char}
              </text>
            );
          })}
          <circle
            ref={pulseRef}
            cx="400"
            cy="0"
            r="12"
            fill="none"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="1.5"
          />
          <circle
            ref={dotRef}
            cx="400"
            cy="0"
            r="6"
            fill="#ffffff"
            className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
          />
        </svg>

        <svg
          viewBox="0 0 48 1650"
          className="lg:hidden absolute left-0 top-0 bottom-28 w-12 pointer-events-none z-10"
          preserveAspectRatio="none"
        >
          <path
            d={mobileD}
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <path
            ref={mobilePathRef}
            d={mobileD}
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle
            ref={mobilePulseRef}
            cx="24"
            cy="0"
            r="10"
            fill="none"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="1.5"
          />
          <circle
            ref={mobileDotRef}
            cx="24"
            cy="0"
            r="5"
            fill="#ffffff"
            className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
          />
        </svg>

        <div className="relative z-20 space-y-8 lg:space-y-0">
          {hackathons.map((event, index) => {
            const lapNum = String(index + 1).padStart(2, "0");
            const posClass = desktopPositions[index] || "lg:top-0 lg:left-0";
            const isWinner = event.achievement === "Winner";
            const isFinalist = event.achievement === "Finalist";
            const isOrganizer = event.achievement === "Organizer";
            const isPassed = activeLap >= index;

            return (
              <div
                key={`${event.date}-${event.title}`}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className={`relative lg:absolute lg:w-[42%] will-change-[clip-path,transform] ${posClass}`}
                style={{ perspective: "900px" }}
              >
                <div className="pl-14 lg:pl-0">
                  <div className="lg:hidden absolute left-0 w-12 top-7 -translate-y-1/2 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border border-white/40 bg-black flex items-center justify-center font-mono text-[9px] text-white">
                      <DecodeText text={lapNum} />
                    </div>
                  </div>

                  <div
                    onMouseMove={handleCardMouseMove}
                    onMouseLeave={handleCardMouseLeave}
                    data-cursor="view"
                    data-cursor-label="RACE"
                    className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 backdrop-blur-md will-change-transform ${
                      isPassed
                        ? "border-white/30 bg-white/[0.04] shadow-[0_0_30px_rgba(255,255,255,0.03)]"
                        : "border-white/10 bg-white/[0.01]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-widest text-white/40">
                          <DecodeText text={`LAP ${lapNum}`} />
                        </span>
                        <span className="text-white/20 font-mono">•</span>
                        <span className="font-mono text-xs text-white/60">
                          {event.date}
                        </span>
                      </div>

                      <div
                        className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider font-semibold border flex items-center gap-1.5 ${
                          isWinner || isFinalist
                            ? "winner-badge bg-white text-black border-white"
                            : "border-white/20 text-white/70 bg-white/[0.02]"
                        }`}
                      >
                        {isWinner ? (
                          <Trophy className="w-3 h-3" />
                        ) : isFinalist ? (
                          <Flag className="w-3 h-3" />
                        ) : isOrganizer ? (
                          <Zap className="w-3 h-3" />
                        ) : (
                          <Users className="w-3 h-3" />
                        )}
                        <span>{event.achievement}</span>
                      </div>
                    </div>

                    <h3 className="font-sans font-bold text-xl sm:text-2xl text-white tracking-tight mb-4">
                      {event.title}
                    </h3>

                    <div className="space-y-1.5 font-mono text-xs pt-2 border-t border-white/10">
                      {"details" in event && Array.isArray((event as any).details) ? (
                        ((event as any).details as { label: string; value: string }[]).map((d) => (
                          <p key={d.label} className="text-white/70">
                            <span className="text-white/30">{d.label} //</span> {d.value}
                          </p>
                        ))
                      ) : (
                        <>
                          <p className="text-white/70">
                            <span className="text-white/30">TEAM //</span> {event.team}
                          </p>
                          <p className="text-white/70">
                            <span className="text-white/30">PROJECT //</span> {event.project}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50 text-center my-16 lg:my-0 lg:absolute lg:top-[1650px] lg:left-1/2 lg:-translate-x-1/2 z-20">
          <ChequeredFlagIcon className="w-4 h-4 text-white" />
          <span>Finish Line // Sector Completed</span>
        </div>
      </div>
    </div>
  );
}
