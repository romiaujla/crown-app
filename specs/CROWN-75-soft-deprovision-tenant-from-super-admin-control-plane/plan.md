# Implementation Plan: API Soft Deprovision Tenant From The Super-Admin Control Plane

**Branch**: `feat/CROWN-75-soft-deprovision-tenant-from-super-admin-control-plane` | **Date**: 2026-03-13 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-75-soft-deprovision-tenant-from-super-admin-control-plane/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-75-soft-deprovision-tenant-from-super-admin-control-plane/spec.md)
**Input**: Feature specification from `/specs/CROWN-75-soft-deprovision-tenant-from-super-admin-control-plane/spec.md`

## Summary

Add a super-admin-only soft deprovision action to the platform tenant API so an existing tenant can be transitioned to `inactive` without deleting its schema or control-plane data. The implementation will add one control-plane route, a small tenant-lifecycle service, and the corresponding OpenAPI documentation and API tests while explicitly leaving forced logout and token invalidation to a follow-up scope.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Prisma ORM 7.x, Markdown planning artifacts  
**Primary Dependencies**: Express 4, Zod 4, Prisma 7, `@prisma/client`, existing auth middleware, existing manual OpenAPI document  
**Storage**: PostgreSQL control-plane schema via Prisma `Tenant`, `PlatformUser`, and `PlatformUserTenant` records; tenant schemas remain in PostgreSQL and are preserved  
**Testing**: `pnpm --filter @crown/api test`, `pnpm --filter @crown/api typecheck`, and `pnpm specify.audit`  
**Target Platform**: Monorepo API workspace serving the super-admin control plane  
**Project Type**: Monorepo web application with an Express API and Prisma-backed control-plane data  
**Performance Goals**: Soft deprovision should complete with one tenant lookup and one tenant status update; auth resolution should stay bounded to one identity lookup with tenant-status-aware membership data  
**Constraints**: Keep route access limited to `super_admin`; preserve tenant schema and control-plane records; reuse existing protected-route error shape where possible; update `apps/api/src/docs/openapi.ts`; remain additive to current tenant-management APIs; do not widen into hard delete, restoration workflows, forced logout, or token invalidation  
**Scale/Scope**: One new protected action route, one small tenant lifecycle service, one tenant contract extension, focused contract/integration tests, and OpenAPI alignment

## CROWN-75 Implementation Outline

- Add a super-admin-only action route under the existing `/api/v1/platform/tenant` namespace for soft deprovisioning a tenant by ID.
- Reuse the existing `Tenant.status` field as the lifecycle source of truth and transition the tenant to `inactive` without dropping schemas or deleting records.
- Return a response that makes the non-destructive operation explicit by echoing the tenant identity and resulting inactive status.
- Preserve existing platform-only super-admin access and unrelated protected-route behavior.
- Leave tenant session invalidation and forced logout behavior out of scope for this story.
- Extend the manual OpenAPI document with the new route, success schema, and error behavior.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Branch naming: PASS. `feat/CROWN-75-soft-deprovision-tenant-from-super-admin-control-plane` matches the constitution for a Story.
- Commit/PR convention: PASS. Work on this branch should use `feat: CROWN-75 - ...` commit subjects and a squash-safe PR title.
- Planning gate: PASS. `CROWN-75` is progressing through `specify`, `plan`, and `tasks` before implementation.
- Scope discipline: PASS. The feature is limited to soft deprovision behavior, non-destructive contract semantics, and OpenAPI alignment.
- API/OpenAPI discipline: PASS. The plan explicitly updates `apps/api/src/docs/openapi.ts` for the new route contract.
- Testing discipline: PASS. The plan includes route contract coverage, lifecycle service coverage, API typecheck, and `pnpm specify.audit`.
- Persistence/migration discipline: PASS. No schema migration is planned; the work reuses the existing `Tenant.status` enum and existing tenant metadata tables.

Post-design re-check: PASS. The design remains additive, keeps tenant data intact, and stays inside API tenant-management boundaries without widening into destructive deletion, session invalidation, or UI implementation.

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
└── tests/
    ├── contract/
    │   └── platform-tenant-soft-deprovision.contract.spec.ts
    └── integration/
        └── tenant-soft-deprovision.spec.ts
```

**Structure Decision**: Keep `CROWN-75` fully inside `apps/api`. Extend the existing platform tenant router rather than creating a separate route namespace, and add a focused tenant lifecycle service for the status transition while leaving auth/session behavior untouched in this story.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
