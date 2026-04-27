import { routeAI } from './router'

export interface PostingSchedule {
  day: string
  date: string
  time: string
  platform: string
  contentType: string
  confidence: number // 0-100
}

export interface WeeklyPostingPlan {
  timezone: string
  schedule: PostingSchedule[]
  bestDays: string[]
  worstDays: string[]
  notes: string
}

export async function calculateOptimalPostingTimes(
  platform: string,
  niche: string,
  timezone: string = 'IST'
): Promise<WeeklyPostingPlan> {
  const prompt = `As a social media analytics expert, calculate the optimal posting schedule for ${platform} in the ${niche} niche for the ${timezone} timezone.

Consider:
- Platform-specific engagement patterns
- Niche-specific audience behavior
- Timezone conversion to ${timezone}
- Weekly patterns (weekday vs weekend)
- Content type preferences by day

Return ONLY JSON:
{
  "timezone": "${timezone}",
  "schedule": [
    {
      "day": "Monday",
      "date": "2026-04-27",
      "time": "3:00 PM",
      "platform": "${platform}",
      "contentType": "educational",
      "confidence": 85
    }
  ],
  "bestDays": ["Tuesday", "Wednesday"],
  "worstDays": ["Sunday"],
  "notes": "string with key insights about the schedule"
}`

  const res = await routeAI(prompt, {
    tier: 'smart',
    temperature: 0.5,
    maxTokens: 1500,
    jsonMode: true
  })

  try {
    const parsed = JSON.parse(res.content)
    return {
      timezone: parsed.timezone,
      schedule: parsed.schedule,
      bestDays: parsed.bestDays,
      worstDays: parsed.worstDays,
      notes: parsed.notes
    }
  } catch {
    // Return a reasonable fallback
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const schedule = days.map((day, index) => ({
      day,
      date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '3:00 PM',
      platform,
      contentType: 'mixed',
      confidence: 70
    }));
    
    return {
      timezone,
      schedule,
      bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
      worstDays: ['Sunday'],
      notes: 'Fallback schedule based on general best practices'
    };
  }
}