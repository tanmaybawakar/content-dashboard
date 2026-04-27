export type ModelTier = 'fast' | 'smart' | 'deep' | 'vision'

interface RouterConfig {
  tier: ModelTier
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
  jsonMode?: boolean
}

interface AIResponse {
  content: string
  model: string
  provider: string
  tokens?: number
  error?: string
}

const GROQ_MODELS = {
  fast: 'llama-3.1-8b-instant',
  smart: 'llama3-70b-8192',
}

const OPENROUTER_MODELS = {
  smart: 'meta-llama/llama-3.3-70b-instruct:free',
  deep: 'google/gemma-3-27b-it:free',
  fallback: 'meta-llama/llama-3.1-8b-instruct:free'
}

async function callGroq(prompt: string, config: RouterConfig): Promise<AIResponse> {
  const model = config.tier === 'fast' ? GROQ_MODELS.fast : GROQ_MODELS.smart
  
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [
        ...(config.systemPrompt ? [{ role: 'system', content: config.systemPrompt }] : []),
        { role: 'user', content: prompt }
      ],
      temperature: config.temperature ?? 0.7,
      max_tokens: config.maxTokens ?? 1024,
      ...(config.jsonMode ? { response_format: { type: 'json_object' } } : {})
    })
  })
  
  if (!res.ok) throw new Error(`Groq error: ${res.status}`)
  
  const json = await res.json()
  return {
    content: json.choices[0].message.content,
    model,
    provider: 'groq',
    tokens: json.usage?.total_tokens
  }
}

async function callOpenRouter(prompt: string, config: RouterConfig): Promise<AIResponse> {
  const model = config.tier === 'deep' ? OPENROUTER_MODELS.deep : OPENROUTER_MODELS.smart
  
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://contentox.vercel.app',
      'X-Title': 'ContentoX'
    },
    body: JSON.stringify({
      model,
      messages: [
        ...(config.systemPrompt ? [{ role: 'system', content: config.systemPrompt }] : []),
        { role: 'user', content: prompt }
      ],
      temperature: config.temperature ?? 0.7,
      max_tokens: config.maxTokens ?? 2048
    })
  })
  
  if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`)
  
  const json = await res.json()
  return {
    content: json.choices[0].message.content,
    model,
    provider: 'openrouter',
    tokens: json.usage?.total_tokens
  }
}

export async function routeAI(prompt: string, config: RouterConfig): Promise<AIResponse> {
  const strategies = [
    // Primary strategy based on tier
    config.tier === 'fast' 
      ? () => callGroq(prompt, config)
      : () => callOpenRouter(prompt, config),
    // First fallback
    config.tier === 'fast'
      ? () => callOpenRouter(prompt, { ...config, tier: 'smart' })
      : () => callGroq(prompt, { ...config, tier: 'smart' }),
    // Final fallback: groq fast
    () => callGroq(prompt, { ...config, tier: 'fast' })
  ]
  
  for (const strategy of strategies) {
    try {
      return await strategy()
    } catch (err) {
      console.warn('AI strategy failed, trying fallback:', err)
      continue
    }
  }
  
  throw new Error('All AI providers failed')
}