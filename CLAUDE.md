# CLAUDE.md

## Tech Stack
- **Framework:** Next.js 15 with App Router
- **Database:** SQLite + Prisma ORM
- **Styling:** Tailwind CSS v4 + custom glassmorphism utilities
- **Components:** shadcn/ui + custom glass primitives
- **Charts:** Recharts
- **Icons:** lucide-react

## Folder Structure
```
src/
├── app/
│   ├── api/
│   │   ├── posts/route.ts           # GET (?status=,platform=), POST
│   │   ├── posts/[id]/route.ts      # GET, PATCH, DELETE
│   │   ├── analytics/route.ts       # GET (?from=,to=,platform=)
│   │   ├── competitors/route.ts     # GET, POST
│   │   ├── competitors/[id]/route.ts # GET, PATCH, DELETE
│   │   ├── news/route.ts            # GET (?topic=,saved=), PATCH
│   │   └── seed/route.ts            # POST (resets + re-seeds DB)
│   ├── layout.tsx          # Root layout with bg-dreamscape gradient + sidebar
│   ├── page.tsx            # Dashboard overview with stat cards
│   ├── globals.css         # Theme variables + glass utilities
│   ├── instagram/page.tsx  # Post manager with CRUD via API
│   ├── analytics/page.tsx  # Charts from /api/analytics (Recharts)
│   ├── calendar/page.tsx   # Monthly grid from /api/posts
│   ├── competitors/page.tsx # Sortable table from /api/competitors
│   └── news/page.tsx       # News feed from /api/news
├── components/
│   ├── app-sidebar.tsx     # Sidebar navigation (client)
│   ├── glass-card.tsx      # <GlassCard> — translucent panel
│   ├── section-header.tsx  # <SectionHeader> — title + desc + actions
│   ├── metric-badge.tsx    # <MetricBadge> — KPI number with golden text
│   ├── status-pill.tsx     # <StatusPill> — post status indicator
│   └── ui/                 # shadcn primitives (card, badge, button, dialog, etc.)
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   └── utils.ts            # cn() helper
prisma/
├── schema.prisma           # Post, AnalyticsSnapshot, Competitor, NewsItem
└── seed.ts                 # Seed script (npm run db:seed)
```

## Conventions

### Theming
- Dark mystical background via `bg-dreamscape` class (radial gradients over deep navy)
- Glass panels: use `<GlassCard>` component or `.glass` / `.glass-light` CSS classes
- Golden accents: `.golden-text` for gradient text, `.golden-left` for fresh-item borders
- All shadcn dark tokens customized in `globals.css` to match navy/gold palette
- Colors use `oklch` for perceptual uniformity

### Data & Persistence
- All data goes through API routes (`/api/*`) backed by Prisma + SQLite
- Client components fetch from API routes — no direct Prisma imports in components
- Seed data: `npm run db:seed` or POST to `/api/seed`
- DB setup: `npm run db:push` to sync schema

### Shared Components
- `GlassCard` — translucent panel with blur; supports `intensity="full|light"` and `hoverable`
- `SectionHeader` — page title with optional description and action buttons slot
- `MetricBadge` — KPI display with golden gradient text and trend indicator
- `StatusPill` — post status pill with icon and color coding

### Adding a New Section
1. Create `src/app/<section>/page.tsx` with `"use client"`
2. Add API route in `src/app/api/<section>/route.ts`
3. Add entry to `sections` array in `src/components/app-sidebar.tsx`
4. Use `<SectionHeader>` + `<GlassCard>` for consistent look

## Key Data Models

**Post**: `id, platform, title, caption, postType, status, scheduledAt, publishedAt, tags (JSON), thumbnailUrl, createdAt, updatedAt`

**AnalyticsSnapshot**: `id, date, platform, impressions, engagementRate, followers, newFollowers, topPostId, createdAt`

**Competitor**: `id, handle, platforms (JSON), followerCount, avgEngagement, postingFrequency, growthRate, notes, lastScrapedAt, createdAt, updatedAt`

**NewsItem**: `id, title, url, source, summary, topic, publishedAt, isSaved, createdAt`

## Running
```bash
npm install
npm run db:push      # Create/sync SQLite database
npm run db:seed      # Populate demo data
npm run dev          # Start dev server (turbopack)
npm run build        # Production build
```

## Plugging In Real APIs
- **Metricool**: Replace mock data in `prisma/seed.ts` and `/api/analytics` with Metricool API calls
- **Social APIs**: Update `/api/competitors` with real scraper or API integration (marked with TODO)
- **RSS Feeds**: Add real RSS feed URLs to NewsItem seed data; integrate an RSS parser in `/api/news`
