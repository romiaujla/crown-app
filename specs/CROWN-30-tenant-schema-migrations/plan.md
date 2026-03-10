# Implementation Plan: Expand Tenant Schema Migrations For Foundational TMS Entities

**Branch**: `feat/CROWN-30-tenant-schema-migrations` | **Date**: 2026-03-09 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-30-tenant-schema-migrations/spec.md)
**Input**: Feature specification from `/specs/CROWN-30-tenant-schema-migrations/spec.md`

## Summary

Implement the migration-backed tenant schema expansion that follows the approved `CROWN-29` model. The work stays foundational: expand tenant SQL migrations for TMS entities, preserve the `core` versus `tenant_<tenant_slug>` boundary, and produce a stable baseline for downstream seed and bootstrap stories.

## Technical Context

**Language/Version**: SQL migration files for tenant schemas, TypeScript 5.x on Node.js 20 for repository tooling and integration validation  
**Primary Dependencies**: PostgreSQL, existing tenant SQL migration framework, Prisma 5 for adjacent control-plane tooling, Spec Kit artifacts from `CROWN-29` and this story  
**Storage**: PostgreSQL with platform-wide shared tables in `core` and tenant-domain tables in `tenant_<tenant_slug>` schemas  
**Testing**: `pnpm specify.audit`, targeted tenant migration integration tests, and migration review against `CROWN-29` outputs  
**Target Platform**: Monorepo API service (`apps/api`) with local/dev GitHub workflow execution paths  
**Project Type**: Monorepo web application with API and tenant-schema migration assets  
**Performance Goals**: N/A for runtime behavior; migration outputs must be stable, reviewable, and ready for deterministic seed/bootstrap follow-on work  
**Constraints**: Must follow `CROWN-29` as source of truth, must keep tenant-domain tables out of `core`, must remain foundational, must not absorb capability-specific APIs, must preserve tenant-owned reference data boundaries  
**Scale/Scope**: One foundational migration expansion for the approved TMS entity set that downstream `CROWN-31` through `CROWN-34` can consume directly

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Branch naming: PASS. `feat/CROWN-30-tenant-schema-migrations` matches the constitution for a Story.
- Commit/PR convention: PASS. Later implementation should use `feat: CROWN-30 - ...` and squash-safe PR titles.
- Planning gate: PASS. `CROWN-30` is being handled through Spec Kit artifacts before implementation.
- Persistence naming rule: PASS. The plan uses singular `PascalCase` model concepts and plural `snake_case` SQL tables, while preserving `core` for shared tables and `tenant_<tenant_slug>` for tenant-domain tables.
- Scope control: PASS. The story is limited to foundational migration expansion and downstream seed/bootstrap readiness, not later capability APIs.

Post-design re-check: PASS. The generated artifacts stay within foundational migration design and do not introduce constitutional violations.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-30-tenant-schema-migrations/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── tenant-migration-handoff-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/api/
├── prisma/
│   └── schema.prisma
├── tenant-migrations/
│   └── 0001_base/
└── tests/

docs/
└── architecture/

specs/
├── CROWN-29-tenant-domain-model/
└── CROWN-30-tenant-schema-migrations/
```

**Structure Decision**: The feature is migration-focused and internal, so the primary design outputs live under `specs/CROWN-30-tenant-schema-migrations/`. The later implementation touchpoints are `apps/api/tenant-migrations/` for tenant SQL migration files, `apps/api/tests/` for migration validation, and `specs/CROWN-29-tenant-domain-model/` as the upstream model source of truth.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
