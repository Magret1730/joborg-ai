# Joborg AI

**An AI-powered mock interview coach that turns any job description into a personalized practice session with instant feedback and a readiness report.**

Joborg AI is the interview-practice layer for the [Joborg](https://github.com/Magret1730/joborg-frontend) career platform. Paste a role description, answer tailored questions, get Gemini-powered evaluation after each answer, and receive a final report with scores, strengths, weaknesses, and recommendations.

Built as a standalone monorepo so it can ship quickly today and integrate into the main Joborg app later.

---

## Problem statement

Job seekers often prepare for interviews with generic question banks that do not match the role they are targeting. Practicing alone makes it hard to know whether answers are strong, structured, or interview-ready.

There is a gap between reading a job posting and feeling confident in a real interview — especially when feedback is missing, untimely, or not role-specific.

---

## Solution overview

Joborg AI closes that gap with a focused MVP workflow:

1. **Generate** — User pastes a job title, company, and description. Gemini generates five tailored interview questions.
2. **Practice** — User answers one question at a time in a guided session UI.
3. **Evaluate** — Each answer is scored and feedback is returned instantly (strengths, weaknesses, improved answer, follow-up question).
4. **Report** — When all questions are answered, Gemini produces a final readiness report with category scores and a verdict.
5. **Track** — Dashboard, history, and reports pages let users review progress over time.

The app is designed for future Joborg integration: shared API conventions, nullable `user_id` for auth, and documented pricing enforcement points — without coupling to Joborg auth or billing yet.

---

## Key features

| Feature | Description |
|---------|-------------|
| **Tailored interview generation** | Creates 5 role-specific questions from a job description |
| **Guided interview session** | One-question-at-a-time UI with navigation, drafts, and progress tracking |
| **AI answer evaluation** | Per-answer scoring and structured feedback via Gemini |
| **Re-evaluation** | Submit an updated answer to get fresh feedback |
| **Progress tracking** | Draft → In Progress → Ready for Report → Completed |
| **Final readiness report** | Overall, technical, communication, and readiness scores with verdict |
| **Report regeneration** | Regenerate a final report after completion |
| **Interview history** | Search, filter, sort, and delete past sessions |
| **Dashboard & reports** | Overview stats and completed report listing |
| **Dark / light theme** | Consistent Joborg-branded UI with accessible contrast |

---

## Tech stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS 4, HeroUI |
| **Backend** | Express 5, TypeScript, Zod validation |
| **Database** | PostgreSQL (Neon), Knex migrations |
| **AI** | Google Gemini (`gemini-2.5-flash`) via `@google/generative-ai` |
| **Monorepo** | npm workspaces |
| **Shared** | `@joborg-ai/shared` package for cross-app types |

---

## Monorepo structure

```
joborg-ai/
├── apps/
│   ├── web/                 # Next.js frontend (port 3000)
│   └── api/                 # Express REST API (port 5001)
├── packages/
│   └── shared/              # Shared TypeScript types and helpers
├── package.json             # Root workspace scripts
└── README.md
```

| Path | Purpose |
|------|---------|
| `apps/web` | User-facing interview coach UI |
| `apps/api` | REST API, AI orchestration, database access |
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

Fill in the values described in [Environment variables](#environment-variables) below.

### 3. Run database migrations

```bash
npm run db:migrate
```

Other database commands:

```bash
npm run db:status     # check migration status
npm run db:rollback   # rollback latest migration batch
```

### 4. Start the apps

**Terminal 1 — API:**

```bash
npm run dev:api
```

API: [http://localhost:5001](http://localhost:5001)

**Terminal 2 — Web:**

```bash
npm run dev:web
```

Web: [http://localhost:3000](http://localhost:3000)

### 5. Verify health

```bash
curl http://localhost:5001/api/v1/health
curl http://localhost:5001/api/v1/health/db
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
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Base URL for the API (default: `http://localhost:5001/api/v1`) |

### API (`apps/api/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | API port (default: `5001`) |
| `NODE_ENV` | No | `development` or `production` |
| `CLIENT_URL` | Yes | Frontend origin for CORS (default: `http://localhost:3000`) |
| `DATABASE_URL` | Yes* | Neon/PostgreSQL connection string |
| `GEMINI_API_KEY` | Yes* | Google Gemini API key |

\* Required for full functionality. Health routes work without them; interview and AI routes need both.

Example API `.env`:

```bash
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:3000
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Never commit real secrets.** Use `.env` locally and platform env vars in deployment.

---

## API routes

Base path: `/api/v1`

All successful responses follow:

```json
{
  "success": true,
  "message": "...",
  "data": { }
}
```

### Health

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/health` | API health check |
| `GET` | `/health/db` | Database connection check |

### Interviews

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/interviews/generate` | Generate interview questions from job description (Gemini) |
| `GET` | `/interviews` | List all interviews with progress metadata |
| `GET` | `/interviews/:id` | Get interview detail, answers, and final report |
| `POST` | `/interviews/:id/answers` | Submit or re-evaluate an answer (Gemini) |
| `POST` | `/interviews/:id/final-report` | Generate or regenerate final report (Gemini) |
| `DELETE` | `/interviews/:id` | Delete interview and all answers |

### Interview status flow

```
draft → in_progress → completed
         ↳ readyForReport (all questions answered, no report yet)
```

`completed` is set when a final report exists.

---

## Database schema summary

PostgreSQL via Knex migrations. Hosted on [Neon](https://neon.tech).

### `interviews`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Nullable — ready for future auth |
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

## AI / Gemini usage

Joborg AI uses **Google Gemini** (`gemini-2.5-flash`) with JSON response mode and Zod validation on every AI response.

| Action | Trigger | Output |
|--------|---------|--------|
| **Generate questions** | `POST /interviews/generate` | 5 tailored questions with hints |
| **Evaluate answer** | `POST /interviews/:id/answers` | Score, strengths, weaknesses, improved answer, follow-up |
| **Final report** | `POST /interviews/:id/final-report` | Category scores, summary, verdict |

Prompts live in `apps/api/src/modules/ai/prompts/`. All Gemini calls go through `AiService` → `GeminiService` with a 30-second timeout and structured error handling.

### Current MVP AI usage limits

During MVP testing, AI-heavy routes are rate-limited per user (24-hour rolling window) to protect Gemini free-tier usage:

| Action | Limit |
|--------|-------|
| Interview generation | 1 per day |
| Answer evaluation | 5 per day |
| Final report generation | 1 per day |

One full interview session uses exactly that budget: 1 generation + 5 evaluations + 1 report.

Limits are enforced **before** Gemini is called via `express-rate-limit` middleware (`apps/api/src/middleware/rateLimiters.ts`). Over-limit requests return `429` with a friendly message in the standard API error format.

Future Joborg pricing and subscription plans will replace or extend these MVP limits with plan-based quotas.

---

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| **Web (Next.js)** | _TBD — e.g. Vercel_ | `https://your-app.vercel.app` |
| **API (Express)** | _TBD — e.g. Railway / Render_ | `https://your-api.example.com` |
| **Database** | [Neon](https://neon.tech) | Connection via `DATABASE_URL` |

### Deployment checklist

- [ ] Set `NEXT_PUBLIC_API_BASE_URL` to production API URL
- [ ] Set `CLIENT_URL` to production web URL (CORS)
- [ ] Set `DATABASE_URL` and run migrations
- [ ] Set `GEMINI_API_KEY`
- [ ] Set `NODE_ENV=production`

---

## Future pricing and usage limits

Joborg AI is designed to integrate with the main Joborg pricing and subscription system.

### Current state

- `interviews.user_id` links interviews to authenticated users
- MVP per-user rate limits protect Gemini usage (see [Current MVP AI usage limits](#current-mvp-ai-usage-limits))
- Plan and subscription checks are **not implemented yet**
- Usage tracking tables are **not implemented yet**

### Free plan

- 1 interview generation per day
- Limited answer evaluations
- Limited final report generations
- No report regeneration
- Limited AI usage

### Premium plan

- Unlimited interview generation
- Unlimited answer evaluations
- Unlimited report generation
- Report regeneration
- Future AI features

### Enforcement points

Limits should be checked **before** calling Gemini to avoid unnecessary AI cost:

- `POST /api/v1/interviews/generate`
- `POST /api/v1/interviews/:id/answers`
- `POST /api/v1/interviews/:id/final-report`

Re-evaluate answer and regenerate final report should count as premium or more strictly limited actions.

When auth is added, each interview will link to a user via `user_id`, and usage will be checked against the user's Joborg subscription plan.

### Future request flow

```
Request → authenticate → resolve plan → check usage quota
       → if over limit, return 429
       → else call Gemini → increment usage → return response
```

---

## Future Joborg integration plan

Joborg AI is built as a standalone monorepo first so it can move quickly without blocking the main Joborg frontend and backend repos.

1. **Shared contracts** — Keep API shapes and types in `packages/shared` for reuse when merged into Joborg.
2. **API alignment** — Use the same `/api/v1` prefix and auth patterns as the main [Joborg backend](https://github.com/Magret1730/joborg-backend).
3. **Frontend reuse** — Match the main [Joborg frontend](https://github.com/Magret1730/joborg-frontend) stack (Next.js, TypeScript, Tailwind) for easy embedding.
4. **Gradual merge** — Once stable, AI routes and UI can be added to the main Joborg repos or deployed as a linked service.
5. **Auth & billing** — Wire `user_id`, subscription plans, and usage quotas at the enforcement points documented above.

---

## Demo script

Use this ~3-minute walkthrough for capstone presentations or stakeholder demos.

### 1. Landing & dashboard (30s)

- Open [http://localhost:3000](http://localhost:3000)
- Highlight the value proposition on the landing page
- Go to **Dashboard** — show stats cards (total, in progress, ready for report, completed)

### 2. Generate an interview (45s)

- Click **Start Interview**
- Enter job title, company, and paste a job description (or use **Use example**)
- Click **Generate Interview**
- Show the generated session with 5 tailored questions

### 3. Answer & evaluate (60s)

- Write an answer and click **Submit Answer**
- Show the AI feedback card: score ring, strengths, weaknesses, improved answer
- Navigate to another question; show progress in the sidebar

### 4. Final report (45s)

- After all questions are answered, click **Generate Report** in the sidebar
- Show the polished report page: hero score, category cards, summary, strengths/weaknesses/recommendations
- Click **Copy Summary** to demonstrate clipboard export

### 5. History & management (30s)

- Go to **History** — search, filter by status, open the actions menu
- Show **View Report**, **Regenerate Report**, and **Delete Interview**
- Visit **Reports** to see completed reports listed

### 6. Future roadmap (15s)

- Mention planned Joborg integration, auth, and free vs premium usage limits

---

## Screenshots

_Add screenshots here before submission or deployment._

| Screen | Description |
|--------|-------------|
| Landing page | Hero and feature overview |
| Start interview | Job description form |
| Interview session | Question card, answer form, and feedback |
| Final report | Scores, verdict, and recommendations |
| Dashboard | Stats and recent interviews |
| History | Search, filters, and actions menu |

```
docs/screenshots/
├── landing.png
├── start-interview.png
├── interview-session.png
├── final-report.png
├── dashboard.png
└── history.png
```

---

## Related repos

- [Joborg frontend](https://github.com/Magret1730/joborg-frontend)
- [Joborg backend](https://github.com/Magret1730/joborg-backend)

---

## License

Private — capstone / portfolio project.
