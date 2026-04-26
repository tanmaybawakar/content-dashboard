import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if (body.platform !== undefined) data.platform = body.platform;
  if (body.title !== undefined) data.title = body.title;
  if (body.caption !== undefined) data.caption = body.caption;
  if (body.postType !== undefined) data.postType = body.postType;
  if (body.status !== undefined) data.status = body.status;
  if (body.scheduledAt !== undefined)
    data.scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;
  if (body.publishedAt !== undefined)
    data.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
  if (body.tags !== undefined) data.tags = body.tags;
  if (body.thumbnailUrl !== undefined) data.thumbnailUrl = body.thumbnailUrl;

  try {
    const post = await prisma.post.update({ where: { id }, data });
    return NextResponse.json(post);
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
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
