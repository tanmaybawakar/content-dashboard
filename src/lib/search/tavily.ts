// Competitor intelligence engine using Tavily API

export interface CompetitorSearchResult {
  title: string
  url: string
  content: string
  score: number
  published_date?: string
}

export interface CompetitorAnalysis {
  competitor: string
  platform: string
  topTopics: string[]
  contentGaps: string[]
  engagementInsights: string
  rawResults: CompetitorSearchResult[]
  summary: string
}

export async function searchCompetitor(
  competitorHandle: string,
  platform: string,
  niche: string
): Promise<CompetitorAnalysis> {
  const query = `${competitorHandle} ${platform} content strategy viral posts ${niche} 2024 2025`

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.TAVILY_API_KEY}`
    },
    body: JSON.stringify({
      query,
      search_depth: 'advanced',
      include_answer: true,
      include_raw_content: false,
      max_results: 10,
      include_domains: [
        'youtube.com', 'twitter.com', 'x.com', 'instagram.com',
        'linkedin.com', 'tiktok.com', 'socialblade.com', 'noxinfluencer.com'
      ]
    })
  })

  const data = await response.json()

  // Parse and return structured analysis
  // Use OpenRouter to summarize the raw results into structured insights
  const aiSummary = await summarizeWithAI(data.results, competitorHandle, platform, niche)

  return {
    competitor: competitorHandle,
    platform,
    ...aiSummary,
    rawResults: data.results || []
  }
}

async function summarizeWithAI(results: any[], competitor: string, platform: string, niche: string) {
  const prompt = `You are a content intelligence analyst. Analyze these search results about competitor "${competitor}" on ${platform} in the ${niche} niche.

Search results:
${JSON.stringify(results.slice(0, 5), null, 2)}

Return a JSON object with ONLY these keys (no markdown, raw JSON):
{
  "topTopics": ["topic1", "topic2", "topic3", "topic4", "topic5"],
  "contentGaps": ["gap1", "gap2", "gap3"],
  "engagementInsights": "2-3 sentence insight about what drives their engagement",
  "summary": "3-4 sentence executive summary of their content strategy"
}`

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://contentox.vercel.app',
      'X-Title': 'ContentoX'
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    })
  })

  const json = await res.json()
  const text = json.choices[0]?.message?.content || '{}'

  try {
    return JSON.parse(text)
  } catch {
    return {
      topTopics: [],
      contentGaps: [],
      engagementInsights: 'Analysis unavailable',
      summary: text
    }
  }
}

export async function searchTrends(niche: string, platform: string): Promise<any> {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.TAVILY_API_KEY}`
    },
    body: JSON.stringify({
      query: `trending content ${niche} ${platform} viral posts 2025`,
      search_depth: 'advanced',
      include_answer: true,
      max_results: 8
    })
  })
  return response.json()
}
