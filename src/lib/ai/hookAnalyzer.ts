import { routeAI } from './router'

export interface HookAnalysis {
  originalHook: string
  score: number // 0-100
  strengths: string[]
  weaknesses: string[]
  improvedVersions: string[] // 3 alternatives
  psychologicalTrigger: string // curiosity | fear | desire | social-proof | urgency
  platformOptimized: string // best platform for this hook style
}

export async function analyzeHook(hook: string, platform: string): Promise<HookAnalysis> {
  const prompt = `Analyze this content hook for ${platform}: "${hook}"

Return ONLY JSON with this exact structure:
{
  "score": number (0-100, be honest),
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "improvedVersions": ["version1", "version2", "version3"],
  "psychologicalTrigger": "curiosity|fear|desire|social-proof|urgency",
  "platformOptimized": "youtube|instagram|twitter|linkedin|tiktok"
}`

  const res = await routeAI(prompt, {
    tier: 'fast',
    temperature: 0.3,
    maxTokens: 600,
    jsonMode: true
  })

  try {
    const parsed = JSON.parse(res.content)
    return { originalHook: hook, ...parsed }
  } catch {
    throw new Error('Hook analysis parsing failed')
  }
}