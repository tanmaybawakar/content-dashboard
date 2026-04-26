import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  actions?: React.ReactNode
}

export function SectionHeader({
  title,
  description,
  actions,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0",
        className
      )}
      {...props}
    >
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground/90 glow-text">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center space-x-2">{actions}</div>
      )}
    </div>
  )
}
