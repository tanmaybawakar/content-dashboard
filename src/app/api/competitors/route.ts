import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const competitors = await prisma.competitor.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(competitors);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // TODO: Integrate real public API scrapers for follower/engagement data
  const competitor = await prisma.competitor.create({
    data: {
      handle: body.handle,
      platforms: body.platforms || "[]",
      followerCount: body.followerCount || 0,
      avgEngagement: body.avgEngagement || 0,
      postingFrequency: body.postingFrequency || 0,
      growthRate: body.growthRate || 0,
      notes: body.notes || "",
    },
  });

  return NextResponse.json(competitor, { status: 201 });
}
