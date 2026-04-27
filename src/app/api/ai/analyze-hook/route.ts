import { NextResponse } from 'next/server'
import { analyzeHook } from '@/lib/ai/hookAnalyzer'

export async function POST(request: Request) {
  try {
    const { hook, platform } = await request.json()
    
    if (!hook || !platform) {
      return NextResponse.json(
        { error: 'Hook and platform are required' },
        { status: 400 }
      )
    }
    
    const analysis = await analyzeHook(hook, platform)
    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error('Error analyzing hook:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze hook' },
      { status: 500 }
    )
  }
}