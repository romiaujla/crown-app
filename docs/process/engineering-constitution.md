# Engineering Constitution

## Purpose
This document is the canonical engineering policy for Crown. It defines mandatory standards for coding, branching, commits, Jira hygiene, review, and release behavior.

## Scope
Applies to all contributors (human and AI) across all repository directories.

## Core Principles
- Ship in small, reviewable increments.
- Keep planning and implementation traceable to Jira work items.
- Prefer deterministic, automated quality gates over manual checks.
- Treat standards as defaults; exceptions require explicit documented rationale.

## Coding Standards
- Use TypeScript strict mode for new code where applicable.
- For reusable finite state or value sets in TypeScript, prefer named enums over ad hoc string unions or inline string tuples.
- One-off literal values that are local to a single type or schema may remain inline when the value set is not reused elsewhere.
- TypeScript enum member keys must use `SNAKE_CASE`.
- TypeScript enum type names must use the `Enum` suffix.
- When a reusable finite value set already exists as a shared enum, Zod schemas should derive from that enum rather than repeat the same inline string array.
- For multi-branch discriminated unions, prefer composing the union from named branch type aliases instead of inlining multiple object-literal branches in a single declaration.
- Use named result-branch aliases when the branches carry distinct meaning, are reused, or would otherwise make the union harder to scan in review.
- Validate external input with Zod before business logic.
- Keep modules cohesive and avoid hidden cross-package coupling.
- Add tests for behavior changes (unit/integration/e2e as appropriate).
- Do not commit generated build artifacts unless explicitly required.
- For API route changes, keep the manually maintained OpenAPI source in `apps/api/src/docs/openapi.ts` aligned with the implemented route surface that powers `/api/v1/docs`.
- Creating a new API route, materially changing an existing API route contract/behavior, or deleting an API route requires updating the corresponding entries in `apps/api/src/docs/openapi.ts`.
- For persistence modeling, use singular `PascalCase` names for ORM/entity models, plural `snake_case` names for database tables, and `snake_case` for database columns.
- Use UUID primary keys by default for new persistence models. Use separate stable business codes or slugs for deterministic fixtures, imports, and user-facing references rather than numeric or sequential record IDs.
- Join or junction models must be named as the singular combination of the entities they connect (for example, `PlatformUserTenant`), and their database tables must use the corresponding plural `snake_case` form (for example, `platform_user_tenants`).
- For database schema changes, update the Prisma schema/model definitions first, use Prisma to generate the migration SQL, inspect the generated SQL before applying it, and only hand-edit generated SQL when Prisma produces something unsafe or structurally incorrect.

## Branching Standard (Mandatory)
Branch naming maps to Jira issue type:
- Task -> `chore/CROWN-<id>-<slug>`
- Story -> `feat/CROWN-<id>-<slug>`
- Bug -> `fix/CROWN-<id>-<slug>`
- Hotfix -> `hotfix/CROWN-<id>-<slug>`

## Commit Standard (Mandatory)
Commit format:
- `<type>: CROWN-<id> - <message>`

Type mapping derives from branch prefix:
- `chore` branch -> `chore` commit prefix
- `feat` branch -> `feat` commit prefix
- `fix` branch -> `fix` commit prefix
- `hotfix` branch -> `hotfix` commit prefix

Commit-message hook enforcement is implemented in:
- `.husky/commit-msg`
- `scripts/commit-msg-rewrite.mjs`

## Jira Standard (Mandatory)
For all non-subtask issues, use Lean template:
- `## Problem`
- `## Goal`
- `## User Story`
- `## Acceptance Criteria`

Implementation details belong in repository docs and should be linked from Jira.

## Planning Gate (Mandatory for Major Features)
Before implementation of major features, complete Spec Kit artifacts:
1. `/constitution`
2. `/specify`
3. `/plan`
4. `/tasks`

PRs for major features must reference these artifacts.

## Pull Request Standard
- When squash merge is used, the PR title must match the commit format exactly: `<type>: CROWN-<id> - <message>`.
- PR title format is release-significant because GitHub squash merge uses the PR title as the commit subject on `main`.
- PR description includes summary, Jira linkage, and validation notes.
- Required checks must pass before merge.
- Keep PR scope aligned with Jira scope; split when scope drifts.

## Release and Versioning Standard
- Trunk branch is `main`.
- Semantic-release is the source of truth for tags/versioning.
- Commit types drive release impact under release config.
- Versions reflect changes that have shipped to `main`, not work that has merely started.
- `feat` releases should drive backward-compatible minor version increments.
- `fix` and `hotfix` releases should drive patch version increments.
- `major` should be used only for shipped breaking changes or deliberate major product milestones; epic start or epic completion alone does not require a major version bump.
- `no-release` commits should not trigger version bumps.
- Repository-managed release commits generated by semantic-release (for example, `chore(release): <version> [skip ci]`) are allowed as an automation exception to the Jira-linked commit format.
- On this repository, release publication must not require direct commits to protected `main`; releases are driven by tags and GitHub Releases rather than changelog/version write-backs.

## Ownership and Change Control
- Primary owner: engineering lead for process/governance.
- Any change to this constitution requires:
  - Jira issue
  - PR with rationale in description
  - approval from designated owner/reviewer

## Precedence
Order of precedence for repository rules:
1. This constitution (`docs/process/engineering-constitution.md`)
2. `AGENTS.md` (agent operational instructions)
3. `docs/process/spec-kit-workflow.md` (execution workflow details)
4. CI/hook automation rules
