import { routeAI } from './router'

export interface GeneratedIdea {
  title: string
  hook: string
  angle: string
  format: string
  bodyOutline: string[]
  cta: string
  estimatedEngagement: 'low' | 'medium' | 'high' | 'viral'
  bestPostingTime: string
  tags: string[]
  aiScore: number
  platform: string
  niche: string
}

export interface GeneratorConfig {
  niche: string
  platform: string
  tone: 'educational' | 'entertaining' | 'controversial' | 'inspirational' | 'behind-scenes'
  count: 3 | 5 | 10
  targetAudience?: string
  contentLength?: 'short' | 'medium' | 'long'
  hookStyle?: 'question' | 'statistic' | 'story' | 'bold-claim' | 'curiosity-gap'
}

export async function generateContentIdeas(config: GeneratorConfig): Promise<GeneratedIdea[]> {
  // Stage 1: Get trend context from Tavily
  let trendContext = ''
  try {
    const tavilyRes = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TAVILY_API_KEY}`
      },
      body: JSON.stringify({
        query: `trending ${config.niche} content ${config.platform} 2025`,
        max_results: 3,
        include_answer: true
      })
    })
    const tavilyData = await tavilyRes.json()
    trendContext = tavilyData.answer || ''
  } catch { /* continue without trend context */ }

  // Stage 2: Generate ideas
  const systemPrompt = `You are a world-class content strategist who has helped creators reach millions of followers. You understand the psychology of what makes content go viral on each platform.

Platform-specific rules:
- YouTube: Titles must create curiosity gap or promise transformation. Thumbnails need one face + bold text. 8-15 min videos perform best.
- Instagram: First line of caption is everything. Reels under 30s are king. Save-worthy educational content beats vanity posts.
- Twitter/X: Hot takes, threads, and contrarian opinions dominate. Concise punchy statements over long explanations.
- LinkedIn: Personal stories with professional lessons outperform pure business advice. Vulnerability + insight = shares.
- TikTok: Hook in first 1 second. Trending sounds matter. POV and story formats dominate.

Current trending context: ${trendContext}

You MUST respond with ONLY a valid JSON array, no markdown, no explanation. Start with [ and end with ]`

  const userPrompt = `Generate exactly ${config.count} content ideas for ${config.platform} in the ${config.niche} niche.

Requirements:
- Tone: ${config.tone}
- Target audience: ${config.targetAudience || 'general audience interested in ' + config.niche}
- Content length: ${config.contentLength || 'medium'}
- Hook style: ${config.hookStyle || 'curiosity-gap'}

Each idea in the array must have these exact keys:
{
  "title": "string",
  "hook": "string (first 1-2 sentences)",
  "angle": "string (what makes this unique)",
  "format": "string (listicle|story|tutorial|opinion|case-study|interview|reaction)",
  "bodyOutline": ["point 1", "point 2", "point 3"],
  "cta": "string",
  "estimatedEngagement": "low|medium|high|viral",
  "bestPostingTime": "string (e.g., 'Tuesday 7-9 PM local time')",
  "tags": ["tag1", "tag2"],
  "aiScore": number (0-100)
}

Make these genuinely excellent ideas that would actually perform. No generic content. Each idea must have a distinct angle.`

  const response = await routeAI(userPrompt, {
    tier: 'smart',
    systemPrompt,
    temperature: 0.85,
    maxTokens: 3000
  })

  // Parse and validate
  let ideas: GeneratedIdea[] = []
  try {
    const cleaned = response.content.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    ideas = Array.isArray(parsed) ? parsed : [parsed]
  } catch {
    // Try to extract JSON from response
    const match = response.content.match(/\[[\s\S]*\]/)
    if (match) {
      try { ideas = JSON.parse(match[0]) } catch { ideas = [] }
    }
  }

  // Stage 3: Add niche/platform context and filter weak ideas
  ideas = ideas
    .map(idea => ({ ...idea, platform: config.platform, niche: config.niche }))
    .filter(idea => idea.aiScore >= 45)
    .sort((a, b) => b.aiScore - a.aiScore)

  return ideas
}