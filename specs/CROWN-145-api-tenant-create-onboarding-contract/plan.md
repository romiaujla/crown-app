# Implementation Plan: API Tenant Create Onboarding Contract

**Branch**: `feat/CROWN-145-api-tenant-create-onboarding-contract` | **Date**: 2026-03-17 | **Spec**: `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-145-api-tenant-create-onboarding-contract/spec.md`  
**Input**: Feature specification from `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-145-api-tenant-create-onboarding-contract/spec.md`

## Summary

Define and wire the v1 guided tenant-create submission contract for `POST /api/v1/platform/tenant` so one request schema includes tenant info, selected roles, and initial user assignments. The plan keeps this story contract-only: shared schema definitions in `@crown/types`, API route validation wiring, and manual OpenAPI alignment, without adding provisioning workflow behavior for user creation or role assignment persistence.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Zod 4, Express 4  
**Primary Dependencies**: `@crown/types`, `@crown/api`, manual OpenAPI source  
**Storage**: PostgreSQL via existing provisioning service (no persistence model changes for this story)  
**Testing**: Vitest contract tests in `apps/api/tests/contract`, OpenAPI contract checks in `apps/api/tests/integration/api-docs.spec.ts`, `pnpm --filter @crown/api typecheck`  
**Target Platform**: API and shared contract package in monorepo  
**Project Type**: API contract refinement + documentation update  
**Performance Goals**: No behavioral/performance regression; request validation remains O(n) over user assignments  
**Constraints**: Keep route protected as-is; keep provisioning behavior unchanged; enforce v1 bootstrap constraints at contract layer; update OpenAPI for route contract changes  
**Scale/Scope**: One route contract shape update, shared schema additions, docs + tests updates

## Constitution Check

_GATE: Must pass before implementation. Re-check after design._

- Branch naming: PASS. `feat/CROWN-145-api-tenant-create-onboarding-contract` matches Story convention.
- Commit format: PASS. Planned commits use `feat: CROWN-145 - ...`.
- Planning gate: PASS. `spec.md`, `plan.md`, `tasks.md` will be completed before implementation.
- Shared contracts: PASS. New onboarding request/response schemas will live in `packages/types/src/index.ts` and be reused by API route validation.
- API/OpenAPI alignment: PASS. `apps/api/src/docs/openapi.ts` will be updated for changed request schema surface.
- Scope guardrails: PASS. No provisioning workflow side effects added (no user creation persistence or role-assignment workflow changes).
- Testing: PASS. Contract and docs tests plus API typecheck will be run.

Post-design re-check: PASS. Design remains contract-definition-only and follows documented route-surface update policy.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-145-api-tenant-create-onboarding-contract/
├── spec.md
├── plan.md
└── tasks.md
```

### Source Code (repository root)

```text
packages/types/
└── src/
    └── index.ts

apps/api/
├── src/
│   ├── tenant/
│   │   └── contracts.ts
│   ├── routes/
│   │   └── platform-tenants.ts
│   └── docs/
│       └── openapi.ts
└── tests/
    ├── contract/
    │   └── platform-tenant-provision.contract.spec.ts
    └── integration/
        └── api-docs.spec.ts
```

**Structure Decision**: Keep onboarding contract source-of-truth in `@crown/types`, keep API route mapping in existing tenant contracts/router files, and reflect request-shape changes in OpenAPI/tests only.

## Implementation Outline

1. Add new shared onboarding schemas/types in `packages/types/src/index.ts`.
2. Reuse those schemas inside `apps/api/src/tenant/contracts.ts` exports for the provisioning endpoint contract.
3. Update `apps/api/src/routes/platform-tenants.ts` mapping to read `tenant` nested fields from the onboarding payload while preserving existing provisioning call behavior.
4. Update OpenAPI component schemas and `/api/v1/platform/tenant` request schema references.
5. Update/extend contract and docs tests for new payload shape and constraint failures.
6. Run focused verification and finalize with PR + Jira transition.

## Complexity Tracking

No constitution exception required for this feature.
