"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DecodeText } from "@/components/decode-text";
import { Cpu, Terminal } from "lucide-react";

interface MemoryRow {
  addr: string;
  skill: string;
  hex: string[];
}

const MEMORY_DATA: MemoryRow[] = [
  {
    addr: "0x0000",
    skill: "C++",
    hex: ["43", "2B", "2B", "00", "A4", "7F", "12", "0C", "E8", "91", "3B", "00", "24", "FF", "01", "10"],
  },
  {
    addr: "0x0010",
    skill: "Java",
    hex: ["4A", "61", "76", "61", "00", "8C", "F0", "1D", "92", "A7", "33", "00", "5C", "88", "B1", "20"],
  },
  {
    addr: "0x0020",
    skill: "Go",
    hex: ["47", "6F", "00", "9B", "14", "FE", "02", "AA", "77", "3D", "10", "00", "C1", "44", "8A", "30"],
  },
  {
    addr: "0x0030",
    skill: "Node.js",
    hex: ["4E", "6F", "64", "65", "2E", "6A", "73", "00", "B2", "A0", "15", "00", "FF", "7C", "09", "40"],
  },
  {
    addr: "0x0040",
    skill: "Python",
    hex: ["50", "79", "74", "68", "6F", "6E", "00", "90", "E1", "3C", "7A", "00", "D4", "55", "2F", "50"],
  },
  {
    addr: "0x0050",
    skill: "IoT",
    hex: ["49", "6F", "54", "00", "C4", "88", "1F", "0A", "FE", "31", "9C", "00", "A8", "22", "7B", "60"],
  },
  {
    addr: "0x0060",
    skill: "Sensors",
    hex: ["53", "65", "6E", "73", "6F", "72", "73", "00", "88", "41", "90", "00", "B3", "C2", "19", "70"],
  },
  {
    addr: "0x0070",
    skill: "Pattern Recognition",
    hex: ["50", "61", "74", "74", "65", "72", "6E", "20", "52", "65", "63", "6F", "67", "6E", "69", "74"],
  },
  {
    addr: "0x0080",
    skill: "Embedded Systems",
    hex: ["45", "6D", "62", "65", "64", "64", "65", "64", "20", "53", "79", "73", "74", "65", "6D", "73"],
  },
];

export function MemoryDump() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [decodedBytes, setDecodedBytes] = useState<{ [rowIdx: number]: string[] }>({});

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      containerRef.current?.querySelectorAll(".hex-byte").forEach((b) => {
        (b as HTMLElement).style.opacity = "1";
        (b as HTMLElement).style.transform = "none";
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const bytes = containerRef.current?.querySelectorAll(".hex-byte");
    if (bytes && bytes.length > 0) {
      gsap.fromTo(
        bytes,
        { opacity: 0, y: 3 },
        {
          opacity: 1,
          y: 0,
          duration: 0.12,
          stagger: 0.007,
          ease: "power2.out",
          scrollTrigger: {
            trigger: tableRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }
  }, []);

  const handleRowEnter = (idx: number) => {
    setHoveredIdx(idx);
    const row = MEMORY_DATA[idx];
    const initialScramble = row.hex.map(() => (Math.random() > 0.5 ? "1" : "0"));
    setDecodedBytes((prev) => ({ ...prev, [idx]: initialScramble }));

    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setDecodedBytes((prev) => {
        const next = row.hex.map((orig, bIdx) => {
          if (frame > bIdx + 2) {
            return bIdx < row.skill.length ? row.skill[bIdx] : ".";
          }
          return Math.random() > 0.5 ? "01" : orig;
        });
        return { ...prev, [idx]: next };
      });

      if (frame > 20) {
        clearInterval(interval);
      }
    }, 28);
  };

  const handleRowLeave = (idx: number) => {
    setHoveredIdx(null);
    setDecodedBytes((prev) => {
      const copy = { ...prev };
      delete copy[idx];
      return copy;
    });
  };

  return (
    <div
      ref={containerRef}
      className="py-24 sm:py-36 px-6 sm:px-12 lg:px-20 border-b border-white/10 bg-black text-white relative font-mono select-none"
    >
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-white/70 mb-3">
              <DecodeText text="[ 03.5 // MEMORY DUMP ]" />
            </div>
            <DecodeText
              text="HEX MEMORY // SKILLS"
              className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter uppercase font-sans text-white block"
            />
          </div>

          <div className="flex flex-col gap-2 max-w-md text-xs text-white/60 font-light">
            <div className="flex items-center gap-2 text-white/80 uppercase tracking-widest text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-white/50" />
              <span>Volatile Memory Allocation</span>
              <span>•</span>
              <span>0x0000 - 0x008F</span>
            </div>
            <p className="leading-relaxed">
              16-byte aligned hardware memory buffers mapping core architecture competencies into executable addresses.
            </p>
          </div>
        </div>

        <div
          ref={tableRef}
          className="border border-white/10 rounded-2xl overflow-hidden bg-black/50 backdrop-blur-md p-4 sm:p-6 lg:p-8 space-y-3"
        >
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-white/40 pb-3 border-b border-white/10 px-2 sm:px-4">
            <div className="w-20 sm:w-28 flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-white/40" />
              <span>Offset</span>
            </div>
            <div className="hidden md:flex flex-1 justify-center gap-2 lg:gap-4 text-white/30 tracking-wider">
              <span>00 01 02 03 04 05 06 07</span>
              <span className="text-white/15">|</span>
              <span>08 09 0A 0B 0C 0D 0E 0F</span>
            </div>
            <div className="w-40 sm:w-56 text-right">ASCII Representation</div>
          </div>

          <div className="space-y-1 pt-1">
            {MEMORY_DATA.map((row, idx) => {
              const isHovered = hoveredIdx === idx;
              const isAnyHovered = hoveredIdx !== null;
              const currentHex = decodedBytes[idx] || row.hex;

              return (
                <div
                  key={row.addr}
                  onMouseEnter={() => handleRowEnter(idx)}
                  onMouseLeave={() => handleRowLeave(idx)}
                  data-cursor="view"
                  data-cursor-label="DUMP"
                  className={`group flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-all duration-200 cursor-crosshair ${
                    isHovered
                      ? "bg-white text-black shadow-xl"
                      : isAnyHovered
                      ? "opacity-30 text-white/50"
                      : "opacity-100 text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="w-20 sm:w-28 font-bold tracking-wider text-xs sm:text-sm">
                    {row.addr}
                  </div>

                  <div className="hidden md:flex flex-1 justify-center items-center gap-1 lg:gap-2 text-xs sm:text-[13px] tracking-wider">
                    {currentHex.map((byte, bIdx) => (
                      <span
                        key={`${row.addr}-${bIdx}`}
                        className={`hex-byte inline-block text-center w-5 sm:w-6 transition-colors duration-150 ${
                          bIdx === 7 ? "mr-2 sm:mr-3" : ""
                        } ${
                          isHovered
                            ? "font-bold text-black"
                            : byte === "00"
                            ? "text-white/20"
                            : "text-white/80"
                        }`}
                      >
                        {byte}
                      </span>
                    ))}
                  </div>

                  <div className="w-40 sm:w-56 text-right font-bold text-xs sm:text-sm tracking-wide truncate">
                    <span className={isHovered ? "text-black" : "text-white"}>
                      |{row.skill}|
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] sm:text-[11px] text-white/40 uppercase tracking-widest px-2 sm:px-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>State: 144 Bytes Allocated // 0 Heap Corruption</span>
            </div>
            <div>Endianness: Little Endian • Arch: x86_64</div>
          </div>
        </div>
      </div>
    </div>
  );
}

