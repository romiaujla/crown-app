# Quickstart: Tenant Provisioning and Schema Bootstrap

## Goal

Validate CROWN-5 planning artifacts and prepare for `/speckit.tasks` breakdown before implementation.

## Prerequisites

- Working branch: `feat/CROWN-5-tenant-provisioning-and-schema-bootstrap` (Jira-linked implementation branch)
- Planning artifacts path: `specs/005-crown-5`
- Dependencies installed: `pnpm install`
- Local PostgreSQL available (via `pnpm postgres`) for implementation-phase tests

## 1. Review planning artifacts

- Feature spec: `specs/005-crown-5/spec.md`
- Plan: `specs/005-crown-5/plan.md`
- Research decisions: `specs/005-crown-5/research.md`
- Data model: `specs/005-crown-5/data-model.md`
- Contracts:
  - `specs/005-crown-5/contracts/tenant-provisioning.openapi.yaml`
  - `specs/005-crown-5/contracts/tenant-migration-runner-contract.md`

## 2. Validate contract completeness

- Confirm provisioning endpoint includes:
  - success contract (`201`)
  - validation/auth/authorization/conflict/failure errors (`400/401/403/409/500`)
- Confirm migration runner contract defines:
  - deterministic ordering
  - skip-on-existing-version behavior
  - stop-on-failure behavior
  - retry semantics

## 3. Prepare implementation test matrix

- Contract tests:
  - super-admin can provision
  - non-super-admin denied
  - invalid slug rejected
  - duplicate slug returns conflict
- Integration tests (PostgreSQL/Testcontainers):
  - schema creation + baseline table creation
  - version tracking for each applied migration
  - retry after simulated mid-run migration failure

## 4. Ready state for `/speckit.tasks`

Proceed to task decomposition when:

- No unresolved clarification remains in `research.md`.
- Endpoint and migration runner contracts are accepted.
- Test scenarios map directly to spec success criteria (`SC-001` to `SC-005`).

## 5. Implementation execution notes (2026-03-03)

- `pnpm --filter @crown/api typecheck`: passed.
- `pnpm --filter @crown/api test`: passed with 12 files and 29 tests.
- Note: sandboxed test execution raised `listen EPERM`; rerun outside sandbox permissions completed successfully.
