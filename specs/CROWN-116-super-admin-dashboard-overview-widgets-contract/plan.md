# Implementation Plan: API Super-Admin Dashboard Overview Widgets Contract

**Branch**: `feat/CROWN-116-super-admin-dashboard-overview-widgets-contract` | **Date**: 2026-03-13 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-116-super-admin-dashboard-overview-widgets-contract/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-116-super-admin-dashboard-overview-widgets-contract/spec.md)
**Input**: Feature specification from `/specs/CROWN-116-super-admin-dashboard-overview-widgets-contract/spec.md`

## Summary

Add a super-admin-only dashboard overview endpoint in `apps/api` that returns an extensible widgets envelope for `CROWN-93`. The initial widget contract will provide total tenant count plus deterministic per-status tenant counts for every current `TenantStatus`, and the manual OpenAPI document will be updated to describe the route and response shape.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Prisma ORM 7.x, Markdown planning artifacts  
**Primary Dependencies**: Express 4, Zod 4, Prisma 7, `@prisma/client`, existing auth middleware, existing manual OpenAPI document  
**Storage**: PostgreSQL control-plane schema via Prisma `Tenant` records  
**Testing**: `pnpm --filter @crown/api test`, `pnpm --filter @crown/api typecheck`, and `pnpm specify.audit`  
**Target Platform**: Monorepo API workspace serving the super-admin web dashboard  
**Project Type**: Monorepo web application with an Express API and Prisma-backed control-plane data  
**Performance Goals**: Single request should resolve the overview widget payload with one total-count query plus one grouped status-count query and no per-status round trips  
**Constraints**: Keep route access limited to `super_admin`; stay scoped to initial overview widgets only; preserve existing error contracts; update `apps/api/src/docs/openapi.ts` alongside the route; do not widen into recent-activity or unrelated platform APIs  
**Scale/Scope**: One new protected `GET` route, one small aggregation service, one response-contract module, focused contract/integration tests, and OpenAPI alignment

## CROWN-116 Implementation Outline

- Add `GET /api/v1/platform/dashboard/overview` as the API surface for the super-admin dashboard overview widgets.
- Return the payload inside a top-level `widgets` object so later widgets can be added as sibling keys.
- Define the first widget as `tenant_summary`, with `total_tenant_count` plus `tenant_status_counts`.
- Populate `tenant_status_counts` for every current `TenantStatus` value, including explicit zeroes for statuses absent from current data.
- Reuse existing authentication and authorization middleware so only `super_admin` can access the route.
- Extend `apps/api/src/docs/openapi.ts` with the new route, schemas, and tag metadata.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Branch naming: PASS. `feat/CROWN-116-super-admin-dashboard-overview-widgets-contract` matches the constitution for a Story.
- Commit/PR convention: PASS. Work on this branch should use `feat: CROWN-116 - ...` commit subjects and a squash-safe PR title.
- Planning gate: PASS. `CROWN-116` is progressing through `specify`, `plan`, and `tasks` before implementation.
- Scope discipline: PASS. The feature is limited to the dashboard overview contract, supporting endpoint behavior, and OpenAPI alignment.
- API/OpenAPI discipline: PASS. The plan explicitly updates `apps/api/src/docs/openapi.ts` for the new route contract.
- Testing discipline: PASS. The plan includes focused API contract coverage, a data-backed aggregation check, API typecheck, and `pnpm specify.audit`.
- Persistence/migration discipline: PASS. No schema change is planned; existing `Tenant` and `TenantStatus` data are reused read-only.

Post-design re-check: PASS. The design remains inside the API workspace, preserves existing platform auth behavior, and avoids widening into dashboard UI implementation or unrelated platform endpoints.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-116-super-admin-dashboard-overview-widgets-contract/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── dashboard-overview-widgets-contract.md
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
│   │   └── platform-dashboard-overview.ts
│   ├── platform/
│   │   └── dashboard/
│   │       ├── contracts.ts
│   │       └── overview-service.ts
│   └── domain/
│       └── status-enums.ts
└── tests/
    ├── contract/
    │   └── platform-dashboard-overview.contract.spec.ts
    └── integration/
        └── platform-dashboard-overview.integration.spec.ts
```

**Structure Decision**: Keep `CROWN-116` fully inside `apps/api`. Introduce a small `platform/dashboard` module for the response contract and aggregation logic, a dedicated route file for the protected endpoint, and focused API tests. The web dashboard remains a downstream consumer and is not changed in this story.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
