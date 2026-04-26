import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: check onboarding status
export async function GET() {
  const workspace = await prisma.workspace.findFirst();
  return NextResponse.json(workspace ?? { onboardingComplete: false });
}

// POST: complete onboarding — create workspace + seed initial data
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Delete any existing workspace (single-workspace app)
  await prisma.workspace.deleteMany();

  const workspace = await prisma.workspace.create({
    data: {
      name: body.name || "My Workspace",
      platforms: body.platforms || "[]",
      niche: body.niche || "",
      newsTopics: body.newsTopics || "tools,research,business",
      onboardingComplete: true,
    },
  });

  // Seed competitors if provided
  if (body.competitors && Array.isArray(body.competitors)) {
    for (const comp of body.competitors) {
      if (comp.handle?.trim()) {
        await prisma.competitor.create({
          data: {
            handle: comp.handle.trim(),
            platforms: comp.platforms || "[]",
            notes: comp.notes || "",
          },
        });
      }
    }
  }

  return NextResponse.json(workspace, { status: 201 });
}

// PATCH: update workspace settings
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    return NextResponse.json({ error: "No workspace" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.platforms !== undefined) data.platforms = body.platforms;
  if (body.niche !== undefined) data.niche = body.niche;
  if (body.newsTopics !== undefined) data.newsTopics = body.newsTopics;
  if (body.onboardingComplete !== undefined)
    data.onboardingComplete = body.onboardingComplete;

  const updated = await prisma.workspace.update({
    where: { id: workspace.id },
    data,
  });

  return NextResponse.json(updated);
}
