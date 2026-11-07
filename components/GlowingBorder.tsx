import React from "react";
import { cn } from "@/lib/utils";

interface GlowingBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: "blue" | "green" | "purple";
}

export function GlowingBorder({
  children,
  className,
  color = "blue",
}: GlowingBorderProps) {
  const colorClasses = {
    blue: {
      border: "border-blue-500/20",
      glow: "shadow-[0_0_15px_rgba(59,130,246,0.2)]",
    },
    green: {
      border: "border-green-500/20",
      glow: "shadow-[0_0_15px_rgba(34,197,94,0.2)]",
    },
    purple: {
      border: "border-purple-500/20",
      glow: "shadow-[0_0_15px_rgba(168,85,247,0.2)]",
    },
  };

  const colorConfig = colorClasses[color];

  return (
    <div
      className={cn(
        "relative rounded-lg border",
        colorConfig.border,
        colorConfig.glow,
        className
      )}
    >
      {children}
    </div>
  );
}
