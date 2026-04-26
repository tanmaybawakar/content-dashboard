import * as React from "react"
import { cn } from "@/lib/utils"

const GlassCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "subtle" | "glow" }
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm backdrop-blur-xl transition-all duration-300",
        {
          "border-border/50 bg-card/60 shadow-lg": variant === "default",
          "border-border/30 bg-card/40": variant === "subtle",
          "border-primary/30 bg-card/80 shadow-primary/20 shadow-xl": variant === "glow",
        },
        className
      )}
      {...props}
    />
  )
})
GlassCard.displayName = "GlassCard"

export { GlassCard }
