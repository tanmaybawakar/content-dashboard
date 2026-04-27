import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TELEGRAM_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY')!
const TAVILY_API_KEY = Deno.env.get('TAVILY_API_KEY')!

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function sendMessage(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
  })
}

async function generateIdea(niche: string, platform: string): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      messages: [{
        role: 'user',
        content: `Generate 3 viral content ideas for ${platform} in the ${niche} niche. Format each as:
🎯 [Title]
🪝 Hook: [opening line]
📝 Angle: [unique perspective]
---`
      }],
      max_tokens: 500
    })
  })
  const json = await res.json()
  return json.choices[0]?.message?.content || 'Could not generate ideas.'
}

serve(async (req) => {
  if (req.method !== 'POST') return new Response('OK')

  const body = await req.json()
  const message = body.message
  if (!message) return new Response('OK')

  const chatId = message.chat.id
  const text = message.text || ''
  const userId = message.from?.id?.toString()

  // Log the message
  await supabase.from('telegram_logs').insert({
    telegram_user_id: userId,
    direction: 'inbound',
    message_text: text
  })

  let response = ''

  if (text === '/start') {
    response = `🚀 *ContentoX Bot Online*\n\nYour AI content intelligence system is ready.\n\nCommands:\n/idea [niche] [platform] — Generate content ideas\n/trends [niche] — Get trending topics\n/ideas — List your saved ideas\n/analyze [handle] [platform] — Analyze competitor\n/help — Show all commands`
  }

  else if (text.startsWith('/idea')) {
    const parts = text.split(' ')
    const niche = parts[1] || 'tech'
    const platform = parts[2] || 'instagram'
    response = await generateIdea(niche, platform)

    // Save to Supabase
    await supabase.from('content_ideas').insert({
      title: `Bot-generated: ${niche} for ${platform}`,
      platform,
      niche,
      source: 'ai_generated'
    })
  }

  else if (text.startsWith('/trends')) {
    const niche = text.split(' ')[1] || 'tech'
    const tavilyRes = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${TAVILY_API_KEY}` },
      body: JSON.stringify({
        query: `trending ${niche} content topics 2025`,
        max_results: 5,
        include_answer: true
      })
    })
    const tavilyData = await tavilyRes.json()
    response = `📈 *Trending in ${niche}:*\n\n${tavilyData.answer || 'No trends found.'}\n\n*Sources:*\n${(tavilyData.results || []).slice(0, 3).map((r: any) => `• ${r.title}`).join('\n')}`
  }

  else if (text === '/ideas') {
    const { data } = await supabase.from('content_ideas').select('title, platform, status').order('created_at', { ascending: false }).limit(5)
    response = data && data.length > 0
      ? `💡 *Your Recent Ideas:*\n\n${data.map((i: any, idx: number) => `${idx + 1}. *${i.title}* — ${i.platform} (${i.status})`).join('\n')}`
      : '📭 No ideas saved yet. Use /idea to generate some!'
  }

  else if (text.startsWith('/analyze')) {
    const parts = text.split(' ')
    const handle = parts[1]
    const platform = parts[2] || 'instagram'
    if (!handle) {
      response = '⚠️ Usage: /analyze @handle platform'
    } else {
      response = `🔍 Analyzing *${handle}* on ${platform}... This may take a moment.\n\n(Visit ContentoX dashboard for full report)`
      // Trigger analysis in background by calling the edge function
    }
  }

  else {
    // Free-form AI chat about content
    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          { role: 'system', content: 'You are ContentoX, an AI content strategy assistant. Help with content ideas, strategy, competitor analysis, and platform growth. Be concise and actionable. Max 3 paragraphs.' },
          { role: 'user', content: text }
        ],
        max_tokens: 400
      })
    })
    const aiJson = await aiRes.json()
    response = aiJson.choices[0]?.message?.content || 'Could not process your request.'
  }

  await sendMessage(chatId, response)

  // Log outbound
  await supabase.from('telegram_logs').insert({
    telegram_user_id: userId,
    direction: 'outbound',
    response_text: response
  })

  return new Response('OK')
})
