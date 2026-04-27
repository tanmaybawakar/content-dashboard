import { NextRequest, NextResponse } from 'next/server'
import { logTelegramMessage } from '@/lib/db/queries'
export const dynamic = 'force-dynamic'

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const message = body.message
    if (!message) return NextResponse.json({ success: true })

    const chatId = message.chat.id
    const text = message.text || ''
    const userId = message.from?.id?.toString()

    // Log inbound message
    await logTelegramMessage({
      telegram_user_id: userId,
      direction: 'inbound',
      message_text: text
    })

    let response = ''

    if (text === '/start') {
      response = `🚀 *ContentoX Bot Online*\n\nYour AI content intelligence system is ready.\n\nCommands:\n/idea [niche] [platform] - Generate content ideas\n/trends [niche] - Get trending topics\n/ideas - List your saved ideas\n/analyze [handle] [platform] - Analyze competitor\n/help - Show all commands`
    }

    else if (text.startsWith('/idea')) {
      const parts = text.split(' ')
      const niche = parts[1] || 'tech'
      const platform = parts[2] || 'instagram'
      response = `Generating content ideas for ${platform} in the ${niche} niche...`

      // Generate ideas using OpenRouter
      const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
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
      const aiJson = await aiRes.json()
      response = aiJson.choices[0]?.message?.content || 'Could not generate ideas.'

      // Save idea
      await logTelegramMessage({
        telegram_user_id: userId,
        direction: 'outbound',
        response_text: response
      })
      return NextResponse.json({ success: true, chatId, response })
    }

    else if (text.startsWith('/trends')) {
      const niche = text.split(' ')[1] || 'tech'
      const tavilyRes = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.TAVILY_API_KEY}`
        },
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
      response = '📋 *Your Saved Ideas:*\n\nComing soon - View your ideas on the ContentoX dashboard.'
    }

    else if (text.startsWith('/analyze')) {
      const parts = text.split(' ')
      const handle = parts[1]
      const platform = parts[2] || 'instagram'
      if (!handle) {
        response = '⚠️ Usage: /analyze @handle platform'
      } else {
        response = `🔍 Analyzing *${handle}* on ${platform}...\n\nVisit the ContentoX dashboard for the full report.`
      }
    }

    else if (text === '/help') {
      response = `Available Commands:\n\n/idea [niche] [platform] - Generate content ideas\n/trends [niche] - Get trending topics\n/ideas - List your saved ideas\n/analyze [handle] [platform] - Analyze competitor\n/help - Show this help menu`
    }

    else {
      // Free-form AI chat
      const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
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

    // Log outbound response
    await logTelegramMessage({
      telegram_user_id: userId,
      direction: 'outbound',
      response_text: response
    })

    // Send response to Telegram
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: response, parse_mode: 'Markdown' })
    })

    return NextResponse.json({ success: true, chatId, response })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
