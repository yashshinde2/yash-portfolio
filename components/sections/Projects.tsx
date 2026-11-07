"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { portfolioData } from "@/lib/portfolio-data";
import { Award, ArrowUpRight, ChevronDown, Terminal } from "lucide-react";
import { ScrambleHeading } from "@/components/ScrambleHeading";

type ProjectItem = (typeof portfolioData.projects)[number];

export function Projects() {
  const { projects } = portfolioData;
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [hoveredProject, setHoveredProject] = useState<ProjectItem | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const card = cardRef.current;
    if (!card) return;

      const xTo = gsap.quickTo(card, "x", { duration: 0.18, ease: "power2.out" });
      const yTo = gsap.quickTo(card, "y", { duration: 0.18, ease: "power2.out" });

      const handleMouseMove = (e: MouseEvent) => {
        xTo(e.clientX + 24);
        yTo(e.clientY + 24);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return() => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
            <div className="py-24 sm:py-36 px-6 sm:px-12 lg:px-20 border-b border-white/10 bg-black text-white relative">
              <div className="max-w-7xl mx-auto mb-16 sm:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-white/50 mb-3">
                    <ScrambleHeading text="[ 03 // PROJECTS ]" as="span" />
                  </div>
                  <ScrambleHeading
                    text="SELECTED WORKS"
                    className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter uppercase font-sans text-white"
                  />
                </div>

                            <p className="text-white/60 font-sans text-base max-w-md font-light leading-relaxed">
                              Hardware-integrated systems and real-time applications pushing the boundaries of
                              software-hardware integration
                            </p>
                          </div>

                          <div className="max-w-7xl mx-auto border-t border-white/10 divide-y divide-white/10">
                            {projects.map((project, index) => {
                              const isExpanded = expandedId === project.id;
                              const num = String(index + 1).padStart(2, "0");

                              return (
                                <div
                                  key={project.id}
                                  className="group transition-colors duration-200"
                                  onMouseEnter={() => setHoveredProject(project)}
                                  onMouseLeave={() => setHoveredProject(null)}
                                >
                                  <div
                                    onClick={() => toggleExpand(project.id)}
                                    className="cursor-pointer py-8 sm:py-12 px-4 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-200 group-hover:bg-white group-hover:text-black rounded-xl sm:rounded-2xl"
                                  >
                                    <div className="flex items-baseline gap-6 sm:gap-12">
                                      <span className="font-mono text-sm sm:text-lg tracking-widest text-white/40 group-hover:text-black/50 select-none">
                                        {num}
                                      </span>
                                      <div>
                                        <h3 className="font-sans font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter uppercase leading-[0.95] transition-colors">
                                          {project.title}
                                        </h3>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-4 self-end md:self-center">
                                      {project.award && (
                                        <span className="px-3 py-1 rounded-full border border-white/20 text-white font-mono text-[10px] uppercase tracking-wider group-hover:border-black/30 group-hover:text-black group-hover:bg-black/5 transition-colors">
                                          Award Winner
                                        </span>
                                      )}
                                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-black group-hover:bg-black group-hover:text-white transition-all duration-200">
                                        <ChevronDown
                                          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
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
                                                  [ Overview ]
                                                </div>
                                                <p className="font-sans text-base sm:text-xl text-white/80 font-light leading-relaxed">
                                                  {project.description}
                                                </p>
                                              </div>

                                              {project.highlights && (
                                                <div>
                                                  <div className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">
                                                    [ Highlights ]
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
                                                          [ Technologies ]
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
                                                        className="inline-flex items-center justify-between px-6 py-4 rounded-xl bg-white text-black font-mono text-xs uppercase tracking-widest font-semibold hover:bg-white/90 transition-all"
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
                            className={`fixed top-0 left-0 pointer-events-none z-50 w-72 sm:w-80 rounded-2xl border border-white/20 bg-black/95 text-white p-5 shadow-2xl backdrop-blur-md transition-opacity duration-200 hidden md:block ${hoveredProject ? "opacity-100 scale-100" : "opacity-0 scale-95"
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
                  { tech }
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
