"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Camera,
  BarChart3,
  CalendarDays,
  Users,
  Newspaper,
  ArrowRight,
  Sparkles,
  Plus,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalPosts: number;
  scheduledPosts: number;
  draftPosts: number;
  totalCompetitors: number;
  totalNews: number;
  workspaceName: string;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    scheduledPosts: 0,
    draftPosts: 0,
    totalCompetitors: 0,
    totalNews: 0,
    workspaceName: "",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const [postsRes, competitorsRes, newsRes, workspaceRes] = await Promise.all([
        fetch("/api/posts"),
        fetch("/api/competitors"),
        fetch("/api/news"),
        fetch("/api/workspace"),
      ]);
      const posts = await postsRes.json();
      const competitors = await competitorsRes.json();
      const news = await newsRes.json();
      const workspace = await workspaceRes.json();

      setStats({
        totalPosts: posts.length,
        scheduledPosts: posts.filter(
          (p: { status: string }) => p.status === "scheduled"
        ).length,
        draftPosts: posts.filter(
          (p: { status: string }) => p.status === "draft"
        ).length,
        totalCompetitors: competitors.length,
        totalNews: news.length,
        workspaceName: workspace.name || "",
      });
      setLoaded(true);
    }
    load();
  }, []);

  const isEmpty = loaded && stats.totalPosts === 0 && stats.totalCompetitors === 0;

  const sections = [
    {
      title: "Instagram Manager",
      href: "/instagram",
      icon: Camera,
      desc: "Create, schedule, and manage posts across platforms.",
      stat: `${stats.totalPosts}`,
      statLabel: "posts",
      primary: true,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      desc: "Track impressions, engagement, and follower growth.",
      stat: stats.scheduledPosts > 0 ? `${stats.scheduledPosts}` : "—",
      statLabel: "scheduled",
    },
    {
      title: "Content Calendar",
      href: "/calendar",
      icon: CalendarDays,
      desc: "Monthly overview of your content pipeline.",
      stat: stats.draftPosts > 0 ? `${stats.draftPosts}` : "—",
      statLabel: "drafts",
    },
    {
      title: "Competitor Tracker",
      href: "/competitors",
      icon: Users,
      desc: "Monitor competitor accounts and growth.",
      stat: `${stats.totalCompetitors}`,
      statLabel: "tracked",
    },
    {
      title: "News Consolidator",
      href: "/news",
      icon: Newspaper,
      desc: "Stay current with industry news and trends.",
      stat: `${stats.totalNews}`,
      statLabel: "articles",
    },
  ];

  return (
    <div>
      <SectionHeader
        title={stats.workspaceName || "Dashboard"}
        description="Your content command center."
      />

      {isEmpty && loaded ? (
        /* Empty state — guide user to start */
        <div className="max-w-lg mx-auto mt-12">
          <GlassCard className="p-8 text-center">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-300/20 to-amber-600/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-5">
              <Sparkles className="h-6 w-6 text-amber-400/80" />
            </div>
            <h2 className="text-lg font-bold mb-2">Your workspace is ready</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Start by creating your first post or adding a competitor to track.
              Everything you need is in the sidebar.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/instagram">
                <Button className="w-full gap-2">
                  <Plus className="h-4 w-4" /> Create your first post
                </Button>
              </Link>
              <Link href="/competitors">
                <Button variant="outline" className="w-full gap-2">
                  <Users className="h-4 w-4" /> Add a competitor
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      ) : (
        /* Dashboard cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.href}>
                <GlassCard hoverable className="p-5 h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {card.desc}
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold golden-text">
                      {card.stat}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {card.statLabel}
                    </span>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
