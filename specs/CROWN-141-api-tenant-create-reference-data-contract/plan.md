# Implementation Plan: API Tenant Create Reference-Data Contract For Management-System Types And Default Roles

**Branch**: `feat/CROWN-141-api-tenant-create-reference-data-contract` | **Date**: 2026-03-15 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-141-api-tenant-create-reference-data-contract/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-141-api-tenant-create-reference-data-contract/spec.md)
**Input**: Feature specification from `/specs/CROWN-141-api-tenant-create-reference-data-contract/spec.md`

## Summary

Add a protected tenant-create reference-data endpoint that returns supported management-system types plus their role options for the super-admin onboarding flow. The implementation will extend the existing platform tenant router with one read-only route, add a focused Prisma-backed reference-data service, define the shared request/response schemas once in `@crown/types`, document the route in the manual OpenAPI source, and add contract plus integration coverage for the returned management-system type and role metadata.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Prisma ORM 7.x, Markdown planning artifacts  
**Primary Dependencies**: Express 4, Zod 4, Prisma 7, `@crown/types`, existing auth/RBAC middleware, manual OpenAPI document  
**Storage**: PostgreSQL control-plane data via Prisma `ManagementSystemType`, `Role`, and `ManagementSystemTypeRole` records; no schema changes required  
**Testing**: `pnpm --filter @crown/api test`, focused Vitest contract/integration runs, `pnpm --filter @crown/api typecheck`, and `pnpm specify.audit`  
**Target Platform**: Monorepo API workspace serving the super-admin control plane  
**Project Type**: Monorepo web application with an Express API, shared type package, and Prisma-backed control-plane catalog data  
**Performance Goals**: The route should stay bounded to one catalog query with nested role membership and deterministic ordering suitable for UI bootstrap/reference-data reads  
**Constraints**: Keep route access limited to `super_admin`; expose only read-only tenant-create reference data; define shared API/web contracts once in `@crown/types`; source display labels from persisted records; mark `tenant_admin` as the required admin option; update `apps/api/src/docs/openapi.ts`; do not widen into tenant provisioning submission or role persistence  
**Scale/Scope**: One protected read route, one reference-data service, shared contract additions, focused contract/integration coverage, and OpenAPI alignment

## CROWN-141 Implementation Outline

- Add a protected `POST /api/v1/platform/tenant/reference-data` route for tenant-create onboarding metadata, with an optional body filter for one management-system type.
- Query active management-system types from Prisma, including their role membership and shared role details.
- Map the persisted catalog into a shared response envelope such as `data.managementSystemTypeList`.
- Return role options with display metadata plus `isDefault` and derived `isRequired` semantics.
- Treat the shared role code `tenant_admin` as the required admin role while preserving the persisted display label `Admin`.
- Centralize the request/response schemas and inferred types in `@crown/types` for later web reuse.
- Update the manual OpenAPI document and docs-route coverage for the new endpoint.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Branch naming: PASS. `feat/CROWN-141-api-tenant-create-reference-data-contract` matches the constitution for a Story.
- Commit/PR convention: PASS. Work on this branch should use `feat: CROWN-141 - ...` commit subjects and a squash-safe PR title.
- Planning gate: PASS. `CROWN-141` is progressing through `specify`, `plan`, and `tasks` before implementation.
- Shared contract discipline: PASS. The plan centralizes shared API/web schemas in `@crown/types` instead of duplicating route-local contracts.
- API/OpenAPI discipline: PASS. The plan explicitly updates `apps/api/src/docs/openapi.ts` for the added route surface.
- Enum/value-set discipline: PASS. Existing shared enums remain the source of truth where available; any new finite route values will be defined once in `@crown/types`.
- Testing discipline: PASS. The plan includes route contract coverage, service/integration coverage, API typecheck, and `pnpm specify.audit`.
- Scope discipline: PASS. The plan stays limited to read-only tenant-create reference-data behavior and excludes tenant provisioning submission or persistence-side changes.

Post-design re-check: PASS. The design uses the existing platform auth boundary, keeps the response contract shared and documented, and derives required admin-role semantics without widening the route into provisioning logic.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-141-api-tenant-create-reference-data-contract/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── tenant-create-reference-data-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/api/
├── src/
│   ├── docs/
│   │   └── openapi.ts
│   ├── platform/
│   │   └── tenants/
│   │       └── reference-data-service.ts
│   └── routes/
│       └── platform-tenants.ts
└── tests/
    ├── contract/
    │   ├── api-docs.contract.spec.ts
    │   └── platform-tenant-create-reference-data.contract.spec.ts
    └── integration/
        ├── api-docs.spec.ts
        └── platform-tenant-create-reference-data.integration.spec.ts

packages/types/
└── src/
    └── index.ts
```

**Structure Decision**: Keep `CROWN-141` primarily inside `apps/api` and `packages/types`. Extend the existing platform tenant router with one reference-data route, place the Prisma query and response mapping in a focused platform tenant service, and centralize the shared contract shapes in `@crown/types` so the later web tenant-create flow can consume the same schema.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
