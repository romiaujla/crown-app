# Implementation Plan: Tenant Directory Table With Search And Status Filter

**Branch**: `feat/CROWN-95-tenant-directory-table-search-status-filter` | **Date**: 2026-03-14 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-95-tenant-directory-table-search-status-filter/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-95-tenant-directory-table-search-status-filter/spec.md)
**Input**: Feature specification from `/specs/CROWN-95-tenant-directory-table-search-status-filter/spec.md`

## Summary

Replace the current `Tenants` placeholder in the super-admin control plane with a dedicated tenant-directory route hierarchy under `/platform`. The implementation will consume the existing tenant-directory API contract from `CROWN-126`, render a searchable and status-filterable tenant table, and add stable route entry points for tenant details, tenant creation, and tenant editing without implementing those follow-up workflows.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20  
**Primary Dependencies**: Next.js 14 App Router, React 18, Tailwind CSS, `lucide-react`, `@crown/types`, existing auth provider and protected-shell utilities  
**Storage**: No new persistence; reuse the existing platform tenant-directory API and browser session auth state  
**Testing**: `pnpm --filter @crown/web typecheck`, focused Playwright coverage in `apps/web/tests/auth-flow.spec.ts`, and `pnpm specify.audit`  
**Target Platform**: Web application in desktop and tablet browsers for super-admin users  
**Project Type**: Monorepo web frontend (`apps/web`) backed by an existing API contract  
**Performance Goals**: Directory interactions should stay responsive, avoid duplicate fetches for the same filter state, and keep placeholder entry-point routes lightweight  
**Constraints**: Stay within `apps/web`; preserve the existing protected platform shell; use explicit `TenantStatusEnum` values from shared contracts; keep tenant detail/add/edit destinations as entry points only; do not change API routes or OpenAPI; keep tenant-management paths under the existing `/platform` access boundary  
**Scale/Scope**: One route-hierarchy refactor, one tenant-directory page implementation, one shared web API helper for tenant search, stable placeholder entry-point pages, and focused browser validation

## CROWN-95 Implementation Outline

- Replace the current query-param-based `Tenants` destination with dedicated App Router paths under `/platform`.
- Keep the existing dashboard route at `/platform` and route `Tenants` to `/platform/tenants`.
- Add routeable tenant-management entry points for details, creation, and editing beneath the platform shell.
- Introduce a focused tenant-directory page component that loads data from `POST /api/v1/platform/tenants/search`.
- Reuse the shared `TenantDirectoryListRequest`, `TenantDirectoryListResponse`, and `TenantStatusEnum` contracts from `@crown/types`.
- Provide tenant-name search plus a single-select status filter with explicit enum-backed options.
- Render stable loading, empty, and failure states for the directory page.
- Keep add/detail/edit pages intentionally lightweight and clearly marked as follow-up workflow entry points.
- Extend Playwright coverage to validate dedicated routing, directory filtering, and entry-point navigation.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Jira traceability and branch policy: PASS. `CROWN-95` is a Story and the branch matches `feat/CROWN-95-<slug>`.
- Planning gate: PASS. `spec.md` exists and is committed before implementation planning advances.
- Scope discipline: PASS. The plan stays limited to web routing, directory presentation, and action entry points without widening into the full detail/create/edit workflows.
- Shared contract discipline: PASS. The plan reuses `@crown/types` for `TenantStatusEnum` and tenant-directory request/response shapes instead of duplicating contracts in `apps/web`.
- API/OpenAPI discipline: PASS. No API route or contract changes are planned, so `apps/api/src/docs/openapi.ts` remains untouched in this story.
- Testing discipline: PASS. The plan includes focused browser assertions, web typecheck, and `pnpm specify.audit`.
- Auth/RBAC discipline: PASS. The plan keeps all new routes under the existing `/platform` protected-shell boundary instead of introducing a parallel authorization path.

Post-design re-check: PASS. The design remains within `apps/web`, reuses shipped shared contracts from `CROWN-126`, and keeps the new route hierarchy scoped to directory UX plus stable follow-up entry points.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-95-tenant-directory-table-search-status-filter/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── tenant-directory-ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/
├── app/
│   └── platform/
│       ├── page.tsx
│       └── tenants/
│           ├── page.tsx
│           ├── new/
│           │   └── page.tsx
│           └── [tenantId]/
│               ├── page.tsx
│               └── edit/
│                   └── page.tsx
├── components/
│   ├── auth/
│   │   └── workspace-shell.tsx
│   └── platform/
│       └── tenant-directory-page.tsx
├── lib/
│   └── auth/
│       └── api.ts
└── tests/
    └── auth-flow.spec.ts
```

**Structure Decision**: Keep `CROWN-95` inside `apps/web`. Reuse the existing `WorkspaceShell` for navigation and shell framing, add a focused tenant-directory page component under `components/platform`, extend `apps/web/lib/auth/api.ts` with a tenant-directory fetch helper, and add dedicated nested platform routes for the directory and its placeholder follow-up destinations.

## Complexity Tracking

No constitutional violations are currently expected.
