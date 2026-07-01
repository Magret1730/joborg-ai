# Joborg AI

Joborg AI is the AI layer for the Joborg career page monitoring platform. It will provide intelligent features such as page analysis, change summarization, and future Gemini-powered workflows.

This repository is a monorepo that keeps the frontend, backend, and shared code in one place so Joborg AI can be developed independently and integrated into the main Joborg app later.

## Monorepo structure

```
joborg-ai/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express API
├── packages/
│   └── shared/       # Shared TypeScript types and helpers
├── package.json      # Root workspace scripts
└── README.md
```

| Path | Purpose |
|------|---------|
| `apps/web` | User-facing frontend for Joborg AI |
| `apps/api` | REST API for Joborg AI features |
| `packages/shared` | Types and utilities used by both apps |

## Getting started

Install dependencies from the repo root:

```bash
npm install
```

Copy the example env files before running locally:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

## Run the frontend

From the repo root:

```bash
npm run dev:web
```

Or from `apps/web`:

```bash
npm run dev
```

The frontend runs at [http://localhost:3000](http://localhost:3000).

## Run the backend

From the repo root:

```bash
npm run dev:api
```

Or from `apps/api`:

```bash
npm run dev
```

The API runs at [http://localhost:5001](http://localhost:5001).

Health check: [http://localhost:5001/api/v1/health](http://localhost:5001/api/v1/health)

Database health check: [http://localhost:5001/api/v1/health/db](http://localhost:5001/api/v1/health/db)

## Database (Neon PostgreSQL)

Joborg AI uses [Neon](https://neon.tech) as hosted PostgreSQL with [Knex](https://knexjs.org) for migrations and queries.

### Configure `DATABASE_URL`

1. Create a Neon project and database.
2. Copy the PostgreSQL connection string from the Neon dashboard.
3. Add it to `apps/api/.env`:

```bash
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
```

Neon connection strings usually include `sslmode=require`. SSL is enabled automatically for Neon URLs.

### Run migrations

From the repo root:

```bash
npm run db:migrate
```

Or from `apps/api`:

```bash
npm run db:migrate
```

Other useful commands:

```bash
npm run db:status    # check migration status
npm run db:rollback  # rollback latest migration batch
```

### Test the database connection

1. Start the API:

```bash
npm run dev:api
```

2. Check database health:

```bash
curl http://localhost:5001/api/v1/health/db
```

Expected response:

```json
{
  "success": true,
  "message": "Database connection healthy",
  "data": {
    "database": "connected"
  }
}
```

If `DATABASE_URL` is missing, the route returns a clean error response.

## Future Joborg integration plan

Joborg AI is being built as a standalone monorepo first so it can move quickly without blocking the main Joborg frontend and backend repos.

Planned integration approach:

1. **Shared contracts** — Keep API shapes and types in `packages/shared` so they can be reused or published when merged into Joborg.
2. **API alignment** — Use the same `/api/v1` prefix and auth patterns as the main [Joborg backend](https://github.com/Magret1730/joborg-backend) to reduce integration work later.
3. **Frontend reuse** — Match the main [Joborg frontend](https://github.com/Magret1730/joborg-frontend) stack (Next.js, TypeScript, Tailwind) so UI can be moved or embedded with minimal changes.
4. **Gradual merge** — Once stable, AI routes and UI can be added to the main Joborg repos or deployed as a linked service that the main app calls.

Gemini integration and production deployment will be added in later tasks.

## Future Pricing Model

Joborg AI is designed to later integrate with the main Joborg pricing and subscription system.

### Current state

- `interviews.user_id` is nullable and ready for auth later.
- Usage tracking is **not implemented yet**.
- Plan and subscription checks are **not implemented yet**.

### Free Plan

- 1 interview generation per day
- Limited answer evaluations
- Limited final report generations
- No report regeneration
- Limited AI usage

### Premium Plan

- Unlimited interview generation
- Unlimited answer evaluations
- Unlimited report generation
- Report regeneration
- Future AI features

### Enforcement points

The following endpoints will eventually enforce pricing and usage limits **before** calling Gemini to avoid unnecessary AI cost:

- `POST /api/v1/interviews/generate`
- `POST /api/v1/interviews/:id/answers`
- `POST /api/v1/interviews/:id/final-report`

Re-evaluate answer and regenerate final report should count as premium or more strictly limited actions.

When auth is added, each interview should be linked to a user through `user_id`, and usage should be checked against the user's Joborg subscription plan.

### Future request flow

```
Request → authenticate → resolve plan → check usage quota
       → if over limit, return 429
       → else call Gemini → increment usage → return response
```

## Related repos

- [Joborg frontend](https://github.com/Magret1730/joborg-frontend)
- [Joborg backend](https://github.com/Magret1730/joborg-backend)
