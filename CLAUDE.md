# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What This Is

This is an **AIOS Starter Kit** — a structured workspace for building your AI Operating System with Claude Code. The AIOS is a layer of AI automation wrapped around your business, powered by plug-and-play modules you install one at a time.

**This file (CLAUDE.md) is the foundation.** It is automatically loaded at the start of every session. Keep it current — it is the single source of truth for how Claude should understand and operate within this workspace.

> From the AAA Accelerator — the #1 AI business launch & AIOS program. [aaaaccelerator.com](https://aaaaccelerator.com)

---

## The Claude-User Relationship

Claude operates as an **agent assistant** with access to the workspace folders, context files, commands, and outputs. The relationship is:

- **User**: Defines goals, provides context about their role/function, and directs work through commands
- **Claude**: Reads context, understands the user's objectives, executes commands, produces outputs, and maintains workspace consistency

Claude should always orient itself through `/prime` at session start, then act with full awareness of who the user is, what they're trying to achieve, and how this workspace supports that.

---

## AIOS Mission

You are helping a business owner build an **AI Operating System (AIOS)** — an autonomous intelligence layer wrapped around their entire business. Everything in this workspace serves that goal.

### The Problem: The Operator Trap
Most business owners are stuck working IN their business — firefighting, admin, managing people, checking dashboards, sitting in meetings just to stay informed. 80% of bandwidth goes to "must-dos." Nothing left for growth, strategy, or the life they actually wanted. The old model says hire more people, buy more tools, work more hours. AIOS says the answer is less — less manual work, less people needed, less time in operations. More bandwidth for the work that matters.

### The Solution: Five Layers
The AIOS gives it back — one layer at a time:
1. **Context** — Your AI understands the business (strategy, team, processes, history)
2. **Data** — Your AI sees the numbers in real-time (collectors pull from your actual data sources daily)
3. **Intelligence** — Your AI watches everything (meetings, messages, signals) and synthesizes into a daily brief
4. **Automate** — Audit every task, score each one, automate them away one by one. Each task automated = bandwidth recovered.
5. **Build** — Freed bandwidth applied to growth, new initiatives, or life. Work ON the business, not IN it.

### Five Principles
1. **Just Ask** — If you can describe it in plain English, Claude can build it. Don't self-censor. Ask for the impossible.
2. **Talk, Don't Type** — Voice-first. Hold FN, speak for 60 seconds, let Claude format it. 3x faster than typing.
3. **Layers, Not Leaps** — One layer at a time. Each independently valuable. Through gradual exposure, you become technical without even trying.
4. **Build for Scale & Security** — Human-in-the-loop by default. Your data stays local. Plan before you build.
5. **Borrow Before You Build** — 80% modules, 20% custom. Check the library before building from scratch.

### Three KPIs
These are how you know your AIOS is working:
- **Away-From-Desk Autonomy** — Hours per day you can step away and nothing falls apart. Target: business runs while you sleep.
- **Task Automation %** — Percentage of recurring tasks automated. Use the Task Audit (`context/task-audit.md`) as your scoreboard.
- **Revenue Per Employee** — Total revenue ÷ team members. Not bigger companies — leaner, faster, more profitable ones.

### How You Should Help
- Be patient. Assume the user is non-technical unless told otherwise.
- Explain what you're doing in plain English BEFORE doing it.
- Celebrate wins — every module installed, every task automated is real progress toward freedom.
- When suggesting solutions, check existing modules and the community first (Borrow Before You Build).
- Keep the three KPIs in mind — every automation should move at least one KPI.
- Never dump error logs or technical jargon. Find the problem, explain it simply, fix it.

---

## Workspace Structure

```
.
├── CLAUDE.md                # This file — core context, always loaded
├── .env                     # API keys and credentials (gitignored, never commit)
├── .claude/
│   └── commands/            # Slash commands Claude can execute
│       ├── prime.md         # /prime — session initialization
│       ├── brief.md         # /brief — morning brief generator
│       ├── task-audit.md    # /task-audit — map recurring tasks
│       ├── install.md       # /install — install an AIOS module
│       ├── create-plan.md   # /create-plan — create implementation plans
│       ├── implement.md     # /implement — execute plans
│       ├── share.md         # /share — package systems for sharing
│       ├── process.md       # /process — empty your GTD inbox
│       └── review.md        # /review — guided weekly review
├── gtd/                     # GTD productivity system (installed: 2026-04-09)
│   ├── dashboard.md         # Operational hub — auto-refreshed
│   ├── inbox.md             # Raw capture bucket
│   ├── projects.md          # Master project list
│   ├── next-actions.md      # Actions organized by context (@me, @claude, etc.)
│   ├── waiting-for.md       # Delegated items
│   ├── someday-maybe.md      # Ideas for later
│   ├── areas.md             # Areas of responsibility
│   └── review-checklist.md   # Weekly review protocol
├── context/                 # Background context about the user and business
│   ├── business-info.md     # What the business does
│   ├── personal-info.md     # Who you are, your role
│   ├── strategy.md          # Current priorities and goals
│   ├── current-data.md      # Key metrics and current state
│   ├── task-audit.md        # Task automation scoreboard
│   ├── daily-brief.md       # Daily brief template
│   ├── weekly-review.md     # Weekly review template
│   ├── monthly-retrospective.md # Monthly retrospective template
│   ├── goals-dashboard.md   # Goals tracker
│   └── import/              # Drop documents here for Claude to analyze
├── module-installs/         # AIOS modules — drop module folders here, install with /install
├── plans/                   # Implementation plans created by /create-plan
├── outputs/                 # Work products and deliverables
├── reference/               # Templates, examples, reusable patterns
├── scripts/                 # Automation scripts (added by modules)
└── shares/                  # Packaged systems for sharing (created by /share)
```

**Key directories:**

| Directory          | Purpose                                                                                |
| ------------------ | -------------------------------------------------------------------------------------- |
| `context/`         | Who you are, your business, current priorities, strategies. Read by `/prime`.           |
| `context/import/`  | Drop any docs here (business plans, ChatGPT exports, etc.) for Claude to analyze.      |
| `module-installs/` | AIOS modules go here. Install them with `/install module-installs/{module-name}`.      |
| `plans/`           | Detailed implementation plans. Created by `/create-plan`, executed by `/implement`.    |
| `outputs/`         | Deliverables, analyses, reports, and work products.                                    |
| `reference/`       | GTD methodology reference + templates and patterns to assist in various workflows.        |
| `scripts/`         | Automation scripts — added by modules as you install them.                             |
| `shares/`          | Packaged systems for sharing. Created by `/share`, ready to hand off.                  |

---

## Commands

### /install [module-path]

**Purpose:** Install an AIOS module into this workspace.

Point it at a module folder in `module-installs/` and Claude walks you through the guided setup. Each module adds a new capability to your AIOS.

Example: `/install module-installs/context-os`

### /brief

**Purpose:** Generate your morning daily brief.

Run this first thing in the morning. Claude will ask 3 quick questions and generate a filled daily brief for your ventures. Uses templates from `context/daily-brief.md` and your current data.

Example: `/brief`

### /prime

**Purpose:** Initialize a new session with full context awareness.

Run this at the start of every session. Claude will:

1. Read CLAUDE.md and context files
2. Summarize understanding of the user, workspace, and goals
3. Confirm readiness to assist

### /create-plan [request]

**Purpose:** Create a detailed implementation plan before making changes.

Use when adding new functionality, commands, scripts, or making structural changes. Produces a thorough plan document in `plans/` that captures context, rationale, and step-by-step tasks.

Example: `/create-plan add a competitor analysis command`

### /implement [plan-path]

**Purpose:** Execute a plan created by /create-plan.

Reads the plan, executes each step in order, validates the work, and updates the plan status.

Example: `/implement plans/2026-01-28-competitor-analysis-command.md`

### /share [system or feature]

**Purpose:** Package a system or feature from your workspace for sharing.

Deep-dives the code first to fully understand it, then produces a self-contained, beginner-friendly package with a Claude-guided installer (INSTALL.md + README.md + scripts). The recipient gives the folder to Claude Code and says "read INSTALL.md and set this up" — Claude walks them through everything step by step. Runs a 6-stage interactive flow: Research → Scope → Frame → Write → Validate → Deliver. Outputs to `shares/`.

Example: `/share the daily brief system`

### /process

**Purpose:** Empty your GTD inbox to zero.

Run this whenever your inbox has items in it. Claude walks you through each item one by one using the GTD decision tree — routing everything to projects, next actions, waiting-for, someday/maybe, or trash.

Example: `/process`

### /review

**Purpose:** Guided weekly review using GTD methodology.

Run this every Friday (or end of week). Claude walks you through 4 phases: empty inbox, walk all lists, check for stuck projects, brainstorm new ideas. Keeps the entire system trustworthy.

Example: `/review`

---

## Getting Started

**First time?** Start here:

1. Run `/prime` — verify Claude knows you
2. Run `/brief` — generate your morning daily brief
3. Run `/task-audit` — map your recurring tasks
4. Use `/process` to empty your inbox
5. Use `/review` weekly to keep the GTD system trustworthy
6. Use `/create-plan` to plan major work items
7. Install more modules from `module-installs/` as you're ready

**Returning?** Run `/prime` at the start of every session.

---

## PolyTrack — Polymarket Live Dashboard

**Live dashboard** for tracking prediction market bets in real-time.

**Dashboard:** `http://localhost:5050` (run with `python scripts/polymarket/run.py`)
**Database:** `data/polymarket.db`
**Scripts:** `scripts/polymarket/` — `run.py`, `dashboard.py`, `fetcher.py`, `db.py`, `hermes_tools.py`

**How it works:**
- Fetches live odds from Polymarket's public API (no API key needed)
- Auto-refreshes every 5 minutes in background
- Stores markets, bets, odds history, and P&L in SQLite
- Shows today's resolving markets, up/down crypto/stock bets, win/loss record

**Hermes tools** (`scripts/polymarket/hermes_tools.py`):
- `python hermes_tools.py today` — today's markets with odds and $100 payout
- `python hermes_tools.py mybets` — your active bets
- `python hermes_tools.py pnl` — P&L summary
- `python hermes_tools.py check <keyword>` — search markets by keyword
- `python hermes_tools.py bet <slug> <side> <amount>` — place a bet

**Start the dashboard:**
```
python scripts/polymarket/run.py
```
Then open `http://localhost:5050` in your browser.

---

## IntelOS — Daily Work & Decision Tracker

IntelOS tracks your daily work, decisions, and key updates across all four business areas. No meetings or Slack — just a daily log you fill in.

**Database:** `data/intel.db`
**Tables:** `work_log`, `decisions`, `daily_updates`, `business_areas`
**Work Log File:** `context/daily-work-log.md`

**Business Areas:**
1. Resob.ai
2. Corntub
3. Father's Business
4. Personal

**What to ask:**
- "What did I work on yesterday for Resob.ai?"
- "What decisions have I made this week?"
- "What's my work log for the past 3 days?"
- "Any blockers across all areas this week?"
- "Update my work log for today"
- "Log a decision I just made"

**Daily workflow:**
1. End of day: fill in `context/daily-work-log.md`
2. Ask me to "collect today's work log into the database"
3. I run `python scripts/intel/collect_worklog.py` and store it
4. Now you can search your entire history anytime

---

## Friday — Global Intelligence Dashboard

Your personal intelligence platform, cloned from `github.com/saphaarelabs/friday13`.

**Dashboard:** `http://localhost:8080` (run with `bun run dev` in the friday13 directory)
**Location:** `C:\Users\Anushka Joshi\friday13\`

### What's Live (No API Keys Needed)

| Data | Source | Status |
|------|--------|--------|
| **Live flights** | OpenSky Network | ✅ Live — 90+ aircraft tracked |
| **Polymarket odds** | Polymarket Gamma API | ✅ Live via Supabase proxy |
| **Flight map** | OpenSky + Friday UI | ✅ Live |
| **Prediction markets UI** | Polymarket + Kalshi | ✅ Live |

### What's Live (Needs API Keys — Free Tier Available)

| Data | Source | Key Needed | How to Add |
|------|--------|------------|------------|
| **Geopolitics news** | Exa AI search | `EXA_API_KEY` | Free at exa.ai → add to Supabase Edge Function secrets |
| **Satellite imagery** | Maxar API | `MAXAR_API_KEY` | Apply at maxar.com (enterprise) |
| **Kalshi markets** | Kalshi API | `KALSHI_API_KEY` | Free at kalshi.com/developers |
| **Forex signals** | Various | API keys | Per-function docs |

### Friday ↔ AIOS Bridge

**Script:** `scripts/friday/friday_data.py`

Pull Friday's live data directly into AIOS conversations:
```
python scripts/friday/friday_data.py --flights     # 90+ live aircraft
python scripts/friday/friday_data.py --markets    # Polymarket odds
python scripts/friday/friday_data.py --all        # everything
```

When you ask me things like "what's happening with Russia/Ukraine?" or "any major geopolitical risks today?", I can pull live Polymarket odds, live flight data, and use the Friday UI as context.

### To Start Friday:
```
cd C:\Users\Anushka Joshi\friday13
bun run dev
```
Then open `http://localhost:8080`

---

## UpRise — Student Skill Economy Platform

**UpRise** is a unified platform where students (Classes 9–college) can post tasks, earn money, get mentored, and build verified skill portfolios — all in one app under one profile.

**Plan:** `plans/2026-04-27-uprise-platform.md`
**Location:** `uprise-platform/` (to be built)
**Domain:** cornutub.xyz
**AIOS Module:** `module-installs/uprise-platform/` (to be created)

### Brand
- **Name:** UpRise
- **Tagline:** "Your Skills. Your Proof. Your Pay."
- **Colors:** Indigo (#6366F1) primary, Teal (#14B8A6) secondary, Amber (#F59E0B) accent

### Four Modes (One Profile)
1. **Post Tasks** (Learner) — create homework/projects, set budget + deadline, receive completed work
2. **Do Tasks** (Earner) — browse tasks, apply/negotiate, complete and get paid
3. **Get Mentored** — book sessions with working professionals, learn industry skills
4. **Be a Mentor** — create mentor profile, accept mentees, earn from sessions

### Key Features
- **Task Marketplace** — online (file upload) + offline (physical notebook) delivery
- **Geo-matching** — city-level location filtering for local tasks
- **Escrow payments** — Razorpay, held until task approval
- **Auto skill tagging** — skills extracted from completed task text → profile
- **Unified profile** — proof-of-work history, skill badges, reviews, mentorship record
- **Role toggle** — switch Learner/Earner/Mentor instantly, no separate accounts

### Tech Stack
- Frontend: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- Backend: Express.js, TypeScript, better-sqlite3 (MVP), Socket.IO
- Payments: Razorpay (India-first: UPI, cards, wallets)

### Phase Plan
- **Phase 1 (MVP):** Core platform — tasks, mentorship, wallet, unified profile
- **Phase 2:** AI recommendations, OTP verification, student ID verification, full auto skill tagging
- **Phase 3:** Geo-matching, mobile app, advanced filters
- **Phase 4:** Clubs/communities, challenges, leaderboards
- **Phase 5:** Recruiter portal, college partnerships

---

## Critical Instruction: Maintain This File

**Whenever Claude makes changes to the workspace, Claude MUST consider whether CLAUDE.md needs updating.**

After any change — adding commands, scripts, workflows, or modifying structure — ask:

1. Does this change add new functionality users need to know about?
2. Does it modify the workspace structure documented above?
3. Should a new command be listed?
4. Does context/ need new files to capture this?

If yes to any, update the relevant sections. This file must always reflect the current state of the workspace so future sessions have accurate context.

---

## Session Workflow

1. **Start**: Run `/prime` to load context
2. **Brief**: Run `/brief` for morning snapshot
3. **Process**: Run `/process` if inbox has items
4. **Work**: Use commands or direct Claude with tasks
5. **Review weekly**: Run `/review` every Friday
6. **Install modules**: Use `/install` to add new AIOS capabilities
7. **Plan changes**: Use `/create-plan` before significant additions
8. **Execute**: Use `/implement` to execute plans
9. **Share**: Use `/share` to package systems for team, clients, or community
10. **Maintain**: Claude updates CLAUDE.md and context/ as the workspace evolves

---

## Notes

- Keep context minimal but sufficient — avoid bloat
- Plans live in `plans/` with dated filenames for history
- Outputs are organized by type/purpose in `outputs/`
- Reference materials go in `reference/` for reuse
- API keys go in `.env` — never commit this file
