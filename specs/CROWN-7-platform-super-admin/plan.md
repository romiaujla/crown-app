# Implementation Plan: Super-Admin Control Plane UI Shell

**Branch**: `feat/CROWN-7-platform-super-admin` | **Date**: 2026-03-08 | **Spec**: [spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-7-platform-super-admin/spec.md)
**Input**: Feature specification from `/specs/CROWN-7-platform-super-admin/spec.md`

**Note**: This plan uses the repository's Jira-linked branch convention and canonical feature path rather than a numeric-only spec-kit branch.

## Summary

Deliver the first real `apps/web` shell for Crown's platform operator experience by giving `super_admin` users a distinct control-plane entry, navigation structure, and management-system-oriented overview state. The implementation should reuse the existing auth/RBAC role model, avoid CRM framing, and establish a scalable top-level shell that later platform and tenant experiences can extend.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20  
**Primary Dependencies**: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, existing Crown auth/RBAC contracts  
**Storage**: N/A for this shell feature directly; reads will eventually depend on existing platform APIs and PostgreSQL-backed platform data  
**Testing**: TypeScript typecheck, Playwright smoke/e2e coverage for shell access and rendering, existing lint pipeline  
**Target Platform**: Web application in modern desktop and mobile browsers  
**Project Type**: Monorepo web application (`apps/web`) backed by existing API/platform contracts  
**Performance Goals**: Super-admin shell renders the primary heading, navigation, and overview state within normal web-app first-load expectations and supports operator orientation without waiting on tenant selection  
**Constraints**: Preserve `super_admin` as the main-app operator role, keep scope bounded to shell/navigation/orientation, avoid CRM-specific terminology, and fit the existing monorepo/frontend patterns  
**Scale/Scope**: One new platform shell in `apps/web`, one role-aware entry experience for `super_admin`, a small set of top-level platform navigation destinations, and empty/overview states for early platform operation

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Jira traceability and branch policy: PASS. Planning work is on `feat/CROWN-7-platform-super-admin`, which matches the repository constitution for a Story.
- Spec-kit planning gate: PASS. `spec.md` exists and this plan completes the required pre-implementation artifact sequence.
- Scope discipline: PASS. Scope is limited to the super-admin control-plane shell in `apps/web` plus related planning/design artifacts, not broader tenant UI implementation.
- Coding/testing standards: PASS. Planned implementation will use TypeScript strict mode, existing frontend patterns, and behavior validation via typecheck and Playwright coverage.
- Governance consistency: PASS with follow-up note. The repository constitution remains the source of truth; Jira wording may need alignment to the management-system pivot before implementation starts, but no constitution exception is required.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-7-platform-super-admin/
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
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── tests/
│   └── smoke.spec.ts
├── package.json
└── playwright.config.ts

docs/
├── architecture/
│   ├── auth-rbac.md
│   └── system-overview.md
└── specs/
    └── backlog-map.md
```

**Structure Decision**: Implement `CROWN-7` in the existing `apps/web` Next.js app. The feature should establish a reusable platform-shell structure in `app/`, supported by Playwright coverage in `apps/web/tests`, while keeping planning/design artifacts under `specs/CROWN-7-platform-super-admin`.

## Complexity Tracking

No constitution violations are currently expected.
