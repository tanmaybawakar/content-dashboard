import { supabaseAdmin } from './server'
import { ContentIdea, Competitor, CompetitorSnapshot, CalendarEntry, AIDiscussion, TrendReport, TelegramLog } from '@/types'

export async function getContentIdeas({
  status,
  platform,
  limit = 50,
  offset = 0
}: { status?: string; platform?: string; limit?: number; offset?: number } = {}) {
  let query = supabaseAdmin.from('content_ideas').select('*', { count: 'exact' }).range(offset, offset + limit - 1)

  if (status) query = query.eq('status', status)
  if (platform) query = query.eq('platform', platform)

  const { data, error, count } = await query

  return { data: data as ContentIdea[], error, count }
}

export async function getContentIdeaById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('content_ideas')
    .select('*')
    .eq('id', id)
    .single()

  return { data: data as ContentIdea, error }
}

export async function createContentIdea(inputData: Omit<ContentIdea, 'id' | 'created_at' | 'updated_at'>) {
    const { data: resultData, error } = await supabaseAdmin
      .from('content_ideas')
      .insert(inputData)
      .select()
      .single()

    return { data: resultData as ContentIdea, error }
  }

export async function updateContentIdea(id: string, updates: Partial<ContentIdea>) {
   const { data: updatedData, error } = await supabaseAdmin
     .from('content_ideas')
     .update(updates)
     .eq('id', id)
     .select()
     .single()

   return { data: updatedData as ContentIdea, error }
 }

export async function deleteContentIdea(id: string) {
   const { error: deleteError } = await supabaseAdmin.from('content_ideas').delete().eq('id', id)
   return { error: deleteError }
 }

export async function getCompetitors() {
   const { data: competitorData, error } = await supabaseAdmin
     .from('competitors')
     .select('*')
     .order('added_at', { ascending: false })

   return { data: competitorData as Competitor[], error }
 }

export async function getCompetitorById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('competitors')
    .select('*')
    .eq('id', id)
    .single()

  return { data: data as Competitor, error }
}

export async function createCompetitor(inputData: Omit<Competitor, 'id' | 'added_at'>) {
   const { data: competitorData, error } = await supabaseAdmin
     .from('competitors')
     .insert(inputData)
     .select()
     .single()

   return { data: competitorData as Competitor, error }
 }

export async function updateCompetitor(id: string, updates: Partial<Competitor>) {
  const { data, error } = await supabaseAdmin
    .from('competitors')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data: data as Competitor, error }
}

export async function deleteCompetitor(id: string) {
  const { error } = await supabaseAdmin.from('competitors').delete().eq('id', id)
  return { error }
}

export async function getCompetitorSnapshots({ competitorId, limit = 50 }: { competitorId?: string; limit?: number } = {}) {
  let query = supabaseAdmin.from('competitor_snapshots').select('*', { count: 'exact' }).order('captured_at', { ascending: false })

  if (competitorId) query = query.eq('competitor_id', competitorId)

  const { data, error, count } = await query.range(0, limit - 1)

  return { data: data as CompetitorSnapshot[], error, count }
}

export async function createCompetitorSnapshot(snapshotData: Omit<CompetitorSnapshot, 'id' | 'captured_at'>) {
   const { data, error } = await supabaseAdmin
     .from('competitor_snapshots')
     .insert(snapshotData)
     .select()
     .single()

   return { data: data as CompetitorSnapshot, error }
 }

export async function getCalendarEntries({
  month,
  platform,
  limit = 50
}: { month?: string; platform?: string; limit?: number } = {}) {
  let query = supabaseAdmin.from('content_calendar').select('*', { count: 'exact' }).order('scheduled_date', { ascending: false })

  if (month) {
    const start = new Date(`${month}-01`)
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0)
    query = query.gte('scheduled_date', start.toISOString().split('T')[0])
      .lte('scheduled_date', end.toISOString().split('T')[0])
  }

  if (platform) query = query.eq('platform', platform)

  const { data, error, count } = await query.range(0, limit - 1)

  return { data: data as CalendarEntry[], error, count }
}

export async function createCalendarEntry(entryData: Omit<CalendarEntry, 'id' | 'created_at'>) {
   const { data, error } = await supabaseAdmin
     .from('content_calendar')
     .insert(entryData)
     .select()
     .single()

   return { data: data as CalendarEntry, error }
 }

export async function getAIDiscussions() {
  const { data, error } = await supabaseAdmin
    .from('ai_discussions')
    .select('*')
    .order('updated_at', { ascending: false })

  return { data: data as AIDiscussion[], error }
}

export async function getAIDiscussionById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('ai_discussions')
    .select('*')
    .eq('id', id)
    .single()

  return { data: data as AIDiscussion, error }
}

export async function createAIDiscussion(discussionData: Omit<AIDiscussion, 'id' | 'created_at' | 'updated_at'>) {
   const { data, error } = await supabaseAdmin
     .from('ai_discussions')
     .insert(discussionData)
     .select()
     .single()

   return { data: data as AIDiscussion, error }
 }

export async function appendMessageToDiscussion(id: string, message: any) {
   // First, get the current discussion
   const { data: discussion, error: fetchError } = await supabaseAdmin
     .from('ai_discussions')
     .select('messages')
     .eq('id', id)
     .single()
     
   if (fetchError) {
     return { data: null, error: fetchError }
   }
   
   // Append the new message
   const updatedMessages = [...(discussion.messages || []), message];
   
   // Update the discussion
   const { data: updateData, error } = await supabaseAdmin
     .from('ai_discussions')
     .update({
       messages: updatedMessages,
       updated_at: new Date().toISOString()
     })
     .eq('id', id)
     .select()
     .single()
 
   return { data: updateData as AIDiscussion, error }
 }

export async function getTrendReports() {
  const { data, error } = await supabaseAdmin
    .from('trend_reports')
    .select('*')
    .order('generated_at', { ascending: false })

  return { data: data as TrendReport[], error }
}

export async function createTrendReport(trendData: Omit<TrendReport, 'id' | 'generated_at'>) {
   const { data, error } = await supabaseAdmin
     .from('trend_reports')
     .insert(trendData)
     .select()
     .single()

   return { data: data as TrendReport, error }
 }

export async function logTelegramMessage(data: Omit<TelegramLog, 'id'>) {
  const { data: result, error } = await supabaseAdmin
    .from('telegram_logs')
    .insert(data)
    .select()
    .single()

  return { data: result as TelegramLog, error }
}

export async function getTelegramLogs({ limit = 50 }: { limit?: number } = {}) {
  const { data, error } = await supabaseAdmin
    .from('telegram_logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .range(0, limit - 1)

  return { data: data as TelegramLog[], error }
}
