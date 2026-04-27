import { routeAI } from './router'

export interface RepurposedContent {
  platform: string
  format: string
  title: string
  content: string
  hashtags: string[]
}

export async function repurposeContent(
  originalContent: string,
  originalPlatform: string,
  targetPlatforms: string[]
): Promise<RepurposedContent[]> {
  const prompt = `You're repurposing content from ${originalPlatform} to other platforms.

Original content:
${originalContent}

Create repurposed versions for: ${targetPlatforms.join(', ')}

For each platform, adapt the content to that platform's norms, character limits, and best practices.

Return ONLY a JSON array:
[{
  "platform": "string",
  "format": "string",
  "title": "string",
  "content": "string",
  "hashtags": ["tag1", "tag2"]
}]`

  const res = await routeAI(prompt, {
    tier: 'smart',
    temperature: 0.7,
    maxTokens: 3000
  })

  const cleaned = res.content.replace(/```json|```/g, '').trim()
  try {
    const match = cleaned.match(/\[[\s\S]*\]/)
    return match ? JSON.parse(match[0]) : []
  } catch {
    return []
  }
}