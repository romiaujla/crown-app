# Implementation Plan: Tenant App UI Shell

**Branch**: `feat/CROWN-8-tenant-app-shell` | **Date**: 2026-03-08 | **Spec**: [spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-8-tenant-app-shell/spec.md)
**Input**: Feature specification from `/specs/CROWN-8-tenant-app-shell/spec.md`

**Note**: This plan uses the repository's Jira-linked branch convention and canonical feature path rather than a numeric-only spec-kit branch.

## Summary

Deliver the first tenant-facing workspace shell in `apps/web` so tenant-scoped users can enter a management-system workspace that is clearly separate from the `super_admin` control plane. The implementation should preserve “powered by Crown” branding, establish tenant-oriented navigation and overview states, and keep the shell flexible enough for future tenant workflows.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20  
**Primary Dependencies**: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, existing Crown auth/RBAC contracts  
**Storage**: N/A for the shell itself; future tenant workspace reads will depend on existing platform APIs and PostgreSQL-backed tenant data  
**Testing**: TypeScript typecheck, Playwright smoke/e2e coverage for tenant-shell rendering and role separation, existing lint pipeline  
**Target Platform**: Web application in modern desktop and mobile browsers  
**Project Type**: Monorepo web application (`apps/web`) backed by existing API/platform contracts  
**Performance Goals**: Tenant shell renders workspace identity, navigation, and overview state within normal first-load web expectations and remains understandable before deeper tenant data is available  
**Constraints**: Keep the tenant shell distinct from the `super_admin` control plane, preserve “powered by Crown” branding, avoid CRM-specific terminology, and keep scope limited to shell/navigation/orientation rather than full tenant workflows  
**Scale/Scope**: One tenant-facing shell in `apps/web`, one tenant-scoped entry experience, a small set of tenant navigation destinations, and overview/empty states for early tenant workspaces

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Jira traceability and branch policy: PASS. Planning work is on `feat/CROWN-8-tenant-app-shell`, which matches the repository constitution for a Story.
- Spec-kit planning gate: PASS. `spec.md` exists and this plan completes the required pre-implementation artifact sequence.
- Scope discipline: PASS. Scope is limited to the tenant app shell in `apps/web` plus planning/design artifacts, not the full tenant feature set.
- Coding/testing standards: PASS. Planned implementation will use TypeScript strict mode, existing frontend patterns, and browser-level validation through Playwright plus typecheck.
- Governance consistency: PASS. The repository constitution remains the source of truth, and this feature explicitly complements `CROWN-7` rather than widening platform-shell scope.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-8-tenant-app-shell/
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
│   ├── system-overview.md
│   └── multi-tenant-model.md
└── specs/
    └── backlog-map.md
```

**Structure Decision**: Implement `CROWN-8` in the existing `apps/web` Next.js app. The feature will build the tenant-facing workspace shell within the current app surface, with behavior validation in `apps/web/tests`, while planning/design artifacts live under `specs/CROWN-8-tenant-app-shell`.

## Complexity Tracking

No constitution violations are currently expected.
