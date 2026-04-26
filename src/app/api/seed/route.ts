import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Reset everything to a clean state
export async function DELETE() {
  await prisma.post.deleteMany();
  await prisma.analyticsSnapshot.deleteMany();
  await prisma.competitor.deleteMany();
  await prisma.newsItem.deleteMany();
  await prisma.workspace.deleteMany();
  return NextResponse.json({ ok: true });
}
