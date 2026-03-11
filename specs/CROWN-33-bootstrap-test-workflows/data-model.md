# Data Model: Integrate Schema And Seed Baseline Into Bootstrap And Test Workflows

## Overview

`CROWN-33` does not introduce new product entities. It defines the workflow objects and setup boundaries that integrate the existing schema bootstrap and canonical seed baseline into local and future test-preparation flows.

## Workflow Entities

### LocalBootstrapWorkflow

- **Purpose**: Represents the supported setup path that prepares a local environment from empty or partial state to the canonical schema-plus-seed baseline.
- **Key attributes**:
  - repository-level bootstrap command
  - control-plane setup step
  - canonical tenant schema bootstrap step
  - canonical seed execution step
  - supported rerun path
- **Validation rules**:
  - Must be understandable as one repeatable local flow
  - Must not require manual database repair between steps

### CanonicalPreparationOrder

- **Purpose**: Represents the required sequencing between schema setup and seed preparation.
- **Key attributes**:
  - prerequisite command or step
  - dependent setup step
  - rerun expectation
  - failure boundary
- **Validation rules**:
  - Must ensure control-plane setup precedes canonical seed execution
  - Must ensure canonical tenant schema readiness before baseline load

### CanonicalTestableBaseline

- **Purpose**: Represents the shared schema-plus-seed state that local development and later automated workflows are expected to reuse.
- **Key attributes**:
  - control-plane readiness
  - canonical tenant identity
  - canonical tenant schema readiness
  - canonical seed fixture availability
  - deterministic lookup-key contract
- **Validation rules**:
  - Must align to `CROWN-31` and `CROWN-32`
  - Must remain foundational and compact

### WorkflowResetBoundary

- **Purpose**: Represents what the integrated bootstrap flow refreshes and what it intentionally leaves untouched.
- **Key attributes**:
  - refreshed canonical tenant-domain data
  - refreshed minimum control-plane baseline
  - preserved unrelated tenants
  - preserved unrelated platform history
- **Validation rules**:
  - Must keep unrelated local data outside the reset path
  - Must match the canonical seed boundary from `CROWN-32`

### TenantCoverageExpectation

- **Purpose**: Represents the foundational assumptions about single-tenant and multi-tenant preparation.
- **Key attributes**:
  - canonical tenant count
  - preserved unrelated tenant behavior
  - later validation expectations
  - future automated workflow reuse rule
- **Validation rules**:
  - Must explain how one canonical tenant baseline coexists with later multi-tenant validation
  - Must not imply broad seeded multi-tenant fixture sprawl in this story

### TestPreparationWorkflow

- **Purpose**: Represents how later e2e or container-based setup flows should consume the same canonical bootstrap contract.
- **Key attributes**:
  - shared baseline source
  - reuse of the repository-level bootstrap sequence
  - automation-neutral preparation guidance
  - rerun expectation
  - reuse boundary
- **Validation rules**:
  - Must reuse the same canonical baseline contract as local bootstrap
  - Must avoid introducing a separate test-only seed baseline

## Canonical Workflow State

### Starting States

- Empty local database with no control-plane tables
- Control-plane schema ready but canonical tenant schema missing
- Canonical tenant schema present but canonical baseline stale or partial
- Local database containing unrelated tenants and unrelated platform records

### Completed State

- Control-plane schema is ready for the API workspace
- Canonical tenant exists with the expected slug and schema name
- Canonical tenant schema is migrated to the foundational baseline
- Canonical seeded baseline is loaded with deterministic fixture keys
- Unrelated tenants and unrelated platform data remain outside the reset path

## Workflow Relationships

- `LocalBootstrapWorkflow` depends on `CanonicalPreparationOrder`
- `CanonicalPreparationOrder` produces `CanonicalTestableBaseline`
- `WorkflowResetBoundary` constrains `LocalBootstrapWorkflow` and `TestPreparationWorkflow`
- `TenantCoverageExpectation` constrains how `CanonicalTestableBaseline` is reused in later validation work

## Multi-Tenant Boundary Model

- One canonical seeded tenant is directly prepared by the foundational workflow.
- Additional unrelated tenants may exist locally and must remain untouched by canonical bootstrap reruns.
- Later tenant-scoped validation can introduce additional tenants or checks, but those should build on the same control-plane and seed baseline contract.
