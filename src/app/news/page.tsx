"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, ExternalLink, Bookmark, BookmarkCheck } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  summary: string;
  topic: string;
  publishedAt: string;
  isSaved: boolean;
}

type Topic = "tools" | "research" | "business";

const TOPICS: Topic[] = ["tools", "research", "business"];

const TOPIC_CONFIG: Record<Topic, { label: string; className: string }> = {
  tools: { label: "Tools", className: "bg-violet-500/15 text-violet-400 border-violet-500/30" },
  research: { label: "Research", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  business: { label: "Business", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
};

function relativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return "just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "yesterday";
  if (diffD < 7) return `${diffD}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Topic[]>([]);
  const [search, setSearch] = useState("");
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const loadNews = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (showSavedOnly) params.set("saved", "true");
    const res = await fetch(`/api/news?${params}`);
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }, [showSavedOnly]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  async function toggleSave(item: NewsItem) {
    await fetch("/api/news", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, isSaved: !item.isSaved }),
    });
    setItems((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isSaved: !n.isSaved } : n))
    );
  }

  function toggleFilter(topic: Topic) {
    setFilters((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  }

  const filtered = useMemo(() => {
    let result = items;
    if (filters.length > 0) {
      result = result.filter((a) => filters.includes(a.topic as Topic));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, filters, search]);

  const counts = useMemo(() => ({
    tools: items.filter((a) => a.topic === "tools").length,
    research: items.filter((a) => a.topic === "research").length,
    business: items.filter((a) => a.topic === "business").length,
  }), [items]);

  // Determine freshness (last 2 days)
  const isFresh = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    return diff < 2 * 24 * 60 * 60 * 1000;
  };

  return (
    <div>
      <SectionHeader
        title="News Consolidator"
        description="Aggregated industry news from RSS feeds."
      />

      {/* Search + Topic filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          {TOPICS.map((topic) => {
            const conf = TOPIC_CONFIG[topic];
            const active = filters.includes(topic);
            const count = topic === "tools" ? counts.tools : topic === "research" ? counts.research : counts.business;
            return (
              <button
                key={topic}
                onClick={() => toggleFilter(topic)}
                className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-all ${
                  active ? conf.className : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {conf.label}
                <span className="ml-1 opacity-60">{count}</span>
              </button>
            );
          })}
          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-all ${
              showSavedOnly ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {showSavedOnly ? <BookmarkCheck className="h-3 w-3 inline mr-1" /> : <Bookmark className="h-3 w-3 inline mr-1" />}
            Saved
          </button>
          {(filters.length > 0 || showSavedOnly) && (
            <button
              onClick={() => { setFilters([]); setShowSavedOnly(false); }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Article count */}
      <p className="text-xs text-muted-foreground mb-3">
        {filtered.length} article{filtered.length !== 1 ? "s" : ""}
        {filters.length > 0 && " (filtered)"}
      </p>

      {loading ? (
        <div className="text-center text-muted-foreground py-12">Loading...</div>
      ) : filtered.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <p className="text-sm text-muted-foreground">No articles match your filters.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((article) => {
            const topicConf = TOPIC_CONFIG[article.topic as Topic] || TOPIC_CONFIG.tools;
            const fresh = isFresh(article.publishedAt);
            return (
              <GlassCard
                key={article.id}
                hoverable
                className={`p-4 ${fresh ? "golden-left" : ""}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <Badge variant="outline" className={`shrink-0 text-[10px] ${topicConf.className}`}>
                    {topicConf.label}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                      {relativeTime(article.publishedAt)}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSave(article); }}
                      className="text-muted-foreground hover:text-amber-400 transition-colors"
                    >
                      {article.isSaved ? (
                        <BookmarkCheck className="h-3.5 w-3.5 text-amber-400" />
                      ) : (
                        <Bookmark className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold leading-snug mb-2">{article.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                  {article.summary}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground/80">
                    {article.source}
                  </span>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Read more <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
