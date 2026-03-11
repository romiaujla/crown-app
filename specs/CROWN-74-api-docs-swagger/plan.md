# Implementation Plan: Local API Docs Route With Swagger UI

**Branch**: `feat/CROWN-74-api-docs-swagger` | **Date**: 2026-03-11 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-74-api-docs-swagger/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-74-api-docs-swagger/spec.md)
**Input**: Feature specification from `/specs/CROWN-74-api-docs-swagger/spec.md`

## Summary

Add a local/dev-first Swagger UI route at `/api/v1/docs` for the current auth-bearing API surface. The implementation should mount a browser-friendly docs endpoint inside the Express app, describe the login, current-user, logout, and protected authorization routes with bearer-auth expectations, and avoid exposing a separate public raw OpenAPI JSON route in this story.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Markdown planning artifacts  
**Primary Dependencies**: Express 4, Zod 3, existing auth route/contracts, `swagger-ui-express`, `swagger-ui-dist`, optional reuse of existing `zod-to-openapi` where practical  
**Storage**: N/A for runtime persistence; no database or migration changes  
**Testing**: `pnpm --filter @crown/api test`, focused Vitest contract coverage for the docs route, and targeted app/router assertions if needed  
**Target Platform**: Local development API server in the monorepo  
**Project Type**: Monorepo web application with an Express API workspace  
**Performance Goals**: Docs route should render quickly enough for local browser use without affecting existing auth route behavior  
**Constraints**: Must stay local/dev-first, must not add a separate public raw spec endpoint, must document only the current auth-bearing routes, and must remain additive to the existing API app wiring  
**Scale/Scope**: One API story spanning docs route wiring, OpenAPI document assembly, Swagger UI serving, and focused route validation

## CROWN-74 Implementation Outline

- Add Swagger UI runtime support to the API workspace.
- Assemble an OpenAPI document for the current auth-bearing routes.
- Mount `/api/v1/docs` in the Express app without adding `/api/v1/openapi.json`.
- Describe bearer-auth requirements and example request/response shapes for protected routes.
- Keep the implementation local/dev-friendly and narrow to existing auth-bearing endpoints.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Branch naming: PASS. `feat/CROWN-74-api-docs-swagger` matches the constitution for a Story.
- Commit/PR convention: PASS. Work on this branch will use `feat: CROWN-74 - ...` subjects and a squash-safe PR title.
- Planning gate: PASS. `CROWN-74` is progressing through `specify`, `plan`, and `tasks` before implementation.
- Testing discipline: PASS. The plan includes focused route coverage for the docs endpoint plus full API verification before handoff.
- Persistence and migration rule: PASS. No Prisma schema or migration changes are needed in this story.
- Scope control: PASS. The plan is constrained to local Swagger UI serving and documentation of existing auth-bearing endpoints only.

Post-design re-check: PASS. The design remains additive, local/dev-first, and avoids widening into public spec hosting or unrelated API redesign.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-74-api-docs-swagger/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── api-docs-swagger-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/api/
├── package.json
├── src/
│   ├── app.ts
│   ├── auth/
│   ├── routes/
│   └── middleware/
└── tests/
    ├── contract/
    └── integration/

specs/
├── CROWN-61-api-auth-foundation/
└── CROWN-74-api-docs-swagger/
```

**Structure Decision**: `CROWN-74` stays within the API workspace and its spec artifacts. The implementation surface is limited to API dependency wiring, a docs/OpenAPI module under `apps/api/src`, Express route registration in `app.ts`, and focused docs-route contract coverage.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
