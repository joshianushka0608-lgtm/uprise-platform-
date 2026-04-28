# Plan: UpRise — Unified Student Skill Economy Platform

**Created:** 2026-04-27 | **Updated:** 2026-04-28
**Status:** Draft
**Request:** Build UpRise — a unified platform where students can post tasks, earn money, learn from mentors, and build verified skill portfolios. All features live in one app under one profile. Domain: cornutub.xyz. Brand name: UpRise.

---

## Overview

### What This Plan Accomplishes

A clean, focused MVP of **UpRise** — a LinkedIn + Fiverr + Mentorship platform for Indian students (Classes 9–12 and college). One app, one profile, four modes: **Post Tasks**, **Do Tasks**, **Get Mentored**, **Be a Mentor**.

### What Makes UpRise Different

- **Unified profile** — no switching accounts; one profile shows your posted tasks, completed tasks, mentor activity, and ratings
- **Proof-of-work focus** — every skill you use gets auto-tagged and recorded; replaces a resume
- **Hybrid delivery** — supports both online (file upload) and offline (physical notebook) task types
- **Geo-matching** — location-based filtering for local physical tasks
- **Role toggle** — Learner / Earner / Mentor in one profile, switch instantly

### Why This Matters

Indian students in Tier 2/3 cities have skills but no platform to prove them. WhatsApp groups handle task exchanges chaotically. LinkedIn requires a full resume. Fiverr is for professionals. UpRise is built for students — classes 9 through college — with homework, projects, mentorship, and earning all in one place.

---

## Current State

### Existing Work

- `plans/2026-04-26-skill-economy-platform.md` — old sprawling plan (superseded, too ambitious)
- No code has been written yet
- No existing brand/brand assets found

### What's Being Replaced

The 2026-04-26 plan attempted to build a full Next.js PWA with PostgreSQL, Redis, WebSockets, AI recommendations, geo-location, clubs, and Razorpay — all in one go (~200-300 hours). That scope was too wide. This plan is the reset: **one focused MVP**, narrower scope, faster to ship.

---

## Proposed Changes

### Summary of Changes

1. **Create UpRise brand identity** — name, tagline, color palette, logo concept
2. **Set up project structure** — clean Next.js + Express stack
3. **Build auth + unified profile** — JWT auth, role toggle (Learner/Earner/Mentor), single profile
4. **Build Task Marketplace** — create, browse, filter, accept, submit, review tasks
5. **Build Mentorship System** — mentor profiles, session booking, ratings
6. **Build Payment Escrow** — Razorpay integration with hold/release/refund flow
7. **Build unified profile + portfolio** — proof-of-work history, skill tags, badges
8. **Build core UI pages** — landing, dashboard, task browser, mentor browser, profile
9. **Create AIOS module wrapper** — package as installable AIOS module

### Core Distinction from Old Plan

| | Old Plan (2026-04-26) | New Plan (UpRise) |
|---|---|---|
| **Scope** | Full PWA + clubs + AI + geo + WebSockets | Focused: tasks + mentorship + wallet + profile |
| **Stack** | Next.js + PostgreSQL + Redis + Socket.IO | Next.js + SQLite (MVP) / Express API |
| **AI Layer** | Full AI recommendation engine | Auto skill tagging only (Phase 2 full AI) |
| **Community** | Full clubs/challenges/leaderboards | Not in MVP |
| **Geo** | Haversine formula + radius matching | Basic location field only (Phase 2) |
| **Est. time** | 200-300 hours | 40-60 hours |

---

## Design Decisions

### Key Decisions Made

1. **SQLite for MVP, PostgreSQL for scale** — Start simple. SQLite handles 10K users fine. Swap to PostgreSQL when you have traction.
2. **Next.js App Router** — SSR for landing page (SEO), client-side for app. PWA-configured for mobile install.
3. **Razorpay for payments** — India-first. UPI, cards, wallets natively. Test mode for MVP.
4. **Role toggle over separate accounts** — one user, Learner + Earner + Mentor modes all accessible from one profile
5. **Auto skill tagging from task text** — AI reads task descriptions and project text to auto-generate skill tags (no manual entry required)
6. **Escrow-first** — every payment is held until task is approved. Trust is the foundation.
7. **Hybrid delivery** — both online (file upload) and offline (notebook exchange with location) supported from day 1
8. **Simplified mentorship** — session-based, no complex calendar integration. Book a slot, pay, meet.

### Alternatives Considered

- **Bubble/FlutterFlow** — rejected. Can't handle custom escrow logic or unified profile system.
- **WhatsApp-first** — rejected for MVP. Can't build skill proof or escrow on WhatsApp.
- **Firebase** — rejected. Structured relational data needs a proper DB. Firebase locks you in.
- **Native app first** — rejected. PWA is faster to ship, installable on mobile, and SEO-friendly.

### Open Questions for You

1. **Student verification** — OTP + student ID for trust, or open sign-up for MVP?
2. **Commission rate** — 10%, 15%, or 20% of each transaction?
3. **Payment threshold** — minimum balance to post a task or withdraw?
4. **Mentorship pricing** — free sessions allowed, or minimum price enforced?
5. **First target city/campus** — where do you want to launch first?

---

## Step-by-Step Tasks

### Step 1: Brand Identity & Project Setup

Set up the project scaffold with brand identity, color palette, typography, and core stack configuration.

**Actions:**

- Create `uprise-platform/` directory with:
  - `frontend/` — Next.js 14 app
  - `backend/` — Express.js API
  - `docs/` — documentation
- Write `uprise-platform/README.md`:
  - Tagline: **"Your Skills. Your Proof. Your Pay."**
  - Hero: UpRise logo + value prop
  - Platform overview (4 modes)
  - Quick start guide
- Write brand spec `docs/BRAND.md`:
  - **Name:** UpRise
  - **Tagline:** "Your Skills. Your Proof. Your Pay."
  - **Color Palette:**
    - Primary: `#6366F1` (Indigo) — trust, ambition
    - Secondary: `#14B8A6` (Teal) — growth, learning
    - Accent: `#F59E0B` (Amber) — energy, earning
    - Background: `#F8FAFC` (Light slate)
    - Dark: `#0F172A` (Slate 900)
  - **Typography:** Inter (headings), system fonts (body)
  - **Logo concept:** Skill icon + lightning bolt — conveys speed + capability
  - **Tone:** Bold, direct, student-first. Not corporate.
- Write `uprise-platform/package.json` (root workspace)
- Write `uprise-platform/frontend/package.json`:
  - `next@14`, `react@18`, `typescript`, `tailwindcss`, `lucide-react`, `framer-motion`, `react-hook-form`, `zod`, `@tanstack/react-query`, `socket.io-client`
- Write `uprise-platform/backend/package.json`:
  - `express`, `typescript`, `ts-node`, `better-sqlite3`, `socket.io`, `jsonwebtoken`, `bcryptjs`, `razorpay`, `openai`, `cors`, `helmet`, `express-validator`, `dotenv`, `uuid`
- Write `uprise-platform/.env.example`:
  - `DATABASE_URL`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `OPENAI_API_KEY`, `FRONTEND_URL`
- Write `uprise-platform/frontend/next.config.js` with PWA plugin
- Write `uprise-platform/frontend/tsconfig.json`
- Write `uprise-platform/backend/tsconfig.json`

**Files created:**
- `uprise-platform/README.md`
- `uprise-platform/docs/BRAND.md`
- `uprise-platform/package.json`
- `uprise-platform/frontend/package.json`
- `uprise-platform/backend/package.json`
- `uprise-platform/.env.example`
- `uprise-platform/frontend/next.config.js`
- `uprise-platform/frontend/tsconfig.json`
- `uprise-platform/backend/tsconfig.json`

---

### Step 2: Database Schema

Set up SQLite database with all tables needed for tasks, users, mentors, escrow, and profiles.

**Actions:**

- Write `uprise-platform/backend/src/db/schema.sql`:
  - `users` (id, email, password_hash, name, phone, role_mask, verified, student_id, avatar_url, bio, location_city, location_state, created_at, updated_at)
  - `user_skills` (id, user_id, skill_name, skill_level, verified, source_task_id, created_at)
  - `roles` (user_id, role_type, active, created_at) — enum: learner, earner, mentor
  - `tasks` (id, poster_id, title, description, category, subcategory, deadline, base_budget, final_budget, complexity, effort_hours, status, delivery_type, accepted_by, submission_url, reviewed_at, rating, review_text, location_city, location_radius, created_at, updated_at) — status: open, in_progress, submitted, completed, cancelled, disputed
  - `task_applications` (id, task_id, applicant_id, message, proposed_amount, status, created_at) — status: pending, accepted, rejected
  - `escrow_transactions` (id, task_id, payer_id, amount, status, razorpay_order_id, razorpay_payment_id, razorpay_transfer_id, created_at, released_at)
  - `mentor_profiles` (id, user_id, headline, industry, years_exp, skills_json, session_price, free_sessions, total_sessions, total_minutes, avg_rating, is_open, created_at)
  - `mentorship_sessions` (id, mentor_id, learner_id, scheduled_at, duration_minutes, mode, topic, status, notes, learner_rating, learner_feedback, mentor_rating, mentor_feedback, created_at) — status: requested, confirmed, completed, cancelled
  - `portfolios` (id, user_id, title, description, skills_json, task_id, project_url, is_verified, created_at)
  - `skill_badges` (id, user_id, badge_type, badge_name, earned_at, criteria_met)
  - `reviews` (id, task_id, reviewer_id, reviewee_id, rating, comment, created_at)
  - `disputes` (id, task_id, raised_by, reason, status, resolution, resolved_by, created_at, resolved_at)
  - `notifications` (id, user_id, type, title, message, read, data_json, created_at)
  - `withdrawals` (id, user_id, amount, method, status, razorpay_transfer_id, created_at)
- Create `backend/src/db/index.ts` — SQLite setup + all table creation
- Create `backend/src/db/seed.ts` — seed with sample categories (Academic Writing, Coding, Design, Marketing, Research, Language, etc.)
- Add indexes on: users(email), tasks(status, category, deadline), task_applications(task_id), mentor_profiles(user_id), notifications(user_id, read)

**Files created:**
- `uprise-platform/backend/src/db/schema.sql`
- `uprise-platform/backend/src/db/index.ts`
- `uprise-platform/backend/src/db/seed.ts`

---

### Step 3: Backend — Auth & User Core

Build the Express API with JWT auth, role management, and core user endpoints.

**Actions:**

- Write `backend/src/index.ts` — Express app with CORS, JSON, helmet, rate limiting, route mounting
- Write `backend/src/middleware/auth.ts` — JWT verification, role-based access
- Write `backend/src/middleware/validate.ts` — express-validator rules for all endpoints
- Write `backend/src/routes/users.ts`:
  - `POST /api/users/register` — email, password, name, phone, role selection
  - `POST /api/users/login` — email + password → JWT
  - `GET /api/users/me` — current user profile
  - `PUT /api/users/me` — update profile
  - `PUT /api/users/roles` — toggle role active state (Learner/Earner/Mentor)
  - `GET /api/users/:id/profile` — public profile (viewable by others)
- Write `backend/src/routes/auth.ts`:
  - `POST /api/auth/refresh` — refresh JWT
  - `POST /api/auth/logout` — invalidate token (add to blocklist in Redis/SQLite)
- Write `backend/src/controllers/userController.ts` — full implementation
- Write `backend/src/controllers/authController.ts` — full implementation
- Write `backend/src/services/skillTaggingService.ts` — extract skills from task text using keyword matching + OpenAI (Phase 2: full AI). For MVP: keyword-based skill detection.

**Files created:**
- `uprise-platform/backend/src/index.ts`
- `uprise-platform/backend/src/middleware/auth.ts`
- `uprise-platform/backend/src/middleware/validate.ts`
- `uprise-platform/backend/src/routes/users.ts`
- `uprise-platform/backend/src/routes/auth.ts`
- `uprise-platform/backend/src/controllers/userController.ts`
- `uprise-platform/backend/src/controllers/authController.ts`
- `uprise-platform/backend/src/services/skillTaggingService.ts`

---

### Step 4: Backend — Task Marketplace

Build the complete task lifecycle API.

**Actions:**

- Write `backend/src/routes/tasks.ts`:
  - `GET /api/tasks` — browse with filters (category, skill, budget range, deadline, location_city, delivery_type, status=open)
  - `POST /api/tasks` — create task (poster selects: Learner role must be active)
  - `GET /api/tasks/:id` — task detail
  - `PUT /api/tasks/:id` — update task (only by poster, only if status=open)
  - `DELETE /api/tasks/:id` — cancel task (only by poster, refunds escrow if exists)
  - `POST /api/tasks/:id/apply` — apply/accept task (earner applies with message + proposed amount)
  - `PUT /api/tasks/:id/accept/:applicationId` — poster accepts an application
  - `POST /api/tasks/:id/submit` — earner submits work (upload URL or "physical ready")
  - `PUT /api/tasks/:id/approve` — poster approves submission → triggers payment release
  - `PUT /api/tasks/:id/reject` — poster rejects with reason → earner can resubmit
  - `POST /api/tasks/:id/review` — both parties review each other
  - `POST /api/tasks/:id/dispute` — raise a dispute
  - `GET /api/tasks/my/posted` — tasks I've posted
  - `GET /api/tasks/my/accepted` — tasks I've accepted
- Write `backend/src/controllers/taskController.ts`:
  - Full CRUD with status machine validation
  - Task status transitions: open → in_progress → submitted → completed (or rejected → submitted, or disputed)
  - Budget stored as base_budget (poster's price) and final_budget (agreed price)
  - Auto skill tagging triggered on task create/update
- Write `backend/src/services/dynamicPricingService.ts`:
  ```
  suggestedPrice = baseBudget × complexityMultiplier(1.0/1.3/1.8) × urgencyMultiplier
  urgencyMultiplier = 1.0 + (daysUntilDeadline <= 1 ? 0.5 : daysUntilDeadline <= 3 ? 0.3 : daysUntilDeadline <= 7 ? 0.1 : 0)
  ```
- Write `backend/src/services/geoService.ts` — simple city-level matching (Phase 1), no coordinates

**Files created:**
- `uprise-platform/backend/src/routes/tasks.ts`
- `uprise-platform/backend/src/controllers/taskController.ts`
- `uprise-platform/backend/src/services/dynamicPricingService.ts`
- `uprise-platform/backend/src/services/geoService.ts`

---

### Step 5: Backend — Mentorship System

Build mentor profiles and session booking API.

**Actions:**

- Write `backend/src/routes/mentors.ts`:
  - `GET /api/mentors` — browse mentors (filter: skill, industry, price_range, is_open)
  - `POST /api/mentors/profile` — create/update mentor profile (mentor role must be active)
  - `GET /api/mentors/profile` — my mentor profile
  - `PUT /api/mentors/profile` — update mentor profile
  - `GET /api/mentors/:id` — public mentor profile with sessions and reviews
  - `POST /api/mentors/:id/request` — learner requests a session
  - `PUT /api/mentors/sessions/:sessionId/confirm` — mentor confirms session
  - `PUT /api/mentors/sessions/:sessionId/complete` — mark session completed + trigger payment
  - `PUT /api/mentors/sessions/:sessionId/cancel` — cancel session (refund if within 24hrs)
  - `POST /api/mentors/sessions/:sessionId/review` — both parties review
- Write `backend/src/controllers/mentorController.ts`:
  - Mentor profile CRUD
  - Session lifecycle: requested → confirmed → completed (or cancelled)
  - Aggregates: total_sessions, avg_rating, skills list
  - Free sessions logic: if free_sessions > 0, skip payment

**Files created:**
- `uprise-platform/backend/src/routes/mentors.ts`
- `uprise-platform/backend/src/controllers/mentorController.ts`

---

### Step 6: Backend — Payments & Escrow

Build Razorpay integration with escrow logic.

**Actions:**

- Write `backend/src/routes/payments.ts`:
  - `POST /api/payments/create-order` — create Razorpay order for task escrow or mentorship session
  - `POST /api/payments/escrow-hold` — after payment success, hold in escrow
  - `POST /api/payments/release` — release escrow to earner's balance (task approved or session completed)
  - `POST /api/payments/refund` — refund to payer (task cancelled or dispute resolved)
  - `POST /api/payments/webhook` — Razorpay webhook handler with signature verification
  - `GET /api/payments/balance` — user's available + pending + in_escrow balance
  - `GET /api/payments/transactions` — transaction history
  - `POST /api/payments/withdraw` — withdraw to UPI/bank
- Write `backend/src/services/paymentService.ts`:
  - Razorpay SDK integration
  - Escrow hold: create order → collect payment → don't transfer immediately
  - Release: create Razorpay transfer to linked account
  - Refund: call razorpay refund API
  - Balance tracking: available balance (can withdraw) vs pending (in escrow) vs in_transit
- Write `backend/src/models/Transaction.ts` — transaction record model

**Files created:**
- `uprise-platform/backend/src/routes/payments.ts`
- `uprise-platform/backend/src/services/paymentService.ts`
- `uprise-platform/backend/src/models/Transaction.ts`

---

### Step 7: Frontend — Landing Page & Onboarding

Build the landing page and multi-step onboarding.

**Actions:**

- Write `frontend/public/manifest.json` — PWA manifest: name "UpRise", theme #6366F1, standalone display, icons
- Write `frontend/app/globals.css` — CSS variables for brand colors, mobile-first breakpoints, base styles
- Write `frontend/app/page.tsx` — Landing page:
  - **Hero:** "Your Skills. Your Proof. Your Pay." + CTA buttons (Get Started / Browse Tasks)
  - **How It Works:** 3-step visual (Post a Task / Get It Done / Build Your Proof)
  - **4 Modes section:** Post Tasks / Do Tasks / Get Mentored / Be a Mentor — icon cards
  - **Social proof placeholder:** "Join X students already on UpRise"
  - **Footer:** links, brand
- Write `frontend/app/onboarding/page.tsx` — 4-step onboarding wizard:
  - Step 1: **Join as** — Learner, Earner, Mentor (animated cards, can pick multiple)
  - Step 2: **Your skills** — searchable tag input (AI suggestions shown)
  - Step 3: **About you** — name, phone, city, student ID (optional)
  - Step 4: **Ready** — confirmation + dashboard link
  - Progress bar throughout
- Write `frontend/components/OnboardingFlow.tsx` — step wizard with animated transitions
- Write `frontend/components/ui/Button.tsx`, `Input.tsx`, `Card.tsx`, `Badge.tsx`, `Modal.tsx`, `Toast.tsx`
- Write `frontend/lib/api.ts` — API client with JWT injection, error handling
- Write `frontend/hooks/useAuth.ts` — auth state management

**Files created:**
- `uprise-platform/frontend/public/manifest.json`
- `uprise-platform/frontend/app/globals.css`
- `uprise-platform/frontend/app/page.tsx`
- `uprise-platform/frontend/app/onboarding/page.tsx`
- `uprise-platform/frontend/components/OnboardingFlow.tsx`
- `uprise-platform/frontend/components/ui/Button.tsx`
- `uprise-platform/frontend/components/ui/Input.tsx`
- `uprise-platform/frontend/components/ui/Card.tsx`
- `uprise-platform/frontend/components/ui/Badge.tsx`
- `uprise-platform/frontend/components/ui/Modal.tsx`
- `uprise-platform/frontend/components/ui/Toast.tsx`
- `uprise-platform/frontend/lib/api.ts`
- `uprise-platform/frontend/hooks/useAuth.ts`

---

### Step 8: Frontend — Dashboard & Unified Profile

Build the main dashboard and profile system.

**Actions:**

- Write `frontend/app/dashboard/page.tsx`:
  - Role-aware view:
    - **Earner mode:** available tasks near me, my accepted tasks, earnings this week
    - **Learner mode:** my posted tasks (status), active mentorships, recommended skills
    - **Mentor mode:** upcoming sessions, students mentored count, earnings
  - Quick stats: tasks completed, skills gained, total earnings, mentor sessions
  - Activity feed: recent task updates, notifications
  - Skill growth: simple progress bars for top skills
- Write `frontend/app/profile/page.tsx`:
  - Role switcher toggle (Learner / Earner / Mentor) — instant, one-click
  - Unified profile sections:
    - **Header:** avatar, name, city, verified badge, bio
    - **Skills:** auto-generated tags with proficiency levels
    - **Tasks:** tab (Posted / Completed)
    - **Mentorship:** tab (As Mentor / As Mentee)
    - **Reviews:** received reviews with star ratings
    - **Badges:** earned badges
  - **Open to Work toggle** — marks profile as discoverable
- Write `frontend/app/profile/[id]/page.tsx` — public profile view (for viewing other users)
- Write `frontend/app/settings/page.tsx` — account settings, notification preferences, payment details (UPI ID)
- Write `frontend/components/RoleSwitcher.tsx` — animated role toggle component
- Write `frontend/components/SkillBadge.tsx` — skill tag with level indicator
- Write `frontend/components/ReviewCard.tsx` — review display component
- Write `frontend/components/StatsCard.tsx` — dashboard stat card

**Files created:**
- `uprise-platform/frontend/app/dashboard/page.tsx`
- `uprise-platform/frontend/app/profile/page.tsx`
- `uprise-platform/frontend/app/profile/[id]/page.tsx`
- `uprise-platform/frontend/app/settings/page.tsx`
- `uprise-platform/frontend/components/RoleSwitcher.tsx`
- `uprise-platform/frontend/components/SkillBadge.tsx`
- `uprise-platform/frontend/components/ReviewCard.tsx`
- `uprise-platform/frontend/components/StatsCard.tsx`

---

### Step 9: Frontend — Task Marketplace

Build the task browser, create form, and task detail pages.

**Actions:**

- Write `frontend/app/tasks/page.tsx`:
  - Filter bar: category, budget range, deadline, delivery_type (online/physical), location_city
  - Sort: newest, deadline (soonest), price (high/low)
  - Task card grid: title, budget, deadline, category badge, urgency indicator, poster rating
  - Pull-to-refresh, infinite scroll
- Write `frontend/app/tasks/create/page.tsx`:
  - Title input with character counter (max 100)
  - Rich description textarea
  - Category + subcategory dropdowns (from seed data)
  - Delivery type: Online / Physical (notebook)
  - If Physical: city selector
  - Deadline date + time picker
  - Effort slider: 1–40 hours with effort labels (Light / Medium / Heavy / Major)
  - Complexity: Low / Medium / High
  - Budget input with **AI pricing suggestion** panel ("Based on similar tasks: ₹XXX – ₹YYY")
  - Preview mode before posting
  - Submit creates escrow order via Razorpay
- Write `frontend/app/tasks/[id]/page.tsx`:
  - Full task info
  - Poster profile card with rating
  - Applications list (if poster viewing) or Apply button (if earner)
  - Negotiate modal: adjust amount, extend deadline
  - Chat with poster (basic messaging)
  - Submission area: file upload (online) or "Mark as physically delivered" (offline)
  - Review section (post-completion)
- Write `frontend/app/tasks/[id]/submit/page.tsx` — submission flow
- Write `frontend/components/TaskCard.tsx` — all states: open, in_progress, submitted, completed, expired
- Write `frontend/hooks/useTasks.ts` — task data fetching + React Query caching
- Write `frontend/hooks/useTaskFilters.ts` — filter state management

**Files created:**
- `uprise-platform/frontend/app/tasks/page.tsx`
- `uprise-platform/frontend/app/tasks/create/page.tsx`
- `uprise-platform/frontend/app/tasks/[id]/page.tsx`
- `uprise-platform/frontend/app/tasks/[id]/submit/page.tsx`
- `uprise-platform/frontend/components/TaskCard.tsx`
- `uprise-platform/frontend/hooks/useTasks.ts`
- `uprise-platform/frontend/hooks/useTaskFilters.ts`

---

### Step 10: Frontend — Mentorship & Wallet

Build mentor browser, mentor profile, session booking, and wallet pages.

**Actions:**

- Write `frontend/app/mentors/page.tsx`:
  - Mentor cards: photo, name, headline, industry, skills, rating, session price, is_open badge
  - Filter: skill, industry, price range, availability
  - Top mentors section
- Write `frontend/app/mentors/[id]/page.tsx`:
  - Hero: avatar, name, headline @ company, rating stars, session count
  - Bio + skills badges
  - **Request Session button** → modal: select topic, mode (online/offline), preferred time
  - Past session reviews
  - Badges: "Mentored X students", "Top Mentor"
- Write `frontend/app/sessions/page.tsx` — my mentorship sessions:
  - As Learner: upcoming sessions, past sessions, pending requests
  - As Mentor: incoming requests, upcoming sessions, completed sessions
- Write `frontend/app/wallet/page.tsx`:
  - Balance card: available balance, pending (in escrow), total earned
  - Transaction history: all/earned/spent/withdrawn tabs
  - Add funds (Razorpay)
  - Withdraw to UPI/bank
  - Escrow panel: in-transit payments with task context
- Write `frontend/components/MentorCard.tsx` — mentor listing card
- Write `frontend/components/SessionCard.tsx` — session card with status
- Write `frontend/hooks/useMentors.ts` — mentor data fetching
- Write `frontend/hooks/useWallet.ts` — wallet/balance data

**Files created:**
- `uprise-platform/frontend/app/mentors/page.tsx`
- `uprise-platform/frontend/app/mentors/[id]/page.tsx`
- `uprise-platform/frontend/app/sessions/page.tsx`
- `uprise-platform/frontend/app/wallet/page.tsx`
- `uprise-platform/frontend/components/MentorCard.tsx`
- `uprise-platform/frontend/components/SessionCard.tsx`
- `uprise-platform/frontend/hooks/useMentors.ts`
- `uprise-platform/frontend/hooks/useWallet.ts`

---

### Step 11: Real-time & AI (Core Only)

Add WebSocket notifications and auto skill tagging (simplified AI).

**Actions:**

- Write `backend/src/websocket/index.ts` — Socket.IO server:
  - Task status change notifications (to relevant users)
  - New application alert (to poster)
  - Session request/confirmation alerts
  - Basic chat between task parties
- Write `frontend/lib/socket.ts` — Socket.IO client connection
- Write `frontend/hooks/useNotifications.ts` — real-time notification hook
- Enhance `backend/src/services/skillTaggingService.ts`:
  - Keyword-based extraction (Phase 1): match task title/description against known skill keywords
  - Categories: Academic Writing → "essay writing, research, citation"; Coding → "python, javascript, web development"; Design → "graphic design, UI/UX, figma"; etc.
  - Auto-populate `user_skills` table on task completion

**Files created:**
- `uprise-platform/backend/src/websocket/index.ts`
- `uprise-platform/frontend/lib/socket.ts`
- `uprise-platform/frontend/hooks/useNotifications.ts`

---

### Step 12: AIOS Module Wrapper & Docs

Package UpRise as an installable AIOS module and write core documentation.

**Actions:**

- Write `module-installs/uprise-platform/INSTALL.md`:
  1. Prerequisites (Node 18+, npm)
  2. Clone/setup `uprise-platform/`
  3. Configure `.env` with Razorpay + OpenAI keys
  4. Install dependencies: `cd frontend && npm install`, `cd ../backend && npm install`
  5. Initialize DB: `cd backend && npx ts-node src/db/seed.ts`
  6. Start backend: `cd backend && npm run dev`
  7. Start frontend: `cd frontend && npm run dev`
  8. Open `http://localhost:3000`
- Write `module-installs/uprise-platform/README.md`:
  - Platform overview, core features, tech stack, quick start
- Write `module-installs/uprise-platform/launch.sh` — one-command startup script
- Write `uprise-platform/docs/USER_FLOWS.md`:
  - Onboarding flow (role → skills → profile → dashboard)
  - Task posting flow (create → escrow → complete → review)
  - Task earning flow (browse → apply → negotiate → submit → get paid → review)
  - Mentorship flow (browse → request → confirm → complete → review)
  - Payment escrow flow (fund → escrow hold → release or refund)
- Write `uprise-platform/docs/MVP_PLAN.md`:
  - **Phase 1 (This plan):** Core platform — tasks, mentorship, wallet, profile
  - **Phase 2:** AI recommendations, full auto skill tagging, notifications
  - **Phase 3:** Geo-matching, mobile app, push notifications
  - **Phase 4:** Club/community features, challenges, leaderboards
  - **Phase 5:** Recruiter portal, college partnerships, enterprise
- Update `CLAUDE.md` to add UpRise platform section under workspace structure
- Add memory entry: save UpRise as an active project

**Files created:**
- `module-installs/uprise-platform/INSTALL.md`
- `module-installs/uprise-platform/README.md`
- `module-installs/uprise-platform/launch.sh`
- `uprise-platform/docs/USER_FLOWS.md`
- `uprise-platform/docs/MVP_PLAN.md`
- `CLAUDE.md` (update)
- Memory: `memory/skillit_platform.md`

---

## Connections & Dependencies

### Files That Reference This Area

- `CLAUDE.md` — needs new section for UpRise platform
- `context/business-info.md` — UpRise is Anushka's new venture alongside Resob.ai and Corntub
- `plans/2026-04-26-skill-economy-platform.md` — superseded, tag as replaced
- Memory system — save SKILLIT as active project

### Updates Needed

- Tag old plan as superseded
- Add UpRise to context/business-info.md as new venture
- Update CLAUDE.md workspace structure

---

## Validation Checklist

- [ ] All environment variables documented in `.env.example`
- [ ] Database schema creates all tables with correct relationships
- [ ] Auth endpoints (register, login, JWT) work correctly
- [ ] Task lifecycle: create → browse → apply → accept → submit → approve → review → payment release
- [ ] Mentorship lifecycle: create profile → browse → request → confirm → complete → review
- [ ] Payment escrow: create order → hold → release OR refund
- [ ] Role switcher toggles Learner/Earner/Mentor modes without page reload
- [ ] Unified profile shows tasks posted + completed + mentorship activity + reviews
- [ ] Auto skill tagging runs on task completion and updates user_skills
- [ ] Frontend renders at 375px mobile viewport
- [ ] Onboarding flow completes all 4 steps
- [ ] AIOS module installs and runs with `launch.sh`

---

## Success Criteria

The MVP is complete when:

1. **User can sign up, toggle roles, and see all 3 modes** (Learner / Earner / Mentor)
2. **Full task lifecycle works** — post a task, accept it, complete it, release payment, review
3. **Mentorship works end-to-end** — create mentor profile, book a session, complete it, review
4. **Unified profile shows proof-of-work** — all tasks, sessions, skills, and reviews in one place
5. **Escrow payment flow is real** — Razorpay test mode creates orders, holds, releases, and refunds correctly
6. **Mobile-first UI** — beautiful at 375px, installable as PWA
7. **AIOS module is installable** — one script launches the whole platform

---

## Notes

### MVP Scope Discipline

Ship ONLY in this plan:
- Auth + role switch
- Task create + browse + accept + submit + review + payment
- Mentor profiles + session booking + payment
- Unified profile + skill tags
- Basic wallet with Razorpay escrow

Everything else (AI recommendations, clubs, geo-matching, push notifications) is Phase 2.

### On the "Uprise" Name

The brand name is **UpRise**. "SKILLIT" / "Skill Economy" / "Corntub" were earlier concepts — consolidated under UpRise for brand strength. One name, one platform. Domain: cornutub.xyz.

### On Business Model

- **Commission:** 15% on each transaction (industry standard for freelancing platforms)
- **Mentorship fee:** Platform takes 15% of session price
- **Free tier:** All features available. Premium (Phase 2) adds: AI resume builder, unlimited skill badges, priority visibility.

---

*Estimated total development time: 40-60 hours (focused MVP, no scope creep)*
