# Research: Detailed Tenant-Domain Model For Foundational TMS Baseline

## Decision 1: Use A TMS-Oriented But Foundational Tenant Model

- **Decision**: Define the next tenant-domain baseline around TMS-oriented foundational entities rather than retaining only the generic `work_items` framing from the minimal seed baseline.
- **Rationale**: `CROWN-23` is explicitly the next foundational TMS baseline epic. Downstream schema, seed, and role stories need a model that is concrete enough to express later transportation workflows without forcing repeated reinterpretation of generic placeholders.
- **Alternatives considered**:
  - Keep the current generic `organizations` / `people` / `work_items` / `activity_records` baseline unchanged: rejected because it is too abstract to guide richer migration and seed design.
  - Jump directly to full product modules: rejected because `CROWN-29` must remain foundational and not absorb later capability behavior.

## Decision 2: Separate Reference Data From Seed Fixtures

- **Decision**: Model reusable reference data separately from seeded fixture records and make that boundary explicit in the specification.
- **Rationale**: Local seeding and later automated tests need deterministic data, but not every seeded record should become a reusable catalog. Distinguishing catalogs from fixtures keeps later seed growth manageable.
- **Alternatives considered**:
  - Treat all baseline records as simple seed fixtures: rejected because it would blur catalogs such as statuses, role labels, or equipment classes with scenario-specific sample data.
  - Treat all baseline records as reference data: rejected because it would overstate the permanence of seeded demo/test records.

## Decision 3: Require Stable Fixture Keys For Downstream Seeds And Tests

- **Decision**: The foundational model must identify stable slugs, codes, or lookup keys where later seed and test workflows are expected to rely on deterministic records.
- **Rationale**: The local resettable seed direction under `CROWN-23` depends on predictable fixture lookup behavior. Stable identifiers reduce brittle coupling to generated IDs or mutable display names.
- **Alternatives considered**:
  - Let downstream stories choose fixture identifiers ad hoc: rejected because it would fragment test expectations and local seed maintenance.
  - Depend only on generated database IDs: rejected because IDs are poor contracts for design-time fixture intent.

## Decision 4: Keep Identity, Admin, And API Capability Behavior Out Of Scope

- **Decision**: Restrict the feature to foundational tenant-domain structure and explicit handoff for `CROWN-30` through `CROWN-34`.
- **Rationale**: The epic has already separated schema, seed, bootstrap, and validation work into later stories. Pulling role workflows or APIs into this story would collapse those boundaries and expand the story beyond foundation.
- **Alternatives considered**:
  - Add tenant-admin and tenant-user behavior directly into the model story: rejected because those belong to later epics and stories.
  - Limit the story to a shallow entity list only: rejected because downstream stories still need relationship, state, and fixture-boundary guidance.

## Decision 5: Use `core` Only For Platform-Wide Shared Tables

- **Decision**: Treat `core` as the shared schema for platform-wide tables used across tenants, while keeping TMS tenant-domain tables inside schemas named `tenant_<tenant_slug>`.
- **Rationale**: This preserves a clean separation between shared control-plane concerns and tenant-owned domain data, which reduces cross-tenant coupling and keeps later migration and seed work aligned to tenant isolation.
- **Alternatives considered**:
  - Put all shared-looking lookup data in `core`: rejected because many foundational TMS catalogs are still tenant-owned and should remain tenant-scoped.
  - Let tenant schemas use ad hoc names: rejected because downstream provisioning and migration flows need a stable schema naming pattern.
