import { cn } from "@/lib/utils";
import { CalendarDays, FileText, Send, Archive } from "lucide-react";

type PostStatus = "draft" | "scheduled" | "published" | "backlog";

const STATUS_CONFIG: Record<
  PostStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  scheduled: {
    label: "Scheduled",
    icon: CalendarDays,
    className: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  },
  draft: {
    label: "Draft",
    icon: FileText,
    className: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  },
  published: {
    label: "Published",
    icon: Send,
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  },
  backlog: {
    label: "Backlog",
    icon: Archive,
    className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  },
};

export function StatusPill({
  status,
  className,
}: {
  status: PostStatus;
  className?: string;
}) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
