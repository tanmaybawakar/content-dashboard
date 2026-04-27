import { NextRequest, NextResponse } from 'next/server'
import { searchCompetitor } from '@/lib/search/tavily'
import { createCompetitorSnapshot } from '@/lib/db/queries'
import { Competitor } from '@/types'

export interface AnalyzeCompetitorRequest {
  competitorId?: string
  handle: string
  platform: string
  niche: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { competitorId, handle, platform, niche } = body as AnalyzeCompetitorRequest

    if (!handle || !platform || !niche) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: handle, platform, and niche are required' },
        { status: 400 }
      )
    }

    // Run competitor analysis
    const analysis = await searchCompetitor(handle, platform, niche)

    // Save snapshot to Supabase
    let snapshotData = null
    if (competitorId) {
      const { data, error } = await createCompetitorSnapshot({
        competitor_id: competitorId,
        snapshot_data: {
          topTopics: analysis.topTopics,
          contentGaps: analysis.contentGaps,
          engagementInsights: analysis.engagementInsights,
          summary: analysis.summary,
          rawResults: analysis.rawResults
        },
        summary: analysis.summary,
        top_topics: analysis.topTopics,
        engagement_insights: analysis.engagementInsights,
        content_gaps: analysis.contentGaps
      })
      snapshotData = data
      if (error) console.error('Failed to save snapshot:', error)
    }

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        snapshot: snapshotData
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to analyze competitor' },
      { status: 500 }
    )
  }
}
