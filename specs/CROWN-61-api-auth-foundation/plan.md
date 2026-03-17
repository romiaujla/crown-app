# Implementation Plan: API Auth Foundation For Login And Current User Context

**Branch**: `feat/CROWN-61-api-auth-foundation` | **Date**: 2026-03-11 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-61-api-auth-foundation/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-61-api-auth-foundation/spec.md)
**Input**: Feature specification from `/specs/CROWN-61-api-auth-foundation/spec.md`

## Summary

Implement the first-pass API authentication surface on top of the `CROWN-60` credential model. The work should add a single login contract that accepts username or email, expose a current-user endpoint with principal and app-target context, document stateless logout semantics, and ensure protected-route middleware provides consistent unauthenticated and forbidden-role behavior.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Prisma ORM 7.x, Markdown planning artifacts  
**Primary Dependencies**: Express 4, Zod 3, Prisma 7, `@prisma/client`, `@prisma/adapter-pg`, `pg`, `tsx`, existing auth middleware and route scaffolding  
**Storage**: PostgreSQL control-plane schema via Prisma, including `PlatformUser`, `PlatformUserTenant`, and `Tenant`  
**Testing**: `pnpm --filter @crown/api test`, focused Vitest contract/integration coverage for auth routes and middleware, plus `pnpm specify.audit` if available in the environment  
**Target Platform**: Monorepo API workspace serving local development and future CI validation  
**Project Type**: Monorepo web application with an Express API and Prisma-backed control-plane data  
**Performance Goals**: Request-time auth resolution remains simple enough for protected route checks and local development workflows  
**Constraints**: Must build on `CROWN-60` without reworking its data model; must keep logout stateless; must not add refresh-session persistence; must preserve structured auth errors and Jira-scoped changes only  
**Scale/Scope**: One API story spanning auth routes, middleware/principal resolution, current-user contract shaping, and focused tests

## CROWN-61 Implementation Outline

- Add credential login support for either username or email.
- Reuse access-token issuance and validation for authenticated API requests.
- Expose `GET /api/v1/auth/me` for current-user context and target-app routing.
- Keep `POST /api/v1/auth/logout` stateless and explicitly non-revoking.
- Unify auth failure and forbidden-role responses across route handlers and middleware.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Branch naming: PASS. `feat/CROWN-61-api-auth-foundation` matches the constitution for a Story.
- Commit/PR convention: PASS. Work on this branch should use `feat: CROWN-61 - ...` commit subjects and a squash-safe PR title.
- Planning gate: PASS. `CROWN-61` is progressing through `specify`, `plan`, and `tasks` before implementation.
- Testing discipline: PASS. The plan includes focused auth contract and integration validation, then repo-level API test verification before final handoff.
- Persistence and migration rule: PASS. `CROWN-61` reuses the `CROWN-60` credential model and does not currently require additional persistence changes; if that changes, Prisma-first migration workflow still applies.
- Scope control: PASS. The plan is limited to login, logout, current-user, token validation, and structured auth/authorization responses.

Post-design re-check: PASS. The design artifacts stay within the auth API surface and keep refresh sessions, password recovery, and broader account-management flows out of scope.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-61-api-auth-foundation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── api-auth-foundation-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/api/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   ├── seed.ts
│   └── seed/
├── src/
│   ├── app.ts
│   ├── auth/
│   ├── routes/
│   ├── tenant/
│   └── generated/
└── tests/
    ├── contract/
    ├── helpers/
    └── integration/

specs/
├── CROWN-60-auth-credential-foundation/
└── CROWN-61-api-auth-foundation/
```

**Structure Decision**: `CROWN-61` stays confined to the API workspace and its planning artifacts. The expected implementation surfaces are the auth route handlers, token/principal resolution modules, request context middleware, current-user response shaping, and focused tests.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
