import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

const GlassCard = ({ children, className, hover = true, glow = false }: GlassCardProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-card/80 to-card/40",
        "backdrop-blur-xl",
        "border border-border/50",
        hover && [
          "transition-all duration-500",
          "hover:translate-y-[-4px]",
          "hover:border-primary/30",
          "hover:shadow-[0_20px_40px_-20px_hsl(var(--primary)/0.15),0_0_60px_-30px_hsl(var(--primary)/0.2)]"
        ],
        glow && "shadow-[0_0_30px_hsl(var(--primary)/0.1)]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
