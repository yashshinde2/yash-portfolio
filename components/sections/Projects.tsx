"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/lib/portfolio-data";
import { Award, ArrowUpRight, Terminal } from "lucide-react";

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
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-12 border-b border-white/10 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/10">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">
              [ 03 // Projects ]
            </div>
            <motion.h2
              initial={{ opacity: 0, y: -15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter uppercase font-sans"
            >
              Deep-Tech Projects
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-white/60 font-sans text-base max-w-md font-light leading-relaxed"
          >
            Hardware-integrated systems and real-time applications pushing the boundaries of
            software-hardware integration
          </motion.p>
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
              <div className="group h-full flex flex-col justify-between p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/30 transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                      <span className="font-mono text-xs text-white/40">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {project.award && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-white font-mono text-[10px] uppercase tracking-wider">
                        <Award className="w-3.5 h-3.5" />
                        <span>Award Winner</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans mb-3 group-hover:text-white transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-white/60 text-sm font-sans font-light leading-relaxed mb-6">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-3 py-1 rounded-md border border-white/10 bg-white/[0.03] text-white/70 font-mono tracking-wider uppercase"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.02] text-white/40 font-mono">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {project.highlights && (
                    <div className="space-y-1.5 pt-4 border-t border-white/10 mb-6">
                      {project.highlights.map((highlight) => (
                        <div
                          key={highlight}
                          className="font-mono text-xs text-white/60 flex items-center gap-2"
                        >
                          <span className="text-white/30">✦</span>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <a
                  href={project.link}
                  className="inline-flex items-center justify-between pt-4 border-t border-white/10 font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors group/link"
                >
                  <span>Learn more</span>
                  <ArrowUpRight className="w-4 h-4 text-white/40 group-hover/link:text-white group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
