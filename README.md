# crown-app

Multi-tenant application monorepo for Crown.

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

- [Local Authentication Guide](docs/auth/local-authentication.md)

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

- Use the seeded local accounts and login journeys documented in [docs/auth/local-authentication.md](docs/auth/local-authentication.md).
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

### Prerequisites

- Docker must be installed and running
  - macOS/Windows: Start Docker Desktop
  - Linux: Ensure Docker daemon is running (`systemctl start docker` or equivalent for your system)

### Commands

- Run all tests:
  - `pnpm test`
- Run tests in watch mode:
  - `cd apps/api && pnpm test:watch`
- Run specific test file:
  - `pnpm test <path/to/test.spec.ts>`

### What Happens

When you run tests:

1. A PostgreSQL container starts automatically (typically < 2 seconds)
2. The database schema is initialized via Prisma migrations
3. Seed data is applied to populate canonical test fixtures
4. Tests run against the container database
5. The container is automatically destroyed after tests complete

### Troubleshooting

**Docker daemon not running**

- macOS: Start Docker Desktop from Applications
- Windows: Start Docker Desktop
- Linux: Run `sudo systemctl start docker` (or equivalent for your distro)

**Tests still failing after Docker is running**

- Verify Docker is running: `docker ps`
- Rebuild the Prisma client: `cd apps/api && pnpm db:generate`
- Check container logs: `docker logs <container-id>`

**Container cleanup issues**

- List running test containers: `docker ps -a | grep postgres`
- Manually stop containers: `docker stop <container-id>`

For detailed troubleshooting and advanced configuration, see [docs/testing-setup.md](docs/testing-setup.md).

## Commit and Release Convention

- Pre-commit hook runs **prettier**, **typecheck**, and **tests** before every commit.
  - If any check fails, the commit is blocked and the failing check category is printed.
  - To bypass in an emergency: `HUSKY=0 git commit`
  - Fix formatting issues: `pnpm format:check` (check) or `npx prettier --write .` (auto-fix)
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
- If you squash merge to `main`, set the PR title to the same format:
  - `<type>: CROWN-<id> - <message>`
- Trunk (`main`) releases are generated with semantic-release, Git tags, and GitHub Releases.
- Release automation does not commit changelog or version files back to protected `main`.

## Engineering Policy

- Canonical policy document: `docs/process/engineering-constitution.md`
- AI-agent mandatory entrypoint: `AGENTS.md`

## Planning-First Workflow

Use tagged workflow commands to choose the delivery path:

- `--help` shows the repository AI-agent prompt registry in `docs/process/ai-agent-prompt-help.md`.
- `--speckit CROWN-<id>` requires Spec Kit artifacts before implementation:

1. `/constitution`
2. `/specify`
3. `/plan`
4. `/tasks`

- `--implement CROWN-<id>` skips `/specify`, `/plan`, and `/tasks` and goes straight to implementation.
- `--clean-code-api` audits only `apps/api` for clean-code and coding-standard issues.
- `--clean-code-web` audits only `apps/web` for clean-code and coding-standard issues.
- Workflow-helper prompts such as `--audit CROWN-<id>`, `--sync-to-jira CROWN-<id>`, `--sync-from-jira CROWN-<id>`, `--resolve-pr-comments [PR-NUMBER]`, `--review [PR-NUMBER]`, `--refresh-pr [PR-NUMBER]`, `--status [CROWN-<id>]`, `--handoff CROWN-<id>`, `--reconcile CROWN-<id>`, `--test-fix [TARGET]`, `--openapi-audit [TARGET]`, and `--scope-drift CROWN-<id>` are documented in the prompt help registry for delivery maintenance and reconciliation work.

Repository guidance:

- Single canonical constitution: `docs/process/engineering-constitution.md`
- AI-agent prompt help registry: `docs/process/ai-agent-prompt-help.md`
- Project-level Spec Kit installation and usage: `docs/process/spec-kit-installation.md`
- Feature artifact/index guidance: `docs/features/README.md`

Tagged workflow examples:

```text
--help
--speckit CROWN-79
--implement CROWN-79
--clean-code-api
--audit CROWN-79
--resolve-pr-comments
```

Expected repository behavior for prompt-driven starts:

- Resolve the Jira issue first. Before creating a new Jira-linked branch, run `git co main && git pull`, then create the Jira-linked branch; if the Jira-linked branch already exists, validate and use that branch.
- When a Jira-linked branch is created, transition that issue to `In Progress`.
- Use `--help` to list the documented repository AI-agent prompt patterns and their behavior.
- Use `--speckit CROWN-<id>` to start with `/specify`, then proceed through `/plan`, `/tasks`, implementation, and pull request creation in order.
- Use `--implement CROWN-<id>` to skip `/specify`, `/plan`, and `/tasks` and proceed directly to implementation.
- Use `--clean-code-api` and `--clean-code-web` to run workspace-scoped review-only coding-standard audits against the engineering constitution and related process guidance, with findings-first output and concrete file references.
- Use the workflow-helper prompts from `docs/process/ai-agent-prompt-help.md` for Jira coverage audits, Jira sync, PR comment resolution, PR refresh, delivery status, handoff, reconciliation, targeted test fixing, OpenAPI alignment audits, review, and scope-drift checks.
- Commit and push each completed phase before advancing when no unresolved clarification remains.
- When a Jira-linked pull request is created, transition that issue to `In Review`.
- Pause for clarification instead of auto-advancing when scope, requirements, or repository state are ambiguous.
