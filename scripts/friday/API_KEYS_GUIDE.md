# Friday — Free API Keys Setup Guide

## What You Need (All Free Tier)

| API | Why | Free Limits | Time to Get |
|-----|-----|-------------|-------------|
| **Perplexity** | Powers 26 AI analysis functions in Friday | ~$5 free credits | 3 min |
| **Gemini (Google)** | Powers Friday's AI chat / analysis | 60 req/min, 1M tokens/mo | 2 min |
| **Exa AI** | Real geopolitics news feed | ~$5 free credits | 3 min |
| **Kalshi** | Election/policy prediction markets | Free tier available | 5 min |
| **NewsAPI** | General news headlines | 100 req/day | 2 min |
| **OpenSky** | Flight tracking | Already live ✅ | 0 min |
| **Polymarket** | Prediction markets | Already live ✅ | 0 min |

---

## Step 1: Perplexity AI (Most Important)

1. Go to **https://www.perplexity.ai** → Sign up (Google login works)
2. Go to **Settings → API** (or search "perplexity api key")
3. Click "Create API Key"
4. Copy the key (starts with `pplx-`)
5. Come back here and say: **"My Perplexity key is: pplx-xxxxxx"**

**What it unlocks:** geopolitics news, country analysis, fear index, forex AI signals, deep analysis, scenario simulation, relationship predictions, tariff calculator, Friday chat, stock chat, and 18 more AI functions.

---

## Step 2: Gemini API (Google AI Studio)

1. Go to **https://aistudio.google.com** → Sign in with Google
2. Click **"Get API Key"** in the left sidebar
3. Click **"Create API Key"** in a new project (or default)
4. Copy the key (starts with `AIza...`)
5. Come back and say: **"My Gemini key is: AIza..."**

**What it unlocks:** Friday's AI chat, market analysis, predictions, bubble analysis, and all Perplexity fallback functions.

---

## Step 3: Exa AI (Real News Feed)

1. Go to **https://exa.ai** → Sign up (Google login works)
2. Go to **https://dashboard.exa.ai** → API section
3. Copy your API key
4. Come back and say: **"My Exa key is: xxxx"**

**What it unlocks:** Live geopolitics news flowing into Friday's news database automatically.

---

## Step 4: NewsAPI (Backup News)

1. Go to **https://newsapi.org** → Register (free, no credit card)
2. Go to **https://newsapi.org/register** → Get your API key
3. Copy the key (32 chars)
4. Come back and say: **"My NewsAPI key is: xxxx"**

**What it unlocks:** Additional news headlines as a fallback/news source.

---

## Step 5: Kalshi (Prediction Markets)

1. Go to **https://kalshi.com/developers** → Apply for API access
2. Register at **https://api.elections.kalshi.com**
3. Copy your API key
4. Come back and say: **"My Kalshi key is: xxxx"**

**What it unlocks:** Kalshi prediction markets alongside Polymarket in Friday's dashboard.

---

## After You Get All Keys

Once you share your keys, I'll run:
```
supabase secrets set PERPLEXITY_API_KEY=your_key
supabase secrets set GEMINI_API_KEY=your_key
supabase secrets set EXA_API_KEY=your_key
supabase secrets set NEWS_API_KEY=your_key
supabase secrets set KALSHI_API_KEY=your_key
```

Then Friday restarts its edge functions and all 26+ AI features go live automatically.

---

## Alternative: Manual Setup (If You Prefer)

If you'd rather set the secrets yourself:
1. Go to **https://supabase.com/dashboard/project/pcubzwojlpgtclbxbpzq**
2. Navigate to: **Edge Functions → Secrets**
3. Add each key as: `PERPLEXITY_API_KEY`, `GEMINI_API_KEY`, etc.

Or use the Supabase CLI:
```bash
supabase secrets set PERPLEXITY_API_KEY=your_key --project-id pcubzwojlpgtclbxbpzq
```
