# Implementation Plan: Tenant Create Role-Selection Step

**Branch**: `feat/CROWN-143-tenant-create-role-selection-step` | **Date**: 2026-03-17 | **Spec**: [spec.md](/specs/CROWN-143-tenant-create-role-selection-step/spec.md)
**Input**: Feature specification from `/specs/CROWN-143-tenant-create-role-selection-step/spec.md`

## Summary

Replace the placeholder step 2 in the tenant-create wizard with a real role-selection component. The component receives the already-loaded reference data and the selected management-system type code from the shell, renders selectable role option cards, enforces the required admin role lock, persists selected role codes in shell state, and resets when the management-system type changes.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Next.js 14 App Router, React 18
**Primary Dependencies**: shadcn/ui primitives (`Checkbox`, `Card`), Tailwind CSS, `@crown/types`, lucide-react
**Storage**: Client-side React state only (no persistence or API calls added)
**Testing**: Playwright E2E in `apps/web/tests/auth-flow.spec.ts`, `pnpm --filter @crown/web typecheck`, `pnpm specify.audit`
**Constraints**: Pure frontend; no API or OpenAPI changes; no user-assignment or submission logic

## Implementation Approach

1. **New step component** — `apps/web/components/platform/tenant-create-step-role-selection.tsx`
   - Presentational component matching the step-1 prop pattern (`data`, `onChange`, callbacks).
   - Receives the `TenantCreateRoleOption[]` for the selected management-system type plus the current `Set<RoleCode>` of selected role codes.
   - Renders each role as a card with a `Checkbox`, display name, and inline rationale.
   - Locks required roles (checkbox checked + disabled).
   - Toggles optional roles via an `onToggle(roleCode)` callback.
   - Shows an empty-state message when no type is selected or role options are empty.

2. **Shell state additions** — `apps/web/components/platform/tenant-create-shell.tsx`
   - Add `selectedRoleCodes: Set<RoleCode>` state initialized to an empty set.
   - When the user reaches step 2 for the first time (or after a type reset), auto-initialize selected roles from `isDefault: true` role option entries.
   - On management-system type change reset (the existing `handleConfirmSystemTypeReset` flow), clear `selectedRoleCodes`.
   - Replace the step 2 placeholder block with the new `TenantCreateStepRoleSelection` component.
   - Update `downstreamDataExists` to consider role-selection state.
   - Wire a `handleRoleToggle` callback.

3. **Static fallback rationale** — A role-code-to-description map inside the step component provides descriptive text when reference data returns `null` for a role's description.

4. **Step-level validity** — The role-selection step is always valid when at least the required admin role is selected (which is guaranteed by the lock behavior), so no explicit gating is needed. The `isCurrentStepValid` check in the shell passes through for step 2.

5. **Playwright test updates** — `apps/web/tests/auth-flow.spec.ts`
   - Update or add a test that navigates to step 2 after selecting a management-system type and asserts the role cards render.
   - Assert the admin role checkbox is checked and disabled.
   - Toggle an optional role and verify the change persists after back/next.
   - Update the existing placeholder-based assertions to reflect real role-selection content.

## Constitution Check

- Branch naming: PASS — `feat/CROWN-143-tenant-create-role-selection-step` matches Story convention.
- Commit/PR convention: PASS — `feat: CROWN-143 - ...` commit subjects.
- Shared contract discipline: PASS — Types already exist in `@crown/types`; no new shared types needed.
- API/OpenAPI discipline: N/A — No API changes.
- Enum/value-set discipline: PASS — Reuses existing `RoleCodeEnum` and `TenantCreateRoleOption`.
- Testing discipline: PASS — Playwright E2E + typecheck.
- Scope discipline: PASS — Pure frontend role selection; no user assignment, provisioning, or submission.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-143-tenant-create-role-selection-step/
├── spec.md
├── plan.md
└── tasks.md
```

### Source Code (changed files)

```text
apps/web/
├── components/platform/
│   ├── tenant-create-shell.tsx              (modified — state, wiring)
│   └── tenant-create-step-role-selection.tsx (new — step 2 component)
└── tests/
    └── auth-flow.spec.ts                    (modified — step 2 assertions)
```

## Complexity Tracking

No constitutional violations or exceptions required.
