import React from "react";
import { cn } from "@/lib/utils";

interface GlowingBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: "blue" | "green" | "purple" | "white";
}

export function GlowingBorder({
  children,
  className,
}: GlowingBorderProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-white/10 hover:border-white/30 transition-colors duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}
