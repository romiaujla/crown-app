# Implementation Plan: Tenant Provisioning and Schema Bootstrap

**Branch**: `005-crown-5` | **Date**: 2026-03-03 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/005-crown-5/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/005-crown-5/spec.md)
**Input**: Feature specification from `/specs/005-crown-5/spec.md`

## Summary

Implement a platform-scoped provisioning flow for `CROWN-5` that validates tenant input, creates `tenant_<slug>` schemas, runs baseline tenant SQL migrations, and records applied schema versions in global metadata tables. The approach reuses existing auth/RBAC contracts and tenant migration strategy while adding deterministic conflict/failure semantics and idempotent-safe retry behavior for the management-system tenant baseline.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20 (repo baseline)  
**Primary Dependencies**: Express 4, Zod 3, Prisma 5, pg 8, Pino 9  
**Storage**: PostgreSQL via Prisma for global metadata plus direct SQL execution for tenant schema DDL/migrations  
**Testing**: Vitest + Supertest + Testcontainers (API contract/integration coverage)  
**Target Platform**: Linux server runtime for `@crown/api`  
**Project Type**: Monorepo web application (API + web) with API-focused feature scope  
**Performance Goals**: Tenant provisioning p95 under 5s for baseline migration set in local integration environment; deterministic error mapping for 100% failure classes  
**Constraints**: Super-admin only access, strict slug/schema validation, no partial side effects on validation/auth failures, additive scope limited to `CROWN-5` provisioning concerns  
**Scale/Scope**: MVP baseline provisioning for single-database multi-tenant model, one schema per tenant, 4 baseline tenant migration files

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Reference constitution: `docs/process/engineering-constitution.md` (canonical; `.specify/memory/constitution.md` is placeholder/uninitialized).

Pre-Phase-0 gate:

- Branch/commit policy: PASS for planning artifacts on existing Jira-linked working branch (`feat/CROWN-5-tenant-provisioning-and-schema-bootstrap`); implementation commits remain subject to mandatory commit hook format.
- Jira traceability and scope: PASS; spec and plan map directly to Jira Story `CROWN-5` and backlog map entry.
- Coding standards: PASS; plan enforces TypeScript strict mode, Zod input validation, and test additions for behavior changes.
- Planning gate for major features: PASS; `/specify` and `/plan` artifacts being produced before implementation tasks.
- PR/release constraints: PASS; plan keeps scope constrained to tenant provisioning and schema bootstrap only.

Post-Phase-1 gate re-check:

- PASS; generated research, data model, contracts, and quickstart artifacts remain within constitution constraints and contain no unapproved policy exceptions.

## Project Structure

### Documentation (this feature)

```text
specs/005-crown-5/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── tenant-provisioning.openapi.yaml
│   └── tenant-migration-runner-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/
├── api/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── app.ts
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── tenant/
│   │       └── migrator.ts
│   ├── tenant-migrations/
│   │   └── 0001_base/
│   └── tests/
│       ├── contract/
│       └── integration/
└── web/

packages/
├── config/
├── types/
└── ui/
```

**Structure Decision**: Implement CROWN-5 in the existing `apps/api` service, keeping global metadata in Prisma-managed `public` schema and tenant bootstrap logic in `apps/api/src/tenant` plus `apps/api/tenant-migrations` SQL assets.

## Complexity Tracking

No constitution violations requiring exception rationale.
