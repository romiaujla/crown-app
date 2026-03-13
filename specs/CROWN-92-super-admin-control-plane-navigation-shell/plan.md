# Implementation Plan: Super-Admin Control-Plane Navigation Shell

**Branch**: `feat/CROWN-92-super-admin-control-plane-navigation-shell` | **Date**: 2026-03-12 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-92-super-admin-control-plane-navigation-shell/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-92-super-admin-control-plane-navigation-shell/spec.md)
**Input**: Feature specification from `/specs/CROWN-92-super-admin-control-plane-navigation-shell/spec.md`

## Summary

Extend the existing super-admin shell in `apps/web` into a route-aware control-plane navigation shell with a persistent left sidebar, the nine Jira-required destinations, consistent placeholder states for unfinished sections, and responsive collapsed navigation behavior for iPad-sized layouts and below.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20  
**Primary Dependencies**: Next.js 14 App Router, React 18, Tailwind CSS, `lucide-react`, existing auth shell primitives  
**Storage**: None for this story directly; placeholder content uses static shell state  
**Testing**: `pnpm --filter @crown/web typecheck`, `pnpm --filter @crown/web test -- --grep` or targeted Playwright smoke/auth coverage  
**Target Platform**: Web application in desktop and tablet browsers  
**Project Type**: Monorepo web frontend (`apps/web`)  
**Performance Goals**: Keep shell transitions and route changes lightweight, with no blocking data fetch required to render placeholder sections  
**Constraints**: Preserve existing super-admin access rules, stay scoped to shell/navigation behavior, avoid widening into fully implemented section workflows, and keep the shell structurally extensible  
**Scale/Scope**: One platform shell refactor, one control-plane navigation model, one set of placeholder section states, and focused responsive/accessibility coverage

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Jira traceability and branch policy: PASS. `CROWN-92` is a Story and the branch matches the `feat/CROWN-<id>-<slug>` convention.
- Planning gate: PASS. `spec.md` exists before implementation planning.
- Scope discipline: PASS. Work is bounded to the super-admin shell structure, navigation behavior, and placeholder content.
- Testing discipline: PASS. The plan includes typecheck plus browser validation for role-aware navigation behavior and responsive shell states.
- Governance consistency: PASS. No API contract or persistence-model changes are expected.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-92-super-admin-control-plane-navigation-shell/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/
├── app/
│   ├── platform/
│   │   └── page.tsx
│   └── globals.css
├── components/
│   ├── auth/
│   │   └── workspace-shell.tsx
│   └── ui/
├── tests/
│   └── auth-flow.spec.ts
└── package.json
```

**Structure Decision**: Keep the implementation inside the existing `apps/web` platform route and shared `WorkspaceShell` component so the new control-plane navigation remains consistent with the current auth and shell architecture.

## Complexity Tracking

No constitution violations are currently expected.
