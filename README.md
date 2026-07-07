# Joborg AI

**An AI-powered mock interview coach that turns any job description into a personalized practice session with instant feedback and a readiness report.**

Joborg AI is the interview-practice layer for the [Joborg](https://github.com/Magret1730/joborg-frontend) career platform. Users register, paste a role description, answer tailored questions, get Gemini-powered evaluation after each answer, and receive a final readiness report with scores, strengths, weaknesses, and recommendations.

Built as a standalone monorepo so it can ship quickly today and integrate into the main Joborg app later.

---

## Table of contents

- [Project overview](#project-overview)
- [Key features](#key-features)
- [Tech stack](#tech-stack)
- [Monorepo structure](#monorepo-structure)
- [Local setup](#local-setup)
- [Environment variables](#environment-variables)
- [API routes](#api-routes)
- [Auth flow](#auth-flow)
- [AI usage limits](#ai-usage-limits)
- [Database schema](#database-schema)
- [Deployment](#deployment)
- [Future Joborg integration](#future-joborg-integration)
- [Demo script](#demo-script)
- [Screenshots](#screenshots)
- [Related repos](#related-repos)

---

## Project overview

### Problem

Job seekers often prepare with generic question banks that do not match the role they are targeting. Practicing alone makes it hard to know whether answers are strong, structured, or interview-ready.

### Solution

Joborg AI closes that gap with a focused MVP workflow:

1. **Register / log in** — JWT-based auth; interviews belong to the authenticated user.
2. **Generate** — Paste a job title, company, and description. Gemini generates five tailored interview questions.
3. **Practice** — Answer one question at a time in a guided session UI.
4. **Evaluate** — Each answer is scored with instant feedback (strengths, weaknesses, improved answer, follow-up question).
5. **Report** — When all questions are answered, Gemini produces a final readiness report with category scores and a verdict.
6. **Track** — Dashboard, history, and reports pages let users review progress over time.

### Interview status flow

```
draft → in_progress → completed
         ↳ readyForReport (all questions answered, no report yet)
```

`completed` is set when a final report exists.

---

## Key features

| Feature | Description |
|---------|-------------|
| **User authentication** | Register, login, logout, session restore via JWT |
| **Protected app routes** | Dashboard, start, history, reports, and interview sessions require login |
| **Interview ownership** | Users can only access their own interviews |
| **Tailored interview generation** | Creates 5 role-specific questions from a job description |
| **Guided interview session** | One-question-at-a-time UI with navigation, drafts, and progress tracking |
| **AI answer evaluation** | Per-answer scoring and structured feedback via Gemini |
| **Re-evaluation** | Submit an updated answer to get fresh feedback |
| **Final readiness report** | Overall, technical, communication, and readiness scores with verdict |
| **Report regeneration** | Regenerate a final report after completion |
| **Interview history** | Search, filter, sort, and delete past sessions |
| **Dashboard & reports** | Overview stats and completed report listing |
| **MVP AI rate limits** | Per-user daily caps on Gemini calls to protect free-tier usage |
| **Dark / light theme** | Consistent Joborg-branded UI with accessible contrast |

---

## Tech stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS 4, HeroUI |
| **Backend** | Express 5, TypeScript, Zod validation |
| **Database** | PostgreSQL ([Neon](https://neon.tech)), Knex migrations |
| **Auth** | JWT (`jsonwebtoken`), bcrypt password hashing |
| **AI** | Google Gemini (`gemini-2.5-flash`) via `@google/generative-ai` |
| **Rate limiting** | `express-rate-limit` on AI-heavy routes |
| **Monorepo** | npm workspaces |
| **Shared** | `@joborg-ai/shared` package for cross-app types |

---

## Monorepo structure

```
joborg-ai/
├── apps/
│   ├── web/                 # Next.js frontend (port 3000)
│   └── api/                 # Express REST API (port 5051 in local dev)
├── packages/
│   └── shared/              # Shared TypeScript types and helpers
├── package.json             # Root workspace scripts
└── README.md
```

| Path | Purpose |
|------|---------|
| `apps/web` | User-facing interview coach UI |
| `apps/api` | REST API, auth, AI orchestration, database access |
| `packages/shared` | Shared contracts for future Joborg merge |

---

## Local setup

### Prerequisites

- Node.js 20+
- npm 10+
- A [Neon](https://neon.tech) PostgreSQL database (or local Postgres)
- A [Google AI Studio](https://aistudio.google.com/) Gemini API key

### 1. Install dependencies

From the repo root:

```bash
npm install
```

### 2. Configure environment variables

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

Fill in the values described in [Environment variables](#environment-variables).

### 3. Run database migrations

```bash
npm run db:migrate
```

Other database commands:

```bash
npm run db:status --workspace=@joborg-ai/api
npm run db:rollback
```

### 4. Start the apps

**Terminal 1 — API:**

```bash
npm run dev:api
```

API: [http://localhost:5051](http://localhost:5051)

**Terminal 2 — Web:**

```bash
npm run dev:web
```

Web: [http://localhost:3000](http://localhost:3000)

> **Local dev ports:** API uses **5051** (not 5001) to avoid macOS AirPlay Receiver conflicts. Web is pinned to **3000**. If port 3000 is already in use, stop the other process or run `lsof -i :3000` to find it.

### 5. Verify health

```bash
curl http://localhost:5051/api/v1/health
curl http://localhost:5051/api/v1/health/db
```

### Build for production

```bash
npm run build
```

---

## Environment variables

### Web (`apps/web/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Base URL for the API (default: `http://localhost:5051/api/v1`) |

Example:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5051/api/v1
```

### API (`apps/api/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | API port (default: `5051` in local dev) |
| `NODE_ENV` | No | `development` or `production` |
| `CLIENT_URL` | Yes | Frontend origin for CORS (default: `http://localhost:3000`) |
| `DATABASE_URL` | Yes* | Neon/PostgreSQL connection string |
| `GEMINI_API_KEY` | Yes* | Google Gemini API key |
| `JWT_SECRET` | Yes* | Secret for signing JWT access tokens |
| `JWT_EXPIRES_IN` | No | Token lifetime (default: `7d`) |

\* Required for full functionality. Health routes work without `DATABASE_URL` / `GEMINI_API_KEY`; auth and interview routes need all values above.

Example API `.env`:

```bash
PORT=5051
NODE_ENV=development
CLIENT_URL=http://localhost:3000
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_long_random_jwt_secret_here
JWT_EXPIRES_IN=7d
```

> **Never commit real secrets.** Use `.env` locally and platform environment variables in deployment.

---

## API routes

Base path: `/api/v1`

### Response format

**Success:**

```json
{
  "success": true,
  "message": "...",
  "data": { }
}
```

**Error:**

```json
{
  "success": false,
  "message": "..."
}
```

### Health (public)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/health` | No | API health check |
| `GET` | `/health/db` | No | Database connection check |

### Auth

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/auth/register` | No | Create account (`name`, `email`, `password`) |
| `POST` | `/auth/login` | No | Log in; returns JWT + user |
| `GET` | `/auth/me` | Yes | Return current user from JWT |
| `POST` | `/auth/logout` | No | Logout (client clears token) |

### Interviews (protected — `Authorization: Bearer <token>` required)

| Method | Route | Rate limited | Description |
|--------|-------|--------------|-------------|
| `POST` | `/interviews/generate` | Yes (1/day) | Generate interview questions from job description |
| `GET` | `/interviews` | No | List current user's interviews |
| `GET` | `/interviews/:id` | No | Get interview detail, answers, and final report |
| `POST` | `/interviews/:id/answers` | Yes (5/day) | Submit or re-evaluate an answer |
| `POST` | `/interviews/:id/final-report` | Yes (1/day) | Generate or regenerate final report |
| `DELETE` | `/interviews/:id` | No | Delete interview and all answers |

Cross-user access returns **404** (`Interview not found`) to avoid leaking ownership.

---

## Auth flow

### Backend

1. **Register** — `POST /auth/register` hashes the password (bcrypt) and creates a `users` row with `plan: "free"`.
2. **Login** — `POST /auth/login` verifies credentials and returns a signed JWT plus public user fields (`id`, `name`, `email`, `plan`).
3. **Protected routes** — `requireAuth` middleware reads `Authorization: Bearer <token>`, verifies the JWT, loads the user, and sets `req.user`.
4. **Interview ownership** — All interview queries filter by `user_id === req.user.id`.

### Frontend

1. **Token storage** — JWT stored in `localStorage` (`joborg-ai-auth-token`).
2. **Session restore** — On load, `AuthContext` calls `GET /auth/me` if a token exists.
3. **API client** — `services/api.ts` attaches the Bearer token to every request; `401` clears the session and redirects to login.
4. **Route guard** — `ProtectedRoute` wraps the `(app)` layout. Unauthenticated users are redirected to `/auth/login?redirect=<original-path>`.
5. **Post-login redirect** — Login page reads the `redirect` query param and sends the user back to their intended route (default: `/dashboard`).
6. **Register flow** — Registration succeeds without auto-login; user is sent to the login page.

### Public vs protected routes

| Public | Protected |
|--------|-----------|
| `/` | `/dashboard` |
| `/auth/login` | `/start` |
| `/auth/register` | `/history` |
| | `/reports` |
| | `/interview/[id]` |
| | `/interview/[id]/report` |

---

## AI usage limits

Joborg AI uses **Google Gemini** (`gemini-2.5-flash`) with JSON response mode and Zod validation on every AI response.

| Action | API route | Output |
|--------|-----------|--------|
| **Generate questions** | `POST /interviews/generate` | 5 tailored questions with hints |
| **Evaluate answer** | `POST /interviews/:id/answers` | Score, strengths, weaknesses, improved answer, follow-up |
| **Final report** | `POST /interviews/:id/final-report` | Category scores, summary, verdict |

Prompts live in `apps/api/src/modules/ai/prompts/`. All Gemini calls go through `AiService` → `GeminiService` with a 30-second timeout and structured error handling.

### Current MVP AI usage limits

During MVP testing, AI-heavy routes are rate-limited **per authenticated user** (24-hour rolling window) to protect Gemini free-tier usage:

| Action | Limit | 429 message (summary) |
|--------|-------|------------------------|
| Interview generation | 1 per day | "You can generate 1 interview per day on the MVP version…" |
| Answer evaluation | 5 per day | "You can evaluate up to 5 answers per day on the MVP version…" |
| Final report generation | 1 per day | "You can generate 1 final report per day on the MVP version…" |

One full interview session uses exactly that budget: **1 generation + 5 evaluations + 1 report**.

Limits are enforced **before** Gemini is called via `express-rate-limit` middleware in `apps/api/src/middleware/rateLimiters.ts`. Over-limit requests return `429` with a friendly message in the standard API error format. `RateLimit-*` response headers are included when supported.

> **Note:** These are MVP safeguards, not full pricing logic. Plan-based quotas, usage tracking tables, and Stripe billing are not implemented yet. Future Joborg pricing will replace or extend these limits.

---

## Database schema

PostgreSQL via Knex migrations. Hosted on [Neon](https://neon.tech).

### `users`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `name` | text | Display name |
| `email` | text | Unique |
| `password_hash` | text | bcrypt hash |
| `plan` | text | `free` (default) or `premium` |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### `interviews`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → `users.id`; set on creation for new interviews |
| `title` | text | Interview title |
| `company_name` | text | Nullable |
| `job_description` | text | Source job posting |
| `questions_json` | jsonb | Generated questions array |
| `final_report_json` | jsonb | Nullable — final AI report |
| `overall_score` | integer | Nullable — from final report |
| `status` | text | `draft`, `in_progress`, or `completed` |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### `answers`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `interview_id` | UUID | FK → `interviews.id` (CASCADE delete) |
| `question_index` | integer | Unique per interview |
| `question_text` | text | |
| `question_type` | text | e.g. technical, behavioral |
| `answer_text` | text | User's answer |
| `score` | integer | Nullable — AI score 0–100 |
| `feedback_json` | jsonb | Nullable — structured AI feedback |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

Unique constraint: `(interview_id, question_index)`

---

## Deployment

Recommended production layout:

| Service | Platform | Purpose |
|---------|----------|---------|
| **Web** | [Vercel](https://vercel.com) | Next.js frontend |
| **API** | [Render](https://render.com) | Express backend |
| **Database** | [Neon](https://neon.tech) | Serverless PostgreSQL |

### 1. Neon (database)

1. Create a project at [neon.tech](https://neon.tech).
2. Copy the **pooled** connection string (include `?sslmode=require`).
3. Save it as `DATABASE_URL` for the API service.

**Run migrations** (from your machine or a one-off Render shell):

```bash
# Set DATABASE_URL to your Neon connection string, then:
cd apps/api
NODE_ENV=production npm run db:latest
```

Or from the repo root after building the API:

```bash
npm run build:api
cd apps/api
NODE_ENV=production npx knex migrate:latest --knexfile knexfile.ts --env production
```

### 2. Render (API)

1. Create a new **Web Service** connected to this repo.
2. Configure:

| Setting | Value |
|---------|-------|
| **Root Directory** | _(leave empty — repo root)_ |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build:shared && npm run build:api` |
| **Start Command** | `npm run start --workspace=@joborg-ai/api` |
| **Health Check Path** | `/api/v1/health` |

3. Set environment variables:

| Variable | Example |
|----------|---------|
| `NODE_ENV` | `production` |
| `PORT` | `5001` (Render sets `PORT` automatically — the app reads it) |
| `CLIENT_URL` | `https://your-app.vercel.app` |
| `DATABASE_URL` | Neon pooled connection string |
| `GEMINI_API_KEY` | Your Gemini API key |
| `JWT_SECRET` | Long random secret (32+ chars) |
| `JWT_EXPIRES_IN` | `7d` |

4. Deploy and verify:

```bash
curl https://your-api.onrender.com/api/v1/health
curl https://your-api.onrender.com/api/v1/health/db
```

> **Tip:** Render free-tier services spin down after inactivity. First request after idle may be slow.

### 3. Vercel (web)

1. Import the repo at [vercel.com](https://vercel.com).
2. Configure:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `apps/web` |
| **Install Command** | `cd ../.. && npm install` |
| **Build Command** | `cd ../.. && npm run build:shared && npm run build --workspace=@joborg-ai/web` |

3. Set environment variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://your-api.onrender.com/api/v1` |

4. Deploy and open the Vercel URL.

5. Update Render `CLIENT_URL` to match the final Vercel domain if it changed during setup.

### Deployment checklist

- [ ] Neon project created; `DATABASE_URL` copied
- [ ] Migrations run against production database
- [ ] Render API deployed with all env vars set
- [ ] `GET /api/v1/health` and `/api/v1/health/db` return success
- [ ] Vercel web deployed with `NEXT_PUBLIC_API_BASE_URL` pointing to Render API
- [ ] `CLIENT_URL` on Render matches Vercel production URL (CORS)
- [ ] `JWT_SECRET` set to a strong production value
- [ ] `GEMINI_API_KEY` set on Render
- [ ] Register a test user in production and complete one interview flow
- [ ] Confirm auth redirect and protected routes work end-to-end

---

## Future Joborg integration

Joborg AI is built as a standalone monorepo first so it can move quickly without blocking the main Joborg frontend and backend repos.

### Near-term roadmap

1. **Shared contracts** — Keep API shapes and types in `packages/shared` for reuse when merged into Joborg.
2. **API alignment** — Match `/api/v1` prefix and auth patterns with the main [Joborg backend](https://github.com/Magret1730/joborg-backend).
3. **Frontend reuse** — Same stack as [Joborg frontend](https://github.com/Magret1730/joborg-frontend) (Next.js, TypeScript, Tailwind) for easy embedding.
4. **Auth unification** — Replace standalone JWT auth with Joborg session/SSO when ready.
5. **Billing & plans** — Wire `users.plan` to Joborg subscriptions (Stripe) and replace MVP rate limits with plan-based quotas.
6. **Usage tracking** — Persist daily/monthly AI usage per user instead of in-memory rate limit counters.
7. **Job page launch** — Let users start a mock interview directly from a tracked Joborg job posting (no manual JD paste).
8. **Gradual merge** — Once stable, AI routes and UI can move into the main Joborg repos or remain a linked microservice.

### Future request flow (post-pricing)

```
Request → authenticate → resolve Joborg plan → check usage quota
       → if over limit, return 429
       → else call Gemini → increment usage → return response
```

Enforcement points (already identified in code):

- `POST /api/v1/interviews/generate`
- `POST /api/v1/interviews/:id/answers`
- `POST /api/v1/interviews/:id/final-report`

---

## Demo script

Use this ~4-minute walkthrough for capstone presentations or stakeholder demos.

### 1. Landing page (20s)

- Open [http://localhost:3000](http://localhost:3000)
- Highlight the value proposition and feature overview
- Show that **Start Interview** redirects to login when logged out

### 2. Register & login (30s)

- Click **Register** and create an account
- Note: registration redirects to login (no auto-login)
- Log in and land on the **Dashboard**
- Point out the free-plan usage note

### 3. Dashboard (20s)

- Show stats cards: total, in progress, ready for report, completed
- Click **Start Interview**

### 4. Generate an interview (45s)

- Enter job title, company, and paste a job description (or click **Use example**)
- Click **Generate Interview**
- Show the session with 5 tailored questions and progress sidebar

### 5. Answer & evaluate (60s)

- Write an answer and click **Submit Answer**
- Show the feedback card: score, strengths, weaknesses, improved answer
- Navigate between questions; highlight answered-state indicators

### 6. Final report (45s)

- After all questions are answered, click **Generate Report**
- Show the report page: hero score, category cards, summary, recommendations
- Click **Copy Summary** to demonstrate clipboard export

### 7. History & management (30s)

- Go to **History** — search, filter by status, open the actions menu
- Show **View Report**, **Regenerate Report**, and **Delete Interview**
- Visit **Reports** for the completed-report listing

### 8. Auth & limits (20s)

- Log out and try visiting `/dashboard` — show login redirect with `?redirect=`
- Mention MVP rate limits (1 interview / 5 evaluations / 1 report per day)
- Mention future Joborg integration and plan-based pricing

---

## Screenshots

_Add screenshots here before submission or deployment._

| Screen | Description |
|--------|-------------|
| Landing page | Hero and feature overview |
| Login / register | Auth flow |
| Dashboard | Stats and recent interviews |
| Start interview | Job description form |
| Interview session | Question card, answer form, and feedback |
| Final report | Scores, verdict, and recommendations |
| History | Search, filters, and actions menu |

Suggested folder:

```
docs/screenshots/
├── landing.png
├── login.png
├── dashboard.png
├── start-interview.png
├── interview-session.png
├── final-report.png
└── history.png
```

---

## Related repos

- [Joborg frontend](https://github.com/Magret1730/joborg-frontend)
- [Joborg backend](https://github.com/Magret1730/joborg-backend)

---

## License

Private — capstone / portfolio project.
