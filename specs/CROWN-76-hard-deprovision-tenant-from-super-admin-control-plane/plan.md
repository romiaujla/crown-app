# Implementation Plan: API Hard Deprovision Tenant From The Super-Admin Control Plane

**Branch**: `feat/CROWN-76-hard-deprovision-tenant` | **Date**: 2026-03-13 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-76-hard-deprovision-tenant-from-super-admin-control-plane/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-76-hard-deprovision-tenant-from-super-admin-control-plane/spec.md)
**Input**: Feature specification from `/specs/CROWN-76-hard-deprovision-tenant-from-super-admin-control-plane/spec.md`

## Summary

Extend the existing super-admin tenant deprovision endpoint so the request can explicitly select soft or hard deprovision through a shared `DeprovisionTypeEnum`. Hard deprovision will drop the tenant schema, remove tenant memberships and tenant schema version rows for the target tenant, retain the control-plane tenant record in an `inactive` state, and preserve global `PlatformUser` identities.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Prisma ORM 7.x, Markdown planning artifacts  
**Primary Dependencies**: Express 4, Zod 4, Prisma 7, `pg`, existing auth middleware, existing manual OpenAPI document  
**Storage**: PostgreSQL control-plane data via Prisma for `Tenant`, `PlatformUser`, `PlatformUserTenant`, and `TenantSchemaVersion`; tenant schemas managed through direct PostgreSQL DDL  
**Testing**: `pnpm --filter @crown/api test`, `pnpm --filter @crown/api typecheck`, and `pnpm specify.audit`  
**Target Platform**: Monorepo API workspace serving the super-admin control plane  
**Project Type**: Monorepo web application with an Express API and Prisma-backed control-plane data plus direct tenant-schema DDL  
**Performance Goals**: Deprovision should stay bounded to one tenant lookup, one route validation branch, and one transactional control-plane cleanup around one tenant schema drop attempt  
**Constraints**: Keep route access limited to `super_admin`; preserve the existing endpoint; default omitted `deprovisionType` to `soft`; retain the tenant record; never delete global `PlatformUser` rows in this story; update `apps/api/src/docs/openapi.ts`; remain additive to current tenant-management APIs  
**Scale/Scope**: One shared request-contract extension, one lifecycle service expansion, one route update, focused contract/integration coverage, and OpenAPI alignment

## CROWN-76 Implementation Outline

- Extend the existing deprovision request contract to accept an optional `deprovisionType` and keep soft behavior as the default.
- Introduce a reusable `DeprovisionTypeEnum` and derive the request validation from that enum to satisfy the repository enum policy.
- Expand the tenant lifecycle service from soft-only behavior to a shared deprovision entry point that dispatches to soft or hard flows.
- Implement hard deprovision with direct PostgreSQL schema-drop DDL plus Prisma-backed cleanup of tenant membership and tenant schema version records.
- Keep the control-plane tenant record and leave it in an `inactive` state after a successful hard deprovision.
- Preserve global `PlatformUser` rows and avoid widening into identity deletion workflows.
- Update the manual OpenAPI source and route tests to show the single shared endpoint and distinct soft versus hard semantics.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Branch naming: PASS. `feat/CROWN-76-hard-deprovision-tenant` matches the constitution for a Story.
- Commit/PR convention: PASS. Work on this branch should use `feat: CROWN-76 - ...` commit subjects and a squash-safe PR title.
- Planning gate: PASS. `CROWN-76` is progressing through `specify`, `plan`, and `tasks` before implementation.
- Scope discipline: PASS. The feature stays inside tenant-management backend behavior for the existing deprovision endpoint.
- API/OpenAPI discipline: PASS. The plan explicitly updates `apps/api/src/docs/openapi.ts` for the changed route contract.
- Enum discipline: PASS. The contract adds a named `DeprovisionTypeEnum` instead of duplicating inline string unions.
- Persistence discipline: PASS. No control-plane schema migration is assumed up front; the design reuses existing models and direct tenant-schema DDL patterns.
- Testing discipline: PASS. The plan includes route contract coverage, lifecycle integration coverage, API typecheck, and `pnpm specify.audit`.

Post-design re-check: PASS. The design remains additive, uses the existing route surface, preserves global identities, and limits destructive behavior to tenant-scoped schema and membership cleanup.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-76-hard-deprovision-tenant-from-super-admin-control-plane/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── tenant-hard-deprovision-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/api/
├── src/
│   ├── docs/
│   │   └── openapi.ts
│   ├── routes/
│   │   └── platform-tenants.ts
│   ├── tenant/
│   │   ├── contracts.ts
│   │   ├── lifecycle-service.ts
│   │   ├── provision-service.ts
│   │   └── types.ts
└── tests/
    ├── contract/
    │   └── platform-tenant-soft-deprovision.contract.spec.ts
    └── integration/
        └── tenant-soft-deprovision.spec.ts
```

**Structure Decision**: Keep `CROWN-76` fully inside `apps/api`. Reuse the existing platform tenant router and tenant lifecycle module rather than creating a parallel route namespace, and mirror the existing direct-`pg` tenant-schema DDL pattern already used in provisioning.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
