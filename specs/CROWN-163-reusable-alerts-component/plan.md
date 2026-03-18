# Implementation Plan: Reusable Alerts Component with Configurable State and Positioning

**Branch**: `feat/CROWN-163-reusable-alerts-component` | **Date**: 2026-03-17 | **Spec**: `specs/CROWN-163-reusable-alerts-component/spec.md`
**Input**: Feature specification from `specs/CROWN-163-reusable-alerts-component/spec.md`

## Summary

Implement a reusable Alert inline component and a toast alert system in `apps/web`. The inline `Alert` component supports four severity variants (success, info, warning, error) with distinct visual treatments, icons, and semantic ARIA roles. The toast system (`AlertProvider`, `AlertViewport`, `useAlerts`) enables imperative dispatch of positioned, auto-dismissing notifications. Migrate all existing ad-hoc alert/banner/notification markup to the shared components and update UI guidelines.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20
**Primary Dependencies**: Next.js 14 App Router, React 18, Tailwind CSS, `class-variance-authority`, `lucide-react`, existing UI helper `cn`
**Storage**: No new persistence
**Testing**: `pnpm --filter @crown/web typecheck`, `pnpm --filter @crown/web test -- tests/auth-flow.spec.ts`
**Target Platform**: Web frontend (`apps/web`) for desktop and mobile layouts
**Project Type**: Monorepo web app component, consumer migration, and documentation update
**Performance Goals**: Inline Alert is a pure presentational component with no client-side effects; toast system uses minimal timers cleaned up on unmount
**Constraints**: Keep scope in `apps/web` and documentation; no backend/API work; preserve all existing test assertions; maintain accessibility semantics
**Scale/Scope**: Two new UI modules (inline Alert + toast system), five consumer migrations, one documentation update

## Constitution Check

- Jira traceability and branch policy: **PASS**. `CROWN-163` is a Story; branch follows `feat/CROWN-<id>-<slug>`.
- Planning gate: **PASS**. `/specify` artifact (`spec.md`) completed before `/plan`.
- Scope discipline: **PASS**. Work is limited to `apps/web` components, documentation, and migration of existing usages.
- API/OpenAPI discipline: **PASS**. No API route or contract changes.
- Testing discipline: **PASS**. Plan includes typecheck and focused browser validation.
- Governance consistency: **PASS**. Component uses CVA variant pattern consistent with Badge, Button, and Stepper.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-163-reusable-alerts-component/
├── spec.md
├── plan.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/
├── components/
│   ├── ui/
│   │   ├── alert.tsx              ← NEW: inline Alert + AlertTitle + AlertDescription
│   │   └── alert-toast.tsx        ← NEW: AlertProvider, AlertViewport, useAlerts
│   ├── auth/
│   │   ├── login-form.tsx         ← MIGRATE: banner message → Alert
│   │   ├── session-expiry-notification.tsx  ← MIGRATE: custom Card → toast
│   │   └── auth-provider.tsx      ← MIGRATE: wire session-expiry through toast
│   └── platform/
│       ├── tenant-create-step-tenant-info.tsx  ← MIGRATE: error summary + info banner
│       ├── tenant-directory-page.tsx           ← MIGRATE: error state → Alert
│       └── ...
├── app/
│   ├── platform/
│   │   └── page.tsx               ← MIGRATE: dashboard error card → Alert
│   └── layout.tsx                 ← ADD: AlertProvider wrapper
└── tests/
    └── auth-flow.spec.ts          ← UPDATE: verify migrated assertions still pass
docs/process/
└── ui-guidlines.md                ← UPDATE: add alerts section
```

## Implementation Phases

### Phase 1 — Inline Alert Component (`alert.tsx`)

Create the base `Alert` component using CVA for variant styling:

1. Define `AlertSeverityEnum` values: `SUCCESS`, `INFO`, `WARNING`, `ERROR`.
2. Build the CVA variant map with color palettes per severity:
   - **success**: green border/bg, `CircleCheck` icon
   - **info**: blue border/bg, `Info` icon
   - **warning**: amber border/bg, `AlertTriangle` icon
   - **error**: red border/bg, `CircleX` icon
3. Expose `Alert`, `AlertTitle`, `AlertDescription` as compound components.
4. Apply `role="alert"` for error/warning, `role="status"` for success/info.
5. Accept optional `className` and `data-testid` passthrough props.

**Files created**: `apps/web/components/ui/alert.tsx`
**Validation**: Typecheck passes.

### Phase 2 — Toast Alert System (`alert-toast.tsx`)

Build the imperative toast layer:

1. Define `AlertPositionEnum` values for seven positions.
2. Create `AlertContext` with state holding an array of active toast entries.
3. Implement `AlertProvider` that wraps children and manages the toast queue.
4. Implement `AlertViewport` that renders active toasts grouped by position in fixed-position containers.
5. Implement `useAlerts` hook exposing `showAlert(options)` → returns alert ID and `dismissAlert(id)`.
6. Each toast renders an `Alert` with an optional close button (`X` icon) and auto-dismiss timer via `useEffect`.
7. Timers clean up on unmount to prevent leaks.

**Files created**: `apps/web/components/ui/alert-toast.tsx`
**Files modified**: `apps/web/app/layout.tsx` (wrap with `AlertProvider` + `AlertViewport`)
**Validation**: Typecheck passes.

### Phase 3 — Migrate Existing Ad-Hoc Usages

Migrate each identified site in order of risk (lowest first):

| #   | File                                                    | Current Pattern              | Target                                            |
| --- | ------------------------------------------------------- | ---------------------------- | ------------------------------------------------- |
| 1   | `login-form.tsx`                                        | Bespoke destructive div      | `<Alert severity="error">`                        |
| 2   | `tenant-create-step-tenant-info.tsx`                    | Inline red error summary div | `<Alert severity="error">` with composed children |
| 3   | `tenant-create-step-tenant-info.tsx`                    | Inline blue info div         | `<Alert severity="info">`                         |
| 4   | `tenant-directory-page.tsx`                             | Bespoke amber div            | `<Alert severity="warning">`                      |
| 5   | `app/platform/page.tsx`                                 | Bespoke amber Card           | `<Alert severity="warning">`                      |
| 6   | `session-expiry-notification.tsx` + `auth-provider.tsx` | Custom fixed-position Card   | Toast via `useAlerts`                             |

**Validation**: Existing Playwright and typecheck assertions pass after each migration.

### Phase 4 — Update UI Guidelines

Add a new section to `docs/process/ui-guidlines.md` covering:

- Alert severity semantics (when to use each)
- Inline Alert vs. Toast decision guide
- Positioning guidance for toasts
- Code examples for both patterns
- Auto-dismiss duration conventions

### Phase 5 — Final Validation

- `pnpm --filter @crown/web typecheck`
- `pnpm --filter @crown/web test -- tests/auth-flow.spec.ts`
- Manual review of all migrated pages

## Complexity Tracking

No constitution violations are expected for this story. No API or database changes. The scope is strictly frontend component + migration + documentation.
