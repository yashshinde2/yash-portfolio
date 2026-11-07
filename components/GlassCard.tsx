import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  glowColor?: "blue" | "green" | "purple" | "white";
  interactive?: boolean;
}

export function GlassCard({
  children,
  className,
  interactive = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6",
        interactive &&
          "transition-all duration-300 hover:bg-white/[0.06] hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]",
        className
      )}
    >
      {children}
    </div>
  );
}
