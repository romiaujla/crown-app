# Quickstart: Align Domain Schemas With Management-System Pivot

## Goal

Validate the `CROWN-6` pivot work from current-state audit through design-ready baseline artifacts.

## Steps

1. Review the current tenant-domain baseline in:
   - `apps/api/tenant-migrations/0001_base/`
   - `docs/architecture/api-boundaries.md`
   - `docs/architecture/multi-tenant-model.md`
   - `specs/005-crown-5/`
2. Produce the tenant-domain audit using the rules in `contracts/tenant-domain-audit-contract.md`.
3. Confirm every existing tenant-domain artifact has a disposition.
4. Validate the audit completeness checklist:
   - every pre-pivot migration artifact is listed
   - every tenant-domain documentation reference is listed
   - every tenant-domain contract example is listed
   - every listed artifact has one disposition
   - every generalized or replaced artifact has a target concept
   - every replaced or deprecated artifact has compatibility handling
5. Validate the new baseline against at least two tenant-system examples:
   - dealer-management system
   - transportation-management system
6. Review the proposed baseline against `contracts/tenant-domain-boundaries.md`.
   - confirm the baseline supports both examples without renaming core entities
   - confirm no baseline concept depends on a sales pipeline
7. Review the operator transition notes and confirm that a pre-pivot tenant can be mapped from:
   - `accounts` -> `organizations`
   - `contacts` -> `people`
   - `deals` -> `work_items`
   - `activities` -> `activity_records`
8. Run repository validation before implementation:
   - `pnpm typecheck`
   - targeted API and tenant-migration tests once implementation tasks exist

## Expected Outcome

- Existing CRM-shaped tenant-domain artifacts are fully accounted for
- A management-system-oriented tenant baseline is defined
- Compatibility handling for pre-pivot tenant environments is documented
- The feature is ready for implementation task execution

## Validation Notes

- 2026-03-08: `pnpm --filter @crown/api typecheck` passed
- 2026-03-08: `pnpm --filter @crown/api exec vitest run tests/integration/tenant-bootstrap-migrations.spec.ts tests/integration/tenant-schema-versioning.spec.ts tests/contract/platform-tenant-provision.contract.spec.ts tests/integration/tenant-provisioning.spec.ts` passed
