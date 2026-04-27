import { routeAI } from './router'

export interface TopicCluster {
  id: string
  name: string
  topics: string[]
  size: number
  percentage: number
  trend: 'growing' | 'stable' | 'declining'
  suggestion: string
}

export interface ClusteringAnalysis {
  clusters: TopicCluster[]
  overrepresented: string[]
  underrepresented: string[]
  recommendations: string[]
}

export async function clusterTopics(
  topics: string[],
  niche: string
): Promise<ClusteringAnalysis> {
  const prompt = `As a content strategist, analyze and cluster these content topics for the ${niche} niche:

Topics: ${JSON.stringify(topics)}

Group similar topics into thematic clusters. For each cluster, provide:
1. A cluster name/theme
2. The topics in that cluster
3. Size and percentage of total topics
4. Trend assessment (growing/stable/declining based on current momentum)
5. Strategic suggestion for that cluster

Also identify:
- Overrepresented clusters (too much focus)
- Underrepresented clusters (opportunity areas)
- Overall recommendations

Return ONLY JSON:
{
  "clusters": [
    {
      "id": "string",
      "name": "string",
      "topics": ["string"],
      "size": number,
      "percentage": number,
      "trend": "growing|stable|declining",
      "suggestion": "string"
    }
  ],
  "overrepresented": ["string"],
  "underrepresented": ["string"],
  "recommendations": ["string"]
}`

  const res = await routeAI(prompt, {
    tier: 'smart',
    temperature: 0.5,
    maxTokens: 2000,
    jsonMode: true
  })

  try {
    const parsed = JSON.parse(res.content)
    return {
      clusters: Array.isArray(parsed.clusters) ? parsed.clusters : [],
      overrepresented: Array.isArray(parsed.overrepresented) ? parsed.overrepresented : [],
      underrepresented: Array.isArray(parsed.underrepresented) ? parsed.underrepresented : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : []
    }
  } catch {
    // Return a basic fallback clustering
    return {
      clusters: topics.map((topic, index) => ({
        id: `cluster-${index}`,
        name: topic,
        topics: [topic],
        size: 1,
        percentage: Math.round(100 / topics.length),
        trend: 'stable',
        suggestion: `Explore different angles on ${topic}`
      })),
      overrepresented: [],
      underrepresented: topics,
      recommendations: ['Consider creating more diverse content topics']
    };
  }
}