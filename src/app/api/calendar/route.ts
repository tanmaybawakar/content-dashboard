import { NextRequest, NextResponse } from 'next/server'
import { getCalendarEntries, createCalendarEntry } from '@/lib/db/queries'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') || undefined
    const platform = searchParams.get('platform') || undefined
    const limit = parseInt(searchParams.get('limit') || '50')

    const { data, error } = await getCalendarEntries({ month, platform, limit })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch calendar entries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ideaId, scheduledDate, platform, status, notes } = body

    if (!ideaId || !scheduledDate) {
      return NextResponse.json(
        { success: false, error: 'ideaId and scheduledDate are required' },
        { status: 400 }
      )
    }

    const { data, error } = await createCalendarEntry({
      idea_id: ideaId,
      scheduled_date: scheduledDate,
      platform: platform || 'instagram',
      status: status || 'scheduled',
      notes: notes || ''
    })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create calendar entry' },
      { status: 500 }
    )
  }
}
