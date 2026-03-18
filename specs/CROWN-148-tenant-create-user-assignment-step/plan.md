# Implementation Plan: Tenant Create User-Assignment Step

**Branch**: `feat/CROWN-148-tenant-create-user-assignment-step` | **Date**: 2026-03-18 | **Spec**: [spec.md](/specs/CROWN-148-tenant-create-user-assignment-step/spec.md)
**Input**: Feature specification from `/specs/CROWN-148-tenant-create-user-assignment-step/spec.md`

## Summary

Replace the placeholder step 3 in the tenant-create wizard with a real user-assignment experience grouped by the roles selected in step 2. The shell will own grouped initial-user draft state, the new step component will render required tenant-admin and optional role sections with inline validation, and Playwright coverage will verify admin gating, optional-role warnings, and reset-safe navigation without adding submission behavior.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Next.js 14 App Router, React 18  
**Primary Dependencies**: shadcn/ui primitives (`Alert`, `Badge`, `Button`, `Card`, `Input`, `Label`), Tailwind CSS, `lucide-react`, `@crown/types`  
**Storage**: Client-side React state only (no new persistence or API calls)  
**Testing**: Playwright E2E in `apps/web/tests/auth-flow.spec.ts`, `pnpm --filter @crown/web typecheck`, `pnpm specify.audit`  
**Target Platform**: Super-admin tenant-create workflow in the protected platform web app  
**Project Type**: Monorepo web application  
**Performance Goals**: Step 3 interactions remain local and responsive with immediate validation feedback and no network round trips  
**Constraints**: Pure frontend; no API/OpenAPI changes; stay aligned with the existing onboarding contract fields; no username generation, existing-user lookup, or submission behavior  
**Scale/Scope**: One new step component, tenant-create shell state and validation updates, and focused Playwright assertions for step 3

## Implementation Approach

1. **New step component** — `apps/web/components/platform/tenant-create-step-user-assignment.tsx`
   - Presentational component for grouped assignment sections.
   - Receives selected role metadata plus grouped draft rows and validation visibility from the shell.
   - Renders the required tenant-admin section first, followed by optional selected-role sections.
   - Uses compact labeled row inputs for `First name`, `Last name`, and `Email` with add/remove affordances.
   - Shows inline field errors, required-admin error treatment, optional-role unstaffed warnings, and a recovery-oriented empty state.

2. **Shell state additions** — `apps/web/components/platform/tenant-create-shell.tsx`
   - Replace the step-3 placeholder state with a dedicated grouped assignment model keyed by selected `RoleCode`.
   - Track step-3 validity separately from step-1 validity so the `Next` button blocks only when the current step is invalid.
   - Persist assignment drafts across back/next navigation.
   - Clear assignment state when the existing management-system-type reset is confirmed.
   - Prune assignment state whenever selected roles change so removed roles cannot leave hidden draft data behind.
   - Include assignment-state presence in downstream-reset and unsaved-change detection.

3. **Contract alignment**
   - Reuse `TenantCreateOnboardingInitialUser` and existing `RoleCode` types from `@crown/types`.
   - Keep role grouping in shell state while ensuring every completed row still maps cleanly to one onboarding-contract user plus one role.
   - Treat duplicate-email validation as cross-group validation because the onboarding contract rejects duplicates across the full `initialUsers` list.

4. **Playwright coverage** — `apps/web/tests/auth-flow.spec.ts`
   - Add a step-3 test that verifies grouped sections render from step-2 selections.
   - Assert progression blocks when no tenant admin is assigned.
   - Assert optional roles can remain empty while surfacing warnings.
   - Assert back/next navigation preserves completed rows and upstream role/type resets clear downstream assignments.

## Constitution Check

- Branch naming: PASS — `feat/CROWN-148-tenant-create-user-assignment-step` matches Story convention.
- Commit/PR convention: PASS — commits should use `feat: CROWN-148 - ...` and the eventual PR title must be squash-safe.
- Planning gate: PASS — `CROWN-148` is following `specify`, then `plan`, then `tasks` before implementation.
- Shared contract discipline: PASS — the plan reuses onboarding types from `@crown/types` instead of duplicating initial-user shapes in `apps/web`.
- API/OpenAPI discipline: PASS — no API route contract changes are planned.
- UI guideline discipline: PASS — compact row entry will still use visible labels and accessible validation states rather than placeholder-only inputs.
- Testing discipline: PASS — the plan includes focused Playwright coverage, web typecheck, and `pnpm specify.audit`.
- Scope discipline: PASS — work remains limited to the step-3 UI, shell draft state, and local validation/reset behavior.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-148-tenant-create-user-assignment-step/
├── spec.md
├── plan.md
└── tasks.md
```

### Source Code (changed files)

```text
apps/web/
├── components/platform/
│   ├── tenant-create-shell.tsx                 (modified — step-3 state, validity, reset wiring)
│   └── tenant-create-step-user-assignment.tsx (new — grouped user-assignment UI)
└── tests/
    └── auth-flow.spec.ts                       (modified — step-3 assertions)
```

**Structure Decision**: Keep `CROWN-148` fully inside `apps/web`. The existing tenant-create shell already owns the stepper and draft-state orchestration, so the cleanest change is one new presentational step component plus focused shell wiring and E2E updates.

## Complexity Tracking

No constitutional violations or exceptions required.
