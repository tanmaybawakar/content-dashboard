import { NextResponse } from 'next/server'
import { repurposeContent } from '@/lib/ai/repurposer'

export async function POST(request: Request) {
  try {
    const { originalContent, originalPlatform, targetPlatforms } = await request.json()
    
    if (!originalContent || !originalPlatform || !targetPlatforms) {
      return NextResponse.json(
        { error: 'Original content, original platform, and target platforms are required' },
        { status: 400 }
      )
    }
    
    const repurposed = await repurposeContent(originalContent, originalPlatform, targetPlatforms)
    return NextResponse.json(repurposed)
  } catch (error: any) {
    console.error('Error repurposing content:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to repurpose content' },
      { status: 500 }
    )
  }
}