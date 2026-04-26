import * as React from "react"
import { cn } from "@/lib/utils"

const PageShell = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
PageShell.displayName = "PageShell"

export { PageShell }
