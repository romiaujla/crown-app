# Data Model: Validate Canonical Seed Baseline And Setup Expectations

## Overview

`CROWN-34` does not introduce new product entities. It defines the validation and documentation objects that prove the existing canonical seed and bootstrap foundation remains trustworthy.

## Validation Entities

### CanonicalValidationContract

- **Purpose**: Represents the combined proof surface for deterministic seeded lookup keys, rerun safety, and preserved reset boundaries.
- **Key attributes**:
  - canonical workflow source
  - deterministic lookup assertions
  - preserved-boundary assertions
  - rerun expectation
  - later workflow reuse rule
- **Validation rules**:
  - Must align to the existing canonical seed and bootstrap workflows
  - Must avoid introducing a new setup contract

### DeterministicSeedLookup

- **Purpose**: Represents the stable seeded identifiers that downstream workflows and reviewers are allowed to reference.
- **Key attributes**:
  - tenant slug
  - tenant schema name
  - platform user email
  - tenant-domain business code
  - reference-data code
- **Validation rules**:
  - Must use business identifiers instead of generated primary keys
  - Must remain stable across repeated canonical reruns

### PreservedBoundaryExpectation

- **Purpose**: Represents the approved distinction between refreshed canonical records and untouched unrelated local data.
- **Key attributes**:
  - canonical refreshed scope
  - unrelated tenant preservation
  - unrelated platform user preservation
  - unrelated platform history preservation
  - rerun outcome
- **Validation rules**:
  - Must prove unrelated data remains outside the canonical reset path
  - Must match the reset boundary defined by `CROWN-31` and implemented by `CROWN-32`

### BootstrapCommandGuidance

- **Purpose**: Represents the documented explanation of when to use the repository-level local bootstrap workflow.
- **Key attributes**:
  - first-time setup scenario
  - empty-or-partial database scenario
  - prepared steps
  - boundary explanation
- **Validation rules**:
  - Must explain the broader setup scope of bootstrap
  - Must remain aligned to the same canonical baseline as direct reseeding

### SeedCommandGuidance

- **Purpose**: Represents the documented explanation of when to use the canonical local seed workflow directly.
- **Key attributes**:
  - reseed-only scenario
  - prerequisite setup state
  - canonical refresh scope
  - preserved-boundary explanation
- **Validation rules**:
  - Must distinguish reseeding from broader bootstrap preparation
  - Must not imply a full local database wipe

## Canonical Validation States

### Starting States

- Canonical baseline has completed once and is ready for deterministic lookup assertions
- Canonical baseline has been rerun and should still expose the same seeded business identifiers
- Unrelated local tenant or platform records already exist alongside the canonical baseline
- Contributor is choosing between local bootstrap and local reseed for a setup task

### Completed State

- Deterministic seeded tenant, operator, and representative tenant-domain lookups are explicitly validated
- Canonical reruns are shown to preserve unrelated local data outside the reset boundary
- Contributor-facing setup guidance clearly distinguishes bootstrap and reseed entrypoints
- Later automated workflow authors can reuse one canonical setup and validation contract

## Relationships

- `CanonicalValidationContract` depends on `DeterministicSeedLookup`
- `CanonicalValidationContract` depends on `PreservedBoundaryExpectation`
- `BootstrapCommandGuidance` and `SeedCommandGuidance` describe two entrypoints into the same canonical baseline contract
- `PreservedBoundaryExpectation` constrains both bootstrap and reseed guidance
