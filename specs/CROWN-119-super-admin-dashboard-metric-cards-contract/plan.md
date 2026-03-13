# Implementation Plan: API Super Admin Dashboard Key Metric Cards Contract

**Branch**: `feat/CROWN-119-super-admin-dashboard-metric-cards-contract` | **Date**: 2026-03-13 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-119-super-admin-dashboard-metric-cards-contract/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-119-super-admin-dashboard-metric-cards-contract/spec.md)
**Input**: Feature specification from `/specs/CROWN-119-super-admin-dashboard-metric-cards-contract/spec.md`

## Summary

Extend the existing `GET /api/v1/platform/dashboard/overview` contract so `CROWN-98` can retrieve all first-generation super-admin metric card values from one protected endpoint. Keep the current `widgets.tenant_summary` envelope, add deterministic week/month/year new-tenant and growth-rate entries derived from `Tenant.createdAt`, document the metric definitions in repo artifacts and OpenAPI, and preserve the existing super-admin auth boundary.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20  
**Primary Dependencies**: Express 4, Zod 4, Prisma 7, Pino 9, Vitest, Supertest  
**Storage**: PostgreSQL via Prisma control-plane models, especially `Tenant` and `PlatformUser`  
**Testing**: `pnpm --filter @crown/api test`, `pnpm --filter @crown/api typecheck`, `pnpm specify.audit`  
**Target Platform**: API route `GET /api/v1/platform/dashboard/overview` in `apps/api`  
**Project Type**: Monorepo backend/API surface with a thin aligned web consumer typing layer  
**Performance Goals**: One dashboard overview request should complete from a bounded set of aggregate count queries without introducing full-record scans into application memory  
**Constraints**: Preserve the existing `widgets.tenant_summary` envelope, keep auth limited to `super_admin`, avoid schema changes, keep OpenAPI aligned, and keep scope limited to contract/service/test/documentation surfaces needed by `CROWN-119`  
**Scale/Scope**: One existing route contract extension, one aggregation service update, focused API contract/integration coverage, aligned OpenAPI docs, and matching frontend response typings for the shared overview schema

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Jira traceability and branch policy: PASS. `CROWN-119` is a Story and the active branch matches the required `feat/CROWN-<id>-<slug>` convention.
- Planning gate: PASS. `spec.md` exists before implementation work begins.
- Scope discipline: PASS. Work is limited to the existing super-admin dashboard overview contract and the directly aligned docs/tests/consumer typing needed to keep the contract consistent.
- API/OpenAPI discipline: PASS. The plan explicitly updates `apps/api/src/docs/openapi.ts` with the contract change.
- Testing discipline: PASS. The plan includes focused contract and integration coverage plus repository audit/typecheck commands.
- Persistence discipline: PASS. The implementation reuses `Tenant.createdAt` and `PlatformUser.role` without schema or migration changes.

Post-design re-check: PASS. The design preserves the current route surface and auth boundary, defines deterministic window math, and keeps the story out of unrelated dashboard UI or new route work.

## Research Notes

- Reuse the current `widgets.tenant_summary` envelope from `CROWN-116` so `CROWN-98` gets the new metrics as additive fields rather than through a second route.
- Model the week/month/year dimensions as deterministic ordered entries keyed by a shared window enum. This keeps the response explicit while avoiding ad hoc repeated property groups.
- Compute new-tenant counts from `Tenant.createdAt` using trailing windows anchored to request time: 7, 30, and 365 days.
- Compute growth rates by comparing each current trailing window to the immediately preceding equal-length trailing window.
- Normalize divide-by-zero behavior explicitly in the service and documentation: `100` when previous is `0` and current is positive, `0` when both are `0`.
- Round growth-rate values to two decimal places so API outputs remain stable for review and UI display.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-119-super-admin-dashboard-metric-cards-contract/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── dashboard-metric-cards-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/api/
├── src/
│   ├── docs/
│   │   └── openapi.ts
│   ├── platform/dashboard/
│   │   ├── contracts.ts
│   │   └── overview-service.ts
│   └── routes/
│       └── platform-dashboard-overview.ts
└── tests/
    ├── contract/
    │   └── platform-dashboard-overview.contract.spec.ts
    └── integration/
        └── platform-dashboard-overview.integration.spec.ts

apps/web/
└── lib/auth/
    └── types.ts
```

**Structure Decision**: Keep the implementation concentrated in the existing API dashboard overview contract and aggregation service. Update the manual OpenAPI source and the shared web-side overview schema so the contract is documented and consumable without widening into `apps/web` rendering changes.

## Complexity Tracking

No constitution violations are expected for `CROWN-119`.
