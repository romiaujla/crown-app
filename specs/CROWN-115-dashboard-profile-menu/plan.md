# Implementation Plan: Dashboard Left-Menu Profile Actions

**Branch**: `feat/CROWN-115-dashboard-profile-menu` | **Date**: 2026-03-13 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-115-dashboard-profile-menu/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-115-dashboard-profile-menu/spec.md)
**Input**: Feature specification from `/specs/CROWN-115-dashboard-profile-menu/spec.md`

## Summary

Refine the shared authenticated dashboard shell in `apps/web` by removing the detached top-level authenticated-user card and replacing it with a compact profile entry anchored beneath the left navigation. The new entry should show initials, open a lightweight profile menu with the user's display name and role, and preserve the existing logout behavior without widening into broader auth or account-management flows.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20  
**Primary Dependencies**: Next.js 14 App Router, React 18, Tailwind CSS, `lucide-react`, existing Crown auth provider and UI primitives  
**Storage**: No new persistence; reuse existing in-memory/browser session auth state  
**Testing**: `pnpm --filter @crown/web typecheck`, focused Playwright coverage in `apps/web/tests/auth-flow.spec.ts`  
**Target Platform**: Web application in modern desktop and tablet browsers  
**Project Type**: Monorepo web frontend (`apps/web`)  
**Performance Goals**: Profile-menu interactions should remain lightweight and local to the shell with no additional network calls required to open or close the menu  
**Constraints**: Preserve existing logout behavior, keep scope limited to dashboard-shell presentation and interaction, avoid introducing a new global dropdown dependency, and keep the shared shell usable for both platform and tenant contexts  
**Scale/Scope**: One shared shell component refactor, one compact profile trigger/menu interaction, one logout-button presentation update if needed, and focused browser assertions

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Jira traceability and branch policy: PASS. `CROWN-115` is a Story and the active branch matches the required `feat/CROWN-<id>-<slug>` convention.
- Planning gate: PASS. `spec.md` exists before implementation planning begins.
- Scope discipline: PASS. Scope is limited to the authenticated dashboard shell profile controls and related browser validation.
- API/OpenAPI discipline: PASS. No API route, API contract, or persistence changes are planned, so `apps/api/src/docs/openapi.ts` remains unaffected.
- Testing discipline: PASS. The plan includes focused browser assertions plus app-level typecheck for the shared shell refactor.
- Governance consistency: PASS. The work reuses the existing auth provider and logout flow rather than introducing new authentication behavior.

Post-design re-check: PASS. The planned work remains inside `apps/web`, reuses the existing auth primitives, and keeps the story scoped to UI relocation and compact profile-menu behavior.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-115-dashboard-profile-menu/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── dashboard-profile-menu-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/
├── app/
│   ├── platform/
│   │   └── page.tsx
│   ├── tenant/
│   │   └── page.tsx
│   └── globals.css
├── components/
│   └── auth/
│       ├── logout-button.tsx
│       └── workspace-shell.tsx
└── tests/
    └── auth-flow.spec.ts
```

**Structure Decision**: Keep `CROWN-115` inside the existing shared `WorkspaceShell` component so the profile affordance is implemented once for authenticated dashboard shells. Use route-level pages only to verify the shared shell still receives the correct user context, and extend the existing Playwright auth-flow coverage instead of adding a separate test suite.

## Complexity Tracking

No constitution violations are currently expected.
