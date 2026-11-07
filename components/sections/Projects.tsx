"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/lib/portfolio-data";
import { GlassCard } from "@/components/GlassCard";
import { GlowingBorder } from "@/components/GlowingBorder";
import { Award, ExternalLink, Code } from "lucide-react";

export function Projects() {
  const { projects } = portfolioData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Background elements */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-20"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-white mb-4 font-sans"
        >
          Deep-Tech Projects
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center text-gray-400 mb-16 max-w-2xl mx-auto"
        >
          Hardware-integrated systems and real-time applications pushing the boundaries of
          software-hardware integration
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <GlassCard
                glow
                glowColor={project.award ? "green" : "blue"}
                interactive
                className="h-full flex flex-col relative overflow-hidden"
              >
                {/* Award badge */}
                {project.award && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full">
                    <Award className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-semibold text-green-400">Award Winner</span>
                  </div>
                )}

                <div className="flex-1">
                  {/* Title and icon */}
                  <div className="flex items-start gap-3 mb-3">
                    <Code className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                    <h3 className="text-xl font-bold text-white font-sans leading-tight">
                      {project.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Highlights */}
                  {project.highlights && (
                    <div className="space-y-1 mb-4">
                      {project.highlights.map((highlight) => (
                        <p key={highlight} className="text-xs text-green-400 font-semibold">
                          ✓ {highlight}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Learn more link */}
                <a
                  href={project.link}
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mt-4 text-sm font-semibold group"
                >
                  Learn more
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
