import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const platform = searchParams.get("platform");

  const where: Record<string, string> = {};
  if (status) where.status = status;
  if (platform) where.platform = platform;

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const post = await prisma.post.create({
    data: {
      platform: body.platform || "instagram",
      title: body.title || "",
      caption: body.caption,
      postType: body.postType || "static",
      status: body.status || "draft",
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      tags: body.tags || "[]",
      thumbnailUrl: body.thumbnailUrl || "",
    },
  });

  return NextResponse.json(post, { status: 201 });
}
