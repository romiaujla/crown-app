# Implementation Plan: API Tenant Slug Availability Lookup Endpoint

**Branch**: `feat/CROWN-137-api-tenant-slug-availability-lookup-endpoint` | **Date**: 2026-03-15 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/specs/CROWN-137-api-tenant-slug-availability-lookup-endpoint/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/92d2/crown-app/specs/CROWN-137-api-tenant-slug-availability-lookup-endpoint/spec.md)
**Input**: Feature specification from `/specs/CROWN-137-api-tenant-slug-availability-lookup-endpoint/spec.md`

## Summary

Add a protected tenant-slug availability lookup endpoint for the super-admin tenant-create flow. The implementation will extend the existing platform tenant router with one read-only lookup route, add a focused Prisma-backed slug-availability service, define the shared request and response schemas once in `@crown/types`, align lookup validation with the existing tenant provisioning slug rules, document the route in the manual OpenAPI source, and add focused contract and integration coverage for available, unavailable, invalid, and repeated lookup behavior.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Prisma ORM 7.x, Markdown planning artifacts  
**Primary Dependencies**: Express 4, Zod 4, Prisma 7, `@crown/types`, existing auth/RBAC middleware, manual OpenAPI document  
**Storage**: PostgreSQL control-plane tenant metadata via Prisma `Tenant`; no schema changes required  
**Testing**: `pnpm --filter @crown/api test`, focused Vitest contract/integration runs, `pnpm --filter @crown/api typecheck`, and `pnpm specify.audit`  
**Target Platform**: Monorepo API workspace serving the super-admin control plane  
**Project Type**: Monorepo web application with an Express API, shared type package, and Prisma-backed control-plane data  
**Performance Goals**: One normalized slug check should resolve through a single indexed tenant lookup and support repeated debounced UI requests without using mutation-oriented throttling  
**Constraints**: Keep route access limited to `super_admin`; stay read-only; reuse provisioning-consistent slug normalization/validation; define shared API/web contracts once in `@crown/types`; update `apps/api/src/docs/openapi.ts`; do not widen into tenant creation, slug reservation, or create-form UI behavior  
**Scale/Scope**: One protected read route, one small lookup service, shared contract additions, focused contract/integration coverage, and OpenAPI alignment

## CROWN-137 Implementation Outline

- Add a protected `POST /api/v1/platform/tenant/slug-availability` route under the existing platform tenant router.
- Accept one candidate slug in the request body and normalize/validate it consistently with the tenant provisioning path before lookup.
- Query persisted tenant metadata by normalized slug and return a compact shared response such as `data.slug` and `data.isAvailable`.
- Treat any retained tenant record, regardless of lifecycle status, as making the slug unavailable.
- Reuse the existing read-oriented platform lookup rate-limit pattern instead of the stricter tenant-mutation limit.
- Centralize the slug-availability request and response schemas and inferred types in `@crown/types` for later web reuse.
- Update the manual OpenAPI document and docs-route coverage for the new route.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Branch naming: PASS. `feat/CROWN-137-api-tenant-slug-availability-lookup-endpoint` matches the constitution for a Story.
- Commit/PR convention: PASS. Work on this branch should use `feat: CROWN-137 - ...` commit subjects and a squash-safe PR title.
- Planning gate: PASS. `CROWN-137` is progressing through `specify`, `plan`, and `tasks` before implementation.
- Shared contract discipline: PASS. The plan centralizes shared API/web schemas in `@crown/types` instead of duplicating route-local contracts.
- API/OpenAPI discipline: PASS. The plan explicitly updates `apps/api/src/docs/openapi.ts` for the added route surface.
- Rate-limit discipline: PASS. The design keeps this protected endpoint on a read-oriented lookup profile instead of mutation limits.
- Testing discipline: PASS. The plan includes route contract coverage, service/integration coverage, API typecheck, and `pnpm specify.audit`.
- Scope discipline: PASS. The plan stays limited to slug lookup behavior and excludes tenant creation, slug reservation, or broader create-form work.

Post-design re-check: PASS. The design uses the existing platform auth boundary, keeps the contract shared and documented, and aligns lookup semantics with the current provisioning path without widening into mutation logic.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-137-api-tenant-slug-availability-lookup-endpoint/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── tenant-slug-availability-contract.md
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
│   │       └── slug-availability-service.ts
│   ├── routes/
│   │   └── platform-tenants.ts
│   └── tenant/
│       ├── contracts.ts
│       └── slug.ts
└── tests/
    ├── contract/
    │   ├── api-docs.contract.spec.ts
    │   └── platform-tenant-slug-availability.contract.spec.ts
    └── integration/
        ├── api-docs.spec.ts
        └── platform-tenant-slug-availability.integration.spec.ts

packages/types/
└── src/
    └── index.ts
```

**Structure Decision**: Keep `CROWN-137` primarily inside `apps/api` and `packages/types`. Extend the existing platform tenant router with one lookup route, place the normalized Prisma check in a focused platform tenant service, and centralize the shared request and response contract in `@crown/types` so the later web tenant-create flow can consume the same schema.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
