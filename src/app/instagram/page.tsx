"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, CalendarDays, FileText, Send, Archive, Pencil, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface Post {
  id: string;
  platform: string;
  title: string;
  caption: string;
  postType: string;
  status: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  tags: string;
  createdAt: string;
}

type PostStatus = "scheduled" | "draft" | "published" | "backlog";

const PLATFORMS = ["instagram", "youtube", "tiktok", "x", "other"];
const POST_TYPES = ["reel", "story", "carousel", "static", "short", "longForm"];
const STATUSES: PostStatus[] = ["scheduled", "draft", "published", "backlog"];

const STATUS_CONFIG: Record<
  PostStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  scheduled: { label: "Scheduled", icon: CalendarDays, className: "bg-blue-500/15 text-blue-400" },
  draft: { label: "Drafts", icon: FileText, className: "bg-amber-500/15 text-amber-400" },
  published: { label: "Published", icon: Send, className: "bg-emerald-500/15 text-emerald-400" },
  backlog: { label: "Backlog", icon: Archive, className: "bg-zinc-500/15 text-zinc-400" },
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "bg-pink-500/15 text-pink-400 border-pink-500/20",
  youtube: "bg-red-500/15 text-red-400 border-red-500/20",
  tiktok: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  x: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  other: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
};

export default function InstagramPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<PostStatus | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const [postType, setPostType] = useState("static");
  const [status, setStatus] = useState<PostStatus>("draft");
  const [platform, setPlatform] = useState("instagram");
  const [scheduledAt, setScheduledAt] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeStatus !== "all") params.set("status", activeStatus);
    const res = await fetch(`/api/posts?${params}`);
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }, [activeStatus]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  function resetForm() {
    setCaption("");
    setTitle("");
    setPostType("static");
    setStatus("draft");
    setPlatform("instagram");
    setScheduledAt("");
    setEditingPost(null);
  }

  function openEdit(post: Post) {
    setEditingPost(post);
    setCaption(post.caption);
    setTitle(post.title);
    setPostType(post.postType);
    setStatus(post.status as PostStatus);
    setPlatform(post.platform);
    setScheduledAt(post.scheduledAt ? post.scheduledAt.split("T")[0] : "");
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!caption.trim()) return;

    const body = {
      caption: caption.trim(),
      title: title.trim(),
      postType,
      status,
      platform,
      scheduledAt: scheduledAt || null,
    };

    if (editingPost) {
      await fetch(`/api/posts/${editingPost.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    resetForm();
    setDialogOpen(false);
    loadPosts();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    loadPosts();
  }

  return (
    <div>
      <SectionHeader
        title="Instagram Manager"
        description="Manage scheduled posts, drafts, published content, and your backlog."
        actions={
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              if (!open) resetForm();
              setDialogOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="glass">
              <DialogHeader>
                <DialogTitle>{editingPost ? "Edit Post" : "Create Post"}</DialogTitle>
                <DialogDescription>
                  {editingPost ? "Update the post details below." : "Add a new post with caption, type, status, and platform."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Post title..." value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="caption">Caption</Label>
                  <Textarea id="caption" placeholder="Write your caption..." value={caption} onChange={(e) => setCaption(e.target.value)} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Platform</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PLATFORMS.map((p) => (
                          <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Post Type</Label>
                    <Select value={postType} onValueChange={setPostType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {POST_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={(v) => setStatus(v as PostStatus)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Scheduled Date</Label>
                    <Input id="date" type="date" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { resetForm(); setDialogOpen(false); }}>Cancel</Button>
                <Button onClick={handleSave}>{editingPost ? "Save Changes" : "Create Post"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveStatus("all")}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
            activeStatus === "all" ? "bg-primary/15 text-primary border-primary/20" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
          }`}
        >
          All
        </button>
        {STATUSES.map((s) => {
          const config = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                activeStatus === s ? config.className + " border-current/20" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Posts grid */}
      {loading ? (
        <div className="text-center text-muted-foreground py-12">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">No posts found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {posts.map((post) => {
            const statusConf = STATUS_CONFIG[post.status as PostStatus];
            return (
              <GlassCard key={post.id} hoverable className="p-4 group">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className={`text-[10px] ${PLATFORM_COLORS[post.platform] || PLATFORM_COLORS.other}`}>
                      {post.platform}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] ${statusConf.className}`}>
                      {post.postType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(post)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="h-3 w-3 text-red-400/70 hover:text-red-400" />
                    </Button>
                  </div>
                </div>
                {post.title && <h3 className="font-medium text-sm mb-1">{post.title}</h3>}
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{post.caption}</p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
                  <span className="text-[11px] text-muted-foreground">
                    {post.scheduledAt
                      ? `Scheduled: ${new Date(post.scheduledAt).toLocaleDateString()}`
                      : post.publishedAt
                        ? `Published: ${new Date(post.publishedAt).toLocaleDateString()}`
                        : "No date set"}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
