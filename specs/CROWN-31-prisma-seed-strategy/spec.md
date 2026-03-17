# Feature Specification: Design Deterministic Prisma Local Seed Strategy For Development And Testing

**Feature Branch**: `feat/CROWN-31-prisma-seed-strategy`  
**Created**: 2026-03-09  
**Status**: Draft  
**Input**: User description: "crown-31"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Define A Resettable Local Seed Baseline (Priority: P1)

The maintainer defines what a clean local seed baseline contains and what reset behavior is required before the baseline is reloaded.

**Why this priority**: Seed work is not dependable until maintainers agree on what is reset, what is reloaded, and what a clean starting point means.

**Independent Test**: A reviewer can read the strategy and determine exactly what data is cleared, what remains outside the reset path, and what baseline data is expected after a rerun.

**Acceptance Scenarios**:

1. **Given** a local development environment with existing tenant data, **When** the seed strategy is reviewed, **Then** the reset scope clearly states what is cleared before the baseline is reloaded.
2. **Given** a maintainer needs a clean restart for development, **When** the seed strategy is followed, **Then** the expected baseline state is defined without ambiguity.

---

### User Story 2 - Define Deterministic Fixture Ordering And Lookup Rules (Priority: P2)

The maintainer defines how representative seed data is ordered, identified, and reused so local workflows and future automated tests can depend on it safely.

**Why this priority**: Seed data becomes brittle when fixture ordering, lookup keys, and representative records are not stable across reruns.

**Independent Test**: A reviewer can identify the deterministic fixture rules, representative baseline data scope, and stable lookup keys without reopening design questions.

**Acceptance Scenarios**:

1. **Given** downstream tests and local workflows depend on seeded records, **When** the strategy is reviewed, **Then** the lookup keys and ordering rules are explicit and repeatable.
2. **Given** the baseline must support representative tenant workflows, **When** the seed scope is reviewed, **Then** the strategy defines what data is required and why it belongs in the baseline.

---

### User Story 3 - Define Safe Rerun And Failure-Recovery Expectations (Priority: P3)

The maintainer defines how the seed process should behave when a rerun is interrupted or a partial reset or partial load occurs.

**Why this priority**: Development and test environments need recovery guidance so a failed or interrupted seed run does not leave the baseline unusable.

**Independent Test**: A reviewer can determine how reruns recover from partial work and what safety expectations apply before future local or containerized usage proceeds.

**Acceptance Scenarios**:

1. **Given** a partial reset or seed failure occurs, **When** the strategy is reviewed, **Then** the expected recovery path and rerun safety expectations are explicit.
2. **Given** the same seed approach must later support local and containerized testing, **When** the strategy is reviewed, **Then** the strategy defines the reliability expectations needed for both contexts.

### Edge Cases

- What happens when control-plane data and tenant-domain data have different reset expectations?
- How is the baseline handled when a deterministic fixture must remain stable but related seeded records change over time?
- What happens when a seed rerun fails after data has been cleared but before the full representative baseline is reloaded?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The seed strategy MUST define a resettable local baseline for development and testing.
- **FR-002**: The strategy MUST define the reset scope, including what data is cleared and what remains outside the reset path.
- **FR-003**: The strategy MUST define the ordering rules for resetting and reloading baseline data.
- **FR-004**: The strategy MUST define the representative baseline data scope required for local development.
- **FR-005**: The strategy MUST define stable seeded identifiers or lookup keys for records that downstream local workflows or tests are expected to reference.
- **FR-006**: The strategy MUST define safe rerun expectations for interrupted resets or partial seed loads.
- **FR-007**: The strategy MUST define failure-recovery expectations for partial reset or partial load scenarios.
- **FR-008**: The strategy MUST support reuse in both local development and future containerized or automated test environments.
- **FR-009**: The strategy MUST remain foundational and MUST NOT absorb later capability-specific workflow, UI, or module behavior.
- **FR-010**: The strategy MUST treat the `CROWN-30` transportation-management-system tenant schema baseline as the structural source of truth for seeded tenant-domain data.
- **FR-011**: The strategy MUST define the canonical reset boundary as tenant-domain data in `tenant_<tenant_slug>` plus only the minimum control-plane records required to keep the seeded tenant and seeded operator access usable.
- **FR-012**: The strategy MUST explicitly exclude unrelated tenants, unrelated platform operators, and unrelated platform audit history from the reset path.
- **FR-013**: The strategy MUST define the canonical seeded baseline as one representative tenant workspace with sufficient control-plane, reference-data, organization, location, people, role, asset, load, stop, and activity coverage for later local development.
- **FR-014**: The strategy MUST define stable business lookup keys for seeded tenant identity, seeded operator identities, and each tenant-domain data area expected to be referenced by local workflows or tests.
- **FR-015**: The strategy MUST define that reruns start from the same canonical baseline and do not rely on partial in-place repair of previously failed seeded rows.
- **FR-016**: The strategy MUST define ordering guidance that allows later implementation to reset and reload data without violating relationship dependencies from `CROWN-29` and `CROWN-30`.

### Key Entities _(include if feature involves data)_

- **Seed Baseline**: The agreed clean dataset and structural state that local and future test environments are expected to reproduce.
- **Reset Scope**: The boundary that identifies which data is cleared and which data remains outside the seed reset path.
- **Deterministic Fixture Contract**: The rules for stable fixture ordering, identifiers, and lookup keys that downstream workflows can depend on safely.
- **Recovery Expectation**: The defined rerun and failure-handling behavior when reset or load operations do not complete cleanly.

## Assumptions

- `CROWN-30` provides the foundational tenant schema baseline that this strategy will target.
- The local seed strategy is intended to guide later implementation work rather than deliver the runnable seed process in this story.
- Stable business codes, slugs, or equivalent lookup keys are more appropriate than record-order assumptions for downstream fixture reuse.
- Local development and future containerized or automated test usage should share one baseline strategy even if execution mechanics differ later.
- The first canonical baseline can focus on one representative transportation-management tenant and grow later without changing the reset contract.
- The seed reset path should preserve migration-state knowledge for the seeded tenant rather than forcing schema recreation on every rerun.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Reviewers can identify the reset scope, retained data boundaries, and post-run baseline state without additional clarification.
- **SC-002**: Reviewers can identify stable fixture lookup keys and ordering rules for every baseline data area that downstream workflows are expected to reference.
- **SC-003**: At least one downstream story can use the strategy directly without reopening reset-scope, fixture-identity, or rerun-safety questions.
- **SC-004**: Reviewers can explain the failure-recovery and rerun expectations for partial reset or partial load scenarios from the strategy alone.
