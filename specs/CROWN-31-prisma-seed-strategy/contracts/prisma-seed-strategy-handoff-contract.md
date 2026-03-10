# Contract: Deterministic Prisma Seed-Strategy Handoff

## Purpose

Define what downstream `CROWN-32` through `CROWN-34` work is allowed to rely on from `CROWN-31`.

## Guaranteed Outputs

- A defined reset scope for local and future test seed usage
- A canonical baseline description for control-plane and tenant-domain seeded data
- Stable deterministic fixture key expectations
- A defined reset and load ordering strategy
- Explicit rerun and partial-failure recovery expectations
- Guidance that later implementation should use Prisma-backed seed entrypoints rather than ad hoc one-off workflows
- Guidance that later implementation should keep seed reset bounded to the canonical seeded tenant and minimum required control-plane access rows

## Downstream Consumers

- `CROWN-32`: uses the strategy to implement the runnable Prisma seed entrypoint and reset command
- `CROWN-33`: uses the strategy to integrate resettable seeds into bootstrap and test workflows
- `CROWN-34`: uses the strategy to validate deterministic keys, rerun safety, and setup documentation

## Baseline Rule

- The seeded dataset must follow the `CROWN-30` foundational tenant schema baseline.
- Shared platform data remains in `core` and tenant-domain seeded data remains in `tenant_<tenant_slug>`.
- Stable business keys are the intended downstream lookup contract for seeded fixtures.
- Control-plane operator lookup should use stable platform user email addresses rather than generated IDs.
- Migration-state retention for the seeded tenant is part of the default contract unless a later story explicitly changes the reset model.

## Reset And Recovery Rule

- Downstream implementation must treat rerun as a full retry to the canonical baseline.
- Downstream implementation may upsert the minimum control-plane baseline but must not clear unrelated tenants or unrelated platform users.
- Downstream implementation must reset and reload tenant-domain data in dependency-safe order rather than relying on record-order side effects.
- Downstream implementation must be safe to rerun after partial failure without requiring manual cleanup of previously seeded rows.

## Out Of Scope For This Contract

- Actual Prisma seed implementation
- Runtime API contracts
- Tenant-facing workflow behavior
- Module-specific sample data beyond the foundational representative baseline

## Review Rule

If downstream work needs to redefine reset boundaries, deterministic lookup keys, or recovery expectations, `CROWN-31` must be revisited before implementation proceeds.
