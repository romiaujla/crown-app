# Contract: Foundational Tenant-Migration Handoff

## Purpose

Define what downstream `CROWN-31` through `CROWN-34` work is allowed to rely on from `CROWN-30`.

## Guaranteed Outputs

- A migration-backed tenant schema baseline that reflects the approved foundational `CROWN-29` model
- Explicit placement rules for `core` versus `tenant_<tenant_slug>`
- A reviewable migration delta from the earlier minimal baseline
- Foundational tenant-owned reference table boundaries
- A migration baseline suitable for downstream seed, bootstrap, and validation work
- A Prisma-authored tenant schema source plus the inspected generated SQL that downstream work can treat as the canonical bootstrap baseline

## Downstream Consumers

- `CROWN-31`: uses the migration baseline to define deterministic seed strategy and reset scope
- `CROWN-32`: uses the migration baseline to implement local seed loading
- `CROWN-33`: uses the migration baseline to integrate schema creation and seed/bootstrap flows
- `CROWN-34`: uses the migration baseline to define validation and setup expectations

## Placement Rule

- Shared platform-wide tables remain in `core`.
- Tenant-domain tables belong in `tenant_<tenant_slug>`.
- Tenant reference data remains tenant-local unless later governance explicitly promotes it to a truly global shared concern.

## Out Of Scope For This Contract

- Runtime route contracts
- Login behavior
- Super-admin or tenant-admin capability contracts
- Module or product-surface decisions

## Review Rule

If downstream stories need to redefine tenant-table placement, foundational entity shape, or the migration delta from the earlier baseline, `CROWN-30` must be revisited before implementation proceeds.
