import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import SparklingBorder from "./SparklingBorder";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  sparkle?: boolean;
}

export default function GlassPanel({ children, className, animate, sparkle = true }: GlassPanelProps) {
  const panel = (
    <div 
      className={cn(
        "glass-panel p-6",
        animate && "animate-float",
        className
      )}
      data-testid="glass-panel"
    >
      {children}
    </div>
  );

  if (sparkle) {
    return <SparklingBorder>{panel}</SparklingBorder>;
  }

  return panel;
}
