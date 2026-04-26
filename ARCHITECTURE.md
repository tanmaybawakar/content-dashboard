# Dashboard Architecture & Technical Specification

## Core Technology Stack
- **Framework:** Next.js 15 (App Router)
- **Database:** SQLite via Prisma ORM
- **Styling:** Tailwind CSS v4 + bespoke Glassmorphism Design System
- **Components:** shadcn/ui primitives + Custom Glass Primitives
- **Data Fetching:** Fetch API with Route Handlers

## Custom Design System: "Apple Liquid Glass"
The dashboard implements a premium aesthetic characterized by:
- **Deep Navy Base:** `oklch(0.12 0.01 260)` background for high contrast.
- **Glass Cards:** `GlassCard` component with `backdrop-blur-xl` and `bg-card/70`.
- **Golden Accents:** `oklch(0.7 0.15 70)` used for primary CTAs, active states, and focus rings.
- **Micro-Animations:** Entrance slide-ins (`PageShell`) and hover transitions.

## Data Persistence (Prisma Models)
| Model | Description |
|-------|-------------|
| `Post` | Content items for Instagram Manager & Calendar. Tracks caption, type, and status. |
| `Competitor` | Tracked industry handles with follower/engagement snapshots. |
| `NewsItem` | (Reserved) Schema for persistent saved articles/feeds. |

## Internal API Endpoints
- `/api/posts`: CRUD for content scheduling.
- `/api/competitors`: Manage competitive tracking list.
- `/api/analytics`: Aggregated performance metrics (Mocked - replace with Metricool/Social API).
- `/api/news`: Real-time RSS aggregator from industry-standard sources (TechCrunch, The Verge, etc.).

## Development Workflow
1. **Migrations:** `npx prisma db push` to sync schema changes.
2. **Icons:** Exclusively uses `lucide-react`.
3. **Styling:** Managed via `globals.css` @theme and @layer base rules.

## Future Integrations
- **Metricool:** Swap `/api/analytics` fetch logic with Metricool API keys.
- **Social APIs:** Integrate Graph API for real-time Instagram publishing.
- **Real Scraping:** Replace Competitor mock statistics with a scraper or third-party tracking API.
