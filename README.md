```
   _____ _                 _               _   
  / ____| |               | |             | |  
 | |    | |__   ___  _ __ | |_ ___   ___  | |_ 
 | |    | '_ \ / _ \| '_ \| __/ _ \ / _ \ | __|
 | |____| | | | (_) | | | | || (_) | (_) | |_ 
  \_____|_| |_|\___/|_| |_|\__\___/ \___/  \__|
                                                

# ContentoX

AI-powered content strategy platform for creators and marketers.

## What it does

ContentoX is an autonomous AI system that helps creators generate, analyze, and optimize content strategies. It provides:

- **AI Idea Generation**: Generate platform-specific content ideas with scoring and predictions
- **Content Discussion**: Context-aware AI advisor for content strategy decisions  
- **Hook Analysis**: Score and improve content hooks for maximum impact
- **Cross-Platform Repurposing**: Automatically adapt content for different platforms
- **Weekly Briefings**: AI-generated strategic content plans every Monday
- **Viral Prediction**: Estimate viral potential before posting
- **Gap Analysis**: Find content opportunities competitors are missing
- **Posting Optimization**: Calculate best times to post for maximum engagement
- **Topic Clustering**: Organize and balance your content strategy
- **Title A/B Testing**: Generate and test title variations for optimal performance

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: SQLite + Prisma ORM
- **Styling**: Tailwind CSS v4 + custom glassmorphism utilities
- **Components**: shadcn/ui + custom glass primitives
- **Charts**: Recharts
- **Icons**: lucide-react
- **AI Models**: 
  - Groq (llama-3.1-8b-instant, llama3-70b-8192) for fast tasks
  - OpenRouter (meta-llama/llama-3.3-70b-instruct:free, google/gemma-3-27b-it:free) for complex reasoning
- **APIs**: Tavily for trending data, Supabase for data storage
- **Deployment**: Vercel

## Local Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (create `.env.local`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENROUTER_API_KEY=your_openrouter_key
   GROQ_API_KEY=your_groq_key
   TAVILY_API_KEY=your_tavily_key
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   ```

4. Set up the database:
   ```bash
   npm run db:push      # Create/sync SQLite database
   npm run db:seed      # Populate demo data
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Get your URL and anon key from Project Settings > API
3. Run the database migrations (handled by Prisma):
   ```bash
   npx prisma db push
   ```
4. Seed initial data:
   ```bash
   npm run db:seed
   ```

## Telegram Webhook Setup

1. Create a bot with @BotFather on Telegram
2. Get your bot token
3. Add it to your environment variables as `TELEGRAM_BOT_TOKEN`
4. After deployment, the webhook will be automatically set to `/api/telegram/webhook`

## Deployment to Vercel

1. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```bash
   ./scripts/deploy.sh
   ```

   Or manually:
   ```bash
   vercel --prod \
     --env NEXT_PUBLIC_SUPABASE_URL=your_supabase_url \
     --env NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key \
     --env OPENROUTER_API_KEY=your_openrouter_key \
     --env GROQ_API_KEY=your_groq_key \
     --env TAVILY_API_KEY=your_tavily_key \
     --env TELEGRAM_BOT_TOKEN=your_telegram_bot_token \
     --name contentox
   ```

3. The deployment script will automatically:
   - Run type checking
   - Build the application
   - Deploy to Vercel
   - Set up the Telegram webhook

## AI Features

All AI features are located in `/lib/ai/`:

- `router.ts` - Smart model routing with fallbacks
- `ideaGenerator.ts` - Multi-stage content idea generation
- `discusser.ts` - Context-aware content strategy advisor
- `hookAnalyzer.ts` - Hook scoring and improvement suggestions
- `repurposer.ts` - Cross-platform content repurposing
- `weeklyBriefing.ts` - AI-generated Monday strategy briefings
- `viralPredictor.ts` - Viral potential scoring
- `gapFinder.ts` - Content gap analysis vs competitors
- `postingOptimizer.ts` - Optimal posting schedule calculation
- `topicClusterer.ts` - Topic clustering and balance analysis
- `titleAB.ts` - Title A/B testing and optimization

## API Routes

All AI API routes are in `/app/api/ai/`:

- `/api/ai/generate-ideas` - POST: Generate content ideas
- `/api/ai/discuss` - POST: AI content strategy discussion
- `/api/ai/analyze-hook` - POST: Analyze and improve hooks
- `/api/ai/repurpose` - POST: Repurpose content for multiple platforms
- `/api/ai/weekly-briefing` - GET: Generate weekly strategy briefing

## License

MIT

Created with ❤️ for creators who want to work smarter, not harder.
```