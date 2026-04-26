"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Competitor {
  id: string;
  handle: string;
  platforms: string; // JSON
  followerCount: number;
  avgEngagement: number;
  postingFrequency: number;
  growthRate: number;
  notes: string;
}

type SortField = "handle" | "followers" | "engagement" | "frequency" | "growth";
type SortDir = "asc" | "desc";

const PLATFORMS = ["Instagram", "YouTube", "TikTok", "Twitter"];

const PLATFORM_COLORS: Record<string, string> = {
  Instagram: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  YouTube: "bg-red-500/20 text-red-400 border-red-500/30",
  TikTok: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Twitter: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return n.toString();
}

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (field !== sortField) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-30" />;
  return sortDir === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />;
}

function Sparkline({ values, color = "hsl(43, 76%, 56%)" }: { values: number[]; color?: string }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 60;
  const h = 20;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} className="inline-block">
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>("followers");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formHandle, setFormHandle] = useState("");
  const [formPlatforms, setFormPlatforms] = useState("Instagram");
  const [formNotes, setFormNotes] = useState("");

  const loadCompetitors = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/competitors");
    const data = await res.json();
    setCompetitors(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCompetitors();
  }, [loadCompetitors]);

  function handleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir(field === "handle" ? "asc" : "desc"); }
  }

  const sorted = useMemo(() => {
    const copy = [...competitors];
    copy.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;
      switch (sortField) {
        case "handle": aVal = a.handle.toLowerCase(); bVal = b.handle.toLowerCase(); break;
        case "followers": aVal = a.followerCount; bVal = b.followerCount; break;
        case "engagement": aVal = a.avgEngagement; bVal = b.avgEngagement; break;
        case "frequency": aVal = a.postingFrequency; bVal = b.postingFrequency; break;
        case "growth": aVal = a.growthRate; bVal = b.growthRate; break;
        default: aVal = 0; bVal = 0;
      }
      if (typeof aVal === "string") return sortDir === "asc" ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
      return sortDir === "asc" ? aVal - (bVal as number) : (bVal as number) - aVal;
    });
    return copy;
  }, [competitors, sortField, sortDir]);

  function toggleExpand(id: string) {
    setExpanded((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }

  async function handleAddCompetitor() {
    if (!formHandle.trim()) return;
    await fetch("/api/competitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        handle: formHandle.trim(),
        platforms: JSON.stringify(formPlatforms.split(",").map((p) => p.trim())),
        notes: formNotes,
        followerCount: Math.floor(Math.random() * 500000) + 10000,
        avgEngagement: +(Math.random() * 8 + 1).toFixed(1),
        postingFrequency: +(Math.random() * 15 + 1).toFixed(1),
        growthRate: +(Math.random() * 10 - 2).toFixed(1),
      }),
    });
    setFormHandle("");
    setFormPlatforms("Instagram");
    setFormNotes("");
    setDialogOpen(false);
    loadCompetitors();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/competitors/${id}`, { method: "DELETE" });
    loadCompetitors();
  }

  const topCompetitorId = sorted.length > 0 ? sorted[0].id : null;

  return (
    <div>
      <SectionHeader
        title="Competitor Tracker"
        description="Monitor competitor accounts, engagement, and growth across platforms."
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4" />Add Competitor</Button>
            </DialogTrigger>
            <DialogContent className="glass">
              <DialogHeader>
                <DialogTitle>Add Competitor</DialogTitle>
                <DialogDescription>Add a competitor handle and social platforms to track.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="handle">Handle</Label>
                  <Input id="handle" placeholder="@competitor" value={formHandle} onChange={(e) => setFormHandle(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Platforms (comma-separated)</Label>
                  <Select value={formPlatforms} onValueChange={setFormPlatforms}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" placeholder="Optional notes..." value={formNotes} onChange={(e) => setFormNotes(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddCompetitor}>Add Competitor</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {loading ? (
        <div className="text-center text-muted-foreground py-12">Loading...</div>
      ) : (
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-left">
                  <th className="px-4 py-3 w-8" />
                  <th className="px-4 py-3 font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("handle")}>
                    <span className="inline-flex items-center">Competitor <SortIcon field="handle" sortField={sortField} sortDir={sortDir} /></span>
                  </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Platforms</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-right cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("followers")}>
                    <span className="inline-flex items-center justify-end w-full">Followers <SortIcon field="followers" sortField={sortField} sortDir={sortDir} /></span>
                  </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-right cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("engagement")}>
                    <span className="inline-flex items-center justify-end w-full">Eng. <SortIcon field="engagement" sortField={sortField} sortDir={sortDir} /></span>
                  </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-right cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("frequency")}>
                    <span className="inline-flex items-center justify-end w-full">Posts/Wk <SortIcon field="frequency" sortField={sortField} sortDir={sortDir} /></span>
                  </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-right cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("growth")}>
                    <span className="inline-flex items-center justify-end w-full">Growth <SortIcon field="growth" sortField={sortField} sortDir={sortDir} /></span>
                  </th>
                  <th className="px-4 py-3 w-10" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((comp) => {
                  const isOpen = expanded.has(comp.id);
                  const isTop = comp.id === topCompetitorId;
                  let platforms: string[] = [];
                  try { platforms = JSON.parse(comp.platforms); } catch { platforms = []; }

                  return (
                    <React.Fragment key={comp.id}>
                      <tr
                        className={`border-b border-border/30 cursor-pointer transition-colors ${
                          isTop ? "bg-amber-400/5 hover:bg-amber-400/8" : "hover:bg-white/[0.02]"
                        }`}
                        onClick={() => toggleExpand(comp.id)}
                      >
                        <td className="px-4 py-3">
                          {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        </td>
                        <td className={`px-4 py-3 font-medium ${isTop ? "golden-text" : ""}`}>
                          {comp.handle}
                          {isTop && <span className="ml-2 text-[10px] text-amber-400/70">TOP</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {platforms.map((p: string) => (
                              <Badge key={p} variant="outline" className={`text-[10px] ${PLATFORM_COLORS[p] || "bg-zinc-500/20 text-zinc-400"}`}>
                                {p}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono">{formatNumber(comp.followerCount)}</td>
                        <td className="px-4 py-3 text-right font-mono">{comp.avgEngagement.toFixed(1)}%</td>
                        <td className="px-4 py-3 text-right font-mono">{comp.postingFrequency.toFixed(1)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Sparkline
                              values={[comp.growthRate * 0.6, comp.growthRate * 0.8, comp.growthRate * 0.9, comp.growthRate * 1.1, comp.growthRate]}
                              color={comp.growthRate >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"}
                            />
                            <span className={`font-mono text-xs ${comp.growthRate >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                              {comp.growthRate >= 0 ? "+" : ""}{comp.growthRate.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(comp.id); }}>
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-400" />
                          </Button>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr key={`${comp.id}-detail`}>
                          <td colSpan={8} className="px-4 py-0">
                            <div className="py-3 pl-8">
                              {comp.notes && (
                                <p className="text-sm text-muted-foreground mb-2">{comp.notes}</p>
                              )}
                              <div className="flex gap-4 text-xs text-muted-foreground">
                                <span>{formatNumber(comp.followerCount)} total followers</span>
                                <span>{comp.avgEngagement.toFixed(1)}% avg engagement</span>
                                <span>{comp.postingFrequency.toFixed(1)} posts/week</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                      No competitors tracked yet. Click &quot;Add Competitor&quot; to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
