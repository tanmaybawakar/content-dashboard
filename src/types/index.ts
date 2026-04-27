// Content Ideas
export interface ContentIdea {
  id: string
  user_id?: string
  title: string
  platform: string
  niche?: string
  hook?: string
  body_outline?: string
  cta?: string
  tags: string[]
  status: 'idea' | 'drafted' | 'published' | 'archived'
  ai_score?: number
  source: 'manual' | 'ai_generated' | 'competitor_inspired'
  created_at: string
  updated_at: string
}

// Competitors
export interface Competitor {
  id: string
  name: string
  platform: string
  handle?: string
  url?: string
  niche?: string
  added_at: string
}

// Competitor Snapshots
export interface CompetitorSnapshot {
  id: string
  competitor_id: string
  snapshot_data: Record<string, any>
  summary: string
  top_topics: string[]
  engagement_insights: string
  content_gaps: string[]
  captured_at: string
}

// Calendar Entries
export interface CalendarEntry {
  id: string
  idea_id: string
  scheduled_date: string
  platform: string
  status: 'scheduled' | 'posted' | 'missed'
  notes?: string
  created_at: string
}

// AI Discussions
export interface AIDiscussion {
  id: string
  title: string
  context?: string
  messages: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp?: string
  }>
  created_at: string
  updated_at: string
}

// Trend Reports
export interface TrendReport {
  id: string
  niche: string
  platform: string
  report_data: Record<string, any>
  summary: string
  generated_at: string
}

// Telegram Logs
export interface TelegramLog {
  id: string
  telegram_user_id: string
  direction: 'inbound' | 'outbound'
  message_text?: string
  command?: string
  response_text?: string
  timestamp?: string
}

// API Response Types
export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  count?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  offset: number
  limit: number
}

// Request/Response bodies
export interface CompetitorAnalysisRequest {
  competitorId?: string
  handle: string
  platform: string
  niche: string
}

export interface CompetitorAnalysisResponse {
  success: boolean
  analysis?: any
  snapshot?: CompetitorSnapshot
  error?: string
}

export interface TrendSearchRequest {
  niche: string
  platform: string
}

export interface TrendSearchResponse {
  success: boolean
  trendReport?: TrendReport
  topTopics?: string[]
  rawResults?: any[]
  error?: string
}
