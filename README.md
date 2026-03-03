# crown-crm

Multi-tenant CRM monorepo for Crown CRM MVP.

## Stack
- Monorepo: pnpm + Turborepo
- Backend: Node.js, TypeScript, Express, Zod, Prisma, PostgreSQL
- Frontend: Next.js App Router, TypeScript, shadcn/ui-compatible component setup, Playwright
- Testing: Vitest + Supertest + Testcontainers (backend), Playwright (frontend)

## Workspace Layout
- `apps/api` - Express API and global Prisma schema
- `apps/web` - Next.js application
- `packages/config` - shared configuration presets
- `packages/types` - shared types and Zod schemas
- `packages/ui` - shared UI primitives
- `infra/docker` - local infrastructure (PostgreSQL)
- `docs` - architecture, ADRs, and specs

## Commands
- `pnpm install`
- `pnpm postgres`
- `pnpm db:setup`
- `pnpm db:push`
- `pnpm db:migrate -- --name <change-name>`
- `pnpm db:generate`
- `pnpm dev`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm release`

## Local Setup and Run
1. Install dependencies:
   - `pnpm install`
2. Start local PostgreSQL:
   - `pnpm postgres`
3. Initialize the database schema:
   - `pnpm db:push`
4. Start API and web in dev mode:
   - `pnpm dev`

Default local endpoints:
- Web: `http://localhost:3000`
- API health: `http://localhost:4000/api/v1/health`

## Database Commands
- Start Postgres and apply schema in one step:
  - `pnpm db:setup`
- Apply schema to local Postgres:
  - `pnpm db:push`
- Create and apply a new migration during development:
  - `pnpm db:migrate -- --name <change-name>`
- Regenerate Prisma client:
  - `pnpm db:generate`

## Commit and Release Convention
- Branch naming by Jira issue type:
  - Task: `chore/CROWN-123-short-name`
  - Story: `feat/CROWN-123-short-name`
  - Bug: `fix/CROWN-123-short-name`
  - Hotfix: `hotfix/CROWN-123-short-name`
- Commit messages are normalized by `commit-msg` hook to:
  - `<type>: CROWN-<id> - <message>`
- Type mapping:
  - `chore` branch -> `chore` commit
  - `feat` branch -> `feat` commit
  - `fix` branch -> `fix` commit
  - `hotfix` branch -> `hotfix` commit
- Trunk (`main`) releases are generated with semantic-release and Git tags.

## Engineering Policy
- Canonical policy document: `docs/process/engineering-constitution.md`
- AI-agent mandatory entrypoint: `AGENTS.md`

## Planning-First Workflow
Major features require Spec Kit artifacts before implementation:
1. `/constitution`
2. `/specify`
3. `/plan`
4. `/tasks`

Repository guidance:
- Single canonical constitution: `docs/process/engineering-constitution.md`
- Project-level Spec Kit installation and usage: `docs/process/spec-kit-installation.md`
- Feature artifact/index guidance: `docs/features/README.md`
