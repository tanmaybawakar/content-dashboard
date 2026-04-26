"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  platform: string;
  title: string;
  caption: string;
  postType: string;
  status: string;
  scheduledAt: string | null;
  publishedAt: string | null;
}

type Platform = "instagram" | "youtube" | "tiktok" | "x" | "other";

const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok", "x"];

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  youtube: "bg-red-500/20 text-red-400 border-red-500/30",
  tiktok: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  x: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  other: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  x: "X",
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function CalendarPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [filters, setFilters] = useState<Platform[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
      setLoading(false);
    }
    load();
  }, []);

  const calendarPosts = useMemo(() => {
    return posts.filter((p) => p.scheduledAt || p.publishedAt);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (filters.length === 0) return calendarPosts;
    return calendarPosts.filter((p) => filters.includes(p.platform as Platform));
  }, [calendarPosts, filters]);

  const postsByDate = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const post of filteredPosts) {
      const dateStr = post.scheduledAt
        ? post.scheduledAt.split("T")[0]
        : post.publishedAt?.split("T")[0];
      if (!dateStr) continue;
      const list = map.get(dateStr);
      if (list) list.push(post);
      else map.set(dateStr, [post]);
    }
    return map;
  }, [filteredPosts]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = formatDate(now.getFullYear(), now.getMonth(), now.getDate());

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  function toggleFilter(platform: Platform) {
    setFilters((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  if (loading) {
    return (
      <div>
        <SectionHeader title="Content Calendar" description="Monthly view of scheduled and published content." />
        <div className="text-center text-muted-foreground py-12">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Content Calendar"
        description="Monthly view of scheduled and published content across all platforms."
      />

      {/* Platform filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs text-muted-foreground mr-1">Filter:</span>
        {PLATFORMS.map((platform) => {
          const active = filters.includes(platform);
          return (
            <button
              key={platform}
              onClick={() => toggleFilter(platform)}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-all ${
                active ? PLATFORM_COLORS[platform] : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {PLATFORM_LABELS[platform]}
            </button>
          );
        })}
        {filters.length > 0 && (
          <button onClick={() => setFilters([])} className="text-xs text-muted-foreground hover:text-foreground ml-1">
            Clear
          </button>
        )}
      </div>

      {/* Calendar navigation */}
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {MONTH_NAMES[month]} {year}
        </h2>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-pink-500" /> Instagram</div>
        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-red-500" /> YouTube</div>
        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-cyan-500" /> TikTok</div>
        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-blue-500" /> X</div>
      </div>

      {/* Calendar grid */}
      <GlassCard className="overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border/50">
          {DAY_NAMES.map((d) => (
            <div key={d} className="px-2 py-2 text-center text-xs font-medium text-muted-foreground">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-border/30" />;
            }

            const dateStr = formatDate(year, month, day);
            const dayPosts = postsByDate.get(dateStr) || [];
            const isToday = dateStr === today;

            return (
              <div
                key={dateStr}
                className={`min-h-[100px] border-b border-r border-border/30 p-1.5 transition-colors ${
                  isToday ? "ring-1 ring-amber-400/30 ring-inset bg-amber-400/5" : "hover:bg-white/[0.02]"
                }`}
              >
                <div
                  className={`text-xs mb-1 ${
                    isToday
                      ? "bg-gradient-to-br from-amber-300/70 to-amber-500/60 text-amber-950 rounded-full w-5 h-5 flex items-center justify-center font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  {day}
                </div>
                <div className="flex flex-col gap-0.5">
                  {dayPosts.slice(0, 3).map((post) => (
                    <button
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className={`truncate rounded px-1.5 py-0.5 text-[11px] font-medium border leading-tight text-left transition-all hover:scale-[1.02] ${
                        PLATFORM_COLORS[post.platform] || PLATFORM_COLORS.other
                      } ${post.status === "published" ? "opacity-50" : "opacity-100"}`}
                      title={`${post.title || post.caption.slice(0, 40)} — ${post.platform}`}
                    >
                      {post.title || post.caption.slice(0, 20)}
                    </button>
                  ))}
                  {dayPosts.length > 3 && (
                    <span className="text-[10px] text-muted-foreground px-1">
                      +{dayPosts.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Post detail drawer */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedPost(null)} />
          <GlassCard className="relative z-10 w-full max-w-md h-full rounded-none border-l border-border/50 p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Post Details</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedPost(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Platform</span>
                <div className="mt-1">
                  <Badge variant="outline" className={PLATFORM_COLORS[selectedPost.platform]}>
                    {PLATFORM_LABELS[selectedPost.platform] || selectedPost.platform}
                  </Badge>
                </div>
              </div>
              {selectedPost.title && (
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Title</span>
                  <p className="mt-1 font-medium">{selectedPost.title}</p>
                </div>
              )}
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Caption</span>
                <p className="mt-1 text-sm leading-relaxed">{selectedPost.caption}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Type</span>
                <p className="mt-1 text-sm capitalize">{selectedPost.postType}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Status</span>
                <p className="mt-1 text-sm capitalize">{selectedPost.status}</p>
              </div>
              {selectedPost.scheduledAt && (
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Scheduled</span>
                  <p className="mt-1 text-sm">{new Date(selectedPost.scheduledAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
              )}
              {selectedPost.publishedAt && (
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Published</span>
                  <p className="mt-1 text-sm">{new Date(selectedPost.publishedAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
