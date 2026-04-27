#!/bin/bash
# Run this after Vercel deploy to connect Telegram webhook
VERCEL_URL="https://contentox.vercel.app"
# Set these in your shell or CI environment before running
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"${VERCEL_URL}/api/telegram/webhook\"}"
