# Implementation Plan: Design Deterministic Prisma Local Seed Strategy For Development And Testing

**Branch**: `feat/CROWN-31-prisma-seed-strategy` | **Date**: 2026-03-09 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-31-prisma-seed-strategy/spec.md)
**Input**: Feature specification from `/specs/CROWN-31-prisma-seed-strategy/spec.md`

## Summary

Define the deterministic Prisma-based seed strategy that follows `CROWN-29` and `CROWN-30`. The work stays foundational: establish reset scope boundaries, deterministic fixture and lookup-key rules, representative local baseline expectations, and rerun or failure-recovery guidance for later seed implementation stories.

The resulting strategy assumes one canonical local baseline centered on a single seeded tenant with stable business identifiers. Later implementation should be able to rerun the reset and load flow repeatedly without clearing unrelated platform data or reopening migration and fixture design questions.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20 for seed-entry design alignment, Prisma 5.x as the planned seed authoring/runtime entrypoint  
**Primary Dependencies**: Prisma, PostgreSQL, `CROWN-29` model handoff, `CROWN-30` migration handoff, Spec Kit artifacts for this story  
**Storage**: PostgreSQL with shared control-plane data in `core` and tenant-domain data in `tenant_<tenant_slug>` schemas  
**Testing**: `pnpm specify.audit`, design review against `CROWN-29` and `CROWN-30`, and downstream readiness checks for local and future containerized seed usage  
**Target Platform**: Monorepo API service (`apps/api`) with local development workflows and future e2e/container execution paths  
**Project Type**: Monorepo web application with API service, Prisma-managed control-plane data, and tenant-schema bootstrap assets  
**Performance Goals**: Seed strategy must support fast, repeatable local resets and deterministic baseline reloads suitable for repeated development usage  
**Constraints**: Must remain design-only in this story, must align with the Prisma-first migration rule, must define reset boundaries explicitly, must avoid feature-specific data sprawl, must support safe reruns after partial failures  
**Scale/Scope**: One foundational seed strategy for representative local and future containerized test baselines that downstream `CROWN-32` through `CROWN-34` can implement directly

## Seed Strategy Outline

- Reset only the seeded tenant-domain data in `tenant_<tenant_slug>` plus the minimum control-plane rows needed to guarantee that seeded tenant identity and access records exist.
- Retain unrelated platform-wide records and migration history that are not part of the canonical seeded baseline.
- Use stable business identifiers such as tenant slug, platform user email, organization code, location code, person code, role code, asset code, load code, and reference-data-set code as the downstream lookup contract.
- Treat a rerun as a full retry from the canonical baseline rather than an incremental repair flow.
- Keep the initial seeded dataset small, representative, and extendable so later stories can add records without redefining the reset contract.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Branch naming: PASS. `feat/CROWN-31-prisma-seed-strategy` matches the constitution for a Story.
- Commit/PR convention: PASS. Later implementation should use `feat: CROWN-31 - ...` and squash-safe PR titles.
- Planning gate: PASS. `CROWN-31` is being handled through Spec Kit artifacts before implementation.
- Persistence and migration rule: PASS. The story assumes Prisma-authored seed entry design on top of the Prisma-generated tenant baseline from `CROWN-30` rather than manual SQL authoring.
- Scope control: PASS. The story is limited to seed strategy, reset scope, deterministic lookup keys, and recovery expectations. It does not absorb actual seed implementation or later product behavior.

Post-design re-check: PASS. The design artifacts stay foundational, align to the constitution’s Prisma-first database rule, and do not introduce constitutional violations.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-31-prisma-seed-strategy/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── prisma-seed-strategy-handoff-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/api/
├── prisma/
│   ├── schema.prisma
│   └── transportation-management-system-schema.prisma
├── scripts/
├── src/
│   └── tenant/
└── tests/

specs/
├── CROWN-29-tenant-domain-model/
├── CROWN-30-tenant-schema-migrations/
└── CROWN-31-prisma-seed-strategy/
```

**Structure Decision**: The primary outputs for `CROWN-31` are design artifacts under `specs/CROWN-31-prisma-seed-strategy/`. The later implementation touchpoints are expected in `apps/api/prisma/`, `apps/api/scripts/`, and seed/bootstrap-related API test areas, but this story only defines the strategy those later changes must follow.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
