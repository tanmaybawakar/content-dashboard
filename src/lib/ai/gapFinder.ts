import { routeAI } from './router'

export interface ContentGap {
  topic: string
  competitorCoverage: number // 0-100%
  userCoverage: number // 0-100%
  gapSize: number // difference
  opportunityScore: number // 0-100
  suggestedAngle: string
}

export async function findContentGaps(
  userTopics: string[],
  competitorTopics: string[],
  niche: string
): Promise<ContentGap[]> {
  const prompt = `As a content strategist, analyze the content gaps between what this user creates and what competitors cover in the ${niche} niche.

User's topics: ${JSON.stringify(userTopics)}
Competitor topics: ${JSON.stringify(competitorTopics)}

For each competitor topic that the user hasn't covered adequately, calculate:
1. How much competitors cover this topic (0-100%)
2. How much the user covers this topic (0-100%)
3. The gap size (difference)
4. An opportunity score (0-100) based on gap size and topic popularity
5. A suggested angle for the user to cover this topic

Return ONLY a JSON array:
[{
  "topic": "string",
  "competitorCoverage": number,
  "userCoverage": number,
  "gapSize": number,
  "opportunityScore": number,
  "suggestedAngle": "string"
}]`

  const res = await routeAI(prompt, {
    tier: 'smart',
    temperature: 0.5,
    maxTokens: 2000,
    jsonMode: true
  })

  try {
    const parsed = JSON.parse(res.content)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}