# Implementation Plan: Tenant Management-System Type And Default Role Template Model

**Branch**: `feat/CROWN-140-db-tenant-management-system-type-default-role-template-model` | **Date**: 2026-03-14 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/spec.md)
**Input**: Feature specification from `/specs/CROWN-140-tenant-management-system-type-default-role-template-model/spec.md`

## Summary

Add a control-plane source of truth for approved tenant management-system types and their default role templates. The implementation will extend `apps/api/prisma/schema.prisma`, create a Prisma migration for the new catalog tables, load deterministic baseline records through the existing local seed workflow, and add focused validation so later onboarding stories can consume a stable persisted baseline.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20 plus Prisma ORM 7.x  
**Primary Dependencies**: Express 4, Prisma 7, PostgreSQL, `pg`, Vitest, existing seed/bootstrap tooling  
**Storage**: PostgreSQL control-plane schema via `apps/api/prisma/schema.prisma`; tenant-domain tables remain in `tenant_<tenant_slug>`  
**Testing**: `pnpm specify.audit`, `pnpm --filter @crown/api exec vitest run tests/integration/prisma-local-seed.spec.ts`, and focused unit/integration coverage for control-plane baseline loading  
**Target Platform**: API service and local bootstrap/seed workflows in the monorepo  
**Project Type**: Monorepo web application with shared control-plane persistence and tenant-domain schemas  
**Performance Goals**: N/A for runtime throughput; the baseline lookup must remain deterministic and cheap for later onboarding reads  
**Constraints**: Must stay control-plane scoped, must not widen into tenant-create UI/API behavior, must follow constitution naming rules, must preserve the existing tenant-domain role tables as downstream consumers rather than replacing them  
**Scale/Scope**: One additive control-plane catalog plus deterministic default records and focused validation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Branch naming: PASS. `feat/CROWN-140-db-tenant-management-system-type-default-role-template-model` matches the constitution for a Story.
- Commit/PR convention: PASS. Phase and implementation commits use the required `feat: CROWN-140 - ...` format and the final PR title will need the same release-safe subject format.
- Planning gate: PASS. This work is following the required Spec Kit sequence before and through implementation.
- Persistence naming rule: PASS. New persistence entities will use singular `PascalCase` model names, plural `snake_case` table names, UUID primary keys for new records, and stable business keys for deterministic lookups.
- Scope control: PASS. The implementation is limited to control-plane persistence, migration, baseline records, and focused validation; onboarding consumption stays in follow-up stories.

Post-design re-check: PASS. The design keeps the new source-of-truth layer in `core` and leaves tenant-domain role assignment behavior in existing `tenant_<tenant_slug>` tables for later stories.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-140-tenant-management-system-type-default-role-template-model/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── management-system-type-role-template-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/api/
├── prisma/
│   ├── schema.prisma
│   ├── seed/
│   │   ├── constants.ts
│   │   ├── control-plane.ts
│   │   └── types.ts
│   └── migrations/
├── src/
│   ├── auth/
│   └── tenant/
└── tests/
    └── integration/

specs/
└── CROWN-140-tenant-management-system-type-default-role-template-model/
```

**Structure Decision**: Keep the design artifacts under the feature spec directory and implement the runtime changes only in `apps/api`, because the new source-of-truth records live in the control-plane schema and are consumed through existing API-side provisioning and seed infrastructure.

## Implementation Approach

1. Extend `apps/api/prisma/schema.prisma` with a management-system type catalog model, a related default role-template model, and the minimum enum metadata needed to mark bootstrap behavior deterministically.
2. Generate and inspect a Prisma migration that adds the new control-plane tables and constraints without altering existing tenant or auth tables.
3. Extend the local control-plane seed baseline so deterministic approved management-system types and default role templates are always present.
4. Add focused tests or harness assertions that prove the seed baseline now includes the new source-of-truth records and preserves idempotent rerun behavior.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
