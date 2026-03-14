# Implementation Plan: API Tenant Directory List Endpoint For Super Admins

**Branch**: `feat/CROWN-126-tenant-directory-list-endpoint` | **Date**: 2026-03-13 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-126-tenant-directory-list-endpoint/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-126-tenant-directory-list-endpoint/spec.md)
**Input**: Feature specification from `/specs/CROWN-126-tenant-directory-list-endpoint/spec.md`

## Summary

Add a super-admin-only tenant directory search endpoint that returns persisted tenant records for the control plane in the agreed `{ data, meta }` envelope. The implementation will add one collection-search route, one focused directory service, shared contract types in `@crown/types`, contract and integration coverage, and OpenAPI documentation for the list response plus body-based `filters.name` and `filters.status`.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Prisma ORM 7.x, Markdown planning artifacts  
**Primary Dependencies**: Express 4, Zod 4, Prisma 7, `@prisma/client`, existing auth middleware, `@crown/types`, existing manual OpenAPI document  
**Storage**: PostgreSQL control-plane data via Prisma `Tenant` records; no tenant-schema DDL changes required  
**Testing**: `pnpm --filter @crown/api test`, `pnpm --filter @crown/api typecheck`, and `pnpm specify.audit`  
**Target Platform**: Monorepo API workspace serving the super-admin control plane  
**Project Type**: Monorepo web application with an Express API, shared type package, and Prisma-backed control-plane data  
**Performance Goals**: The directory request should stay bounded to one filtered `Tenant` query plus one count aligned with the filtered result set; no pagination is added in this story  
**Constraints**: Keep route access limited to `super_admin`; use persisted tenant statuses as the source of truth; preserve the agreed camelCase response contract; define shared API/web contracts once in `@crown/types`; update `apps/api/src/docs/openapi.ts`; do not widen into tenant detail, tenant update, nested `userList`, or pagination  
**Scale/Scope**: One protected collection route, one tenant directory service, shared contract additions, focused contract/integration tests, and OpenAPI alignment

## CROWN-126 Implementation Outline

- Add a protected `POST /api/v1/platform/tenants/search` route for tenant directory reads.
- Validate the request body `filters.name` and `filters.status` before executing business logic.
- Query persisted `Tenant` records through Prisma and map them to the agreed camelCase API response.
- Return the collection in `{ data: { tenantList }, meta }` with `meta.totalRecords` and echoed filters.
- Reuse the shared tenant status enum as the source of truth for status filtering and response values.
- Define the shared request/response schemas and inferred types once in `@crown/types` so the web client can consume the same contract.
- Update the manual OpenAPI document and docs-route tests for the new search-style collection route.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Branch naming: PASS. `feat/CROWN-126-tenant-directory-list-endpoint` matches the constitution for a Story.
- Commit/PR convention: PASS. Work on this branch should use `feat: CROWN-126 - ...` commit subjects and a squash-safe PR title.
- Planning gate: PASS. `CROWN-126` is progressing through `specify`, `plan`, and `tasks` before implementation.
- Shared contract discipline: PASS. The plan centralizes shared API/web schemas in `@crown/types` instead of duplicating them locally.
- API/OpenAPI discipline: PASS. The plan explicitly updates `apps/api/src/docs/openapi.ts` for the new route contract.
- Enum discipline: PASS. The design reuses the shared tenant status enum instead of introducing inline status literals.
- Testing discipline: PASS. The plan includes route contract coverage, service/integration coverage, API typecheck, and `pnpm specify.audit`.
- Scope discipline: PASS. The feature remains limited to tenant directory listing and does not widen into create/detail/update or nested related collections.

Post-design re-check: PASS. The design keeps the response envelope consistent with the agreed standard, preserves platform auth behavior, and stays inside the tenant directory scope.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-126-tenant-directory-list-endpoint/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── tenant-directory-list-contract.md
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
│   │       └── directory-service.ts
│   └── routes/
│       └── platform-tenants.ts
└── tests/
    ├── contract/
    │   ├── api-docs.contract.spec.ts
    │   └── platform-tenant-directory.contract.spec.ts
    └── integration/
        └── platform-tenant-directory.integration.spec.ts

packages/types/
└── src/
    └── index.ts
```

**Structure Decision**: Keep `CROWN-126` primarily inside `apps/api` and `packages/types`. Extend the existing platform tenant router with a collection read route, place the list-query logic in a focused platform tenant directory service, and centralize shared contract shapes in `@crown/types`.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
