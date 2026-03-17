# Implementation Plan: Align Domain Schemas With Management-System Pivot

**Branch**: `feat/CROWN-6-domain-skeleton-update` | **Date**: 2026-03-08 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/spec.md)
**Input**: Feature specification from `/specs/CROWN-6-domain-skeleton-update/spec.md`

## Summary

Audit the existing tenant-domain baseline introduced by tenant provisioning work, replace CRM-only tenant concepts with a management-system-oriented domain baseline, and define compatibility guidance for already-provisioned tenants. The implementation plan centers on explicitly dispositioning `accounts`, `contacts`, `deals`, and `activities`, updating architecture contracts that still describe CRM-scoped tenant operations, and preserving generic control-plane models.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, plus SQL migration assets and Markdown architecture/spec artifacts  
**Primary Dependencies**: Express 4, Zod 3, Prisma 5, pg 8, Pino 9  
**Storage**: PostgreSQL via Prisma for control-plane metadata plus versioned SQL files for tenant schema artifacts  
**Testing**: Vitest, Supertest, Testcontainers, and artifact-level review of schema/domain contracts  
**Target Platform**: Linux server runtime for `@crown/api` with PostgreSQL-backed tenant schemas  
**Project Type**: Monorepo web application with API service, web app, and architecture/spec artifacts  
**Performance Goals**: Tenant bootstrap remains operational for new tenants with no unresolved CRM-only baseline artifacts before additional tenant-domain expansion proceeds  
**Constraints**: Preserve existing control-plane schema stability, keep changes additive and reviewable, maintain compatibility guidance for already-provisioned tenants, and avoid coupling tenant APIs to CRM-only terminology  
**Scale/Scope**: One control-plane Prisma schema, one baseline tenant migration set, four current tenant-domain tables (`accounts`, `contacts`, `deals`, `activities`), and related architecture/spec artifacts that describe tenant-scoped operations

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Pre-Phase-0 gate:

- Branch/commit policy: PASS for implementation branch `feat/CROWN-6-domain-skeleton-update`; implementation commits must keep the mandatory `feat: CROWN-6 - ...` format.
- Jira traceability and scope: PASS; plan aligns directly to Story `CROWN-6`, which was updated to own management-system domain alignment and existing schema artifact review.
- Coding standards: PASS; planned changes preserve TypeScript strict-mode expectations, Zod-validated boundaries, cohesive tenant-domain modules, and test additions for behavior changes.
- Planning gate for major features: PASS; `/specify` is complete and `/plan` artifacts are being generated before implementation.
- PR/release constraints: PASS; scope is limited to tenant-domain schema pivot work and related contracts/docs, with no unrelated release-process changes.

Post-Phase-1 gate re-check:

- PASS; research and design artifacts remain within `CROWN-6` scope and do not require constitutional exceptions.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-6-domain-skeleton-update/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── tenant-domain-audit-contract.md
│   └── tenant-domain-boundaries.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/
├── api/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── tenant-migrations/
│   │   └── 0001_base/
│   ├── src/
│   │   ├── routes/
│   │   └── tenant/
│   └── tests/
│       ├── contract/
│       └── integration/
└── web/

docs/
└── architecture/

specs/
├── 005-crown-5/
└── CROWN-6-domain-skeleton-update/
```

**Structure Decision**: Keep `CROWN-6` centered in the existing `apps/api` tenant-domain and migration surfaces, with supporting architecture/spec artifacts under `docs/architecture` and `specs/CROWN-6-domain-skeleton-update`.

## Complexity Tracking

No constitution violations requiring exception rationale.
