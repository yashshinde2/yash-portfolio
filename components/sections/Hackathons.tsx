"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioData } from "@/lib/portfolio-data";
import { ScrambleHeading } from "@/components/ScrambleHeading";
import { ArrowUpRight, Trophy, Users, Zap } from "lucide-react";

function ChequeredFlagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M4 2v20H2V2h2zm2 2h4v3H6V4zm4 0h4v3h-4V4zm4 0h4v3h-4V4zm-8 3h4v3H6V7zm4 0h4v3h-4V7zm4 0h4v3h-4V7zm-8 3h4v3H6v-3zm4 0h4v3h-4v-3zm4 0h4v3h-4v-3zm4-6v10H6V4h14z" />
    </svg>
  );
}

const desktopPositions = [
  "md:top-[40px] md:left-[4%]",
  "md:top-[230px] md:left-[54%]",
  "md:top-[420px] md:left-[4%]",
  "md:top-[610px] md:left-[54%]",
  "md:top-[800px] md:left-[4%]",
  "md:top-[990px] md:left-[54%]",
  "md:top-[1180px] md:left-[4%]",
];

export function Hackathons() {
  const { hackathons } = portfolioData;
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopPathRef = useRef<SVGPathElement>(null);
  const mobilePathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const [activeLap, setActiveLap] = useState<number>(0);

  const totalLaps = hackathons.length + 1;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 768;
    const path = isMobile ? mobilePathRef.current : desktopPathRef.current;
    if (!path || !containerRef.current) return;

    const totalLength = path.getTotalLength();
    path.style.strokeDasharray = `${totalLength}`;
    path.style.strokeDashoffset = `${totalLength}`;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 65%",
      end: "bottom 75%",
      scrub: 0.3,
      onUpdate: (self) => {
        const progress = Math.min(Math.max(self.progress, 0), 1);
        path.style.strokeDashoffset = `${totalLength * (1 - progress)}`;

        const point = path.getPointAtLength(progress * totalLength);
        if (dotRef.current) {
          dotRef.current.setAttribute("cx", `${point.x}`);
          dotRef.current.setAttribute("cy", `${point.y}`);
        }
        if (pulseRef.current) {
          pulseRef.current.setAttribute("cx", `${point.x}`);
          pulseRef.current.setAttribute("cy", `${point.y}`);
        }

        const currentLapIndex = Math.floor(progress * totalLaps);
        setActiveLap(Math.min(currentLapIndex, totalLaps - 1));
      },
    });

    return () => {
      trigger.kill();
    };
  }, [totalLaps]);

  const desktopD =
    "M 400 0 C 400 50, 360 50, 360 100 C 360 200, 440 200, 440 300 C 440 400, 360 400, 360 500 C 360 600, 440 600, 440 700 C 440 800, 360 800, 360 900 C 360 1000, 440 1000, 440 1100 C 440 1200, 360 1200, 360 1300 C 360 1380, 400 1380, 400 1440";

  const mobileD = "M 24 0 L 24 1440";

  return (
    <div
      ref={containerRef}
      className="py-24 sm:py-36 px-4 sm:px-8 lg:px-16 border-b border-white/10 bg-black text-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto mb-16 sm:mb-24 text-center space-y-4">
        <div className="font-mono text-xs uppercase tracking-widest text-white/70">
          <ScrambleHeading text="[ 04 // HACKATHONS & EXPERIENCE ]" as="span" />
        </div>
        <ScrambleHeading
          text="GRAND PRIX // COMPETITIONS"
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter uppercase font-sans text-white"
        />
        <div className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest text-white/70">
          <span>Circuit Telemetry</span>
          <span>✦</span>
          <span>7 Competitive Laps</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative md:min-h-[1480px]">
        <svg
          viewBox="0 0 800 1440"
          className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-10"
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
          viewBox="0 0 48 1440"
          className="md:hidden absolute inset-0 w-12 h-full pointer-events-none z-10"
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
        </svg>

        <div className="relative z-20 space-y-8 md:space-y-0">
          {hackathons.map((event, index) => {
            const lapNum = String(index + 1).padStart(2, "0");
            const posClass = desktopPositions[index] || "md:top-0 md:left-0";
            const isWinner = event.achievement === "Winner";
            const isOrganizer = event.achievement === "Organizer";
            const isPassed = activeLap >= index;

            return (
              <div
                key={`${event.date}-${event.title}`}
                className={`relative md:absolute md:w-[42%] transition-all duration-300 ${posClass}`}
              >
                <div className="pl-12 md:pl-0">
                  <div className="md:hidden absolute left-3 top-3 w-6 h-6 rounded-full border border-white/40 bg-black flex items-center justify-center font-mono text-[9px] text-white">
                    {lapNum}
                  </div>

                  <div
                    className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 backdrop-blur-md ${
                      isPassed
                        ? "border-white/30 bg-white/[0.04] shadow-[0_0_30px_rgba(255,255,255,0.03)]"
                        : "border-white/10 bg-white/[0.01]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs uppercase tracking-widest text-white/40">
                          LAP {lapNum}
                        </span>
                        <span className="text-white/20 font-mono">•</span>
                        <span className="font-mono text-xs text-white/60">
                          {event.date}
                        </span>
                      </div>

                      <div
                        className={`px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider font-semibold border flex items-center gap-1.5 ${
                          isWinner
                            ? "bg-white text-black border-white"
                            : isOrganizer
                            ? "border-white/40 text-white bg-white/10"
                            : "border-white/20 text-white/70 bg-white/[0.02]"
                        }`}
                      >
                        {isWinner ? (
                          <Trophy className="w-3 h-3" />
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
                      <p className="text-white/70">
                        <span className="text-white/30">TEAM //</span> {event.team}
                      </p>
                      <p className="text-white/70">
                        <span className="text-white/30">PROJECT //</span> {event.project}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div
            className={`relative md:absolute md:w-[42%] md:top-[1180px] md:left-[4%] transition-all duration-300`}
          >
            <div className="pl-12 md:pl-0">
              <div className="md:hidden absolute left-3 top-3 w-6 h-6 rounded-full border border-white/40 bg-black flex items-center justify-center font-mono text-[9px] text-white">
                07
              </div>

              <a
                href="#contact"
                className={`block p-6 sm:p-8 rounded-2xl border transition-all duration-300 backdrop-blur-md group hover:border-white/50 hover:bg-white/[0.06] ${
                  activeLap >= 6
                    ? "border-white/40 bg-white/[0.04] shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                    : "border-white/10 bg-white/[0.01]"
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-widest text-white/40">
                      LAP 07
                    </span>
                    <span className="text-white/20 font-mono">•</span>
                    <span className="font-mono text-xs text-white/60">
                      NEXT RACE
                    </span>
                  </div>

                  <div className="px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider font-semibold border flex items-center gap-1.5 bg-white text-black border-white">
                    <ChequeredFlagIcon className="w-3.5 h-3.5" />
                    <span>Next Checkpoint</span>
                  </div>
                </div>

                <h3 className="font-sans font-bold text-xl sm:text-2xl text-white tracking-tight mb-2 group-hover:text-white transition-colors">
                  NEXT: YOUR TEAM?
                </h3>

                <div className="space-y-1.5 font-mono text-xs pt-2 border-t border-white/10">
                  <p className="text-white/70">
                    <span className="text-white/30">STATUS //</span> Open to High-Impact Engineering Roles
                  </p>
                  <p className="text-white/70">
                    <span className="text-white/30">OBJECTIVE //</span> Build Next-Gen Systems Together
                  </p>
                </div>

                <div className="mt-5 inline-flex items-center gap-2 font-mono text-xs text-white uppercase tracking-wider group-hover:underline">
                  <span>Connect at Contact</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="hidden md:flex absolute bottom-0 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-20 font-mono text-xs uppercase tracking-widest text-white/50">
          <ChequeredFlagIcon className="w-4 h-4 text-white" />
          <span>Finish Line // Sector Completed</span>
        </div>
      </div>
    </div>
  );
}
