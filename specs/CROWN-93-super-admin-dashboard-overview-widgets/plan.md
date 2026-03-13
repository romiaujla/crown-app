# Implementation Plan: Super-Admin Dashboard Overview Widgets

**Branch**: `feat/CROWN-93-ui-super-admin-dashboard-overview-widgets` | **Date**: 2026-03-13 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-93-super-admin-dashboard-overview-widgets/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-93-super-admin-dashboard-overview-widgets/spec.md)
**Input**: Feature specification from `/specs/CROWN-93-super-admin-dashboard-overview-widgets/spec.md`

## Summary

Replace the static super-admin dashboard placeholder cards in `apps/web` with a live tenant-summary overview widget that consumes the existing platform overview API from `CROWN-116`. The dashboard will show the total tenant count and per-status tenant counts, preserve a purposeful loading and error experience, and keep the overview area structured for future widget expansion without widening into activity feeds or unrelated platform workflows.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Next.js 14 App Router, React 18, Markdown planning artifacts  
**Primary Dependencies**: Next.js client components, existing auth API helpers, Zod 4, Playwright, Tailwind CSS, Lucide icons  
**Storage**: No new persistence; reads existing dashboard overview data from the API at `GET /api/v1/platform/dashboard/overview`  
**Testing**: `pnpm --filter @crown/web test`, `pnpm --filter @crown/web typecheck`, and `pnpm specify.audit`  
**Target Platform**: `apps/web` super-admin dashboard at `/platform`  
**Project Type**: Monorepo web application with a Next.js frontend and existing Express API backend  
**Performance Goals**: One dashboard overview request per dashboard load with no redundant polling and no blocking of the surrounding shell rendering  
**Constraints**: Stay scoped to the initial dashboard overview widgets only; do not add recent-activity or tenant-change widgets; preserve existing super-admin routing and auth behavior; keep the layout extensible for future widgets  
**Scale/Scope**: One dashboard page update, one small client-side overview API module plus schemas, and focused Playwright coverage for success, loading/error, and scope boundaries

## CROWN-93 Implementation Outline

- Add a web-side dashboard overview contract and fetch helper that calls the existing platform overview route with the current session bearer token.
- Replace the static placeholder dashboard cards in `/platform` with one live tenant-summary widget area.
- Surface the total tenant count prominently and render the returned status buckets as explicit, readable count chips or cards.
- Provide an intentional loading state while overview data is being fetched.
- Provide a contained error state when the overview request fails so the platform shell remains usable.
- Keep the dashboard area structured so future widgets can be added alongside the tenant-summary section without redesigning the page.
- Extend Playwright coverage to pin the live widget behavior and the no-activity-feed scope boundary.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Branch naming: PASS. `feat/CROWN-93-ui-super-admin-dashboard-overview-widgets` matches the constitution for a Story.
- Commit/PR convention: PASS. Work on this branch should use `feat: CROWN-93 - ...` commit subjects and a squash-safe PR title.
- Planning gate: PASS. `CROWN-93` is progressing through `specify`, `plan`, and `tasks` before implementation.
- Scope discipline: PASS. The plan is limited to the platform dashboard UI consumer of the existing overview contract and does not reopen API or unrelated shell work.
- API/OpenAPI discipline: PASS. No API contract change is planned on this branch, so no OpenAPI update is required unless implementation reveals contract drift.
- Testing discipline: PASS. The plan includes targeted browser coverage, web typecheck, and `pnpm specify.audit`.
- Persistence/migration discipline: PASS. No schema or migration work is included.

Post-design re-check: PASS. The design remains contained to `apps/web`, consumes the existing API contract, preserves the protected-shell boundary, and stays out of recent-activity or additional widget scope.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-93-super-admin-dashboard-overview-widgets/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/
├── app/
│   └── platform/
│       └── page.tsx
├── lib/
│   └── auth/
│       ├── api.ts
│       └── types.ts
└── tests/
    └── auth-flow.spec.ts
```

**Structure Decision**: Keep `CROWN-93` inside `apps/web`. Extend the existing auth API client/types area with a narrow dashboard overview fetch contract, update the platform page to render the live overview widget, and validate the behavior through the existing Playwright auth-flow suite instead of introducing a separate frontend data framework.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
