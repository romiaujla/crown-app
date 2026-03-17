# Implementation Plan: Frontend Reusable Stepper Component (Horizontal + Vertical Support)

**Branch**: `feat/CROWN-161-reusable-stepper-component-horizontal-vertical-support` | **Date**: 2026-03-17 | **Spec**: `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-161-reusable-stepper-component/spec.md`  
**Input**: Feature specification from `/specs/CROWN-161-reusable-stepper-component/spec.md`

## Summary

Implement a reusable `Stepper` UI component in `apps/web` that supports horizontal and vertical layouts, orientation-aware position variants, completed/current/upcoming state rendering, connector visualization, and optional interactive keyboard-accessible step selection. Replace the bespoke progress list in the tenant create shell with this shared component while preserving existing tenant-create placeholder navigation and cancel-guard behavior.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20  
**Primary Dependencies**: Next.js 14 App Router, React 18, Tailwind CSS, `lucide-react`, existing UI helper `cn`  
**Storage**: No new persistence  
**Testing**: `pnpm --filter @crown/web typecheck`, `pnpm --filter @crown/web test -- tests/auth-flow.spec.ts`  
**Target Platform**: Web frontend (`apps/web`) for desktop and mobile layouts  
**Project Type**: Monorepo web app component and consumer refactor  
**Performance Goals**: Stepper renders as pure presentational state with no extra network calls; interactivity remains local and event-driven  
**Constraints**: Keep scope in `apps/web`; no backend/API work; preserve existing tenant-create flow behavior and routes; maintain accessibility semantics  
**Scale/Scope**: One new reusable UI component, one consumer refactor, and focused Playwright assertion updates

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Jira traceability and branch policy: PASS. `CROWN-161` is a Story and branch naming follows `feat/CROWN-<id>-<slug>`.
- Planning gate: PASS. `/specify` artifact (`spec.md`) was completed, committed, and pushed before `/plan`.
- Scope discipline: PASS. Work is limited to a frontend reusable stepper and tenant-create-shell usage example.
- API/OpenAPI discipline: PASS. No API route or contract changes are planned.
- Testing discipline: PASS. Plan includes web typecheck and focused browser validation updates.
- Governance consistency: PASS. The component is config-driven and reusable, avoiding hardcoded flow-specific labels.

Post-design re-check: PASS. Planned edits stay inside `apps/web` and do not widen into unrelated shell, auth, or backend behavior.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-161-reusable-stepper-component/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── stepper-component-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/
├── components/
│   ├── platform/
│   │   └── tenant-create-shell.tsx
│   └── ui/
│       └── stepper.tsx
└── tests/
    └── auth-flow.spec.ts
```

**Structure Decision**: Add `Stepper` under `apps/web/components/ui` for shared frontend reuse, then update `tenant-create-shell.tsx` as the first consumer example and extend existing Playwright coverage in `auth-flow.spec.ts`.

## Complexity Tracking

No constitution violations are expected for this story.
