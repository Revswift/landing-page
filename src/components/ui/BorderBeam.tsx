import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
}

const BorderBeam = ({ 
  className, 
  size = 200, 
  duration = 3,
  delay = 0 
}: BorderBeamProps) => {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none",
        className
      )}
    >
      <div
        className="absolute inset-[-1px] rounded-[inherit]"
        style={{
          background: `linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)`,
          animation: `border-beam ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
          width: `${size}px`,
          height: "100%",
        }}
      />
    </div>
  );
};

export default BorderBeam;
