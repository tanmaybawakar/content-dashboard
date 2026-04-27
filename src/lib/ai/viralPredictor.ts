import { routeAI } from './router'

export interface ViralPrediction {
  title: string
  hook: string
  platform: string
  viralScore: number // 0-100
  reasoning: string
  suggestedChanges: {
    title?: string
    hook?: string
    format?: string
  }
}

export async function predictViralPotential(
  title: string,
  hook: string,
  platform: string
): Promise<ViralPrediction> {
  const prompt = `Analyze the viral potential of this content for ${platform}:

Title: "${title}"
Hook: "${hook}"

Consider platform-specific virality factors:
- YouTube: Curiosity gaps, transformation promises, thumbnail potential
- Instagram: Save-worthy content, visual appeal, first-line impact
- Twitter/X: Controversy, timeliness, thread potential
- LinkedIn: Professional insight, personal vulnerability, shareability
- TikTok: Trend alignment, hook immediacy, duet/stitch potential

Return ONLY JSON:
{
  "viralScore": number (0-100),
  "reasoning": "string explaining the score",
  "suggestedChanges": {
    "title": "optional improved title",
    "hook": "optional improved hook",
    "format": "optional better format suggestion"
  }
}`

  const res = await routeAI(prompt, {
    tier: 'smart',
    temperature: 0.4,
    maxTokens: 800,
    jsonMode: true
  })

  try {
    const parsed = JSON.parse(res.content)
    return {
      title,
      hook,
      platform,
      viralScore: parsed.viralScore,
      reasoning: parsed.reasoning,
      suggestedChanges: parsed.suggestedChanges
    }
  } catch {
    throw new Error('Viral prediction parsing failed')
  }
}