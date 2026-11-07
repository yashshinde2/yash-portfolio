"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, GitCommit, Flame } from "lucide-react";
import { ScrambleHeading } from "@/components/ScrambleHeading";

interface ContributionDay {
  date: string;
  contributionCount: number;
  weekday: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionData {
  totalContributions: number;
  currentStreak: number;
  weeks: ContributionWeek[];
}

export function CommitMatrix() {
  const [data, setData] = useState<ContributionData | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [hoveredDay, setHoveredDay] = useState<{
    day: ContributionDay;
    x: number;
    y: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/github-contributions")
      .then((res) => res.json())
      .then((json: ContributionData) => {
        setData(json);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!data) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTotalCount(data.totalContributions);
      setStreakCount(data.currentStreak);
      return;
    }

    const duration = 1500;
    const start = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      setTotalCount(Math.floor(ease * data.totalContributions));
      setStreakCount(Math.floor(ease * data.currentStreak));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTotalCount(data.totalContributions);
        setStreakCount(data.currentStreak);
      }
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [data]);

  const handleCellHover = (
    e: React.MouseEvent<HTMLDivElement>,
    day: ContributionDay
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredDay({
      day,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div
      ref={containerRef}
      className="py-24 sm:py-36 px-4 sm:px-8 lg:px-16 border-b border-white/10 bg-black text-white relative overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-white/70 mb-3">
              <ScrambleHeading text="[ 04 // GITHUB TELEMETRY ]" as="span" />
            </div>
            <ScrambleHeading
              text="COMMIT MATRIX // 1s AND 0s"
              className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tighter uppercase font-sans text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-xs uppercase tracking-widest">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.02]">
              <GitCommit className="w-4 h-4 text-white/60" />
              <span className="text-white/60">Annual Ops:</span>
              <span className="font-bold text-white text-sm tabular-nums">
                {totalCount}
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.02]">
              <Flame className="w-4 h-4 text-white" />
              <span className="text-white/60">Current Streak:</span>
              <span className="font-bold text-white text-sm tabular-nums">
                {streakCount} Days
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02] space-y-6">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-white/50 border-b border-white/10 pb-3">
            <span>52-Week Binary Telemetry Grid</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="text-white/20">0</span>
                <span>= Idle</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-white font-bold">1</span>
                <span>= Active</span>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto pb-4 scrollbar-none">
            <div className="inline-flex gap-1 sm:gap-1.5 min-w-[760px]">
              {data?.weeks.map((week, wIdx) => (
                <div key={`w-${wIdx}`} className="flex flex-col gap-1 sm:gap-1.5">
                  {week.contributionDays.map((day) => {
                    const count = day.contributionCount;
                    const isZero = count === 0;

                    let colorClass = "text-white/20 hover:text-white/40";
                    if (count > 0 && count <= 2) {
                      colorClass = "text-white/60 hover:text-white";
                    } else if (count > 2 && count <= 5) {
                      colorClass = "text-white/85 hover:text-white font-semibold";
                    } else if (count > 5) {
                      colorClass =
                        "text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]";
                    }

                    return (
                      <div
                        key={day.date}
                        onMouseEnter={(e) => handleCellHover(e, day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center font-mono text-[10px] sm:text-[11px] cursor-crosshair rounded-sm transition-colors duration-150 ${colorClass}`}
                      >
                        {isZero ? "0" : "1"}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs font-mono tracking-wider text-white/60">
            <div className="flex items-center gap-4">
              <span>Luminance Level:</span>
              <div className="flex items-center gap-2">
                <span className="text-white/20 font-bold">0</span>
                <span className="text-white/50 font-bold">1</span>
                <span className="text-white/75 font-bold">1</span>
                <span className="text-white font-bold drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">
                  1
                </span>
              </div>
            </div>

            <a
              href="https://github.com/yashshinde2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
            >
              <span>Inspect on GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {hoveredDay && (
        <div
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-full px-3 py-2 rounded-xl border border-white/20 bg-black/95 text-white backdrop-blur-md shadow-2xl font-mono text-xs space-y-0.5 whitespace-nowrap"
          style={{
            left: hoveredDay.x,
            top: hoveredDay.y,
          }}
        >
          <div className="text-white/50 text-[10px] uppercase tracking-wider">
            {formatDate(hoveredDay.day.date)}
          </div>
          <div className="font-bold text-white">
            {hoveredDay.day.contributionCount === 0
              ? "0 Contributions (Idle)"
              : `${hoveredDay.day.contributionCount} Contributions (Active)`}
          </div>
        </div>
      )}
    </div>
  );
}
