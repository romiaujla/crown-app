# Research: Implement Resettable Local Seed Runner And Baseline Dataset

## Decision 1: Use A Prisma-Native Seed Entrypoint As The Canonical Local Command

- **Decision**: Implement the local baseline loader behind a Prisma-recognized seed entrypoint in `apps/api` and expose one canonical developer-facing seed command through the workspace package scripts.
- **Rationale**: `CROWN-31` explicitly hands off a Prisma-backed seed entrypoint, and the repository already uses Prisma for control-plane access in `apps/api`. Keeping the seed flow behind Prisma’s standard entrypoint avoids inventing a parallel local-only reset mechanism.
- **Alternatives considered**:
  - Build a standalone SQL-only reseed script: rejected because it would bypass the intended Prisma seed surface and fragment the local workflow.
  - Hide seeding behind an ad hoc application route: rejected because the story is for local development setup, not runtime API behavior.

## Decision 2: Split Seeding Into Control-Plane Ensure, Tenant Reset, And Tenant Reload Phases

- **Decision**: Structure the local seed flow into three explicit phases:
  1. ensure the canonical tenant and minimum platform access rows exist,
  2. reset the seeded tenant-domain schema in dependency-safe order,
  3. reload the canonical tenant-domain baseline in dependency-safe order.
- **Rationale**: The control-plane models in `apps/api/prisma/schema.prisma` and tenant-domain models in `apps/api/prisma/transportation-management-system-schema.prisma` have different reset rules. Separating ensure/reset/reload phases keeps unrelated platform data protected while giving reruns a deterministic recovery path.
- **Alternatives considered**:
  - One opaque reset transaction for everything: rejected because control-plane data should be ensured idempotently, not destructively recreated.
  - Record-by-record repair after failure: rejected because `CROWN-31` defines rerun as a full retry back to the canonical baseline.

### Reset Boundary Detail

- Preserve unrelated tenants, unrelated platform users, unrelated tenant memberships, and unrelated audit history.
- Preserve migration-state knowledge for the seeded tenant in `core.tenant_schema_versions`.
- Upsert only the minimum control-plane baseline needed for:
  - the seeded tenant identity
  - the seeded tenant schema assignment
  - seeded platform users used for deterministic local access
  - seeded platform-user-to-tenant memberships
- Clear and reload only tenant-domain records inside the canonical `tenant_<tenant_slug>` schema.

## Decision 3: Use Stable Business Keys As The Seed Lookup Contract

- **Decision**: All baseline fixture loading and downstream references should resolve through stable business identifiers rather than generated UUIDs.
- **Rationale**: The domain and migration handoffs already define stable tenant slug, organization code, location code, person code, role code, asset code, load code, and reference-data-set code expectations. Those keys make reruns readable, reviewable, and safe even when UUID primary keys are regenerated.
- **Alternatives considered**:
  - Hardcode UUIDs in source fixtures: rejected because UUID regeneration should not break the local fixture contract.
  - Depend on insertion order: rejected because it is brittle and hard to validate.

### Canonical Deterministic Keys

- Control-plane:
  - tenant slug
  - tenant schema name
  - platform user email
- Tenant-domain:
  - `data_set_code`
  - `organization_code`
  - `location_code`
  - `person_code`
  - `role_code`
  - `asset_code`
  - `load_code`
- Derived relationships:
  - load-stop identity via `load_code + stop_sequence`
  - activity context via subject business key plus `activity_type`

## Decision 4: Keep The Initial Baseline Small, Representative, And Additive

- **Decision**: Seed one representative tenant with enough foundational records to exercise the `CROWN-30` schema relationships, but do not pack the baseline with feature-specific or demo-only records.
- **Rationale**: The Jira story and `CROWN-31` strategy both call for a foundational dataset that can grow over time without redefining the reset contract. Small, representative coverage keeps reseeds fast and comprehensible.
- **Alternatives considered**:
  - Seed every plausible workflow variant now: rejected because it would front-load fixture sprawl before those product areas exist.
  - Seed only control-plane records: rejected because local development also needs representative tenant-domain data to be useful.

### Baseline Coverage

- Seed one canonical tenant.
- Seed minimum control-plane access for one platform-level operator path and one tenant-level operator path if both are needed for local inspection.
- Seed foundational tenant-owned reference data.
- Seed multiple organizations and locations.
- Seed multiple people, tenant role definitions, and role assignments.
- Seed multiple equipment assets.
- Seed multiple loads with ordered stops.
- Seed a small activity history tied to representative subject records.

## Decision 5: Validate Behavior With Integration Tests Around Reruns And Boundaries

- **Decision**: Add integration tests that exercise at least:
  - successful first run,
  - successful repeated rerun,
  - preservation of unrelated out-of-scope records,
  - rerun recovery after partial failure.
- **Rationale**: The core risk in this story is not isolated pure logic. It is operational behavior across control-plane plus tenant-domain boundaries. Integration tests are the most defensible way to prove rerun safety and reset correctness.
- **Alternatives considered**:
  - Unit tests only around fixture builders: rejected because they would not prove boundary preservation or rerun safety.
  - Manual verification only: rejected because the constitution prefers deterministic quality gates.

### Test Strategy Detail

- Reuse existing `apps/api/tests/integration` patterns and helper utilities where practical.
- Treat the seed command as the public behavior under test, with fixture verification performed by querying control-plane and seeded tenant-domain records.
- Simulate partial failure at a controlled point in the tenant-domain load phase, then verify a subsequent rerun restores the canonical baseline.
