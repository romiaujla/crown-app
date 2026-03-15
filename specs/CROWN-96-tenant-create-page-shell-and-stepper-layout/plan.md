# Implementation Plan: Tenant Create Page Shell And Stepper Layout

**Branch**: `feat/CROWN-96-tenant-create-page-shell-and-stepper-layout` | **Date**: 2026-03-15 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/specs/CROWN-96-tenant-create-page-shell-and-stepper-layout/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-crm/.codex/worktrees/a913/crown-app/specs/CROWN-96-tenant-create-page-shell-and-stepper-layout/spec.md)
**Input**: Feature specification from `/specs/CROWN-96-tenant-create-page-shell-and-stepper-layout/spec.md`

## Summary

Replace the current `/platform/tenants/new` placeholder card with a dedicated guided tenant-create page shell in the protected platform experience. The implementation will add a visible stepper, placeholder step content for the future onboarding stages, next/back/cancel navigation affordances, and discard-warning protection for in-progress step input without implementing the actual tenant-create business workflow.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20  
**Primary Dependencies**: Next.js 14 App Router, React 18, Tailwind CSS, `lucide-react`, existing protected-shell and platform-shell components  
**Storage**: No persistence changes; use client-side placeholder draft state only  
**Testing**: `pnpm --filter @crown/web typecheck`, focused Playwright coverage in `apps/web/tests/auth-flow.spec.ts`, and `pnpm specify.audit`  
**Target Platform**: Web application in desktop and tablet/mobile browsers for `super_admin` users  
**Project Type**: Monorepo web frontend (`apps/web`)  
**Performance Goals**: Step transitions should feel immediate, avoid route churn between steps, and keep the shell responsive on narrower layouts  
**Constraints**: Stay within `apps/web`; preserve the existing protected `/platform` shell boundary; do not introduce API or OpenAPI changes; keep all step content explicitly placeholder-level; support discard warnings only where the browser/app can actually intercept exit  
**Scale/Scope**: One route-page replacement, one reusable tenant-create shell component, one small local step/draft model, and focused browser coverage for routing, step navigation, and discard protection

## CROWN-96 Implementation Outline

- Replace the current `/platform/tenants/new` placeholder card with a dedicated tenant-create shell component.
- Keep the route under the existing `PlatformShellFrame` so the page inherits the current platform navigation and access boundary.
- Add a feature-local ordered step definition for `Tenant info`, `Role selection`, `User assignment`, and `Review`.
- Render a visible progress indicator that communicates active, completed, and upcoming steps.
- Provide stable placeholder content for each step, including enough in-progress input to exercise unsaved-change detection without implementing real onboarding forms.
- Add `Next`, `Back`, and `Cancel` controls with correct first-step and last-step behavior.
- Add discard confirmation for in-app cancel/route exits plus browser/page-exit interception where supported.
- Extend Playwright coverage to validate route entry, step transitions, and exit protection.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Jira traceability and branch policy: PASS. `CROWN-96` is a Story and the branch matches `feat/CROWN-96-<slug>`.
- Planning gate: PASS. `spec.md` exists and is committed before implementation planning advances.
- Scope discipline: PASS. The plan stays limited to the guided shell, placeholder step navigation, and exit protection without widening into real tenant-create workflow logic.
- Shared contract discipline: PASS. No shared API/web contract changes are needed for this shell-only story; feature-local UI state can remain in `apps/web`.
- API/OpenAPI discipline: PASS. No API route or behavior changes are planned, so `apps/api/src/docs/openapi.ts` remains untouched.
- Testing discipline: PASS. The plan includes focused browser validation, web typecheck, and `pnpm specify.audit`.
- Auth/RBAC discipline: PASS. The plan keeps `/platform/tenants/new` inside the existing protected platform shell instead of creating a parallel access path.

Post-design re-check: PASS. The design remains fully in `apps/web`, preserves the existing route boundary from `CROWN-95`, and keeps future tenant-create business workflows out of this story.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-96-tenant-create-page-shell-and-stepper-layout/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── tenant-create-shell-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/
├── app/
│   └── platform/
│       └── tenants/
│           └── new/
│               └── page.tsx
├── components/
│   └── platform/
│       └── tenant-create-shell.tsx
└── tests/
    └── auth-flow.spec.ts
```

**Structure Decision**: Keep `CROWN-96` inside `apps/web`. Replace the route-level placeholder in `apps/web/app/platform/tenants/new/page.tsx` with a focused `TenantCreateShell` component under `components/platform`, and extend `apps/web/tests/auth-flow.spec.ts` for the browser-visible guided-flow behavior.

## Complexity Tracking

No constitutional violations are currently expected.
