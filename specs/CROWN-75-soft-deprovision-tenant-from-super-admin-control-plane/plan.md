# Implementation Plan: API Soft Deprovision Tenant From The Super-Admin Control Plane

**Branch**: `feat/CROWN-75-soft-deprovision-tenant-from-super-admin-control-plane` | **Date**: 2026-03-13 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-75-soft-deprovision-tenant-from-super-admin-control-plane/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-75-soft-deprovision-tenant-from-super-admin-control-plane/spec.md)
**Input**: Feature specification from `/specs/CROWN-75-soft-deprovision-tenant-from-super-admin-control-plane/spec.md`

## Summary

Add a super-admin-only soft deprovision action to the platform tenant API so an existing tenant can be transitioned to `inactive` without deleting its schema or control-plane data. The implementation will add one control-plane route, a small tenant-lifecycle service, tenant-status-aware auth resolution that stops treating inactive tenants as active memberships, and the corresponding OpenAPI documentation and API tests.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Prisma ORM 7.x, Markdown planning artifacts  
**Primary Dependencies**: Express 4, Zod 4, Prisma 7, `@prisma/client`, existing auth middleware, existing manual OpenAPI document  
**Storage**: PostgreSQL control-plane schema via Prisma `Tenant`, `PlatformUser`, and `PlatformUserTenant` records; tenant schemas remain in PostgreSQL and are preserved  
**Testing**: `pnpm --filter @crown/api test`, `pnpm --filter @crown/api typecheck`, and `pnpm specify.audit`  
**Target Platform**: Monorepo API workspace serving the super-admin control plane and tenant-auth flows  
**Project Type**: Monorepo web application with an Express API and Prisma-backed control-plane data  
**Performance Goals**: Soft deprovision should complete with one tenant lookup and one tenant status update; auth resolution should stay bounded to one identity lookup with tenant-status-aware membership data  
**Constraints**: Keep route access limited to `super_admin`; preserve tenant schema and control-plane records; reuse existing protected-route error shape where possible; update `apps/api/src/docs/openapi.ts`; remain additive to current tenant-management APIs; do not widen into hard delete or restoration workflows  
**Scale/Scope**: One new protected action route, one small tenant lifecycle service, one tenant contract extension, targeted auth-resolution changes, focused contract/integration tests, and OpenAPI alignment

## CROWN-75 Implementation Outline

- Add a super-admin-only action route under the existing `/api/v1/platform/tenants` namespace for soft deprovisioning a tenant by ID.
- Reuse the existing `Tenant.status` field as the lifecycle source of truth and transition the tenant to `inactive` without dropping schemas or deleting records.
- Return a response that makes the non-destructive operation explicit by echoing the tenant identity and resulting inactive status.
- Introduce tenant-status-aware membership handling so inactive tenants no longer count as active tenant access contexts during login or current-user resolution.
- Preserve existing platform-only super-admin access and unrelated protected-route behavior.
- Extend the manual OpenAPI document with the new route, success schema, and error behavior.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Branch naming: PASS. `feat/CROWN-75-soft-deprovision-tenant-from-super-admin-control-plane` matches the constitution for a Story.
- Commit/PR convention: PASS. Work on this branch should use `feat: CROWN-75 - ...` commit subjects and a squash-safe PR title.
- Planning gate: PASS. `CROWN-75` is progressing through `specify`, `plan`, and `tasks` before implementation.
- Scope discipline: PASS. The feature is limited to soft deprovision behavior, tenant-access enforcement for inactive tenants, and OpenAPI alignment.
- API/OpenAPI discipline: PASS. The plan explicitly updates `apps/api/src/docs/openapi.ts` for the new route contract.
- Testing discipline: PASS. The plan includes route contract coverage, lifecycle service coverage, auth-resolution regression coverage, API typecheck, and `pnpm specify.audit`.
- Persistence/migration discipline: PASS. No schema migration is planned; the work reuses the existing `Tenant.status` enum and existing tenant metadata tables.

Post-design re-check: PASS. The design remains additive, keeps tenant data intact, and stays inside API tenant-management and auth-resolution boundaries without widening into destructive deletion or UI implementation.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-75-soft-deprovision-tenant-from-super-admin-control-plane/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── tenant-soft-deprovision-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/api/
├── src/
│   ├── app.ts
│   ├── docs/
│   │   └── openapi.ts
│   ├── routes/
│   │   └── platform-tenants.ts
│   ├── tenant/
│   │   ├── contracts.ts
│   │   ├── lifecycle-service.ts
│   │   └── types.ts
│   ├── auth/
│   │   ├── default-auth-service.ts
│   │   ├── identity.ts
│   │   └── role-resolution.ts
│   └── middleware/
│       └── authenticate.ts
└── tests/
    ├── contract/
    │   ├── auth-routes.contract.spec.ts
    │   └── platform-tenant-soft-deprovision.contract.spec.ts
    └── integration/
        ├── tenant-auth-inactive.spec.ts
        └── tenant-soft-deprovision.spec.ts
```

**Structure Decision**: Keep `CROWN-75` fully inside `apps/api`. Extend the existing platform tenant router rather than creating a separate route namespace, add a focused tenant lifecycle service for the status transition, and keep auth-resolution changes in the current auth modules so inactive-tenant enforcement remains centralized.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
