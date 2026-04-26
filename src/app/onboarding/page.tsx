"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Instagram,
  Youtube,
  Hash,
  Globe,
  Users,
  Newspaper,
  Plus,
  Trash2,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ── Constants ──

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-400" },
  { id: "youtube", label: "YouTube", icon: Youtube, color: "text-red-400" },
  { id: "tiktok", label: "TikTok", icon: Hash, color: "text-cyan-400" },
  { id: "x", label: "X / Twitter", icon: Globe, color: "text-blue-400" },
] as const;

const NEWS_TOPICS = [
  { id: "tools", label: "Tools & Platforms", desc: "New creator tools, API updates, platform features" },
  { id: "research", label: "Research & Trends", desc: "Studies, benchmarks, audience behavior insights" },
  { id: "business", label: "Business & Deals", desc: "Funding, acquisitions, revenue models, partnerships" },
] as const;

const TOTAL_STEPS = 5;

// ── Component ──

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);

  // Redirect away if onboarding already complete
  useEffect(() => {
    fetch("/api/workspace")
      .then((res) => res.json())
      .then((data) => {
        if (data.onboardingComplete) {
          router.replace("/");
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [router]);

  // Step 0: Welcome (no data)

  // Step 1: Workspace
  const [workspaceName, setWorkspaceName] = useState("");
  const [niche, setNiche] = useState("");

  // Step 2: Platforms
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  // Step 3: Competitors
  const [competitors, setCompetitors] = useState<{ handle: string; platforms: string }[]>([
    { handle: "", platforms: "Instagram" },
  ]);

  // Step 4: News topics
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["tools", "research", "business"]);

  function togglePlatform(id: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  function toggleTopic(id: string) {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  function addCompetitor() {
    setCompetitors((prev) => [...prev, { handle: "", platforms: "Instagram" }]);
  }

  function removeCompetitor(idx: number) {
    setCompetitors((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateCompetitor(idx: number, field: "handle" | "platforms", value: string) {
    setCompetitors((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
    );
  }

  function canProceed(): boolean {
    switch (step) {
      case 0: return true;
      case 1: return workspaceName.trim().length > 0;
      case 2: return selectedPlatforms.length > 0;
      case 3: return true; // competitors optional
      case 4: return selectedTopics.length > 0;
      default: return false;
    }
  }

  async function handleFinish() {
    setSubmitting(true);
    await fetch("/api/workspace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: workspaceName.trim() || "My Workspace",
        platforms: JSON.stringify(selectedPlatforms),
        niche: niche.trim(),
        newsTopics: selectedTopics.join(","),
        competitors: competitors
          .filter((c) => c.handle.trim())
          .map((c) => ({
            handle: c.handle.trim(),
            platforms: JSON.stringify([c.platforms]),
          })),
      }),
    });
    router.push("/");
    router.refresh();
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-dreamscape flex items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dreamscape flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-300/70 to-amber-600/50 flex items-center justify-center">
            <LayoutDashboard className="h-4 w-4 text-amber-950" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">
            <span className="golden-text">Content</span> Dashboard
          </h1>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-1.5 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-8 bg-amber-400/80"
                  : i < step
                    ? "w-3 bg-amber-400/30"
                    : "w-3 bg-white/10"
              }`}
            />
          ))}
        </div>

        <GlassCard className="p-6 sm:p-8">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-300/20 to-amber-600/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-5">
                <Sparkles className="h-6 w-6 text-amber-400/80" />
              </div>
              <h2 className="text-xl font-bold mb-2">Welcome to your dashboard</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto mb-8">
                Let&apos;s set up your workspace. This takes about a minute — you&apos;ll configure
                your platforms, track competitors, and personalize your news feed.
              </p>
              <Button onClick={() => setStep(1)} className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 1: Workspace */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-1">Name your workspace</h2>
              <p className="text-sm text-muted-foreground mb-6">
                This is your content command center. Give it a name.
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ws-name">Workspace name</Label>
                  <Input
                    id="ws-name"
                    placeholder="e.g. Acme Social Team"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="niche">Niche / Industry (optional)</Label>
                  <Input
                    id="niche"
                    placeholder="e.g. Fashion, SaaS, Fitness"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Helps us tailor news and trends to your space.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Platforms */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-1">Which platforms do you use?</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Select the social platforms you create content for.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {PLATFORMS.map((p) => {
                  const selected = selectedPlatforms.includes(p.id);
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={`flex items-center gap-3 rounded-lg border p-3.5 text-left transition-all ${
                        selected
                          ? "border-amber-400/40 bg-amber-400/5 ring-1 ring-amber-400/20"
                          : "border-border/50 hover:border-border hover:bg-white/[0.02]"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${selected ? "text-amber-400" : p.color}`} />
                      <span className="text-sm font-medium">{p.label}</span>
                      {selected && (
                        <Check className="h-3.5 w-3.5 text-amber-400 ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Competitors */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-1">Track a competitor</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Add competitor handles to monitor their growth. You can skip this and add later.
              </p>
              <div className="space-y-3">
                {competitors.map((comp, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="@competitor"
                        value={comp.handle}
                        onChange={(e) => updateCompetitor(idx, "handle", e.target.value)}
                      />
                    </div>
                    <select
                      value={comp.platforms}
                      onChange={(e) => updateCompetitor(idx, "platforms", e.target.value)}
                      className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring w-28"
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Twitter">Twitter</option>
                    </select>
                    {competitors.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCompetitor(idx)}
                        className="shrink-0"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addCompetitor}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mt-3 transition-colors"
              >
                <Plus className="h-3 w-3" /> Add another
              </button>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/40">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">
                  Competitors can be added, edited, or removed anytime from the Competitor Tracker.
                </span>
              </div>
            </div>
          )}

          {/* Step 4: News Topics */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold mb-1">Personalize your news feed</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Choose which types of industry news matter to you.
              </p>
              <div className="space-y-3">
                {NEWS_TOPICS.map((topic) => {
                  const selected = selectedTopics.includes(topic.id);
                  return (
                    <button
                      key={topic.id}
                      onClick={() => toggleTopic(topic.id)}
                      className={`w-full flex items-start gap-3 rounded-lg border p-3.5 text-left transition-all ${
                        selected
                          ? "border-amber-400/40 bg-amber-400/5 ring-1 ring-amber-400/20"
                          : "border-border/50 hover:border-border hover:bg-white/[0.02]"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                          selected
                            ? "bg-amber-400/20 border-amber-400/40"
                            : "border-border"
                        }`}
                      >
                        {selected && <Check className="h-3 w-3 text-amber-400" />}
                      </div>
                      <div>
                        <span className="text-sm font-medium block">{topic.label}</span>
                        <span className="text-xs text-muted-foreground">{topic.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/40">
                <Newspaper className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">
                  Sources and topics can be adjusted from the News Consolidator.
                </span>
              </div>
            </div>
          )}

          {/* Navigation */}
          {step > 0 && (
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-border/40">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => s - 1)}
                className="gap-1"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <span className="text-xs text-muted-foreground">
                {step} of {TOTAL_STEPS - 1}
              </span>
              {step < TOTAL_STEPS - 1 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                  className="gap-1"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  disabled={!canProceed() || submitting}
                  className="gap-1"
                >
                  {submitting ? "Setting up..." : "Launch Dashboard"}
                  {!submitting && <Sparkles className="h-4 w-4" />}
                </Button>
              )}
            </div>
          )}
        </GlassCard>

        {/* Skip link */}
        {step > 0 && step < TOTAL_STEPS - 1 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setStep(TOTAL_STEPS - 1)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip to finish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
