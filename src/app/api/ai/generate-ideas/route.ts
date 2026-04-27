import { NextResponse } from 'next/server'
import { generateContentIdeas } from '@/lib/ai/ideaGenerator'
import { supabaseAdmin } from '@/lib/db/server'

export async function POST(request: Request) {
  try {
    const config = await request.json()
    
    // Validate required fields
    if (!config.niche || !config.platform || !config.tone || !config.count) {
      return NextResponse.json(
        { error: 'Missing required fields: niche, platform, tone, count' },
        { status: 400 }
      )
    }
    
    // Generate ideas
    const ideas = await generateContentIdeas(config)
    
    // Save to database
    const { data, error } = await supabaseAdmin
      .from('content_ideas')
      .insert(
        ideas.map(idea => ({
          title: idea.title,
          hook: idea.hook,
          angle: idea.angle,
          format: idea.format,
          body_outline: idea.bodyOutline,
          cta: idea.cta,
          estimated_engagement: idea.estimatedEngagement,
          best_posting_time: idea.bestPostingTime,
          tags: idea.tags,
          ai_score: idea.aiScore,
          platform: idea.platform,
          niche: idea.niche,
          status: 'generated'
        }))
      )
      .select()
    
    if (error) throw error
    
    return NextResponse.json({ ideas, saved: data })
  } catch (error: any) {
    console.error('Error generating ideas:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate ideas' },
      { status: 500 }
    )
  }
}