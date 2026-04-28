# UpRise — Student Skill Economy Platform

**Design System:** Deep Graphite + Burnt Orange + Steel Blue on a dark premium aesthetic.

---

## Quick Start

```bash
cd uprise
npm install
npm run dev
```

Open [http://localhost:3003](http://localhost:3003)

---

## Design System

| Token | Value | Use |
|---|---|---|
| Graphite | `#1A1A1D` | Primary background |
| Graphite Light | `#222226` | Card backgrounds |
| Burnt Orange | `#E07A2F` | Primary accent, CTAs |
| Sand | `#F4F1EC` | Light sections |
| Steel Blue | `#3A86FF` | Secondary accent |

---

## Pages

| Page | Route | Description |
|---|---|---|
| **Onboarding** | `/` | Intent → Identity selection (first-time experience) |
| **Dashboard** | `/dashboard` | Role-based stats, empty states, no fake data |
| **Tasks** | `/tasks` | Browse tasks, hierarchical category filter, search |
| **Post Task** | `/tasks/create` | 3-step wizard: Details → Category → Budget |
| **Learn** | `/learn` | Browse all interest categories and topics |
| **Profile** | `/profile` | Student/Mentor info, hierarchical interests editor, settings |

---

## Key Differentiators

- **Hierarchical interest system** — categories with sub-topics, not flat tags
- **Zero fake data** — empty states only, no placeholder jobs or assignments
- **Intent → Identity onboarding** — "What do you want to do?" → "Who are you?"
- **Role-aware dashboard** — shows relevant sections for student/mentor/both
- **Clean empty states** — every section gracefully handles no data

---

## API Integration

Frontend connects to `http://localhost:3000` by default. Set `NEXT_PUBLIC_API_URL` in `.env.local` to change.

All API calls include JWT from `localStorage.getItem('uprise_token')` automatically.

---

## Next Steps

1. Run `npm install && npm run dev`
2. Complete the onboarding flow (Intent → Identity)
3. Build the backend to power real data
4. Connect `lib/api.ts` calls to real endpoints