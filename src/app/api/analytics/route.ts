import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const platform = searchParams.get("platform");

  const where: Record<string, unknown> = {};
  if (platform && platform !== "all") where.platform = platform;
  if (from || to) {
    const dateFilter: Record<string, Date> = {};
    if (from) dateFilter.gte = new Date(from);
    if (to) dateFilter.lte = new Date(to);
    where.date = dateFilter;
  }

  const snapshots = await prisma.analyticsSnapshot.findMany({
    where,
    orderBy: { date: "asc" },
  });

  const totalImpressions = snapshots.reduce((s, snap) => s + snap.impressions, 0);
  const avgEngagement =
    snapshots.length > 0
      ? snapshots.reduce((s, snap) => s + snap.engagementRate, 0) / snapshots.length
      : 0;
  const latestFollowers = snapshots.length > 0 ? snapshots[snapshots.length - 1].followers : 0;
  const totalNewFollowers = snapshots.reduce((s, snap) => s + snap.newFollowers, 0);

  const topPosts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 5,
  });

  return NextResponse.json({
    snapshots,
    kpis: {
      totalImpressions,
      avgEngagement: Math.round(avgEngagement * 10) / 10,
      followers: latestFollowers,
      newFollowers: totalNewFollowers,
    },
    topPosts,
  });
}
