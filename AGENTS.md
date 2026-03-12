# AGENTS.md

## Mandatory Policy
All AI agents working in this repository must follow:
- `docs/process/engineering-constitution.md`

This is mandatory for code changes, branch naming, commits, Jira issue updates, pull requests, and release-related work.

## Required Workflow
- Use Jira-linked branches and commits per constitution.
- Keep issue descriptions aligned with Lean Jira template.
- For major features, require Spec Kit artifacts before implementation.

## Prompt-Driven Start Workflow
When a user prompt is in the form `Start implementing <JIRA ISSUE>`:

1. Resolve the Jira issue first and use that issue as the only delivery scope unless the user explicitly broadens it.
2. Use `docs/process/engineering-constitution.md` as the governing policy for branch naming, commits, pull requests, and release-safe metadata.
3. Create or validate the Jira-linked branch that matches the issue type before editing files.
4. For major feature work, begin with `/specify`, then continue in this order: `/plan`, `/tasks`, implementation, and pull request creation.
5. After completing `/specify`, `/plan`, `/tasks`, and implementation, commit and push that phase before moving to the next phase when no unresolved clarification remains.
6. Pause for user clarification instead of auto-advancing when scope, requirements, repository state, validation evidence, or Jira-to-branch alignment are ambiguous or blocked.
7. Create the final pull request only after implementation is complete, committed, and pushed, and include Jira linkage, links to `spec.md`, `plan.md`, and `tasks.md`, a scope statement, and validation notes in the PR description.

## Operational Rules
- Do not bypass repository hooks, CI checks, or branch protection requirements.
- Do not widen PR scope beyond the Jira issue(s) named in the branch/PR.
- Prefer additive, reviewable commits and explicit rationale for policy exceptions.
- For API route changes, keep the manual OpenAPI source in `apps/api/src/docs/openapi.ts` aligned with the implemented route surface.
- Creating a new API route, materially changing an existing API route contract/behavior, or deleting an API route requires updating the corresponding entries in `apps/api/src/docs/openapi.ts`.

## Active Technologies
- TypeScript 5.x on Node.js 20 (repo baseline) + Express 4, Zod 3, Prisma 5, Pino 9 (001-jwt-rbac-foundation)
- PostgreSQL (via Prisma), plus JWT claim payload validation in request contex (001-jwt-rbac-foundation)
- TypeScript 5.x on Node.js 20 (repo baseline) + Express 4, Zod 3, Prisma 5, pg 8, Pino 9 (005-crown-5)
- PostgreSQL via Prisma for global metadata plus direct SQL execution for tenant schema DDL/migrations (005-crown-5)
- TypeScript 5.x on Node.js 20, plus SQL migration assets and Markdown architecture/spec artifacts + Express 4, Zod 3, Prisma 5, pg 8, Pino 9 (006-domain-skeleton-update)
- PostgreSQL via Prisma for control-plane metadata plus versioned SQL files for tenant schema artifacts (006-domain-skeleton-update)
- TypeScript 5.x on Node.js 20 + Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, existing Crown auth/RBAC contracts (feat/CROWN-7-platform-super-admin)
- N/A for this shell feature directly; reads will eventually depend on existing platform APIs and PostgreSQL-backed platform data (feat/CROWN-7-platform-super-admin)
- N/A for the shell itself; future tenant workspace reads will depend on existing platform APIs and PostgreSQL-backed tenant data (feat/CROWN-8-tenant-app-shell)
- TypeScript 5.x on Node.js 20 for the repo baseline; Markdown design artifacts for this story + Prisma 5, PostgreSQL, existing tenant SQL migration baseline, Spec Kit artifact workflow (feat/CROWN-29-tenant-domain-model)
- PostgreSQL for control-plane models via Prisma and tenant schemas via versioned SQL migrations (feat/CROWN-29-tenant-domain-model)
- SQL migration files for tenant schemas, TypeScript 5.x on Node.js 20 for repository tooling and integration validation + PostgreSQL, existing tenant SQL migration framework, Prisma 5 for adjacent control-plane tooling, Spec Kit artifacts from `CROWN-29` and this story (feat/CROWN-30-tenant-schema-migrations)
- PostgreSQL with platform-wide shared tables in `core` and tenant-domain tables in `tenant_<tenant_slug>` schemas (feat/CROWN-30-tenant-schema-migrations)
- TypeScript 5.x on Node.js 20 for seed-entry design alignment, Prisma 5.x as the planned seed authoring/runtime entrypoin + Prisma, PostgreSQL, `CROWN-29` model handoff, `CROWN-30` migration handoff, Spec Kit artifacts for this story (feat/CROWN-31-prisma-seed-strategy)
- PostgreSQL with shared control-plane data in `core` and tenant-domain data in `tenant_<tenant_slug>` schemas (feat/CROWN-31-prisma-seed-strategy)
- TypeScript 5.x on Node.js 20, Prisma 5.19.x + Prisma Client, Prisma CLI seed entrypoint support, `pg`, `tsx`, Vitest, existing `apps/api` tenant migration and provisioning modules (feat/CROWN-32-prisma-local-seed-runner)
- PostgreSQL with control-plane tables in `core` via `apps/api/prisma/schema.prisma` and tenant-domain tables in `tenant_<tenant_slug>` via `apps/api/prisma/transportation-management-system-schema.prisma` (feat/CROWN-32-prisma-local-seed-runner)
- TypeScript 5.x on Node.js 20, Prisma 5.19.x, Markdown documentation in the repository root and `specs/` + Prisma CLI and Prisma seed entrypoint support, `pg`, `tsx`, existing `apps/api` tenant provisioning and local seed modules, README-based local setup guidance (feat/CROWN-33-bootstrap-test-workflows)
- TypeScript 5.x on Node.js 20, Prisma 5.19.x, Markdown documentation in the repository root and `specs/` + Vitest, existing `apps/api/prisma/seed.ts` seed entrypoint, repository-level local bootstrap script, current seed/bootstrap test harnesses, README-based local setup guidance (feat/CROWN-34-seed-validation-expectations)
- PostgreSQL with control-plane data in `core` via Prisma and tenant-domain data in `tenant_<tenant_slug>` schemas established by the existing migration and seed baseline (feat/CROWN-34-seed-validation-expectations)
- TypeScript 5.x on Node.js 20, Prisma ORM 7.x, Markdown documentation in the repository root and `specs/` + `prisma`, `@prisma/client`, `@prisma/adapter-pg`, `pg`, `tsx`, existing API seed and tenant tooling, repository-level pnpm command surfaces (chore/CROWN-35-prisma-7-upgrade)
- PostgreSQL with control-plane data in `core` via Prisma and tenant-domain data in `tenant_<tenant_slug>` via the existing SQL migration baseline (chore/CROWN-35-prisma-7-upgrade)
- TypeScript 5.x on Node.js 20, Prisma ORM 7.x, SQL migrations, Markdown planning artifacts + Express 4, Zod 3, Prisma 7, `@prisma/client`, `@prisma/adapter-pg`, `pg`, `tsx`, existing control-plane seed/bootstrap tooling (feat/CROWN-60-auth-credential-foundation)
- PostgreSQL control-plane schema via Prisma and canonical local seed baseline for control-plane records (feat/CROWN-60-auth-credential-foundation)

## Recent Changes
- 001-jwt-rbac-foundation: Added TypeScript 5.x on Node.js 20 (repo baseline) + Express 4, Zod 3, Prisma 5, Pino 9
