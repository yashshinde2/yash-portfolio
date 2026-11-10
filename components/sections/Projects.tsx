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

    const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!hoverCapable) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let lastX = 0;
    let currentTilt = 0;
    let targetTilt = 0;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = Math.min(e.clientX + 28, window.innerWidth - 340);
      targetY = Math.min(e.clientY + 20, window.innerHeight - 260);
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
    <div className="py-16 sm:py-36 px-4 sm:px-12 lg:px-20 border-b border-white/10 bg-black text-white relative">
      <div className="max-w-7xl mx-auto mb-10 sm:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b border-white/10 pb-6 sm:pb-8">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-white/70 mb-2 sm:mb-3">
            <DecodeText text="[ 03 // PROJECTS ]" />
          </div>
          <DecodeText
            text="SELECTED WORKS"
            className="text-3xl sm:text-6xl lg:text-7xl font-bold tracking-tighter uppercase font-sans text-white block"
          />
        </div>

        <p className="text-white/60 font-sans text-sm sm:text-base max-w-md font-light leading-relaxed">
          Projects built at hackathons and for the open-source community.
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
                data-cursor="view"
                data-cursor-label="VIEW"
                className="relative cursor-pointer py-6 sm:py-10 px-3 sm:px-8 flex flex-col justify-between gap-4 rounded-xl sm:rounded-2xl overflow-hidden transition-colors duration-300 min-h-[56px]"
              >
                <div className="absolute inset-0 bg-white origin-bottom scale-y-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:hover)]:group-hover:scale-y-100 z-0 pointer-events-none rounded-xl sm:rounded-2xl" />

                <div className="relative z-10 flex items-center justify-between w-full gap-3 sm:gap-6">
                  <div className="flex items-center gap-3 sm:gap-8 min-w-0">
                    <span className="font-mono text-xs sm:text-base tracking-widest text-white/70 [@media(hover:hover)]:group-hover:text-black/70 select-none shrink-0">
                      <DecodeText text={num} on="hover" />
                    </span>
                    <h3 className="font-sans font-black text-[clamp(1.5rem,6vw,4.5rem)] tracking-normal uppercase leading-[1.05] transition-transform duration-300 ease-out [@media(hover:hover)]:group-hover:translate-x-4 truncate">
                      {project.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    {project.dates && (
                      <span className="hidden sm:inline font-mono text-xs text-white/50 [@media(hover:hover)]:group-hover:text-black/60 transition-colors">
                        {project.dates}
                      </span>
                    )}
                    {(project.badge || project.award) && (
                      <span className="hidden md:inline px-3 py-1 rounded-full border border-white/20 text-white font-mono text-[10px] uppercase tracking-wider [@media(hover:hover)]:group-hover:border-black/30 [@media(hover:hover)]:group-hover:text-black [@media(hover:hover)]:group-hover:bg-black/5 transition-colors">
                        {project.badge || (project.award ? "Award Winner" : null)}
                      </span>
                    )}
                    <div className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full border border-white/20 flex items-center justify-center text-white [@media(hover:hover)]:group-hover:border-black [@media(hover:hover)]:group-hover:bg-black [@media(hover:hover)]:group-hover:text-white transition-all duration-300">
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex flex-wrap items-center gap-2 sm:hidden pt-1">
                  {project.dates && (
                    <span className="font-mono text-[11px] text-white/50">
                      {project.dates}
                    </span>
                  )}
                  {(project.badge || project.award) && (
                    <span className="px-2 py-0.5 rounded-full border border-white/20 text-white/80 font-mono text-[9px] uppercase tracking-wider">
                      {project.badge || (project.award ? "Award Winner" : null)}
                    </span>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden bg-white/[0.03] rounded-2xl my-3 sm:my-4 border border-white/10"
                  >
                    <div className="p-5 sm:p-10 space-y-6 sm:space-y-8">
                      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 sm:gap-8">
                        <div className="lg:col-span-8 space-y-5 sm:space-y-6">
                          <div>
                            <div className="font-mono text-xs uppercase tracking-widest text-white/40 mb-2">
                              <DecodeText text="[ Overview ]" />
                            </div>
                            <p className="font-sans text-sm sm:text-xl text-white/80 font-light leading-relaxed">
                              {project.description}
                            </p>
                          </div>

                          {"highlights" in project && Array.isArray((project as any).highlights) && (
                            <div>
                              <div className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">
                                <DecodeText text="[ Highlights ]" />
                              </div>
                              <div className="space-y-2">
                                {((project as any).highlights as string[]).map((highlight) => (
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

                        <div className="lg:col-span-4 flex flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-l border-white/10 pt-5 lg:pt-0 lg:pl-8">
                          <div>
                            <div className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">
                              <DecodeText text="[ Technologies ]" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-white/80 font-mono text-xs uppercase tracking-wider"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-cursor="view"
                              data-cursor-label="GITHUB"
                              className="inline-flex items-center justify-between px-6 py-3.5 sm:py-4 rounded-xl bg-white text-black font-mono text-xs uppercase tracking-widest font-semibold hover:bg-white/90 transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none min-h-[44px] w-full"
                            >
                              <span>View on GitHub</span>
                              <ArrowUpRight className="w-4 h-4" />
                            </a>
                          )}
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
        className={`fixed top-0 left-0 pointer-events-none z-50 w-72 sm:w-80 rounded-2xl border border-white/20 bg-black/95 text-white p-5 shadow-2xl backdrop-blur-md transition-opacity duration-200 hidden md:block will-change-transform [@media(hover:none)]:hidden ${
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

            {hoveredProject.dates && (
              <div className="font-mono text-[10px] text-white/50">
                {hoveredProject.dates}
              </div>
            )}

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

            {(hoveredProject.badge || hoveredProject.award) && (
              <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-mono text-white/90 uppercase tracking-wider">
                <Award className="w-3 h-3" />
                <span>{hoveredProject.badge || "Award Winner"}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
