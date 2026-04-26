import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic");
  const saved = searchParams.get("saved");

  const where: Record<string, unknown> = {};
  if (topic) where.topic = topic;
  if (saved === "true") where.isSaved = true;

  const items = await prisma.newsItem.findMany({
    where,
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json(items);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, isSaved } = body;

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  try {
    const item = await prisma.newsItem.update({
      where: { id },
      data: { isSaved: isSaved ?? true },
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
