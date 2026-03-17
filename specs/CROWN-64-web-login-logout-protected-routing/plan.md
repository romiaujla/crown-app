# Implementation Plan: Web Login, Logout, and Protected-Route Handling

**Branch**: `feat/CROWN-64-web-login-logout-protected-routing` | **Date**: 2026-03-13 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-64-web-login-logout-protected-routing/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-64-web-login-logout-protected-routing/spec.md)
**Input**: Feature specification from `/specs/CROWN-64-web-login-logout-protected-routing/spec.md`

## Summary

Deliver the first real authenticated web entry flow in `apps/web` by adding a shared login page, client-side session bootstrap around the existing API auth routes, and protected platform and tenant shell routes that respect the API routing contract. The implementation should preserve the `CROWN-7` platform shell and `CROWN-8` tenant shell as separate experiences, store access tokens only in `sessionStorage`, restore valid return paths after login, and fall back to a safe redirect or explicit unauthorized state when a requested route does not match the authenticated user context.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20  
**Primary Dependencies**: Next.js 14 App Router, React 18, TypeScript, existing Crown auth API contracts, Playwright  
**Storage**: Browser `sessionStorage` for access-token persistence in the active tab only; no new server-side storage  
**Testing**: `pnpm --filter @crown/web typecheck`, focused Playwright coverage for login/protected-route/logout flows, and targeted API validation as needed for contract alignment  
**Target Platform**: Web application in modern desktop and mobile browsers  
**Project Type**: Monorepo web application (`apps/web`) consuming the existing Express auth API  
**Performance Goals**: Protected-route bootstrap should resolve the current-user context before rendering the wrong shell and should keep redirect decisions deterministic within normal first-load web expectations  
**Constraints**: Must reuse `CROWN-61` login/current-user/logout contracts, must keep token persistence limited to `sessionStorage`, must preserve the platform-versus-tenant shell split from `CROWN-7` and `CROWN-8`, and must stay within the Jira story scope rather than adding refresh-token or account-recovery flows  
**Scale/Scope**: One authenticated web story spanning login UI, session bootstrap, route-guard behavior, unauthorized/session-expired states, logout wiring, and browser-level validation

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Jira traceability and branch policy: PASS. Planning is on `feat/CROWN-64-web-login-logout-protected-routing`, which matches the Story branch convention.
- Spec Kit gate: PASS. `spec.md` exists and this plan completes the required pre-implementation phase before `/tasks` and coding.
- Enum/schema policy: PASS. The feature consumes existing shared auth enums and response contracts rather than introducing new ad hoc route-state value sets.
- API contract alignment: PASS. The web implementation will consume the current auth API as defined in `apps/api/src/routes/auth.ts`; no API route changes are planned, so `apps/api/src/docs/openapi.ts` should remain untouched unless implementation uncovers a contract mismatch.
- Testing discipline: PASS. The plan includes typed frontend work plus browser-level coverage for the user-visible auth flows introduced by this story.
- Scope discipline: PASS. Scope is limited to the web login/logout/protected-routing experience and its planning artifacts, not broader account management or token lifecycle changes.

Post-design re-check: PASS. The design artifacts keep the work inside `apps/web`, reuse the existing API contract, and avoid broadening into API refresh sessions or new persistence concerns.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-64-web-login-logout-protected-routing/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── login-and-session-contract.md
│   └── protected-routing-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── login/
│   ├── platform/
│   ├── tenant/
│   └── unauthorized/
├── lib/
│   ├── auth/
│   └── routing/
├── components/
│   └── auth/
├── tests/
│   ├── smoke.spec.ts
│   └── auth-flow.spec.ts
├── package.json
└── playwright.config.ts

apps/api/
└── src/
    ├── auth/
    └── routes/
```

**Structure Decision**: Implement `CROWN-64` in `apps/web` by replacing the current role-query-param demo entry with explicit auth-aware routes and shared client helpers. The primary work should live in the Next.js app router, plus lightweight auth/routing utilities under `apps/web/lib`, while Playwright coverage expands under `apps/web/tests`. The API workspace is a consumed dependency surface only unless a contract bug is uncovered.

## Complexity Tracking

No constitution violations require exception rationale for this feature.
