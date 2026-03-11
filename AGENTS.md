# AGENTS.md

## Mandatory Policy
All AI agents working in this repository must follow:
- `docs/process/engineering-constitution.md`

This is mandatory for code changes, branch naming, commits, Jira issue updates, pull requests, and release-related work.

## Required Workflow
- Use Jira-linked branches and commits per constitution.
- Keep issue descriptions aligned with Lean Jira template.
- For major features, require Spec Kit artifacts before implementation.

## Operational Rules
- Do not bypass repository hooks, CI checks, or branch protection requirements.
- Do not widen PR scope beyond the Jira issue(s) named in the branch/PR.
- Prefer additive, reviewable commits and explicit rationale for policy exceptions.

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

## Recent Changes
- 001-jwt-rbac-foundation: Added TypeScript 5.x on Node.js 20 (repo baseline) + Express 4, Zod 3, Prisma 5, Pino 9
