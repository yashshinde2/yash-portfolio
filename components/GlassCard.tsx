import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  glowColor?: "blue" | "green" | "purple";
  interactive?: boolean;
}

export function GlassCard({
  children,
  className,
  glow = false,
  glowColor = "blue",
  interactive = false,
}: GlassCardProps) {
  const glowClasses = {
    blue: "hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    green: "hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]",
    purple: "hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]",
  };

  return (
    <div
      className={cn(
        "relative rounded-xl backdrop-blur-md border border-white/10 bg-white/5 p-6",
        glow && glowClasses[glowColor],
        interactive && "transition-all duration-300 hover:bg-white/8 hover:border-white/20",
        className
      )}
    >
      {children}
    </div>
  );
}
