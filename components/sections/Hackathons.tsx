"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/lib/portfolio-data";
import { Trophy, Users, Zap } from "lucide-react";
import { ScrambleHeading } from "@/components/ScrambleHeading";

export function Hackathons() {
  const { hackathons } = portfolioData;

  const timelineVariants = {
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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="py-24 sm:py-36 px-6 sm:px-12 lg:px-20 border-b border-white/10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 sm:mb-24 space-y-4">
          <div className="font-mono text-xs uppercase tracking-widest text-white/50">
            <ScrambleHeading text="[ 04 // HACKATHONS & EXPERIENCE ]" as="span" />
          </div>
          <ScrambleHeading
            text="COMPETITIONS & LEADERSHIP"
            className="text-4xl sm:text-6xl font-bold tracking-tighter uppercase font-sans text-white"
          />
          <p className="text-white/60 font-sans text-base max-w-xl mx-auto font-light leading-relaxed">
            Problem-solving competitions and leadership experience pushing innovation and teamwork
          </p>
        </div>

        <motion.div
          variants={timelineVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="space-y-6"
        >
          {hackathons.map((event, index) => {
            const isWinner = event.achievement === "Winner";
            const isOrganizer = event.achievement === "Organizer";

            return (
              <motion.div
                key={`${event.date}-${event.title}`}
                variants={itemVariants}
                className="relative flex gap-6 sm:gap-8 group"
              >
                {index !== hackathons.length - 1 && (
                  <div className="absolute left-6 top-14 bottom-0 w-px bg-white/10" />
                )}

                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center border border-white/20 bg-white/[0.04] text-white relative z-10 group-hover:border-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                    {isWinner ? (
                      <Trophy className="w-5 h-5" />
                    ) : isOrganizer ? (
                      <Zap className="w-5 h-5" />
                    ) : (
                      <Users className="w-5 h-5" />
                    )}
                  </div>
                </div>

                <div className="flex-1 p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02] group-hover:border-white/30 group-hover:bg-white/[0.04] transition-all duration-300 mb-2">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <span className="text-xs text-white/40 font-mono uppercase tracking-widest">
                        {event.date}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 font-sans tracking-tight">
                        {event.title}
                      </h3>
                    </div>
                    <div className="self-start px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider font-semibold border border-white/20 bg-white/10 text-white whitespace-nowrap">
                      {event.achievement}
                    </div>
                  </div>

                  <div className="space-y-1.5 font-mono text-xs">
                    <p className="text-white/60">
                      <span className="text-white/30">TEAM //</span> {event.team}
                    </p>
                    <p className="text-white/60">
                      <span className="text-white/30">PROJECT //</span> {event.project}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
