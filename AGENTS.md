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

## Recent Changes
- 001-jwt-rbac-foundation: Added TypeScript 5.x on Node.js 20 (repo baseline) + Express 4, Zod 3, Prisma 5, Pino 9
