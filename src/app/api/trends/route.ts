import { NextRequest, NextResponse } from 'next/server'
import { searchTrends } from '@/lib/search/tavily'
import { createTrendReport } from '@/lib/db/queries'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { niche, platform } = body

    if (!niche || !platform) {
      return NextResponse.json(
        { success: false, error: 'niche and platform are required' },
        { status: 400 }
      )
    }

    // Run Tavily trend search
    const rawData = await searchTrends(niche, platform)

    // Extract top results and create summary
    const results = rawData.results || []
    const topTopics = Array.from(new Set(results.slice(0, 10).map((r: any) => r.title.split(' ').slice(0, 3).join(' ')).filter(Boolean)))

    // Save to Supabase
    const { data, error } = await createTrendReport({
      niche,
      platform,
      report_data: rawData,
      summary: `Trending topics for ${niche} on ${platform}: ${topTopics.slice(0, 5).join(', ')}`
    })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        trendReport: data,
        topTopics: topTopics.slice(0, 10),
        rawResults: results.slice(0, 5)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trends' },
      { status: 500 }
    )
  }
}
