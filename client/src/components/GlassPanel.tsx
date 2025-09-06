import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export default function GlassPanel({ children, className, animate }: GlassPanelProps) {
  return (
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
}
