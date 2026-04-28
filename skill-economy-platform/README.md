# SkillEdge — Skill Economy Platform

A mobile-first PWA connecting students and professionals in a skill economy where you **earn**, **learn**, and **prove it**.

---

## Quick Start

```bash
cd skill-economy-platform

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
skill-economy-platform/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page
│   ├── auth/
│   │   ├── login/page.tsx        # Login
│   │   └── signup/page.tsx       # Signup
│   ├── dashboard/page.tsx        # Main dashboard
│   ├── tasks/
│   │   ├── page.tsx             # Browse tasks
│   │   ├── create/page.tsx       # Post a task
│   │   └── [id]/page.tsx        # Task detail
│   ├── mentors/
│   │   ├── page.tsx             # Browse mentors
│   │   └── [id]/page.tsx        # Mentor profile + booking
│   ├── profile/page.tsx          # User profile (portfolio + earnings)
│   └── mentorship/page.tsx       # My mentorship sessions
├── components/
│   ├── ui/                       # Design system components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   └── Toast.tsx
│   ├── TaskCard.tsx              # Task card component
│   ├── MentorCard.tsx            # Mentor card component
│   ├── Navbar.tsx                # Bottom nav + top nav
│   └── StatsCard.tsx             # Stats, skeleton, empty state
├── lib/
│   ├── api.ts                    # API client (axios + interceptors)
│   ├── auth.ts                   # Auth hooks + token management
│   └── utils.ts                  # Helpers, constants, formatters
├── public/
│   ├── manifest.json             # PWA manifest
│   └── sw.js                     # Service worker (offline support)
├── tailwind.config.ts            # Tailwind with brand colors
├── package.json
└── tsconfig.json
```

---

## Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Hero, features, how it works, testimonials |
| Login | `/auth/login` | Email + password sign in |
| Signup | `/auth/signup` | 2-step signup with role selection |
| Dashboard | `/dashboard` | Stats, role switcher, tasks, mentors |
| Browse Tasks | `/tasks` | Filterable task marketplace |
| Post Task | `/tasks/create` | 3-step task creation wizard |
| Task Detail | `/tasks/[id]` | Full task info, bids, accept/bid |
| Browse Mentors | `/mentors` | Mentor discovery with AI recommendations |
| Mentor Profile | `/mentors/[id]` | Profile, skills, calendar, booking |
| Profile | `/profile` | Portfolio, earnings, reviews, settings |
| Mentorship | `/mentorship` | Upcoming & past sessions |

---

## API Integration

The frontend connects to `http://localhost:3000` by default.

**Example API call:**
```typescript
import { tasksAPI } from '@/lib/api';

// List tasks
const { data } = await tasksAPI.list({ category: 'design', status: 'open' });

// Create a task
const { data } = await tasksAPI.create({
  title: 'Design a logo',
  budget: 5000,
  deadline: '2026-05-01',
  category: 'design',
});
```

**Auth flow:**
- JWT token stored in `localStorage`
- `api.ts` interceptor attaches token to every request
- 401 responses auto-redirect to `/auth/login`

---

## Design System

- **Mobile-first** — optimized for 375px and up
- **Glass morphism** — translucent cards with backdrop blur
- **Neon accents** — brand purple, neon green, pink
- **Dark theme** — `#0a0a0f` background
- **Animations** — slide-up, fade-in, float, bounce-in
- **PWA** — manifest + service worker for offline support

---

## Next Steps

1. Run `npm install && npm run dev`
2. Connect to your backend API at `http://localhost:3000`
3. Set `NEXT_PUBLIC_API_URL` in `.env.local` if your API runs elsewhere
4. Replace mock data in each page with real API calls
