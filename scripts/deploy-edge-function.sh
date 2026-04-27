#!/bin/bash
cd supabase
# Set these in your shell or CI environment before running
npx supabase functions deploy telegram-bot --project-ref $SUPABASE_PROJECT_REF
npx supabase secrets set TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
npx supabase secrets set OPENROUTER_API_KEY=$OPENROUTER_API_KEY
npx supabase secrets set TAVILY_API_KEY=$TAVILY_API_KEY
npx supabase secrets set SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
npx supabase secrets set SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
