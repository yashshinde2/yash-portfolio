"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/lib/portfolio-data";
import { GlassCard } from "@/components/GlassCard";
import { Trophy, Users, Zap } from "lucide-react";

export function Hackathons() {
  const { hackathons } = portfolioData;

  const timelineVariants = {
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
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950/50">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-20"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-white mb-4 font-sans"
        >
          Hackathons & Experience
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center text-gray-400 mb-16 max-w-2xl mx-auto"
        >
          Problem-solving competitions and leadership experience pushing innovation and teamwork
        </motion.p>

        {/* Timeline */}
        <motion.div
          variants={timelineVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-8"
        >
          {hackathons.map((event, index) => {
            const isWinner = event.achievement === "Winner";
            const isOrganizer = event.achievement === "Organizer";

            return (
              <motion.div
                key={`${event.date}-${event.title}`}
                variants={itemVariants}
                className="relative"
              >
                {/* Timeline connector */}
                {index !== hackathons.length - 1 && (
                  <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 to-transparent"></div>
                )}

                <div className="flex gap-6">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 relative z-10 ${
                        isWinner
                          ? "bg-green-500/20 border-green-500 text-green-400"
                          : isOrganizer
                          ? "bg-purple-500/20 border-purple-500 text-purple-400"
                          : "bg-blue-500/20 border-blue-500 text-blue-400"
                      }`}
                    >
                      {isWinner ? (
                        <Trophy className="w-6 h-6" />
                      ) : isOrganizer ? (
                        <Zap className="w-6 h-6" />
                      ) : (
                        <Users className="w-6 h-6" />
                      )}
                    </motion.div>
                  </div>

                  {/* Content card */}
                  <GlassCard
                    interactive
                    glow
                    glowColor={isWinner ? "green" : isOrganizer ? "purple" : "blue"}
                    className="flex-1 mb-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm text-gray-400 font-mono">{event.date}</p>
                        <h3 className="text-lg sm:text-xl font-bold text-white mt-1 font-sans">
                          {event.title}
                        </h3>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${
                          isWinner
                            ? "bg-green-500/20 text-green-400 border border-green-500/40"
                            : isOrganizer
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/40"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                        }`}
                      >
                        {event.achievement}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-300 font-sans">
                        <span className="text-gray-500">Team:</span> {event.team}
                      </p>
                      <p className="text-gray-300 font-sans">
                        <span className="text-gray-500">Project:</span> {event.project}
                      </p>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
