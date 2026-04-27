import { NextResponse } from 'next/server'
import { generateWeeklyBriefing } from '@/lib/ai/weeklyBriefing'
import { supabaseAdmin } from '@/lib/db/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const niche = searchParams.get('niche') || 'content creation'
    
    // Fetch this week's scheduled ideas
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // Start of week (Sunday)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6) // End of week (Saturday)
    
    const { data: scheduledIdeas, error: ideasError } = await supabaseAdmin
      .from('content_ideas')
      .select('*')
      .gte('created_at', weekStart.toISOString())
      .lte('created_at', weekEnd.toISOString())
      .order('created_at', { ascending: true })
    
    if (ideasError) throw ideasError
    
    // Fetch recent competitor data
    const { data: competitorSnapshots, error: compError } = await supabaseAdmin
      .from('competitor_snapshots')
      .select('*')
      .order('captured_at', { ascending: false })
      .limit(5)
    
    if (compError) throw compError
    
    // Generate weekly briefing
    const briefing = await generateWeeklyBriefing(
      niche,
      scheduledIdeas || [],
      competitorSnapshots || []
    )
    
    // Cache the briefing in trend_reports table
    await supabaseAdmin
      .from('trend_reports')
      .insert({
        type: 'weekly_briefing',
        title: `Weekly Briefing for ${niche}`,
        content: JSON.stringify(briefing),
        created_at: new Date().toISOString()
      })
    
    return NextResponse.json(briefing)
  } catch (error: any) {
    console.error('Error generating weekly briefing:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate weekly briefing' },
      { status: 500 }
    )
  }
}