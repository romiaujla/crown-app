# Contract: Foundational Tenant-Model Handoff

## Purpose

Define what downstream `CROWN-30` through `CROWN-34` work is allowed to rely on from `CROWN-29`.

## Guaranteed Outputs

- A named set of foundational tenant-domain entities for the next TMS baseline
- Core entity relationships and lifecycle/state boundaries
- Explicit `core` versus `tenant_<tenant_slug>` schema placement rules for downstream migration design
- Explicit separation between reusable reference data and seeded fixture records
- Stable fixture identifiers or slugs where later seed/test workflows need deterministic records
- Clear scope boundary that excludes later capability-specific APIs

## Downstream Consumers

- `CROWN-30`: uses the model as the source of truth for migration scope
- `CROWN-31`: uses the model to define resettable seed and reference-data strategy
- `CROWN-32`: uses the model to implement deterministic local seed fixtures
- `CROWN-33`: uses the model to integrate schema and seed setup into local/test workflows
- `CROWN-34`: uses the model to define validation expectations for seeded keys and reusable setup

## Placement Rule

- Shared platform-wide tables belong in `core`.
- Tenant-domain tables belong in `tenant_<tenant_slug>`.
- Tenant reference data remains tenant-local unless later governance explicitly promotes it to a truly global shared catalog.

## Out Of Scope For This Contract

- Runtime route contracts
- Login behavior
- Super-admin or tenant-admin capability contracts
- Dispatcher or driver execution behavior

## Review Rule

If downstream work requires redefining foundational entities, fixture-key strategy, or reference-data boundaries, `CROWN-29` must be revisited before implementation proceeds.
