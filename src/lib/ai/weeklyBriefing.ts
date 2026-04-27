import { routeAI } from './router'

export async function generateWeeklyBriefing(
  niche: string,
  scheduledIdeas: any[],
  recentCompetitorData: any[]
): Promise<{
  weekTheme: string
  priorityContent: string[]
  competitorAlert: string
  opportunityOfWeek: string
  motivationalNote: string
}> {
  const prompt = `You are generating a Monday content strategy briefing for a creator in the ${niche} space.

Their scheduled content this week: ${JSON.stringify(scheduledIdeas.slice(0, 5))}
Recent competitor insights: ${JSON.stringify(recentCompetitorData.slice(0, 3))}

Generate a sharp, useful weekly briefing. Return ONLY JSON:
{
  "weekTheme": "string (overarching theme to lean into this week)",
  "priorityContent": ["action1", "action2", "action3"],
  "competitorAlert": "string (one key thing competitors are doing that we should watch)",
  "opportunityOfWeek": "string (one specific content opportunity to capitalize on this week)",
  "motivationalNote": "string (one sentence, direct and energizing — no fluff)"
}`

  const res = await routeAI(prompt, {
    tier: 'smart',
    temperature: 0.6,
    maxTokens: 800,
    jsonMode: true
  })

  return JSON.parse(res.content)
}