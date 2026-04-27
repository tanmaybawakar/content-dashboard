import { NextRequest, NextResponse } from 'next/server'
import { getContentIdeas, createContentIdea } from '@/lib/db/queries'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined
    const platform = searchParams.get('platform') || undefined
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data, error } = await getContentIdeas({ status, platform, limit, offset })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ideas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, platform, niche, hook, body_outline, cta, tags, status, ai_score, source } = body

    if (!title || !platform) {
      return NextResponse.json(
        { success: false, error: 'title and platform are required' },
        { status: 400 }
      )
    }

    const { data, error } = await createContentIdea({
      title,
      platform,
      niche,
      hook,
      body_outline,
      cta,
      tags: tags || [],
      status: status || 'idea',
      ai_score: ai_score || null,
      source: source || 'manual'
    })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create idea' },
      { status: 500 }
    )
  }
}
