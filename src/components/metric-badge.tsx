import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricBadgeProps {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ElementType;
  className?: string;
}

export function MetricBadge({
  label,
  value,
  change,
  trend,
  icon: Icon,
  className,
}: MetricBadgeProps) {
  return (
    <div className={cn("p-4", className)}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <div className="text-2xl font-bold golden-text">{value}</div>
      {change && trend && trend !== "neutral" && (
        <div className="flex items-center gap-1 mt-1">
          {trend === "up" ? (
            <ArrowUpRight className="h-3 w-3 text-emerald-400" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-red-400" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              trend === "up" ? "text-emerald-400" : "text-red-400"
            )}
          >
            {change}
          </span>
        </div>
      )}
    </div>
  );
}
