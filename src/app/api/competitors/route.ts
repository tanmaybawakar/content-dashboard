import { NextRequest, NextResponse } from 'next/server'
import { getCompetitors, createCompetitor, deleteCompetitor } from '@/lib/db/queries'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const niche = searchParams.get('niche')

    const { data, error } = await getCompetitors()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const filtered = niche ? data.filter(c => c.niche === niche) : data

    return NextResponse.json({ success: true, data: filtered })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch competitors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, platform, handle, url, niche } = body

    if (!name || !platform) {
      return NextResponse.json(
        { success: false, error: 'name and platform are required' },
        { status: 400 }
      )
    }

    const { data, error } = await createCompetitor({
      name,
      platform,
      handle,
      url,
      niche
    })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create competitor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id is required' },
        { status: 400 }
      )
    }

    const { error } = await deleteCompetitor(id)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete competitor' },
      { status: 500 }
    )
  }
}
