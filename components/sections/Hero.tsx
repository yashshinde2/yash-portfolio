"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/lib/portfolio-data";
import { ArrowUpRight, Download, Github, Linkedin, Mail, MapPin } from "lucide-react";

export function Hero() {
  const { hero, social } = portfolioData;

  const socialIcons: Record<string, React.ReactNode> = {
    GitHub: <Github className="w-4 h-4" />,
    LinkedIn: <Linkedin className="w-4 h-4" />,
    Email: <Mail className="w-4 h-4" />,
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-32 pb-16 px-4 sm:px-6 lg:px-12 border-b border-white/10 bg-black text-white">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10"
        >
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50">
            <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
            <MapPin className="w-3.5 h-3.5 text-white/70" />
            <span>{hero.location}</span>
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-white/40">
            Systems • Hardware • Backend
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter uppercase leading-[0.9]">
              {hero.name}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-baseline gap-3"
          >
            <span className="font-serif italic text-3xl sm:text-5xl lg:text-6xl text-white/80 font-normal">
              {hero.headline}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8"
          >
            <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4">
                [ Overview // Background ]
              </div>
              <p className="font-sans text-base sm:text-lg lg:text-xl text-white/70 leading-relaxed font-light">
                {hero.summary}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-between gap-6 p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="space-y-3">
                <a
                  href="#projects"
                  className="w-full inline-flex items-center justify-between px-6 py-4 rounded-xl bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-white/90 transition-all duration-200"
                >
                  <span>View Projects</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <a
                  href={hero.resumeLink}
                  className="w-full inline-flex items-center justify-between px-6 py-4 rounded-xl border border-white/20 text-white font-mono text-xs uppercase tracking-wider hover:bg-white/10 transition-all duration-200"
                >
                  <span>Download Resume</span>
                  <Download className="w-4 h-4 text-white/70" />
                </a>
              </div>

              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3">
                  Connect
                </div>
                <div className="flex gap-2">
                  {social.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg border border-white/10 hover:border-white/40 hover:bg-white/5 transition-all text-white/80 hover:text-white"
                      title={link.name}
                    >
                      {socialIcons[link.name] || <ArrowUpRight className="w-4 h-4" />}
                      <span className="font-mono text-xs hidden sm:inline">{link.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
