"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Eye, TrendingUp, Users } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { SectionHeader } from "@/components/section-header";
import { MetricBadge } from "@/components/metric-badge";
import { Button } from "@/components/ui/button";

interface Snapshot {
  id: string;
  date: string;
  platform: string;
  impressions: number;
  engagementRate: number;
  followers: number;
  newFollowers: number;
}

interface Kpis {
  totalImpressions: number;
  avgEngagement: number;
  followers: number;
  newFollowers: number;
}

interface TopPost {
  id: string;
  title: string;
  caption: string;
  postType: string;
  publishedAt: string | null;
}

interface AnalyticsData {
  snapshots: Snapshot[];
  kpis: Kpis;
  topPosts: TopPost[];
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return n.toLocaleString();
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-sm">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-muted-foreground">
          <span style={{ color: entry.color }}>{entry.name}</span>:{" "}
          {typeof entry.value === "number"
            ? entry.value >= 1000
              ? `${(entry.value / 1000).toFixed(1)}k`
              : entry.value.toLocaleString()
            : entry.value}
        </p>
      ))}
    </div>
  );
}

function getDateRange(preset: string): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  switch (preset) {
    case "7d":
      from.setDate(to.getDate() - 7);
      break;
    case "30d":
      from.setDate(to.getDate() - 30);
      break;
    case "90d":
      from.setDate(to.getDate() - 90);
      break;
    default:
      from.setDate(to.getDate() - 30);
  }
  return {
    from: from.toISOString().split("T")[0],
    to: to.toISOString().split("T")[0],
  };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [preset, setPreset] = useState("30d");

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    const { from, to } = getDateRange(preset);
    const res = await fetch(`/api/analytics?from=${from}&to=${to}`);
    const result = await res.json();
    setData(result);
    setLoading(false);
  }, [preset]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  if (loading || !data) {
    return (
      <div>
        <SectionHeader title="Analytics" description="Content performance metrics." />
        <div className="text-center text-muted-foreground py-12">Loading...</div>
      </div>
    );
  }

  const chartData = data.snapshots.map((s) => ({
    date: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    impressions: s.impressions,
    engagement: s.engagementRate,
    followers: s.followers,
  }));

  const PRESETS = [
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "90 Days", value: "90d" },
  ];

  return (
    <div>
      <SectionHeader
        title="Analytics"
        description="Content performance metrics powered by Metricool."
        actions={
          <div className="flex items-center gap-1">
            {PRESETS.map((p) => (
              <Button
                key={p.value}
                variant={preset === p.value ? "default" : "outline"}
                size="sm"
                onClick={() => setPreset(p.value)}
                className="text-xs"
              >
                {p.label}
              </Button>
            ))}
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <GlassCard>
          <MetricBadge
            label="Total Impressions"
            value={formatNumber(data.kpis.totalImpressions)}
            icon={Eye}
          />
        </GlassCard>
        <GlassCard>
          <MetricBadge
            label="Avg Engagement"
            value={`${data.kpis.avgEngagement}%`}
            icon={TrendingUp}
          />
        </GlassCard>
        <GlassCard>
          <MetricBadge
            label="Followers"
            value={formatNumber(data.kpis.followers)}
            icon={Users}
          />
        </GlassCard>
        <GlassCard>
          <MetricBadge
            label="New Followers"
            value={`+${data.kpis.newFollowers}`}
            icon={Users}
          />
        </GlassCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Impressions Over Time */}
        <GlassCard className="p-4">
          <h3 className="text-sm font-medium mb-3">Impressions Over Time</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="impressionsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(43, 76%, 56%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(43, 76%, 56%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" stroke="hsl(0, 0%, 50%)" fontSize={11} tickLine={false} />
                <YAxis stroke="hsl(0, 0%, 50%)" fontSize={11} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="impressions" stroke="hsl(43, 76%, 56%)" fill="url(#impressionsGrad)" strokeWidth={2} name="Impressions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Follower Growth */}
        <GlassCard className="p-4">
          <h3 className="text-sm font-medium mb-3">Follower Growth</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" stroke="hsl(0, 0%, 50%)" fontSize={11} tickLine={false} />
                <YAxis stroke="hsl(0, 0%, 50%)" fontSize={11} tickLine={false} domain={["dataMin - 50", "dataMax + 50"]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="followers" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(142, 71%, 45%)" }} name="Followers" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Engagement + Top Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Engagement Rate Over Time */}
        <GlassCard className="p-4">
          <h3 className="text-sm font-medium mb-3">Engagement Rate</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" stroke="hsl(0, 0%, 50%)" fontSize={10} tickLine={false} />
                <YAxis stroke="hsl(0, 0%, 50%)" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="engagement" fill="hsl(262, 83%, 58%)" radius={[3, 3, 0, 0]} name="Engagement %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Top Performing Posts */}
        <GlassCard className="p-4 lg:col-span-2">
          <h3 className="text-sm font-medium mb-3">Recent Published Posts</h3>
          <div className="space-y-3">
            {data.topPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No published posts yet.</p>
            ) : (
              data.topPosts.map((post, i) => (
                <div key={post.id} className="flex items-start gap-3 text-sm">
                  <span className="text-muted-foreground font-mono text-xs mt-0.5 w-4 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">
                      {post.title || post.caption.slice(0, 60)}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {post.postType}
                      {post.publishedAt && ` — ${new Date(post.publishedAt).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
