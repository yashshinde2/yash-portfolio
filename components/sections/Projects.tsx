"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioData } from "@/lib/portfolio-data";
import { Award, ArrowUpRight, ChevronDown, Terminal } from "lucide-react";
import { DecodeText } from "@/components/decode-text";

type ProjectItem = (typeof portfolioData.projects)[number];

export function Projects() {
  const { projects } = portfolioData;
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [hoveredProject, setHoveredProject] = useState<ProjectItem | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      rowsRef.current.forEach((r) => {
        if (r) r.style.clipPath = "inset(0% 0 0 0)";
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const rows = rowsRef.current.filter(Boolean);
    if (rows.length > 0) {
      gsap.fromTo(
        rows,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

    if (window.matchMedia("(pointer: coarse)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let lastX = 0;
    let currentTilt = 0;
    let targetTilt = 0;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX + 28;
      targetY = e.clientY + 20;
      const vx = e.clientX - lastX;
      lastX = e.clientX;
      targetTilt = Math.max(-8, Math.min(8, vx * 0.4));
    };

    const loop = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      currentTilt += (targetTilt - currentTilt) * 0.15;
      targetTilt += (0 - targetTilt) * 0.08;

      if (cardRef.current) {
        gsap.set(cardRef.current, {
          x: currentX,
          y: currentY,
          rotation: currentTilt,
        });
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="py-24 sm:py-36 px-6 sm:px-12 lg:px-20 border-b border-white/10 bg-black text-white relative">
      <div className="max-w-7xl mx-auto mb-16 sm:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-white/70 mb-3">
            <DecodeText text="[ 03 // PROJECTS ]" />
          </div>
          <DecodeText
            text="SELECTED WORKS"
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter uppercase font-sans text-white block"
          />
        </div>

        <p className="text-white/60 font-sans text-base max-w-md font-light leading-relaxed">
          Hardware-integrated systems and real-time applications pushing the boundaries of software-hardware integration
        </p>
      </div>

      <div ref={listRef} className="max-w-7xl mx-auto border-t border-white/10 divide-y divide-white/10">
        {projects.map((project, index) => {
          const isExpanded = expandedId === project.id;
          const num = String(index + 1).padStart(2, "0");

          return (
            <div
              key={project.id}
              ref={(el) => {
                rowsRef.current[index] = el;
              }}
              className="group transition-colors duration-200 will-change-[clip-path]"
              style={{ clipPath: "inset(0% 0 0 0)" }}
              onMouseEnter={() => setHoveredProject(project)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div
                onClick={() => toggleExpand(project.id)}
                className="relative cursor-pointer py-8 sm:py-12 px-4 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-xl sm:rounded-2xl overflow-hidden transition-colors duration-300"
              >
                <div className="absolute inset-0 bg-white origin-bottom scale-y-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 z-0 pointer-events-none rounded-xl sm:rounded-2xl" />

                <div className="relative z-10 flex items-baseline gap-6 sm:gap-12 transition-colors duration-300 group-hover:text-black">
                  <span className="font-mono text-sm sm:text-lg tracking-widest text-white/70 group-hover:text-black/70 select-none">
                    <DecodeText text={num} on="hover" />
                  </span>
                  <div>
                    <h3 className="font-sans font-black text-[clamp(2rem,5vw,4.5rem)] tracking-[-0.02em] uppercase leading-[0.95] transition-transform duration-300 ease-out group-hover:translate-x-6">
                      {project.title}
                    </h3>
                  </div>
                </div>

                <div className="relative z-10 flex items-center gap-4 self-end md:self-center">
                  {project.award && (
                    <span className="px-3 py-1 rounded-full border border-white/20 text-white font-mono text-[10px] uppercase tracking-wider group-hover:border-black/30 group-hover:text-black group-hover:bg-black/5 transition-colors">
                      Award Winner
                    </span>
                  )}
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:border-black group-hover:bg-black group-hover:text-white transition-all duration-300 group-hover:scale-105">
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden bg-white/[0.03] rounded-2xl my-4 border border-white/10"
                  >
                    <div className="p-6 sm:p-10 space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-6">
                          <div>
                            <div className="font-mono text-xs uppercase tracking-widest text-white/40 mb-2">
                              <DecodeText text="[ Overview ]" />
                            </div>
                            <p className="font-sans text-base sm:text-xl text-white/80 font-light leading-relaxed">
                              {project.description}
                            </p>
                          </div>

                          {project.highlights && (
                            <div>
                              <div className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">
                                <DecodeText text="[ Highlights ]" />
                              </div>
                              <div className="space-y-2">
                                {project.highlights.map((highlight) => (
                                  <div
                                    key={highlight}
                                    className="flex items-center gap-2 font-mono text-xs text-white/70"
                                  >
                                    <span className="text-white/40">✦</span>
                                    <span>{highlight}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="lg:col-span-4 flex flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
                          <div>
                            <div className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">
                              <DecodeText text="[ Technologies ]" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-white/80 font-mono text-xs uppercase tracking-wider"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-between px-6 py-4 rounded-xl bg-white text-black font-mono text-xs uppercase tracking-widest font-semibold hover:bg-white/90 transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                          >
                            <span>Open Project</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div
        ref={cardRef}
        className={`fixed top-0 left-0 pointer-events-none z-50 w-72 sm:w-80 rounded-2xl border border-white/20 bg-black/95 text-white p-5 shadow-2xl backdrop-blur-md transition-opacity duration-200 hidden md:block will-change-transform ${
          hoveredProject ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {hoveredProject && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-white/50 border-b border-white/10 pb-2">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-white/40" />
                <span>Project Preview</span>
              </span>
              <span>0{hoveredProject.id}</span>
            </div>

            <div className="font-sans font-bold text-base text-white leading-tight">
              {hoveredProject.title}
            </div>

            <p className="text-white/60 text-xs font-light line-clamp-2 leading-relaxed">
              {hoveredProject.description}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {hoveredProject.technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded border border-white/15 bg-white/5 text-[10px] font-mono text-white/70"
                >
                  {tech}
                </span>
              ))}
            </div>

            {hoveredProject.award && (
              <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-mono text-white/90 uppercase tracking-wider">
                <Award className="w-3 h-3" />
                <span>Award-Winning Project</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
