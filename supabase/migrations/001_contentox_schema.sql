-- Users / Sessions
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  telegram_id text unique,
  name text,
  created_at timestamptz default now()
);

-- Content Ideas
create table if not exists public.content_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  title text not null,
  platform text,
  niche text,
  hook text,
  body_outline text,
  cta text,
  tags text[],
  status text default 'idea',
  ai_score integer,
  source text default 'manual',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Competitor Tracking
create table if not exists public.competitors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  platform text not null,
  handle text,
  url text,
  niche text,
  added_at timestamptz default now()
);

-- Competitor Analysis Snapshots
create table if not exists public.competitor_snapshots (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid references public.competitors(id),
  snapshot_data jsonb,
  summary text,
  top_topics text[],
  engagement_insights text,
  content_gaps text[],
  captured_at timestamptz default now()
);

-- Content Calendar
create table if not exists public.content_calendar (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid references public.content_ideas(id),
  scheduled_date date,
  platform text,
  status text default 'scheduled',
  notes text,
  created_at timestamptz default now()
);

-- Chat / Discussion sessions with AI
create table if not exists public.ai_discussions (
  id uuid primary key default gen_random_uuid(),
  title text,
  context text,
  messages jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trend Reports
create table if not exists public.trend_reports (
  id uuid primary key default gen_random_uuid(),
  niche text,
  platform text,
  report_data jsonb,
  summary text,
  generated_at timestamptz default now()
);

-- Telegram Messages Log
create table if not exists public.telegram_logs (
  id uuid primary key default gen_random_uuid(),
  telegram_user_id text,
  direction text,
  message_text text,
  command text,
  response_text text,
  timestamp timestamptz default now()
);
