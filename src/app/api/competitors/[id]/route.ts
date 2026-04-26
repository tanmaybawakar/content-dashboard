import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const competitor = await prisma.competitor.findUnique({ where: { id } });
  if (!competitor)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(competitor);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if (body.handle !== undefined) data.handle = body.handle;
  if (body.platforms !== undefined) data.platforms = body.platforms;
  if (body.followerCount !== undefined) data.followerCount = body.followerCount;
  if (body.avgEngagement !== undefined) data.avgEngagement = body.avgEngagement;
  if (body.postingFrequency !== undefined)
    data.postingFrequency = body.postingFrequency;
  if (body.growthRate !== undefined) data.growthRate = body.growthRate;
  if (body.notes !== undefined) data.notes = body.notes;

  try {
    const competitor = await prisma.competitor.update({ where: { id }, data });
    return NextResponse.json(competitor);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.competitor.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
