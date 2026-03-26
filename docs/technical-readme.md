# Crown App Technical README

This document keeps the implementation-focused setup and workspace details that were previously in the repository root README.

## Stack

- Monorepo: pnpm + Turborepo
- Backend: Node.js, TypeScript, Express, Zod, Prisma, PostgreSQL
- Frontend: Next.js App Router, TypeScript, shadcn/ui-compatible component setup, Playwright
- Testing: Vitest + Supertest + Testcontainers (backend), Playwright (frontend)

## Workspace Layout

- `apps/api` - Express API and global Prisma schema
- `apps/web` - Next.js application with a shadcn/ui CLI-compatible component setup
- `packages/config` - shared configuration presets
- `packages/types` - shared types and Zod schemas
- `packages/ui` - shared UI primitives
- `infra/docker` - local infrastructure (PostgreSQL)
- `docs` - architecture, ADRs, and specs

## Commands

- `pnpm install`
- `pnpm postgres`
- `pnpm db:bootstrap:local`
- `pnpm db:setup`
- `pnpm db:push`
- `pnpm db:seed:local`
- `pnpm db:migrate -- --name <change-name>`
- `pnpm db:generate`
- `pnpm dev`
- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm release`

## Local Setup and Run

1. Install dependencies:
   - `pnpm install`
2. Start local PostgreSQL:
   - `pnpm postgres`
3. Copy `apps/api/.env.example` to `apps/api/.env.local`, then update the values you need for your local machine.
4. Run the canonical local bootstrap workflow:
   - `pnpm db:bootstrap:local`
5. Start API and web in dev mode:
   - `pnpm dev`

Default local endpoints:

- Web: `http://localhost:3000`
- API health: `http://localhost:4000/api/v1/health`

Local auth reference:

- [Local Authentication Guide](auth/local-authentication.md)

## Web UI Baseline

- `apps/web` is configured for shadcn/ui component generation through `apps/web/components.json`.
- Use the repo root or `apps/web` as your working directory when adding components with the CLI:
  - `cd apps/web && pnpm dlx shadcn@latest add button`
  - or `pnpm dlx shadcn@latest add button --cwd apps/web`
- The baseline utility lives at `apps/web/lib/utils.ts`.
- The initial shared UI primitives live under `apps/web/components/ui/`.
- Session-expiry UX is driven by the access-token `exp` claim and a shared web-auth warning flow.
- The web app shows a top-right warning shortly before logout, then redirects to login with a session-expired message when expiry is reached.

## Local Auth

- Use the seeded local accounts and login journeys documented in [auth/local-authentication.md](auth/local-authentication.md).
- The current phase uses tab-scoped `sessionStorage`, so local sessions are not shared automatically across browser tabs.

## Database Commands

- Start Postgres and apply schema in one step:
  - `pnpm db:setup`
- Run the canonical local bootstrap workflow:
  - `pnpm db:bootstrap:local`
  - This is the supported bootstrap path for local development.
  - Use it when:
    - you are setting up the project locally for the first time
    - your local DB is empty or only partially prepared
    - you want to get back to the canonical baseline without manually remembering the order of setup steps
  - What it does:
    - starts local Postgres
    - runs `pnpm db:push` to prepare the control-plane schema
    - runs `pnpm db:seed:local` to bootstrap the canonical tenant if needed and reload the canonical seeded baseline
  - When to use `db:bootstrap:local` vs `db:seed:local`:
    - use `pnpm db:bootstrap:local` when you want full local DB preparation from the repo root
    - use `pnpm db:seed:local` when Postgres and schema setup are already handled and you only want to refresh the canonical seeded tenant data
  - Important boundary:
    - it does not wipe the whole database
    - it refreshes only the canonical local seeded tenant baseline
    - unrelated tenants and unrelated platform records are preserved
  - It starts local PostgreSQL, prepares the control-plane schema state, then runs the canonical seeded tenant bootstrap and seed workflow.
  - It is safe to rerun and continues to preserve unrelated tenants, unrelated platform users, and unrelated platform history outside the canonical seed boundary.
- Apply schema to local Postgres:
  - `pnpm db:push`
  - Prisma 7 uses an explicit generated client path, so this command refreshes Prisma Client before applying schema changes.
- Reset and reseed the canonical local tenant baseline:
  - `pnpm db:seed:local`
  - Copy `apps/api/.env.example` to `apps/api/.env.local` first and update `DATABASE_URL` or any local-only secrets before running the command.
  - This command loads `apps/api/.env.local`, bootstraps the canonical seeded tenant schema if it does not exist yet, then resets and reloads the seeded tenant-domain data.
  - Validation relies on the same deterministic tenant slug, tenant schema name, seeded user emails, and representative business codes on every successful rerun.
  - Each run preserves unrelated tenants, unrelated platform users, and unrelated audit history. It resets only the canonical local seed scope for the seeded tenant and reloads the deterministic baseline records.
  - Later automated or container-based setup should reuse this same canonical baseline contract rather than define a separate test-only seed path.
- Create and apply a new migration during development:
  - `pnpm db:migrate -- --name <change-name>`
- Regenerate Prisma client:
  - `pnpm db:generate`
  - Prisma 7 no longer relies on the older implicit generation default, so run this after Prisma schema or package changes if you need to refresh the generated client manually.

## Running Tests

Tests automatically provision an ephemeral PostgreSQL container for you. No manual database setup is required.
