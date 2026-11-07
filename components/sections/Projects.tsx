"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/lib/portfolio-data";
import { Award, ArrowUpRight, Terminal } from "lucide-react";
import { ScrambleHeading } from "@/components/ScrambleHeading";

export function Projects() {
  const { projects } = portfolioData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="py-24 sm:py-36 px-6 sm:px-12 lg:px-20 border-b border-black/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-black/10">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-black/50 mb-3">
              <ScrambleHeading text="[ 03 // PROJECTS ]" as="span" />
            </div>
            <ScrambleHeading
              text="DEEP-TECH PROJECTS"
              className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter uppercase font-sans text-black"
            />
          </div>

          <p className="text-black/60 font-sans text-base max-w-md font-light leading-relaxed">
            Hardware-integrated systems and real-time applications pushing the boundaries of
            software-hardware integration
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div key={project.id} variants={itemVariants} className="h-full">
              <div className="group h-full flex flex-col justify-between p-6 sm:p-8 rounded-2xl border border-black/10 bg-black/[0.02] hover:bg-black/[0.04] hover:border-black/30 transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-black/40 group-hover:text-black transition-colors" />
                      <span className="font-mono text-xs text-black/40">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {project.award && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-black/20 bg-black text-white font-mono text-[10px] uppercase tracking-wider font-semibold">
                        <Award className="w-3.5 h-3.5" />
                        <span>Award Winner</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-black font-sans mb-3 group-hover:text-black transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-black/60 text-sm font-sans font-light leading-relaxed mb-6">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-3 py-1 rounded-md border border-black/10 bg-black/[0.03] text-black/80 font-mono tracking-wider uppercase"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs px-2.5 py-1 rounded-md border border-black/10 bg-black/[0.02] text-black/50 font-mono">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {project.highlights && (
                    <div className="space-y-1.5 pt-4 border-t border-black/10 mb-6">
                      {project.highlights.map((highlight) => (
                        <div
                          key={highlight}
                          className="font-mono text-xs text-black/70 flex items-center gap-2"
                        >
                          <span className="text-black/30">✦</span>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <a
                  href={project.link}
                  className="inline-flex items-center justify-between pt-4 border-t border-black/10 font-mono text-xs uppercase tracking-widest text-black/60 hover:text-black transition-colors group/link"
                >
                  <span>Learn more</span>
                  <ArrowUpRight className="w-4 h-4 text-black/40 group-hover/link:text-black group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
