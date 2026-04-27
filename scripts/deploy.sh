#!/bin/bash
set -e

echo "🚀 Deploying ContentoX to Vercel..."

# Install Vercel CLI if not present
npm install -g vercel 2>/dev/null || true

# Run type check first
echo "🔍 Type checking..."
npx tsc --noEmit

# Build
echo "🏗️ Building..."
npm run build

# Deploy to Vercel
echo "📡 Deploying..."
# Set these in your shell or CI environment before running
vercel --prod --yes \
  --env NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  --env NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
  --env OPENROUTER_API_KEY=$OPENROUTER_API_KEY \
  --env GROQ_API_KEY=$GROQ_API_KEY \
  --env TAVILY_API_KEY=$TAVILY_API_KEY \
  --env TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN \
  --name contentox

echo "✅ Deployment complete!"
echo ""
echo "📱 Setting up Telegram webhook..."
DEPLOYMENT_URL=$(vercel ls contentox --json | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); const j=JSON.parse(d); console.log('https://'+j[0].url)")
curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"${DEPLOYMENT_URL}/api/telegram/webhook\"}"
echo "✅ Telegram webhook set!"