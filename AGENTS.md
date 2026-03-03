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

## Recent Changes
- 001-jwt-rbac-foundation: Added TypeScript 5.x on Node.js 20 (repo baseline) + Express 4, Zod 3, Prisma 5, Pino 9
