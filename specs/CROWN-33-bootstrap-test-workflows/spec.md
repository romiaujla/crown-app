# Feature Specification: Integrate Schema And Seed Baseline Into Bootstrap And Test Workflows

**Feature Branch**: `feat/CROWN-33-bootstrap-test-workflows`  
**Created**: 2026-03-10  
**Status**: Draft  
**Input**: User description: "CROWN-33"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Run A Complete Local Bootstrap Workflow (Priority: P1)

The maintainer uses one repeatable local setup workflow that prepares the foundational database state, provisions the canonical tenant baseline when needed, and leaves the local environment ready for development.

**Why this priority**: Local development remains fragile until schema bootstrap and canonical seed setup fit together as one dependable workflow.

**Independent Test**: Starting from an empty or partially prepared local environment, a maintainer can follow the documented bootstrap flow and reach the same usable baseline without manual database repair steps.

**Acceptance Scenarios**:

1. **Given** a fresh local database, **When** the maintainer runs the supported bootstrap workflow, **Then** the foundational control-plane schema, canonical tenant schema, and canonical baseline data are prepared in the correct order.
2. **Given** a partially prepared local database, **When** the maintainer reruns the supported bootstrap workflow, **Then** the environment ends in the same canonical baseline state without destructive resets outside the approved scope.

---

### User Story 2 - Reuse The Same Baseline In Test Preparation Workflows (Priority: P2)

The maintainer can prepare local or future automated test environments from the same canonical bootstrap and seed baseline instead of inventing a separate test-only data path.

**Why this priority**: Foundational value is lost if local setup and test preparation drift into different schema and seed contracts.

**Independent Test**: A reviewer can identify one baseline preparation flow and see how later e2e or container-based workflows can consume it without redefining seeded data expectations.

**Acceptance Scenarios**:

1. **Given** future automated or container-based workflows need a clean starting point, **When** the workflow guidance is reviewed, **Then** it reuses the same canonical schema and seed baseline defined for local development.
2. **Given** test preparation needs tenant-scoped validation, **When** the workflow guidance is reviewed, **Then** the expected tenant coverage and rerun behavior are explicit enough to support later validation work.

---

### User Story 3 - Define Multi-Tenant And Rerun Expectations For Workflow Integration (Priority: P3)

The maintainer understands how the foundational bootstrap and seed workflow should behave when multiple tenants exist locally and when later validation needs tenant-scoped comparisons.

**Why this priority**: Bootstrap and test workflows become unsafe if multi-tenant boundaries and rerun expectations are left implicit.

**Independent Test**: A reviewer can determine which tenant data is refreshed, which tenant data remains untouched, and what later validation or test workflows may assume about canonical and non-canonical tenants.

**Acceptance Scenarios**:

1. **Given** unrelated tenants exist alongside the canonical seeded tenant, **When** the workflow is rerun, **Then** the canonical tenant baseline is refreshed without altering unrelated tenant schemas or data.
2. **Given** later tenant-scoped validation requires more than one tenant context, **When** the workflow expectations are reviewed, **Then** the foundational multi-tenant coverage rules are explicit even if the initial baseline remains small.

### Edge Cases

- What happens when the local bootstrap workflow starts with control-plane tables present but the canonical tenant schema missing?
- What happens when the canonical tenant schema exists but the canonical seeded data is stale or only partially loaded?
- How does the workflow behave when unrelated tenant schemas and unrelated platform users already exist locally?
- How should later test workflows treat multi-tenant coverage when the canonical seeded baseline starts with one representative tenant?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a repeatable local bootstrap workflow that accounts for both foundational schema setup and the canonical resettable seed baseline.
- **FR-002**: The local bootstrap workflow MUST prepare control-plane schema state before relying on the canonical seeded tenant baseline.
- **FR-003**: The local bootstrap workflow MUST ensure the canonical tenant schema is created and migrated before the canonical seeded baseline is loaded.
- **FR-004**: The integrated workflow MUST be safe to rerun repeatedly during development.
- **FR-005**: The integrated workflow MUST reuse the canonical seeded baseline defined by `CROWN-31` and implemented by `CROWN-32`.
- **FR-006**: The integrated workflow MUST preserve unrelated tenants, unrelated platform users, and unrelated platform history outside the approved reset scope.
- **FR-007**: The workflow guidance MUST describe how local bootstrap expectations map to future e2e or container-based test preparation.
- **FR-008**: The workflow guidance MUST define the tenant-scoped validation and multi-tenant coverage assumptions that later test workflows may rely on.
- **FR-009**: The workflow integration MUST remain foundational and MUST NOT absorb later feature-specific API, UI, or product behavior.
- **FR-010**: The workflow MUST make rerun and failure-recovery expectations explicit for both local bootstrap and later test preparation use.
- **FR-011**: The workflow MUST define when the canonical tenant baseline is refreshed versus when unrelated local tenant data remains untouched.
- **FR-012**: The workflow MUST be documented clearly enough that maintainers can prepare a local environment and understand how that preparation carries forward into future automated workflows.

### Key Entities *(include if feature involves data)*

- **Bootstrap Workflow**: The repeatable setup path that prepares schema state and canonical baseline data for local or future test use.
- **Canonical Testable Baseline**: The schema-plus-seed state that local development and future automated workflows are expected to share.
- **Workflow Reset Boundary**: The set of records and schemas refreshed by the canonical bootstrap and seed integration flow.
- **Tenant Coverage Expectation**: The defined assumption about how many tenants the foundational workflow prepares directly and what later validation may assume about tenant-scoped comparisons.

## Assumptions

- `CROWN-30` provides the foundational tenant migration baseline.
- `CROWN-31` defines the canonical seeded baseline, reset boundary, and deterministic lookup-key contract.
- `CROWN-32` provides the runnable local seed workflow that this story will integrate into broader bootstrap and test-preparation expectations.
- The initial foundational workflow may still center on one canonical seeded tenant so long as multi-tenant validation expectations are explicit for later stories.
- The supported bootstrap rerun path refreshes only the canonical seeded tenant baseline and does not act as a general-purpose multi-tenant reset command.
- Later e2e or container-based test automation should reuse the same canonical bootstrap and seed contract rather than define a separate seed baseline.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A maintainer can prepare a fresh or partially prepared local environment to the canonical baseline through one documented bootstrap flow without manual database repair steps.
- **SC-002**: Reviewers can identify one canonical schema-and-seed baseline that both local development and future automated workflows are expected to reuse.
- **SC-003**: Reviewers can explain what data the workflow refreshes and what unrelated tenant or platform data it preserves.
- **SC-004**: Reviewers can identify the foundational multi-tenant and tenant-scoped validation assumptions without reopening reset-boundary or baseline-contract decisions.
