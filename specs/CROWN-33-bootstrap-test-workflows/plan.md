# Implementation Plan: Integrate Schema And Seed Baseline Into Bootstrap And Test Workflows

**Branch**: `feat/CROWN-33-bootstrap-test-workflows` | **Date**: 2026-03-10 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-33-bootstrap-test-workflows/spec.md)
**Input**: Feature specification from `/specs/CROWN-33-bootstrap-test-workflows/spec.md`

## Summary

Integrate the migration-backed tenant schema baseline from `CROWN-30` and the local seed runner from `CROWN-32` into one foundational bootstrap and test-preparation workflow. The work should consolidate local setup commands, document the canonical preparation order, and make it clear how later e2e or container-based workflows can reuse the same baseline without widening the reset boundary.

The implementation should stay workflow-focused. It should make the local bootstrap path dependable from an empty or partially prepared environment, preserve unrelated tenants and platform data, and define the foundational multi-tenant expectations that later validation stories can build on.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Prisma 5.19.x, Markdown documentation in the repository root and `specs/`  
**Primary Dependencies**: Prisma CLI and Prisma seed entrypoint support, `pg`, `tsx`, existing `apps/api` tenant provisioning and local seed modules, README-based local setup guidance  
**Storage**: PostgreSQL with control-plane tables in `core` via `apps/api/prisma/schema.prisma` and tenant-domain tables in `tenant_<tenant_slug>` via `apps/api/prisma/transportation-management-system-schema.prisma`  
**Testing**: `pnpm --filter @crown/api typecheck`, focused Vitest coverage around local bootstrap and seed workflow behavior, `pnpm specify.audit`, and documentation review for bootstrap/test setup clarity  
**Target Platform**: Monorepo API workspace plus repository-level local setup workflow on macOS/Linux, with future reuse in containerized or e2e preparation flows  
**Project Type**: Monorepo web application with API service, repository-level developer workflow commands, and spec-driven setup documentation  
**Performance Goals**: Local bootstrap should remain fast enough for repeated development use and restore the canonical schema-plus-seed baseline through one supported workflow path  
**Constraints**: Must preserve `CROWN-31` reset boundaries and `CROWN-32` deterministic fixture contracts, must not clear unrelated tenants or unrelated platform users, must remain foundational rather than becoming a full test-harness feature, must document multi-tenant coverage assumptions without overcommitting to broad fixture sprawl  
**Scale/Scope**: One canonical bootstrap workflow for one representative seeded tenant, shared local setup guidance, and foundational expectations for future e2e or container-based baseline reuse

## Bootstrap Workflow Outline

- Consolidate local bootstrap expectations so maintainers can move from empty local database to canonical schema-plus-seed baseline through one documented flow.
- Ensure control-plane setup, canonical tenant schema bootstrap, and canonical seeded baseline preparation happen in the correct order.
- Align repository-level setup commands and API-level seed/provision behavior so local and future automated workflows share the same baseline contract.
- Preserve unrelated tenants and unrelated platform records during reruns while documenting the foundational multi-tenant assumptions later validation work may rely on.
- Add focused validation for bootstrap-from-empty, rerun-from-partial, and reusable-test-baseline behavior.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Branch naming: PASS. `feat/CROWN-33-bootstrap-test-workflows` matches the constitution for a Story.
- Commit/PR convention: PASS. Work on this branch should continue to use `feat: CROWN-33 - ...` commit subjects and squash-safe PR titles.
- Planning gate: PASS. `CROWN-33` is progressing through `specify` then `plan` before implementation.
- Testing discipline: PASS. The plan includes workflow-level validation around empty-environment bootstrap, rerun behavior, and reusable baseline preparation.
- Persistence and migration rule: PASS. The plan builds on the existing Prisma-first control-plane and seed implementation from `CROWN-30` through `CROWN-32` rather than introducing ad hoc database setup paths.
- Scope control: PASS. The plan is limited to workflow integration, setup guidance, and foundational test-preparation reuse. It excludes later feature APIs and broad test-fixture expansion.

Post-design re-check: PASS. The design artifacts stay within workflow-integration scope, preserve the existing database rules, and do not require constitutional exceptions.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-33-bootstrap-test-workflows/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── bootstrap-workflow-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
README.md
package.json

apps/api/
├── package.json
├── prisma/
│   ├── seed.ts
│   └── seed/
├── scripts/
├── src/
│   └── tenant/
└── tests/
    ├── helpers/
    └── integration/

specs/
├── CROWN-30-tenant-schema-migrations/
├── CROWN-31-prisma-seed-strategy/
├── CROWN-32-prisma-local-seed-runner/
└── CROWN-33-bootstrap-test-workflows/
```

**Structure Decision**: `CROWN-33` produces planning artifacts under `specs/CROWN-33-bootstrap-test-workflows/` and is expected to touch repository-level setup docs and commands plus the API bootstrap/seed workflow surfaces already introduced in `CROWN-32`. The work is workflow integration, not a new product module.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
