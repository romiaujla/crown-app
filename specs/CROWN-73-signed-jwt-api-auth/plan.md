# Implementation Plan: Signed JWT Issuance And Verification For API Auth

**Branch**: `feat/CROWN-73-signed-jwt-api-auth` | **Date**: 2026-03-12 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-73-signed-jwt-api-auth/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-73-signed-jwt-api-auth/spec.md)
**Input**: Feature specification from `/specs/CROWN-73-signed-jwt-api-auth/spec.md`

## Summary

Replace the current placeholder access-token behavior with real signed JWT issuance and verification for the API auth surface. The implementation should sign login tokens with the repository’s configured access secret, verify bearer tokens cryptographically in middleware, preserve the existing auth response contracts where possible, and update auth fixtures and tests to match the signed runtime behavior.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Markdown planning artifacts  
**Primary Dependencies**: Express 4, Zod 4, existing auth route and middleware modules, likely a JWT library such as `jsonwebtoken` or `jose` for symmetric signing and verification  
**Storage**: No new persistence; existing in-memory/default auth directory and current auth claims only  
**Testing**: `pnpm --filter @crown/api test`, focused Vitest contract and integration coverage for login and authenticated middleware paths  
**Target Platform**: Monorepo API workspace for local development and CI validation  
**Project Type**: Monorepo web application with an Express API service  
**Performance Goals**: JWT verification should remain lightweight enough for the current protected-route surface and local developer workflows  
**Constraints**: Preserve existing auth contracts where feasible, reject the old placeholder token path, use environment-backed signing configuration, keep refresh-session persistence out of scope, and stay within the `CROWN-73` auth surface only  
**Scale/Scope**: One API story spanning token issue/verify helpers, auth middleware integration, test fixture updates, and environment/config alignment

## CROWN-73 Implementation Outline

- Add a shared JWT utility or auth-token module for signed access-token issuance and verification.
- Update login token creation in `apps/api/src/routes/auth.ts` to issue signed tokens rather than `alg: none` placeholders.
- Update `apps/api/src/middleware/authenticate.ts` to verify signatures and expiration before trusting claims.
- Reuse the current claims schema and principal-resolution flow once verification succeeds.
- Update auth fixtures and tests to generate valid signed tokens and explicit invalid/tampered token cases.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Branch naming: PASS. `feat/CROWN-73-signed-jwt-api-auth` matches the constitution for a Story.
- Commit/PR convention: PASS. Work on this branch should use `feat: CROWN-73 - ...` commit subjects and a squash-safe PR title.
- Planning gate: PASS. `CROWN-73` is progressing through `specify`, `plan`, and `tasks` before implementation.
- Testing discipline: PASS. The plan includes focused login/middleware coverage and full API verification before handoff.
- Persistence and migration rule: PASS. No Prisma schema or migration changes are needed for this story.
- Scope control: PASS. The plan stays limited to signed token issuance, verification, config alignment, and test support.

Post-design re-check: PASS. The design keeps refresh tokens, persistent sessions, and broader auth redesign out of scope.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-73-signed-jwt-api-auth/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── signed-jwt-auth-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/api/
├── package.json
├── src/
│   ├── app.ts
│   ├── auth/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   └── types/
└── tests/
    ├── contract/
    ├── helpers/
    └── integration/

specs/
├── CROWN-61-api-auth-foundation/
└── CROWN-73-signed-jwt-api-auth/
```

**Structure Decision**: `CROWN-73` remains confined to the API workspace and its planning artifacts. Expected implementation surfaces are the login route, JWT/token helpers under `apps/api/src/auth`, the authenticate middleware, environment configuration, and the auth-related contract/integration test helpers.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
