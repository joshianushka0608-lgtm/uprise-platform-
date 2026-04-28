# Plan: Skill Economy for Students — Full Platform Build

**Created:** 2026-04-26
**Status:** Superseded — replaced by `plans/2026-04-27-skillit-platform.md`

> ⚠️ This plan is too ambitious (~200-300 hrs). See the fresh SKILLIT plan for a focused MVP scope (~40-60 hrs). Uprise and Skill Economy are the same platform — brand name is SKILLIT.

**Status:** Draft
**Request:** Build "Skill Economy for Students" — a full mobile-first PWA platform with AIOS module integration. The platform connects students/freelancers/professionals into a skill economy with Task Marketplace, Mentorship System, Skill Proof Portfolio, Clubs/Communities, Geo-location matching, and AI Layer.

---

## Overview

### What This Plan Accomplishes

This plan delivers a complete, production-ready MVP of the **Skill Economy Platform** — a LinkedIn + Fiverr + Discord hybrid for Indian students. It covers the full architecture (frontend, backend, database, AI layer, payments), all core features, user flows, database schemas, and a phased rollout strategy from zero to MVP. The platform will be structured as a standalone web application with modular AIOS integration, scalable into a full startup.

### Why This Matters

Your vision of a "proof-of-work + skill identity" platform addresses a real gap in India's student ecosystem. Current platforms either focus on jobs (LinkedIn) or tasks (Fiverr) but never combine mentorship, skill proof, community, and earning into one ecosystem. This platform replaces resumes with verified proof-of-work — exactly what recruiters and students both need but no one has built well for Tier 2/3 India yet.

---

## Current State

### Relevant Existing Structure

This workspace is an **AIOS (AI Operating System) starter kit** — a structured workspace with:
- `.claude/commands/` — slash commands (`/prime`, `/brief`, `/install`, `/create-plan`, etc.)
- `context/` — user context files (business-info, strategy, goals, etc.)
- `module-installs/` — AIOS plug-and-play modules
- `scripts/` — Python automation scripts
- `plans/` — implementation plans
- `outputs/` — deliverables
- `reference/` — templates and patterns
- `gtd/` — GTD productivity system
- `data/` — data storage (SQLite DBs for PolyTrack, Intel)

### Gaps or Problems Being Addressed

1. **No platform exists** that combines earning + learning + proof-of-work + community in one student-focused app
2. **Resume inflation** — students have degrees but no skills; this platform fixes that
3. **Tier 2/3 opportunity** — underserved market with high mobile penetration
4. **Trust deficit** — no escrow, no verified mentors, no skill badges currently exist
5. **Fragmentation** — students use WhatsApp for tasks, YouTube for learning, LinkedIn for profile — this unifies it

---

## Proposed Changes

### Summary of Changes

1. **Create the full Skill Economy Platform** as a Next.js PWA with Node.js/Express backend
2. **Set up PostgreSQL database schema** with all core tables
3. **Build the Task Marketplace** — create, browse, accept, submit, review tasks with dynamic pricing
4. **Build the Mentorship System** — mentor profiles, session booking, ratings, badges
5. **Build the Skill Proof System** — auto-portfolio, skill tagging, badges, timeline
6. **Build the Community/Clubs System** — groups, threads, challenges, leaderboards
7. **Build the AI Layer** — task recommendations, mentor matching, skill gap analysis, resume generation
8. **Build the Payment/Escrow System** — Razorpay integration with escrow logic
9. **Build the Geo-location Layer** — nearby task matching with radius discovery
10. **Create AIOS Modules** — package each core engine as a pluggable AIOS module
11. **Build all UX flows** — onboarding, task posting, task accepting, mentorship booking, profile building

### New Files to Create

#### Root Project Structure
| File Path | Purpose |
|---|---|
| `skill-economy-platform/` | Root project directory |
| `skill-economy-platform/README.md` | Platform overview and getting started |
| `skill-economy-platform/package.json` | Dependencies (Next.js, Node, etc.) |
| `skill-economy-platform/.env.example` | Environment variable template |
| `skill-economy-platform/next.config.js` | Next.js PWA configuration |
| `skill-economy-platform/tsconfig.json` | TypeScript configuration |

#### Frontend (Next.js App Router)
| File Path | Purpose |
|---|---|
| `skill-economy-platform/frontend/` | Next.js frontend app |
| `skill-economy-platform/frontend/app/layout.tsx` | Root layout with PWA meta tags |
| `skill-economy-platform/frontend/app/page.tsx` | Landing / hero page |
| `skill-economy-platform/frontend/app/globals.css` | Global styles |
| `skill-economy-platform/frontend/app/onboarding/page.tsx` | Multi-step onboarding |
| `skill-economy-platform/frontend/app/dashboard/page.tsx` | Main user dashboard |
| `skill-economy-platform/frontend/app/tasks/page.tsx` | Task marketplace browser |
| `skill-economy-platform/frontend/app/tasks/create/page.tsx` | Create new task form |
| `skill-economy-platform/frontend/app/tasks/[id]/page.tsx` | Task detail page |
| `skill-economy-platform/frontend/app/mentors/page.tsx` | Browse mentors |
| `skill-economy-platform/frontend/app/mentors/[id]/page.tsx` | Mentor profile + booking |
| `skill-economy-platform/frontend/app/portfolio/[id]/page.tsx` | Public skill portfolio |
| `skill-economy-platform/frontend/app/clubs/page.tsx` | Browse communities/clubs |
| `skill-economy-platform/frontend/app/clubs/[id]/page.tsx` | Club page with threads |
| `skill-economy-platform/frontend/app/profile/page.tsx` | User profile settings |
| `skill-economy-platform/frontend/app/wallet/page.tsx` | Escrow wallet + transactions |
| `skill-economy-platform/frontend/components/ui/` | Reusable UI components |
| `skill-economy-platform/frontend/components/TaskCard.tsx` | Task card component |
| `skill-economy-platform/frontend/components/MentorCard.tsx` | Mentor card component |
| `skill-economy-platform/frontend/components/SkillBadge.tsx` | Skill badge component |
| `skill-economy-platform/frontend/components/ClubCard.tsx` | Club card component |
| `skill-economy-platform/frontend/components/OnboardingFlow.tsx` | Onboarding step wizard |
| `skill-economy-platform/frontend/lib/api.ts` | API client helper |
| `skill-economy-platform/frontend/lib/auth.ts` | Auth utilities |
| `skill-economy-platform/frontend/lib/utils.ts` | Utility functions |
| `skill-economy-platform/frontend/hooks/useAuth.ts` | Auth hook |
| `skill-economy-platform/frontend/hooks/useTasks.ts` | Tasks data hook |
| `skill-economy-platform/frontend/hooks/useMentors.ts` | Mentors data hook |
| `skill-economy-platform/frontend/public/manifest.json` | PWA manifest |
| `skill-economy-platform/frontend/public/sw.js` | Service worker for offline |

#### Backend (Express API)
| File Path | Purpose |
|---|---|
| `skill-economy-platform/backend/` | Express.js backend |
| `skill-economy-platform/backend/src/index.ts` | Express app entry point |
| `skill-economy-platform/backend/src/config/database.ts` | PostgreSQL connection |
| `skill-economy-platform/backend/src/config/redis.ts` | Redis connection |
| `skill-economy-platform/backend/src/middleware/auth.ts` | JWT auth middleware |
| `skill-economy-platform/backend/src/middleware/validate.ts` | Request validation |
| `skill-economy-platform/backend/src/routes/users.ts` | User routes |
| `skill-economy-platform/backend/src/routes/tasks.ts` | Task marketplace routes |
| `skill-economy-platform/backend/src/routes/mentors.ts` | Mentorship routes |
| `skill-economy-platform/backend/src/routes/portfolio.ts` | Skill proof routes |
| `skill-economy-platform/backend/src/routes/clubs.ts` | Community routes |
| `skill-economy-platform/backend/src/routes/payments.ts` | Payment/escrow routes |
| `skill-economy-platform/backend/src/routes/ai.ts` | AI recommendation routes |
| `skill-economy-platform/backend/src/controllers/userController.ts` | User CRUD |
| `skill-economy-platform/backend/src/controllers/taskController.ts` | Task marketplace logic |
| `skill-economy-platform/backend/src/controllers/mentorController.ts` | Mentorship logic |
| `skill-economy-platform/backend/src/controllers/portfolioController.ts` | Skill proof logic |
| `skill-economy-platform/backend/src/controllers/clubController.ts` | Community logic |
| `skill-economy-platform/backend/src/controllers/paymentController.ts` | Escrow logic |
| `skill-economy-platform/backend/src/controllers/aiController.ts` | AI layer logic |
| `skill-economy-platform/backend/src/models/User.ts` | User model |
| `skill-economy-platform/backend/src/models/Task.ts` | Task model |
| `skill-economy-platform/backend/src/models/Mentor.ts` | Mentor model |
| `skill-economy-platform/backend/src/models/Portfolio.ts` | Portfolio model |
| `skill-economy-platform/backend/src/models/Club.ts` | Club model |
| `skill-economy-platform/backend/src/models/Transaction.ts` | Transaction model |
| `skill-economy-platform/backend/src/services/pricingService.ts` | Dynamic pricing engine |
| `skill-economy-platform/backend/src/services/aiService.ts` | AI recommendation service |
| `skill-economy-platform/backend/src/services/paymentService.ts` | Razorpay integration |
| `skill-economy-platform/backend/src/services/skillTaggingService.ts` | Auto skill tagging |
| `skill-economy-platform/backend/src/websocket/index.ts` | WebSocket server for real-time |
| `skill-economy-platform/backend/src/utils/dynamicPricing.ts` | Pricing calculation logic |
| `skill-economy-platform/backend/src/utils/geo.ts` | Geo-location utilities |
| `skill-economy-platform/backend/src/db/schema.sql` | Complete PostgreSQL schema |

#### AIOS Module Wrappers
| File Path | Purpose |
|---|---|
| `module-installs/skill-economy-platform/` | AIOS module for this platform |
| `module-installs/skill-economy-platform/INSTALL.md` | Guided AIOS install instructions |
| `module-installs/skill-economy-platform/README.md` | Module overview |
| `module-installs/skill-economy-platform/launch.sh` | Quick-launch script |
| `module-installs/skill-economy-platform/config/platform.json` | Platform config |

#### Documentation
| File Path | Purpose |
|---|---|
| `skill-economy-platform/docs/ARCHITECTURE.md` | Full system architecture |
| `skill-economy-platform/docs/USER_FLOWS.md` | All UX flow diagrams |
| `skill-economy-platform/docs/AI_LAYER.md` | AI system design |
| `skill-economy-platform/docs/MONETIZATION.md` | Revenue model |
| `skill-economy-platform/docs/MVP_PLAN.md` | Phased rollout strategy |

---

## Design Decisions

### Key Decisions Made

1. **Next.js App Router over Flutter**: PWA-first gives instant deployment, SEO, and shareable URLs. Native apps can wrap later. Faster to iterate.

2. **PostgreSQL + Redis over Firebase**: Structured relational data (tasks, users, transactions) needs PostgreSQL. Redis handles real-time sessions, caching, and WebSocket state. Firebase could work but locks you into Google's ecosystem.

3. **Razorpay over Stripe**: India-first platform. Razorpay supports UPI, Indian cards, wallets natively. Stripe India is limited.

4. **MVP = Task Marketplace + Skill Profile only**: Resist scope creep. First version ships with only tasks and profiles. Mentorship, clubs, AI layer, geo come in phases 2-5.

5. **Escrow-first payments**: No direct transfers. Every payment holds in escrow until task is approved. This is the trust foundation.

6. **Auto skill tagging over manual input**: Users shouldn't have to tag their own skills. The AI reads their task history and project descriptions to auto-generate skill tags.

7. **Role switching via toggle**: Users can be Learner on Monday, Earner on Tuesday. The role switch is a single toggle — no separate accounts needed.

8. **Dynamic pricing algorithm**: Task prices increase as deadline approaches (urgency multiplier). Complexity and effort are weighted inputs. AI suggests the starting price.

### Alternatives Considered

- **Monolith vs microservices**: Monolith for MVP. Split into microservices only when scaling beyond 50K users.
- **No-code platforms (FlutterFlow, Bubble)**: Rejected — too limited for custom escrow logic, AI integration, and geo-matching.
- **WhatsApp-first approach**: Rejected for MVP. Good for initial validation, but can't build skill proof system or escrow on WhatsApp.
- **Only native mobile**: Rejected. PWA + web is faster to ship and easier to iterate. Native app in Phase 2.

### Open Questions

1. **Student ID verification**: Do you want mandatory OTP + student ID verification for all users, or make it optional (verified badge) in MVP?
2. **Payment threshold**: What minimum balance should users need to post tasks or withdraw earnings?
3. **Commission rate**: 10%, 15%, or 20%? Higher = more revenue per transaction, lower = more competitive.
4. **AI provider**: OpenAI GPT-4 for all AI features, or mix with Claude for different tasks?
5. **Database hosting**: Local development with Docker, or deploy directly to a cloud provider for MVP?
6. **Campus ambassador program**: Should Phase 1 include a referral system with special ambassador tiers?
7. **Scope priority**: Out of all features, which ONE do you want working first — task marketplace OR mentorship OR portfolio?

---

## Step-by-Step Tasks

### Step 1: Design Full System Architecture & Database Schema

Create the complete PostgreSQL schema with all tables, relationships, and indexes. Define the API endpoints contract for all 8 modules. Document the data flow between frontend, backend, AI service, and payment provider.

**Actions:**

- Write `backend/src/db/schema.sql` with ALL tables:
  - `users` (id, email, password_hash, name, phone, role_mask, verified, student_id, avatar_url, bio, location_lat, location_lng, created_at, updated_at)
  - `user_skills` (id, user_id, skill_name, skill_level, verified, source_task_id, created_at)
  - `roles` (user_id, role_type enum(learner, earner, mentor, recruiter), active, created_at)
  - `tasks` (id, poster_id, title, description, category, subcategory, deadline, base_budget, final_budget, complexity enum(low, medium, high), effort_hours, status, accepted_by, submission_url, reviewed_at, rating, review_text, location_required, location_radius, created_at)
  - `task_bids` (id, task_id, bidder_id, amount, message, created_at)
  - `escrow_transactions` (id, task_id, payer_id, amount, status enum(pending, held, released, refunded), razorpay_order_id, razorpay_payment_id, created_at, released_at)
  - `mentor_profiles` (id, user_id, headline, job_role, company, years_exp, skills_json, session_price, free_slots_json, total_sessions, total_minutes, avg_rating, created_at)
  - `mentor_sessions` (id, mentor_id, learner_id, scheduled_at, duration_minutes, status, topic, notes, rating, feedback, created_at)
  - `portfolios` (id, user_id, title, description, skills_json, task_id, project_url, is_verified, created_at)
  - `skill_badges` (id, user_id, badge_type, badge_name, earned_at, criteria_met)
  - `clubs` (id, name, description, category, icon, member_count, leaderboard_enabled, created_at)
  - `club_members` (id, club_id, user_id, role, joined_at)
  - `club_posts` (id, club_id, user_id, content, type enum(post, challenge, poll), likes, created_at)
  - `club_challenges` (id, club_id, title, description, start_date, end_date, points, status)
  - `notifications` (id, user_id, type, title, message, read, data_json, created_at)
  - `reviews` (id, task_id, reviewer_id, reviewee_id, rating, comment, created_at)
  - `disputes` (id, task_id, raised_by, reason, status, resolution, resolved_by, created_at, resolved_at)
  - `referrals` (id, referrer_id, referred_id, reward_credits, status, created_at)
  - Indexes on: users(email), tasks(status, category, deadline), task_bids(task_id), mentor_profiles(user_id), club_members(club_id), notifications(user_id, read)
- Write `docs/ARCHITECTURE.md` covering: system overview diagram, component interactions, API gateway pattern, real-time architecture, AI layer design, payment flow, geo-matching algorithm, security model

**Files affected:**

- `skill-economy-platform/backend/src/db/schema.sql`
- `skill-economy-platform/docs/ARCHITECTURE.md`

---

### Step 2: Build the Backend — Core API Server

Set up the Express.js backend with all routes, controllers, services, and middleware. Implement every function from the spec: createUser, switchRole, createTask, acceptTask, submitTask, calculateDynamicPricing, createEscrow, releasePayment, etc.

**Actions:**

- Set up `backend/package.json` with: express, typescript, ts-node, pg, redis, socket.io, jsonwebtoken, bcryptjs, razorpay, openai, cors, helmet, express-validator, dotenv, uuid
- Write `backend/src/index.ts` — Express app with middleware (CORS, JSON, helmet, rate limiting), WebSocket server setup, route mounting
- Write all route files (`routes/*.ts`) with full CRUD + business logic endpoints
- Write all controller files with actual implementation logic (not stubs)
- Write `services/pricingService.ts` — dynamic pricing algorithm:
  ```
  finalPrice = baseBudget × complexityMultiplier(1.2/1.5/2.0) × urgencyMultiplier(1.0-1.5) × effortMultiplier
  urgencyMultiplier = 1.0 + (daysRemaining <= 1 ? 0.5 : daysRemaining <= 3 ? 0.3 : daysRemaining <= 7 ? 0.1 : 0)
  ```
- Write `services/paymentService.ts` — Razorpay escrow flow: create order → hold payment → release on approval
- Write `services/skillTaggingService.ts` — parse task descriptions + project text → extract skills → assign confidence scores → update user_skills table
- Write `services/aiService.ts` — OpenAI integration for: skill gap analysis, mentor recommendations, task recommendations, resume auto-generation
- Write `services/geoService.ts` — Haversine formula for radius matching, nearby task discovery
- Write WebSocket handlers for: real-time task status updates, chat between earner/poster, session notifications
- Write `middleware/auth.ts` — JWT verification, role-based access control
- Write `middleware/validate.ts` — express-validator rules for each endpoint

**Files affected:**

- All files under `skill-economy-platform/backend/src/`

---

### Step 3: Build the Frontend — Landing Page & Onboarding

Create the Next.js frontend with beautiful, mobile-first UI. Build the landing page, onboarding flow, and core layout components.

**Actions:**

- Initialize Next.js 14 project with TypeScript, App Router
- Write `next.config.js` with PWA configuration (manifest.json, service worker)
- Write `frontend/public/manifest.json` — PWA manifest with app name, icons, theme color, display: standalone
- Write `frontend/public/sw.js` — Service worker for offline support, caching strategy
- Write `frontend/app/globals.css` — CSS variables, mobile-first breakpoints, dark/light theme, brand colors (vibrant indigo + teal)
- Write `frontend/app/page.tsx` — Landing page:
  - Hero section: "Your Skills Are Your Resume" tagline, CTA buttons
  - Feature highlights (3 cards: Earn, Learn, Prove It)
  - How it works (3-step flow)
  - Social proof section
  - Footer
- Write `frontend/app/onboarding/page.tsx` — Multi-step onboarding wizard:
  - Step 1: Role selection (Learner, Earner, Mentor) with animated cards
  - Step 2: Skills input (searchable tag input with AI suggestions)
  - Step 3: Goals selection (dropdown + custom input)
  - Step 4: Basic profile (name, email, phone, optional student ID)
  - Progress indicator throughout
  - Skip option for optional steps
- Write `frontend/components/OnboardingFlow.tsx` — Step wizard component with transitions
- Write `frontend/components/ui/Button.tsx`, `Input.tsx`, `Card.tsx`, `Badge.tsx`, `Modal.tsx`, `Toast.tsx` — Design system components
- Write `frontend/lib/api.ts` — API client with JWT token injection, error handling
- Write `frontend/hooks/useAuth.ts` — Auth state management

**Files affected:**

- All files under `skill-economy-platform/frontend/`

---

### Step 4: Build the Frontend — Task Marketplace

Build the complete task marketplace UI: browse, filter, create, detail, accept, submit, review.

**Actions:**

- Write `frontend/app/tasks/page.tsx` — Task browser:
  - Filter bar: category, price range, deadline, complexity, location
  - Task cards grid (2 columns mobile, 3 desktop)
  - Each card shows: title, budget range, deadline, category badge, urgency indicator, poster rating
  - Sort options: newest, deadline, price, rating
  - Pull-to-refresh on mobile
  - Infinite scroll pagination
- Write `frontend/app/tasks/create/page.tsx` — Create task form:
  - Title input with character counter
  - Rich description textarea
  - Category + subcategory dropdowns
  - Effort slider (1-40 hours with labels)
  - Deadline date picker with calendar
  - Budget input with AI pricing suggestion panel
  - Location toggle (local delivery option)
  - Preview mode before submit
  - AI pricing suggestion: "Based on similar tasks, we suggest ₹XXX"
- Write `frontend/app/tasks/[id]/page.tsx` — Task detail:
  - Full task info with poster profile card
  - Bid list (if bidding enabled) or instant accept button
  - Chat with poster (real-time WebSocket)
  - Submission area (file upload + text)
  - Review section
  - Similar tasks recommendations
- Write `frontend/components/TaskCard.tsx` — Reusable task card with all states (open, in-progress, completed, expired)
- Write `frontend/hooks/useTasks.ts` — Tasks data fetching and caching

**Files affected:**

- `skill-economy-platform/frontend/app/tasks/`
- `skill-economy-platform/frontend/components/TaskCard.tsx`
- `skill-economy-platform/frontend/hooks/useTasks.ts`

---

### Step 5: Build the Frontend — Mentorship & Portfolio

Build the mentorship discovery + booking system and the skill portfolio/profile system.

**Actions:**

- Write `frontend/app/mentors/page.tsx` — Mentor browser:
  - Mentor cards: photo, name, job role @ company, skills, rating, session price
  - Filter: skill, price range, availability
  - AI-recommended mentors section at top
  - Top mentors leaderboard
- Write `frontend/app/mentors/[id]/page.tsx` — Mentor profile:
  - Hero: photo, name, role, company, rating stars, session count
  - Bio section
  - Skills badges
  - Availability calendar with time slots
  - Booking modal: select slot → confirm → payment → confirmation
  - Past session reviews
  - Badges earned (Mentored X students, Top Mentor in Y)
- Write `frontend/app/portfolio/[id]/page.tsx` — Public portfolio:
  - Header: name, headline, verification badges
  - Skill tags with proficiency levels (auto-generated)
  - Task history with skills used
  - Projects section
  - Mentor connections
  - Growth timeline (visual)
  - Contact CTA
- Write `frontend/app/profile/page.tsx` — Private profile editor:
  - Role switcher toggle (Learner / Earner / Mentor)
  - Skill manager (add, remove, reorder)
  - Portfolio projects section
  - Badge showcase
  - Settings (notifications, privacy, payment details)
- Write `frontend/components/MentorCard.tsx`, `SkillBadge.tsx`, `Timeline.tsx`
- Write `frontend/hooks/useMentors.ts`

**Files affected:**

- `skill-economy-platform/frontend/app/mentors/`
- `skill-economy-platform/frontend/app/portfolio/`
- `skill-economy-platform/frontend/app/profile/`
- `skill-economy-platform/frontend/components/MentorCard.tsx`
- `skill-economy-platform/frontend/components/SkillBadge.tsx`
- `skill-economy-platform/frontend/hooks/useMentors.ts`

---

### Step 6: Build the Frontend — Clubs, Wallet & Dashboard

Build the community/clubs system, wallet/transactions, and main dashboard.

**Actions:**

- Write `frontend/app/clubs/page.tsx` — Clubs browser:
  - Categories: Coding, UPSC, English Speaking, Chess, Startups, etc.
  - Club cards with member count, weekly challenge active indicator
  - Search by name or category
  - Join button with community size indicator
- Write `frontend/app/clubs/[id]/page.tsx` — Club page:
  - Header: name, description, member count, join button
  - Tab navigation: Feed, Challenges, Leaderboard, Members
  - Feed: threaded posts, likes, comments
  - Challenges: active challenge card, past challenge archive
  - Leaderboard: top 10 members by points
  - Members grid
- Write `frontend/app/wallet/page.tsx` — Escrow wallet:
  - Balance card with total balance, pending, available
  - Transaction history (filterable: all, earned, spent, withdrawn)
  - Add funds button (Razorpay)
  - Withdraw button (UPI/bank)
  - Escrow in-transit panel
- Write `frontend/app/dashboard/page.tsx` — Main dashboard:
  - Role-specific view (Earner: available tasks, earnings today; Learner: active sessions, recommended skills; Mentor: upcoming sessions, student count)
  - Quick stats cards: tasks completed, skills gained, earnings, mentor sessions
  - Activity feed: recent actions, notifications
  - Skill growth chart (simple visual timeline)
  - Upcoming deadlines / sessions
- Write `frontend/components/ClubCard.tsx`
- Write `frontend/app/globals.css` additions for dashboard

**Files affected:**

- `skill-economy-platform/frontend/app/clubs/`
- `skill-economy-platform/frontend/app/wallet/`
- `skill-economy-platform/frontend/app/dashboard/`
- `skill-economy-platform/frontend/components/ClubCard.tsx`

---

### Step 7: Build AI Layer, Real-time & Payment Integration

Integrate the AI recommendation engine, WebSocket real-time features, and Razorpay payment flow.

**Actions:**

- Write `backend/src/services/aiService.ts` — All AI functions:
  - `recommendTasks(userId)`: match user skills → relevant open tasks, ranked by skill overlap + price + deadline fit
  - `recommendMentors(userId)`: based on user's skill gaps and learning goals → top 5 mentors
  - `skillGapAnalysis(userId)`: compare current skills vs target role → gap list + learning path
  - `autoTagSkills(project)`: GPT-4 extraction of skills from project description
  - `autoGenerateResume(userId)`: compile portfolio → formatted resume text
  - `suggestPricing(taskDetails)`: analyze similar completed tasks → suggest price range
- Write `backend/src/routes/ai.ts` — API endpoints for all AI functions
- Integrate Socket.IO in `backend/src/websocket/index.ts`:
  - Task status change notifications
  - Real-time chat between task parties
  - Session reminder pings
  - New bid / bid accepted alerts
- Integrate Razorpay in `backend/src/services/paymentService.ts`:
  - Create order → return order_id to frontend
  - Frontend collects payment via Razorpay Checkout
  - Webhook handler: payment success → create escrow record
  - Release: on task approval → trigger razorpay transfer to earner's balance
  - Refund: on dispute resolution → trigger refund API call
- Write webhook handler at `POST /api/payments/webhook` with signature verification
- Add Redis caching for: AI recommendations (TTL 1hr), mentor availability slots (TTL 5min), task list filters

**Files affected:**

- `skill-economy-platform/backend/src/services/aiService.ts`
- `skill-economy-platform/backend/src/routes/ai.ts`
- `skill-economy-platform/backend/src/websocket/index.ts`
- `skill-economy-platform/backend/src/services/paymentService.ts`

---

### Step 8: Create AIOS Module Wrapper & Documentation

Package the platform as an AIOS module for easy deployment and create comprehensive documentation.

**Actions:**

- Write `module-installs/skill-economy-platform/INSTALL.md` — Step-by-step guided install:
  1. Check prerequisites (Node 18+, PostgreSQL, Redis)
  2. Clone/setup project structure
  3. Configure `.env` with API keys (Razorpay, OpenAI, database)
  4. Run database migrations
  5. Start backend server
  6. Start frontend dev server
  7. Configure Nginx/proxy for production
  8. Set up Razorpay webhook URL
  9. Verify with test transaction
- Write `module-installs/skill-economy-platform/README.md` — Platform overview
- Write `module-installs/skill-economy-platform/launch.sh` — One-command startup script
- Write `skill-economy-platform/docs/USER_FLOWS.md`:
  - Onboarding flow (role selection → skill input → goal selection → profile setup)
  - Task posting flow (input → AI pricing → deadline slider → preview → post)
  - Task accepting flow (browse → filter → accept/bid → submit → review)
  - Mentorship booking flow (browse → profile → slot selection → payment → confirmation → session)
  - Profile building flow (auto-updated from tasks + projects + mentors)
  - Payment escrow flow (fund → escrow hold → task complete → release)
- Write `skill-economy-platform/docs/MONETIZATION.md`: commission structure, premium tiers, recruiter access pricing
- Write `skill-economy-platform/docs/MVP_PLAN.md`: Phase 1 (MVP), Phase 2 (Mentorship + AI), Phase 3 (Clubs), Phase 4 (Geo + Real-time), Phase 5 (Recruiter Portal)
- Write `skill-economy-platform/docs/RISKS.md`: fraud, low liquidity, trust deficit, regulatory concerns — each with mitigation strategy
- Update `CLAUDE.md` to add Skill Economy Platform section under workspace structure

**Files affected:**

- `module-installs/skill-economy-platform/`
- `skill-economy-platform/docs/`
- `CLAUDE.md` (update)

---

## Connections & Dependencies

### Files That Reference This Area

- `CLAUDE.md` — needs new section for this platform
- `context/business-info.md` — Anushka's ventures include Resob.ai and Corntub — this platform could be the tech layer for both
- Memory system — save insights about this project for future sessions

### Updates Needed for Consistency

- `CLAUDE.md` — add Skill Economy Platform documentation
- `MEMORY.md` — add project memory entry

### Impact on Existing Workflows

- `/prime` command should now recognize the Skill Economy Platform as a major active project
- `/create-plan` and `/implement` commands remain the execution mechanism
- `/brief` could pull platform metrics (if DB is running)

---

## Validation Checklist

- [ ] PostgreSQL schema creates all tables with correct foreign keys and indexes
- [ ] Backend starts and all API routes respond correctly
- [ ] Frontend builds without TypeScript errors
- [ ] PWA manifest and service worker are valid
- [ ] Landing page renders on mobile viewport (375px)
- [ ] Onboarding flow completes all 4 steps
- [ ] Task create form submits to API with correct payload
- [ ] Dynamic pricing calculation returns reasonable values
- [ ] AI recommendation endpoints call OpenAI and return formatted results
- [ ] Razorpay integration creates orders and handles webhooks
- [ ] WebSocket server starts and handles basic events
- [ ] All environment variables are documented in `.env.example`
- [ ] AIOS module INSTALL.md is executable without errors
- [ ] Documentation covers all 8 user flows

---

## Success Criteria

The implementation is complete when:

1. **Full-stack MVP runs locally**: User can sign up, post a task, accept a task, complete it, and see payment flow — all on localhost
2. **AI recommendations work**: Given a user profile, the AI returns relevant task and mentor recommendations
3. **Mobile-first UI is polished**: The app renders beautifully at 375px mobile width with proper touch targets
4. **Escrow payment flow is complete**: Money is held, released, or refunded correctly through Razorpay
5. **AIOS module is installable**: The platform can be launched via the AIOS module wrapper with one command

---

## Notes

### On Sequencing

The 8 steps above are ordered for maximum learning and validation. Steps 1-2 (architecture + backend) can run in parallel with Steps 3-6 (frontend). Step 7 (AI + payments) should be done after both frontend and backend are stable. Step 8 (docs + AIOS wrapper) is the final polish.

### On AI Choice

For skill tagging and gap analysis, GPT-4o is recommended (fast, cheap, accurate enough). For resume generation, use Claude 3.5 Sonnet (better long-form output). This gives best quality-per-cost ratio.

### On MVP Scope Discipline

This plan has EVERYTHING. For MVP, ship ONLY:
- User auth + role switch
- Task create + browse + accept + submit + review
- Basic profile with auto skill tagging
- Simple wallet with manual escrow (Razorpay test mode)

Everything else (clubs, geo, AI recommendations, mentor booking calendar) is Phase 2.

### On Startup Legitimacy

This is a real startup idea. Before writing code, consider:
- **Incorporate** as a private limited company (not essential for MVP, but needed before taking real money)
- **Razorpay TIN** needed before real payments
- **Terms of Service + Privacy Policy** needed before collecting user data
- **Student ID verification** adds trust but slows onboarding — balance carefully

---

*This plan represents ~200-300 hours of development work for a solo developer. Consider breaking it into the 5 phases defined in docs/MVP_PLAN.md to ship incrementally.*
