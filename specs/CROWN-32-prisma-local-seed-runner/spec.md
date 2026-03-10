# Feature Specification: Implement Resettable Local Seed Runner And Baseline Dataset

**Feature Branch**: `feat/CROWN-32-prisma-local-seed-runner`  
**Created**: 2026-03-10  
**Status**: Draft  
**Input**: User description: "CROWN-32"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reset And Reload The Canonical Local Baseline (Priority: P1)

The maintainer runs one local seed workflow that clears the defined reset scope and reloads the canonical baseline dataset without manual cleanup steps.

**Why this priority**: The story only delivers value if maintainers can return local development to a known clean state on demand.

**Independent Test**: A maintainer can start with pre-existing local baseline data, run the local seed workflow once, and verify that the resulting dataset matches the canonical baseline for the seeded tenant.

**Acceptance Scenarios**:

1. **Given** a local environment contains previously seeded baseline records, **When** the maintainer runs the local seed workflow, **Then** the defined reset scope is cleared and the canonical baseline is reloaded.
2. **Given** a local environment contains partial or outdated baseline records, **When** the maintainer runs the local seed workflow, **Then** the environment ends in the same canonical post-seed state as a fresh local reset.

---

### User Story 2 - Preserve Deterministic Seeded Records For Downstream Use (Priority: P2)

The maintainer receives a local baseline whose seeded tenant, operators, and representative tenant-domain records always use stable business identifiers and predictable relationships.

**Why this priority**: Later local views, tests, and bootstrap stories depend on seeded records being consistent across reruns.

**Independent Test**: A reviewer can inspect the resulting local baseline after multiple reruns and confirm that the same seeded records, lookup keys, and representative relationships remain available for downstream workflows.

**Acceptance Scenarios**:

1. **Given** downstream local workflows reference seeded records by business codes, slugs, or other stable lookup keys, **When** the seed workflow completes, **Then** those identifiers remain present and consistent across reruns.
2. **Given** the canonical baseline includes representative tenant-domain coverage, **When** the maintainer reseeds the environment, **Then** the same seeded tenant, seeded operators, and representative tenant-domain records are restored predictably.

---

### User Story 3 - Safely Recover From Repeated Or Interrupted Seed Runs (Priority: P3)

The maintainer can rerun the local seed workflow repeatedly, including after an interrupted or failed attempt, without leaving the canonical baseline in an ambiguous state.

**Why this priority**: Local development loses reliability when maintainers cannot trust the seed flow after a partial reset or load failure.

**Independent Test**: A maintainer can rerun the workflow immediately after a prior run or after simulating a failed run and still restore the canonical baseline without manual repair steps.

**Acceptance Scenarios**:

1. **Given** the local seed workflow has already completed successfully, **When** the maintainer runs it again, **Then** the environment returns to the same canonical baseline without duplicate seeded records.
2. **Given** a prior seed run stops after part of the reset or reload work finishes, **When** the maintainer reruns the workflow, **Then** the environment can still be restored to the canonical baseline through the supported rerun path.

### Edge Cases

- What happens when unrelated tenants or unrelated platform records exist locally outside the defined reset scope?
- What happens when a prior seed run clears data but stops before the representative baseline is fully restored?
- How does the workflow behave when required baseline records already exist with the expected stable lookup keys?
- How are seeded records handled when the canonical baseline grows over time but earlier lookup keys must remain stable?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide one documented local seed workflow that resets and reloads the canonical baseline dataset for development use.
- **FR-002**: The local seed workflow MUST clear the reset boundary defined by `CROWN-31` before reloading the canonical baseline.
- **FR-003**: The local seed workflow MUST restore the same canonical post-seed baseline state on every successful rerun.
- **FR-004**: The local seed workflow MUST be safe to rerun repeatedly during development without creating duplicate canonical seeded records.
- **FR-005**: The seeded baseline MUST include the representative tenant workspace defined by the approved upstream seed strategy.
- **FR-006**: The seeded baseline MUST include the minimum control-plane records required to access and use the seeded tenant workspace locally.
- **FR-007**: The seeded baseline MUST include representative tenant-domain records that cover the foundational local workflow areas identified by the upstream strategy.
- **FR-008**: The seeded baseline MUST use stable business identifiers, slugs, codes, or equivalent lookup keys for records that downstream local workflows or tests are expected to reference.
- **FR-009**: The local seed workflow MUST preserve data outside the approved reset scope, including unrelated tenants and unrelated platform history.
- **FR-010**: The local seed workflow MUST follow the structural and placement rules established by `CROWN-29` and `CROWN-30`.
- **FR-011**: The local seed workflow MUST support the supported rerun path after a partial reset or partial load failure.
- **FR-012**: The local seed workflow MUST leave the local environment in either a completed canonical baseline state or a state that can be restored by rerunning the supported workflow.
- **FR-013**: The seed baseline MUST remain foundational and MUST NOT absorb later feature-specific fixture sprawl unrelated to the canonical local baseline.
- **FR-014**: The local seed workflow MUST be documented clearly enough that maintainers can identify what data is reset, what data is restored, and what baseline records are expected afterward.
- **FR-015**: The seeded baseline MUST be extendable so later stories can add canonical records without changing the meaning of previously established stable lookup keys.

### Key Entities *(include if feature involves data)*

- **Local Seed Workflow**: The repeatable development action that clears the approved reset scope and reloads the canonical baseline.
- **Canonical Baseline Dataset**: The seeded local dataset that represents the expected clean starting point for the seeded tenant workspace.
- **Seeded Tenant Workspace**: The representative tenant and minimum related access records that downstream local development depends on.
- **Deterministic Seed Record**: A seeded record with a stable business identifier or lookup key that downstream workflows can reference safely across reruns.
- **Reset Boundary**: The exact set of local records that are cleared before the canonical baseline is reloaded.

## Assumptions

- `CROWN-31` already defines the canonical reset scope, representative baseline coverage, and deterministic lookup-key expectations that this story implements.
- `CROWN-30` already provides the migration-backed structural baseline that the local seeded dataset will populate.
- The initial canonical baseline focuses on one representative tenant workspace and the minimum control-plane access needed to use it locally.
- Local maintainers need a single supported rerun path rather than manual instructions for partial in-place repair.
- Later stories may extend the canonical baseline, but they should build on the same stable identifiers and reset contract established here.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A maintainer can reset and repopulate the local canonical baseline through the documented seed workflow without performing manual database cleanup steps.
- **SC-002**: After two consecutive successful reruns, reviewers can confirm that the same seeded tenant, access records, and representative baseline records remain available through the same stable lookup keys.
- **SC-003**: Reviewers can verify that data outside the approved reset scope remains intact after the local seed workflow completes.
- **SC-004**: After an interrupted or partial run, a maintainer can restore the canonical baseline by rerunning the supported local seed workflow without bespoke repair steps.
