# Deploy UpRise on cornutub.xyz

This guide walks you through deploying UpRise — frontend on Vercel, backend on Railway, and connecting your domain.

---

## Overview

```
cornutub.xyz  →  Vercel (Frontend)      → https://corntub.xyz
api.corntub.xyz →  Railway (Backend)     → https://uprise-api.up.railway.app
```

**Total monthly cost at launch:** ₹0 (all free tiers)

---

## Step 1: Push Code to GitHub

### Create a new GitHub repo
1. Go to [github.com](https://github.com)
2. Click **New repository**
3. Name it `uprise-platform`
4. **Don't** initialize with README (we already have files)
5. Click **Create repository**

### Push your code
```bash
cd uprise-platform

# Initialize git (if not already)
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit — UpRise platform scaffold"

# Add GitHub remote (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/uprise-platform.git

# Push
git branch -M main
git push -u origin main
```

**Note:** You'll be asked for your GitHub username and password (or Personal Access Token).

---

## Step 2: Deploy Backend on Railway

Railway is the easiest way to deploy a Node.js backend with a database.

### 2a: Create Railway account
1. Go to [railway.app](https://railway.app)
2. Sign up with **GitHub** (fastest)
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your `uprise-platform` repo
5. Railway will auto-detect it's a Node.js app

### 2b: Configure backend deployment
1. In Railway, go to your deployment
2. **Root Directory:** `backend`
3. **Build Command:** `bun install` (or `npm install`)
4. **Start Command:** `bun run start` (or `npx tsx src/index.ts`)

> Note: The backend uses `sql.js` (pure JavaScript SQLite) so no native module compilation is needed — works on all platforms including Railway.

### 2c: Add environment variables
In Railway project settings → Variables, add:

```
PORT=3001
JWT_SECRET=any-random-32-char-string-make-it-long-and-random
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_here
FRONTEND_URL=https://corntub.xyz
```

**For JWT_SECRET**, generate one:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2d: Set up SQLite database
Railway provides ephemeral filesystems by default. For SQLite to persist:
1. In Railway → your project → **Storage** → **Add Persistent Disk** (512MB free)
2. Mount it at `/app/data` (or the path Railway gives you)
3. Update `backend/src/db/index.ts` to use the mounted path:
   ```ts
   const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, "../../../../data/uprise.db");
   ```
   Set `DATABASE_PATH=/app/data/uprise.db` in Railway variables.

### 2e: Get your backend URL
Once deployed, Railway gives you a URL like:
`https://uprise-api.up.railway.app`

**Test it:**
```
https://uprise-api.up.railway.app/health
```
Should return: `{"status":"ok","timestamp":"..."}`

---

## Step 3: Deploy Frontend on Vercel

### 3a: Create Vercel account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with **GitHub**
3. Click **Add New** → **Project**
4. Import your `uprise-platform` repo
5. Set **Root Directory:** `frontend`
6. Vercel auto-detects Next.js

### 3b: Add environment variables
In Vercel project settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://uprise-api.up.railway.app
NEXT_PUBLIC_APP_URL=https://corntub.xyz
```

### 3c: Deploy
Click **Deploy**. Vercel gives you a URL like:
`https://uprise-platform.vercel.app`

Once live, Vercel will auto-deploy every time you push to GitHub.

---

## Step 4: Connect Your Domain (GoDaddy)

### 4a: Add domain in Vercel
1. In Vercel → your project → **Settings** → **Domains**
2. Enter: `corntub.xyz`
3. Click **Add**
4. Vercel will show you DNS records to add in GoDaddy

### 4b: Configure GoDaddy DNS
Log into your GoDaddy account → **My Products** → **DNS** for cornutub.xyz:

**For the main domain (@):**
| Type | Name | Value | TTL |
|---|---|---|---|
| A | @ | `76.76.21.21` | 1 hour |

> `76.76.21.21` is Vercel's IP for domain forwarding. Vercel handles SSL automatically.

**For www subdomain:**
| Type | Name | Value | TTL |
|---|---|---|---|
| CNAME | www | `cname.vercel-dns.com` | 1 hour |

### 4c: Add API subdomain
For `api.corntub.xyz` pointing to your Railway backend:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | api | `76.76.21.21` | 1 hour |

Or use a CNAME (Railway may support it):
| Type | Name | Value | TTL |
|---|---|---|---|
| CNAME | api | `uprise-api.up.railway.app` | 1 hour |

> ⚠️ If Railway doesn't support CNAME for custom domains, use the A record with Railway's IP (check Railway dashboard for server IP).

### 4d: SSL
Vercel handles SSL automatically for corntub.xyz. Railway also provides free SSL for your Railway URL.

---

## Step 5: Update Next.js Config for API Proxy

Update `frontend/next.config.js` with your Railway backend URL:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://uprise-api.up.railway.app/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

Then push the update:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

Vercel auto-deploys on push.

---

## Step 6: Seed the Database

After backend is running on Railway, run the seed script once:

```bash
# SSH into Railway or use Railway CLI
railway run npx tsx src/db/seed.ts

# Or: use curl to hit the categories endpoint (creates tables on first API call)
curl https://uprise-api.up.railway.app/api/categories
```

---

## Step 7: Test Everything

### Backend health
```
https://uprise-api.up.railway.app/health
```

### API endpoints
```
POST https://uprise-api.up.railway.app/api/auth/register
POST https://uprise-api.up.railway.app/api/auth/login
GET  https://uprise-api.up.railway.app/api/categories
GET  https://uprise-api.up.railway.app/api/users/me (needs Authorization header)
```

### Frontend
```
https://corntub.xyz
https://corntub.xyz/login
https://corntub.xyz/register
https://corntub.xyz/dashboard
```

---

## Account Signup Checklist

Before your first users join, make sure you have:

- [ ] **Razorpay account** at [razorpay.com](https://razorpay.com) (for real payments)
  - Get `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
  - Add to Railway environment variables
- [ ] **Privacy Policy** page on your site (required for GDPR/data laws)
  - Generate at [iubenda.com](https://iubenda.com) or [termly.io](https://termly.io)
- [ ] **Terms of Service** page
- [ ] **Contact page** with your email

---

## Common Issues & Fixes

### CORS errors
If frontend can't reach backend, check:
- Railway: `FRONTEND_URL` env var is set to `https://corntub.xyz`
- Backend: CORS origin matches exactly (no trailing slash)

### Database not persisting
SQLite files vanish on Railway redeploys unless you use a persistent disk. See Step 2d.

### Build errors on Vercel
Check that `frontend/` has its own `package.json` and `tsconfig.json`. Vercel must set root to `frontend/`.

### DNS propagation
DNS changes take 5 min to 48 hours. Test with:
```bash
nslookup corntub.xyz
ping corntub.xyz
```

---

## Quick Reference: Commands

```bash
# Run locally
cd uprise-platform

# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev

# Push to GitHub
git add . && git commit -m "your message" && git push

# Railway CLI (install with: npm i -g @railway/cli)
railway login
railway status
railway logs
railway run npx tsx src/db/seed.ts
```
