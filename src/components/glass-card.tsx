import { cn } from "@/lib/utils";

interface GlassCardProps extends React.ComponentProps<"div"> {
  intensity?: "full" | "light";
  hoverable?: boolean;
}

export function GlassCard({
  className,
  intensity = "full",
  hoverable = false,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl",
        intensity === "full" ? "glass" : "glass-light",
        hoverable && "transition-glass hover-glow cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
