# UpRise — Your Skills. Your Proof. Your Pay.

A unified platform where students (Classes 9–college) can post tasks, earn money, get mentored, and build verified proof-of-work portfolios — all in one app.

**Domain:** cornutub.xyz
**Brand:** UpRise

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repo
git clone <your-repo-url>
cd uprise-platform

# Install all dependencies
cd frontend && npm install
cd ../backend && npm install

# Copy environment variables
cp .env.example .env
```

### Run Locally

```bash
# Terminal 1 — Backend (port 3001)
cd backend && npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Express.js, TypeScript, better-sqlite3 |
| Auth | JWT (access + refresh tokens) |
| Payments | Razorpay (Phase 1: test mode) |

---

## Project Structure

```
uprise-platform/
├── frontend/          # Next.js 14 app
│   ├── app/           # App Router pages
│   ├── components/    # React components
│   ├── hooks/         # Custom hooks
│   └── lib/           # API client, utilities
├── backend/           # Express.js API
│   └── src/
│       ├── db/        # SQLite schema + seed
│       ├── routes/    # API routes
│       ├── controllers/ # Route handlers
│       ├── middleware/  # Auth, validation
│       └── services/   # Business logic
├── DEPLOY.md          # Deployment guide
└── package.json       # Root workspace
```

---

## Features (MVP)

- [ ] User registration + login (JWT)
- [ ] Role toggle: Learner / Earner / Mentor
- [ ] Profile creation + editing
- [ ] Student ID verification (OTP + ID card)
- [ ] Task marketplace (create, browse, accept)
- [ ] Mentorship system
- [ ] Escrow wallet
- [ ] Reviews + ratings

---

## Deployment

See [DEPLOY.md](./DEPLOY.md) for full deployment instructions.

---

## License

Private — All rights reserved.
