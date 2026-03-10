# Data Model: Design Deterministic Prisma Local Seed Strategy For Development And Testing

## Overview

`CROWN-31` does not introduce new product entities. It defines the strategy objects and seeded data expectations that later Prisma seed implementation work will follow.

## Strategy Entities

### SeedBaseline

- **Purpose**: Represents the canonical local and future test baseline that the seed process is expected to recreate.
- **Key attributes**:
  - Baseline tenant slug and schema name
  - Baseline control-plane records required for seeded tenant access
  - Baseline tenant-domain data areas
  - Representative workflow coverage
  - Dataset size boundary
- **Validation rules**:
  - Must be small enough for repeated local use
  - Must be representative enough for downstream workflows and tests
  - Must use one canonical baseline definition across local and future containerized contexts

### ResetScope

- **Purpose**: Defines which records are cleared before the seed baseline is reloaded.
- **Key attributes**:
  - Tenant-domain reset boundary
  - Control-plane reset boundary
  - Excluded records or areas
  - Reset order
- **Validation rules**:
  - Must prevent partial stale baseline state from surviving across reruns
  - Must not destroy unrelated data outside the agreed reset boundary

### SeededControlPlaneBaseline

- **Purpose**: Defines the minimum platform-side records that later implementation must ensure before or during a seed rerun.
- **Key attributes**:
  - Tenant identity row
  - Tenant schema assignment
  - Seeded platform operator identities
  - Seeded platform-user-to-tenant access rows
  - Migration-state retention rule
- **Validation rules**:
  - Must remain minimal and directly tied to the seeded tenant baseline
  - Must not imply a full platform reset

### SeededTenantDomainBaseline

- **Purpose**: Defines the representative tenant-domain records that make the canonical seeded tenant useful for local development.
- **Key attributes**:
  - Tenant-owned reference data sets
  - Organizations and locations
  - People and tenant role definitions and assignments
  - Equipment assets
  - Loads and load stops
  - Activity records
- **Validation rules**:
  - Must reflect the `CROWN-30` transportation-management-system schema baseline
  - Must avoid feature-specific sample sprawl

### DeterministicFixtureKey

- **Purpose**: Represents a stable lookup identifier that local workflows and future tests can rely on.
- **Key attributes**:
  - Record domain
  - Stable code or slug
  - Intended consumer
  - Expected uniqueness boundary
- **Validation rules**:
  - Must remain stable across reruns
  - Must be human-reviewable and not depend on record order

### SeedOrderingRule

- **Purpose**: Represents the required sequence for clearing and reloading baseline data.
- **Key attributes**:
  - Reset phase
  - Load phase
  - Dependency ordering
  - Failure boundary
- **Validation rules**:
  - Must respect schema relationships from `CROWN-30`
  - Must support safe reruns after partial failure

### RecoveryExpectation

- **Purpose**: Represents how the seed process is expected to recover from interrupted or partial work.
- **Key attributes**:
  - Failure point category
  - Expected rerun behavior
  - Manual intervention expectation
  - Completion signal
- **Validation rules**:
  - Must define whether rerun alone is sufficient
  - Must be understandable for both local and automated test contexts

## Seeded Data Areas

### Control-Plane Baseline

- **Purpose**: The minimum tenant and membership records needed to make the seeded tenant usable.
- **Expected contents**:
  - Seeded tenant identity in the shared control-plane tables
  - Seeded tenant schema reference using `tenant_<tenant_slug>`
  - Seeded platform user identities for deterministic local access
  - Seeded platform-user-to-tenant access references
  - Retained tenant migration-state records when later implementation depends on them
- **Boundary**:
  - Keep this minimal and directly tied to the seeded tenant baseline
  - Do not clear unrelated tenants, unrelated operator identities, or unrelated audit history

### Tenant-Domain Baseline

- **Purpose**: Representative tenant data inside `tenant_<tenant_slug>` that supports local development and future test scenarios.
- **Expected contents**:
  - Tenant-owned reference data sets
  - Organizations and locations
  - People and tenant role definitions and assignments
  - Equipment assets
  - Loads and load stops
  - Activity records
- **Boundary**:
  - Must reflect the `CROWN-30` foundational schema
  - Must avoid feature-specific data sprawl

## Canonical Baseline Shape

- One seeded tenant with a stable tenant slug and deterministic schema name
- One seeded super-admin-compatible platform operator path for local inspection if later implementation needs it
- One seeded tenant-admin-compatible operator path for tenant inspection if later implementation needs it
- A compact but representative tenant dataset:
  - multiple organizations
  - multiple locations
  - multiple people
  - reusable role definitions and assignments
  - multiple equipment assets
  - multiple loads with ordered stops
  - activity history tied to representative subjects
- A size boundary that favors fast local reseed over exhaustive demo coverage

## Deterministic Lookup Strategy

- Prefer stable business keys such as tenant slug, organization codes, person codes, role codes, asset codes, load codes, and reference-data codes.
- Use stable platform user email addresses for control-plane operator lookup.
- Use stable location codes for stop and organization navigation.
- Avoid record-order assumptions.
- Avoid using regenerated UUIDs as the primary fixture lookup contract.

## Seed Ordering Guidance

1. Ensure the minimum control-plane baseline for the seeded tenant and seeded operator access exists.
2. Reset tenant-domain data inside `tenant_<tenant_slug>` in dependency-safe order.
3. Reload tenant-owned reference data before records that depend on those catalogs.
4. Reload organizations and locations before people, assets, loads, and load stops.
5. Reload people and role catalogs before role assignments and actor-dependent activities.
6. Reload loads before load stops and activity rows that reference those subjects.
7. Reload activity rows last.

## Recovery Model

- A rerun is expected to be safe without manual cleanup.
- Later implementation should treat control-plane baseline setup as idempotent.
- Later implementation should treat tenant-domain reset plus reload as the canonical recovery path after partial failure.
- Partial record repair is not part of the foundational contract for this story.
