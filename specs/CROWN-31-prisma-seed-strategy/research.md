# Research: Design Deterministic Prisma Local Seed Strategy For Development And Testing

## Decision 1: Use `CROWN-30` As The Seed-Baseline Source Of Truth

- **Decision**: Treat the Prisma-authored tenant migration baseline from `CROWN-30` as the structural source of truth for what seed data must support.
- **Rationale**: The seed strategy should not reinterpret foundational schema shape after the migration baseline is approved. This keeps seed design aligned to the actual tenant tables and allowed lifecycle values.
- **Alternatives considered**:
  - Re-open entity shape during seed design: rejected because it would duplicate `CROWN-29` and `CROWN-30` decisions.
  - Define a seed strategy before the migration baseline: rejected because reset and fixture rules need a concrete table baseline.

## Decision 2: Reset Tenant-Domain Data, Not All Platform Data

- **Decision**: The reset path should clear tenant-domain seeded data inside `tenant_<tenant_slug>` and only the minimum control-plane records needed to recreate or reference the seeded tenant baseline.
- **Rationale**: Local reseeds need to be safe and predictable without turning every run into a destructive reset of unrelated platform metadata.
- **Alternatives considered**:
  - Reset the entire database on every run: rejected because it is unnecessarily destructive and weakens later shared-platform workflows.
  - Never reset control-plane records: rejected because some seeded tenant baselines still need deterministic tenant identities and memberships.

### Reset Boundary Detail

- Reset tenant-domain rows in the seeded tenant schema, including tenant-owned reference data, organizations, locations, people, role definitions and assignments, equipment assets, loads, load stops, and activity records.
- Retain unrelated tenant schemas and unrelated platform records.
- Keep migration-history knowledge for the seeded tenant intact unless a later implementation story proves that schema recreation is part of the intended local reset flow.
- Allow later implementation to upsert or reconcile the minimum control-plane baseline for:
  - seeded tenant identity
  - seeded tenant schema assignment
  - seeded platform user identities needed for local access
  - seeded platform-user-to-tenant access rows

## Decision 3: Use Stable Business Keys For Deterministic Fixture Reuse

- **Decision**: Deterministic fixture references should rely on stable business identifiers, slugs, or codes rather than insertion order or raw primary keys.
- **Rationale**: Stable business keys are easier to read, safer to reuse across local and containerized tests, and remain valid even when UUID primary keys are regenerated.
- **Alternatives considered**:
  - Depend on record order: rejected because it is brittle and hard to review.
  - Depend directly on generated UUIDs: rejected because the strategy should remain robust when IDs are regenerated or reloaded.

### Canonical Deterministic Keys

- Tenant baseline:
  - tenant slug
  - tenant schema name
- Control-plane baseline:
  - platform user email
  - platform user display-name convention only where needed for review
- Tenant-domain baseline:
  - `organization_code`
  - `location_code`
  - `person_code`
  - `role_code`
  - `asset_code`
  - `load_code`
  - `data_set_code`
- Derived or non-canonical records such as activity rows should be referenced through the stable business key of their subject record plus activity type rather than through transient insertion order.

## Decision 4: Design For Safe Reruns After Partial Failure

- **Decision**: The strategy must assume that a reset or load can fail partway through and must define a rerun path that returns the environment to the canonical baseline without manual cleanup steps.
- **Rationale**: Local development and future automated test environments both depend on reliable recovery after interrupted resets or partial seed loads.
- **Alternatives considered**:
  - Treat partial failures as manual-recovery problems: rejected because developers will stop trusting the seed workflow.
  - Skip recovery guidance until implementation: rejected because the reset order and scope depend on it.

### Recovery Expectation Detail

- If a failure occurs before tenant-domain data is cleared, rerun should reconcile the minimum control-plane baseline and continue with a full reset plus reload.
- If a failure occurs after tenant-domain data is cleared but before all baseline data is reloaded, rerun should repeat the full tenant-domain reset and full baseline load rather than attempt record-by-record repair.
- If a failure occurs after control-plane records are ensured but before tenant-domain load completes, rerun should treat those control-plane rows as idempotent prerequisites rather than as a reason to abort.
- The strategy assumes later implementation may use transactional phases where practical, but the design must remain safe even when the entire reset and load lifecycle is not one database transaction.

## Decision 5: One Canonical Baseline, Multiple Future Execution Contexts

- **Decision**: `CROWN-31` defines one canonical seed strategy that later execution paths can use in local development and future containerized or e2e contexts.
- **Rationale**: A single baseline strategy reduces divergence between local and automated environments and keeps downstream stories focused on execution rather than redefining fixture intent.
- **Alternatives considered**:
  - Separate local and test strategies from the start: rejected because it would create drift before the first runnable seed implementation exists.
  - Optimize only for local use: rejected because the Jira story explicitly anticipates future containerized or automated test usage.

### Canonical Baseline Shape

- One representative seeded tenant with a deterministic slug and schema name
- Minimal seeded control-plane access needed to sign in and inspect that tenant locally
- One foundational tenant-owned reference-data baseline
- Enough organizations, locations, people, roles, assets, loads, stops, and activities to cover the foundational TMS relationships from `CROWN-29` and `CROWN-30`
- A dataset small enough to reset quickly during repeated local development
