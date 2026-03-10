# Implementation Plan: Implement Resettable Local Seed Runner And Baseline Dataset

**Branch**: `feat/CROWN-32-prisma-local-seed-runner` | **Date**: 2026-03-10 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-32-prisma-local-seed-runner/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-32-prisma-local-seed-runner/spec.md)
**Input**: Feature specification from `/specs/CROWN-32-prisma-local-seed-runner/spec.md`

## Summary

Implement the runnable local seed workflow that `CROWN-31` prepared. The work should add a Prisma-backed seed entrypoint in `apps/api`, ensure the minimum control-plane baseline for one canonical tenant, reset only the approved tenant-domain scope, and reload a deterministic foundational dataset that local developers can rerun safely.

The implementation should stay narrowly scoped to foundational local development data. It should favor one supported reset-and-reseed command, stable business lookup keys, and integration tests that prove repeated reruns, preserved out-of-scope data, and recovery after partial failure.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Prisma 5.19.x  
**Primary Dependencies**: Prisma Client, Prisma CLI seed entrypoint support, `pg`, `tsx`, Vitest, existing `apps/api` tenant migration and provisioning modules  
**Storage**: PostgreSQL with control-plane tables in `core` via `apps/api/prisma/schema.prisma` and tenant-domain tables in `tenant_<tenant_slug>` via `apps/api/prisma/transportation-management-system-schema.prisma`  
**Testing**: `pnpm --filter @crown/api exec vitest`, focused integration tests for rerun safety and reset boundaries, plus targeted typecheck if implementation adds new TypeScript modules  
**Target Platform**: Monorepo API workspace in `apps/api` for local developer workflows on macOS/Linux with future reuse in containerized test paths  
**Project Type**: Monorepo web application with API service, Prisma-managed control-plane models, and tenant-schema SQL bootstrap assets  
**Performance Goals**: Local seed reruns should complete quickly enough for repeated development use and restore the canonical baseline in one supported command path  
**Constraints**: Must follow the `CROWN-31` reset boundary, must preserve unrelated tenants and unrelated platform history, must use stable business identifiers instead of record-order assumptions, must remain foundational rather than becoming feature-specific sample data, must be safe to rerun after partial failure  
**Scale/Scope**: One canonical local baseline for one representative tenant, minimum control-plane access rows, and representative foundational tenant-domain fixtures across organizations, locations, people, roles, assets, loads, stops, activities, and tenant-owned reference data

## Seed Runner Outline

- Add a Prisma-recognized seed entrypoint under `apps/api` so local developers have one canonical seed command.
- Ensure the seeded tenant and minimum platform membership records exist idempotently before any tenant-domain reset begins.
- Reset only the seeded tenant-domain schema contents in dependency-safe order while retaining migration-state knowledge and all unrelated platform data.
- Reload the canonical tenant-domain baseline using deterministic business keys so later local workflows and tests can reference seeded records predictably.
- Cover repeated reruns, preserved out-of-scope data, and recovery after interrupted loads with integration tests.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Branch naming: PASS. `feat/CROWN-32-prisma-local-seed-runner` matches the constitution for a Story.
- Commit/PR convention: PASS. Work on this branch should continue to use `feat: CROWN-32 - ...` commit subjects and squash-safe PR titles.
- Planning gate: PASS. `CROWN-32` is progressing through `specify` then `plan` before implementation.
- Testing discipline: PASS. The plan includes integration coverage for behavior changes around rerun safety, reset boundaries, and deterministic fixtures.
- Persistence and migration rule: PASS. The plan keeps Prisma as the control-plane access layer, respects the established tenant-schema baseline from `CROWN-30`, and does not introduce ad hoc schema changes.
- Scope control: PASS. The plan is limited to local seed implementation and foundational dataset loading, excluding later bootstrap orchestration and feature-specific demo fixtures.

Post-design re-check: PASS. The resulting design artifacts remain within the story scope, preserve the Prisma-first persistence rule, and do not require constitutional exceptions.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-32-prisma-local-seed-runner/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── local-seed-runner-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/api/
├── package.json
├── prisma/
│   ├── schema.prisma
│   ├── transportation-management-system-schema.prisma
│   └── seed/
├── src/
│   ├── db/
│   └── tenant/
├── tests/
│   ├── helpers/
│   └── integration/
└── scripts/

specs/
├── CROWN-29-tenant-domain-model/
├── CROWN-30-tenant-schema-migrations/
├── CROWN-31-prisma-seed-strategy/
└── CROWN-32-prisma-local-seed-runner/
```

**Structure Decision**: `CROWN-32` produces both planning artifacts under `specs/CROWN-32-prisma-local-seed-runner/` and runnable implementation under `apps/api`. The planned implementation surface centers on a Prisma seed entrypoint plus supporting reset/load modules and integration tests rather than application routes or frontend code.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
