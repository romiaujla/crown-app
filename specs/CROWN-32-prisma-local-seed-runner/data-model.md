# Data Model: Implement Resettable Local Seed Runner And Baseline Dataset

## Overview

`CROWN-32` does not add new product-facing domain entities. It defines the runnable seed-runner objects, canonical baseline groupings, and reset/load relationships that implementation in `apps/api` must honor.

## Seed Runner Entities

### LocalSeedCommand

- **Purpose**: Represents the canonical developer-facing action that resets and reloads the baseline dataset.
- **Key attributes**:
  - command name
  - execution environment
  - supported rerun behavior
  - success and failure exit conditions
- **Validation rules**:
  - Must have one clear local invocation path
  - Must be safe to run repeatedly against the same canonical tenant baseline

### SeedExecutionPhase

- **Purpose**: Represents one ordered phase within the seed workflow.
- **Key attributes**:
  - phase name
  - dependency order
  - idempotency expectation
  - failure boundary
- **Validation rules**:
  - Must enforce control-plane ensure before tenant reset
  - Must reload tenant-domain fixtures only after reset completion

### ControlPlaneSeedBaseline

- **Purpose**: Represents the minimum shared records required to make the canonical tenant usable locally.
- **Key attributes**:
  - tenant row
  - tenant schema name
  - platform user identities
  - platform-user-to-tenant memberships
  - tenant schema version retention rule
- **Validation rules**:
  - Must stay limited to the canonical tenant and minimum required access rows
  - Must be ensured idempotently rather than destructively reset

### TenantDomainSeedBaseline

- **Purpose**: Represents the canonical tenant-owned dataset loaded into `tenant_<tenant_slug>`.
- **Key attributes**:
  - reference data sets
  - organizations
  - locations
  - people
  - tenant role definitions and assignments
  - equipment assets
  - loads
  - load stops
  - activity records
- **Validation rules**:
  - Must reflect the `CROWN-30` schema baseline
  - Must remain compact and foundational

### DeterministicSeedKey

- **Purpose**: Represents the stable lookup contract for seeded records.
- **Key attributes**:
  - domain area
  - business key
  - uniqueness boundary
  - downstream consumers
- **Validation rules**:
  - Must stay stable across reruns
  - Must not depend on generated primary keys or insertion order

### ResetBoundary

- **Purpose**: Represents the exact records eligible for deletion or replacement during a rerun.
- **Key attributes**:
  - included control-plane records
  - excluded control-plane records
  - included tenant-domain tables
  - excluded unrelated schemas and rows
- **Validation rules**:
  - Must protect unrelated tenant and platform data
  - Must align to the `CROWN-31` reset strategy

### SeedFailureRecoveryPath

- **Purpose**: Represents how the workflow behaves after an interrupted reset or reload.
- **Key attributes**:
  - failure phase
  - expected next rerun behavior
  - manual intervention expectation
  - completion signal
- **Validation rules**:
  - Must allow a clean rerun path without bespoke repair steps
  - Must leave the environment recoverable by the canonical command

## Canonical Baseline Composition

### Control-Plane Group

- **Purpose**: Make the seeded tenant discoverable and usable from shared platform data.
- **Expected contents**:
  - one seeded tenant with stable slug and schema name
  - minimum seeded platform users identified by stable email addresses
  - seeded tenant memberships for those platform users
  - retained tenant schema version rows for the canonical tenant
- **Boundary**:
  - do not clear unrelated tenants or unrelated users
  - do not clear shared audit history unrelated to the canonical baseline

### Tenant-Domain Group

- **Purpose**: Provide a representative working tenant dataset inside `tenant_<tenant_slug>`.
- **Expected contents**:
  - tenant-owned reference data sets
  - organizations and locations
  - people plus role definitions and assignments
  - equipment assets
  - loads, load stops, and activities
- **Boundary**:
  - reset and reload only the canonical seeded tenant schema
  - keep the dataset small enough for frequent local reruns

## Deterministic Lookup Map

- Tenant: `slug`
- Tenant schema: `schema_name`
- Platform user: `email`
- Reference data set: `data_set_code`
- Organization: `organization_code`
- Location: `location_code`
- Person: `person_code`
- Tenant role definition: `role_code`
- Equipment asset: `asset_code`
- Load: `load_code`
- Load stop: `load_code + stop_sequence`
- Activity record: `subject business key + activity_type + occurred_at semantic slot`

## Seed Ordering Model

1. Ensure the canonical tenant and minimum platform memberships exist.
2. Resolve the canonical tenant schema target.
3. Clear tenant-domain tables in reverse dependency order inside the canonical tenant schema.
4. Reload tenant-owned reference data sets.
5. Reload organizations and locations.
6. Reload people, role definitions, and role assignments.
7. Reload equipment assets.
8. Reload loads and load stops.
9. Reload activity records last.

## Recovery Model

- A rerun always starts by re-ensuring the control-plane baseline.
- A rerun re-applies the full tenant-domain reset plus reload path rather than attempting partial row repair.
- Failure after control-plane ensure is acceptable if a subsequent rerun can still restore the canonical baseline.
- Success means the same deterministic lookup map resolves to the same canonical tenant and representative tenant-domain records after every rerun.
