# Implementation Plan: Global Auth and RBAC Foundation

**Branch**: `001-jwt-rbac-foundation` | **Date**: 2026-03-02 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/001-jwt-rbac-foundation/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/001-jwt-rbac-foundation/spec.md)
**Input**: Feature specification from `/specs/001-jwt-rbac-foundation/spec.md`

## Summary

Define an executable auth and authorization contract baseline for Crown by formalizing JWT claim requirements, role policy boundaries, tenant-scope enforcement rules, and route/middleware contracts for `/api/v1/auth/*`, `/api/v1/platform/*`, and `/api/v1/tenant/*`. The implementation plan centers on shared claim validation and explicit role decision rules aligned with existing architecture docs.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20 (repo baseline)  
**Primary Dependencies**: Express 4, Zod 3, Prisma 5, Pino 9  
**Storage**: PostgreSQL (via Prisma), plus JWT claim payload validation in request context  
**Testing**: Vitest + Supertest for API and middleware contract coverage  
**Target Platform**: Linux server runtime for API service (`@crown/api`)  
**Project Type**: Monorepo web application with API + web app packages  
**Performance Goals**: 100% protected-route decision coverage with deterministic allow/deny behavior and no uncategorized protected operations  
**Constraints**: Enforce tenant isolation for non-`super_admin`; reject malformed or incomplete claim sets; maintain additive, reviewable scope limited to auth/RBAC contracts  
**Scale/Scope**: 3 roles, 3 API namespaces, auth route contracts (login/refresh/logout), middleware contract for protected endpoints

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Reference constitution: `docs/process/engineering-constitution.md`

- Branch/commit policy: PASS for planning branch context (`001-jwt-rbac-foundation` contains feature artifact set; implementation branch naming remains governed by Jira policy for code delivery PRs).
- Jira traceability and scope: PASS; plan is scoped to CROWN-4 and aligns with feature spec requirements.
- Coding standards: PASS (TypeScript strict mode, Zod validation, cohesive modules, tests required for behavior changes).
- Planning gate for major features: PASS; `/specify` complete and `/plan` artifacts being generated before implementation.
- PR/release constraints: PASS; no PR scope expansion or release behavior changes introduced in plan.

Post-design re-check: PASS (no constitutional violations introduced by generated design artifacts).

## Project Structure

### Documentation (this feature)

```text
specs/001-jwt-rbac-foundation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── auth-routes.openapi.yaml
│   └── middleware-rbac-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/
├── api/
│   ├── src/
│   │   ├── app.ts
│   │   ├── routes/
│   │   ├── config/
│   │   └── tenant/
│   ├── prisma/
│   └── vitest.config.ts
└── web/
    ├── app/
    └── tests/

packages/
├── types/
│   └── src/index.ts
├── ui/
└── config/
```

**Structure Decision**: Use the existing monorepo API-first structure with auth/RBAC contracts authored in feature docs and implemented primarily in `apps/api` plus shared claim schemas in `packages/types`.

## Complexity Tracking

No constitution violations requiring exception rationale.
