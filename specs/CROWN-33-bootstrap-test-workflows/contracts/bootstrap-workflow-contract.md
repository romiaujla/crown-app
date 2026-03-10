# Contract: Local Bootstrap And Test Preparation Workflow

## Purpose

Define the supported foundational workflow that prepares schema and canonical seed baseline state for local development and later automated test reuse.

## Supported Local Workflow

- Local maintainers have one documented bootstrap path that prepares control-plane schema state and the canonical seeded tenant baseline.
- The canonical local seed command remains the supported baseline loader.
- The workflow may be rerun from empty or partially prepared local state without widening the reset boundary.

## Guaranteed Outcomes

- Control-plane database setup is complete before the canonical baseline is required.
- The canonical tenant schema exists and is migrated before seeded tenant-domain data is loaded.
- The canonical seeded baseline from `CROWN-32` remains the shared source of truth for local and later automated setup.
- Unrelated tenants, unrelated platform users, and unrelated platform history remain outside the canonical refresh boundary.
- Later e2e or container-based workflows can reuse the same canonical preparation contract rather than defining a separate baseline.

## Preparation Order

1. Start local database services.
2. Prepare the control-plane schema state required by the API workspace.
3. Load API-local environment configuration.
4. Run the canonical local seed workflow to ensure the canonical tenant schema and canonical seeded baseline.
5. Reuse that same baseline contract in later automated or containerized setup flows.

## Multi-Tenant Coverage Rule

- The foundational workflow directly prepares one canonical seeded tenant.
- Unrelated tenants may coexist locally and must remain untouched by canonical bootstrap reruns.
- Later validation workflows may add tenant-scoped comparison steps, but they must not redefine the canonical baseline or its reset boundary.

## Out Of Scope

- Feature-specific product APIs
- Rich demo or sample datasets beyond the foundational baseline
- Hardcoded design for one automation platform or container stack
- Later validation assertions that belong in `CROWN-34`

## Review Rule

If implementation needs to widen the reset boundary, redefine the canonical seeded baseline, or introduce a separate automated-test seed contract, `CROWN-31` through `CROWN-33` planning artifacts must be revisited before code changes proceed.
