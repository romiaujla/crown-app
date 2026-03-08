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
- Validate external input with Zod before business logic.
- Keep modules cohesive and avoid hidden cross-package coupling.
- Add tests for behavior changes (unit/integration/e2e as appropriate).
- Do not commit generated build artifacts unless explicitly required.

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
- PR title includes Jira key.
- PR description includes summary, Jira linkage, and validation notes.
- Required checks must pass before merge.
- Keep PR scope aligned with Jira scope; split when scope drifts.

## Release and Versioning Standard
- Trunk branch is `main`.
- Semantic-release is the source of truth for tags/versioning.
- Commit types drive release impact under release config.
- `no-release` commits should not trigger version bumps.

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
