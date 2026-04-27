import { routeAI } from './router'

export interface TitleVariant {
  title: string
  type: 'SEO' | 'curiosity' | 'emotion' | 'controversy' | 'authority' | 'original'
  score: number // 0-100
  reasoning: string
}

export interface ABTestResult {
  original: TitleVariant
  variants: TitleVariant[]
  winner: TitleVariant
  confidence: string // 'high' | 'medium' | 'low'
}

export async function testTitleVariants(
  originalTitle: string,
  platform: string,
  niche: string
): Promise<ABTestResult> {
  const prompt = `As a copywriting expert, create 5 alternative versions of this title for ${platform} in the ${niche} niche, each optimized for a different psychological trigger:

Original title: "${originalTitle}"

Create variants for:
1. SEO-focused (keywords, search intent)
2. Curiosity-focused (gap, mystery, questions)
3. Emotion-focused (joy, fear, surprise, awe)
4. Controversy-focused (challenging norms, hot takes)
5. Authority-focused (expertise, data, credentials)

For each variant, score it 0-100 and explain why.

Return ONLY JSON:
{
  "original": {
    "title": "string",
    "type": "original",
    "score": number,
    "reasoning": "string"
  },
  "variants": [
    {
      "title": "string",
      "type": "SEO|curiosity|emotion|controversy|authority",
      "score": number,
      "reasoning": "string"
    }
  ],
  "winner": {
    "title": "string",
    "type": "SEO|curiosity|emotion|controversy|authority",
    "score": number,
    "reasoning": "string"
  },
  "confidence": "high|medium|low"
}`

  const res = await routeAI(prompt, {
    tier: 'smart',
    temperature: 0.7,
    maxTokens: 1500,
    jsonMode: true
  })

  try {
    const parsed = JSON.parse(res.content)
    return {
      original: parsed.original as TitleVariant,
      variants: (Array.isArray(parsed.variants) ? parsed.variants : []) as TitleVariant[],
      winner: parsed.winner as TitleVariant,
      confidence: parsed.confidence as 'high' | 'medium' | 'low'
    }
  } catch {
    // Fallback: create basic variants
    const variants: TitleVariant[] = [
      {
        title: `${originalTitle} - Complete Guide`,
        type: 'SEO',
        score: 75,
        reasoning: 'SEO-optimized with guide format'
      },
      {
        title: `You Won't Believe ${originalTitle}`,
        type: 'curiosity',
        score: 80,
        reasoning: 'Curiosity gap created'
      },
      {
        title: `The Shocking Truth About ${originalTitle}`,
        type: 'emotion',
        score: 70,
        reasoning: 'Emotional trigger with shocking framing'
      },
      {
        title: `Why Everyone's Wrong About ${originalTitle}`,
        type: 'controversy',
        score: 85,
        reasoning: 'Contrarian stance creates engagement'
      },
      {
        title: `${originalTitle}: Expert Analysis`,
        type: 'authority',
        score: 70,
        reasoning: 'Positions as authoritative source'
      }
    ];
    
    const winner = variants.reduce((best, current) => 
      current.score > best.score ? current : best
    );
    
    return {
      original: {
        title: originalTitle,
        type: 'original',
        score: 65,
        reasoning: 'Original title baseline'
      },
      variants,
      winner,
      confidence: 'medium'
    };
  }
}