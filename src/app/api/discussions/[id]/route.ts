import { NextRequest, NextResponse } from 'next/server'
import { getAIDiscussionById, appendMessageToDiscussion } from '@/lib/db/queries'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await getAIDiscussionById(id)

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Discussion not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch discussion' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { role, content } = body

    if (!role || !content) {
      return NextResponse.json(
        { success: false, error: 'role and content are required' },
        { status: 400 }
      )
    }

    const message = {
      role,
      content,
      timestamp: new Date().toISOString()
    }

    const { data, error } = await appendMessageToDiscussion(id, message)

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Discussion not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to append message' },
      { status: 500 }
    )
  }
}
