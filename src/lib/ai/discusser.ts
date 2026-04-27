import { supabaseAdmin } from '@/lib/db/server'
import { routeAI } from './router'

export interface DiscussionMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface DiscussionContext {
  discussionId?: string
  attachedIdeaId?: string
  attachedCompetitorId?: string
  messages: DiscussionMessage[]
}

const DISCUSSER_SYSTEM = `You are ContentoX AI — a brutally honest, highly strategic content advisor built for serious creators and indie builders.

Your personality:
- Direct and opinionated. You don't hedge. You give clear recommendations.
- Data-aware. You reference what actually works on each platform.
- Actionable. Every response ends with a concrete next step.
- Critical. If an idea is weak, you say why and fix it immediately.
- Builder mindset. You understand the intersection of content, distribution, and business growth.

You have access to the user's content pipeline and competitor data. Use it.

Format your responses:
- Short answers under 3 paragraphs when possible
- Use bold for key insights: **insight**
- End complex responses with "→ Next: [one action]"
- Never use bullet points for every response. Vary your format.`

export async function discussContent(
  userMessage: string,
  context: DiscussionContext
): Promise<{ response: string; updatedMessages: DiscussionMessage[] }> {
  // Fetch context if needed
  let contextBlock = ''
  
  if (context.attachedIdeaId) {
    const { data: idea } = await supabaseAdmin
      .from('content_ideas')
      .select('*')
      .eq('id', context.attachedIdeaId)
      .single()
    if (idea) {
      contextBlock += `\n\nATTACHED IDEA:\nTitle: ${idea.title}\nPlatform: ${idea.platform}\nHook: ${idea.hook}\nStatus: ${idea.status}\nAI Score: ${idea.ai_score}`
    }
  }
  
  if (context.attachedCompetitorId) {
    const { data: snapshot } = await supabaseAdmin
      .from('competitor_snapshots')
      .select('*')
      .eq('competitor_id', context.attachedCompetitorId)
      .order('captured_at', { ascending: false })
      .limit(1)
      .single()
    if (snapshot) {
      contextBlock += `\n\nCOMPETITOR CONTEXT:\nTop Topics: ${snapshot.top_topics?.join(', ')}\nInsights: ${snapshot.engagement_insights}\nContent Gaps: ${snapshot.content_gaps?.join(', ')}`
    }
  }

  // Build messages array for the AI
  const messages = [
    ...context.messages.map(m => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: userMessage + (contextBlock ? `\n\n[Context]${contextBlock}` : '') }
  ]

  const response = await routeAI(messages[messages.length - 1].content, {
    tier: context.messages.length > 6 ? 'deep' : 'smart',
    systemPrompt: DISCUSSER_SYSTEM,
    temperature: 0.75,
    maxTokens: 1500
  })

  const newMessage: DiscussionMessage = {
    role: 'assistant',
    content: response.content,
    timestamp: new Date().toISOString()
  }

  const updatedMessages: DiscussionMessage[] = [
    ...context.messages,
    { role: 'user', content: userMessage, timestamp: new Date().toISOString() },
    newMessage
  ]

  return { response: response.content, updatedMessages }
}

export async function generateDiscussionTitle(firstMessage: string): Promise<string> {
  const res = await routeAI(
    `Generate a short 4-6 word title for a content strategy discussion that starts with: "${firstMessage.slice(0, 100)}". Return ONLY the title, no quotes, no punctuation.`,
    { tier: 'fast', temperature: 0.5, maxTokens: 20 }
  )
  return res.content.trim()
}