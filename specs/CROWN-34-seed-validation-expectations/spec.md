# Feature Specification: Validate Canonical Seed Baseline And Setup Expectations

**Feature Branch**: `feat/CROWN-34-seed-validation-expectations`  
**Created**: 2026-03-10  
**Status**: Draft  
**Input**: User description: "CROWN-34"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Prove Deterministic Canonical Seed Records (Priority: P1)

The maintainer can verify that the canonical seeded baseline exposes stable tenant, operator, and representative tenant-domain lookup keys that downstream workflows may rely on across reruns.

**Why this priority**: Downstream local setup, login flows, and later automated validation lose trust immediately if canonical seeded records cannot be referenced deterministically.

**Independent Test**: A reviewer can inspect the validation outputs and see that the same canonical seeded records remain available through the same business identifiers after repeat seed runs.

**Acceptance Scenarios**:

1. **Given** the canonical local seed workflow has completed, **When** validation is run against the seeded baseline, **Then** the expected stable tenant, operator, and representative domain lookup keys are present.
2. **Given** the canonical local seed workflow is run multiple times, **When** validation compares the resulting baseline records, **Then** the same deterministic identifiers remain available without duplicate canonical records.

---

### User Story 2 - Prove Rerun And Reset-Boundary Safety (Priority: P2)

The maintainer can verify that rerunning the canonical bootstrap and seed workflows restores the approved baseline while preserving unrelated local data outside the reset boundary.

**Why this priority**: The current workflow foundation is only safe if validation proves that canonical refreshes do not widen into full local-database resets.

**Independent Test**: A reviewer can follow the validation coverage and confirm that canonical reruns restore the same baseline while leaving unrelated tenants and unrelated platform data untouched.

**Acceptance Scenarios**:

1. **Given** unrelated tenant or platform records exist locally, **When** the canonical bootstrap or seed validation is run, **Then** the canonical baseline is refreshed without altering out-of-scope records.
2. **Given** the canonical bootstrap or seed workflow is rerun after a prior successful run or partial setup state, **When** validation is run, **Then** the resulting environment returns to the same canonical baseline through the supported rerun path.

---

### User Story 3 - Make Reusable Setup Expectations Explicit For Reviewers (Priority: P3)

The maintainer can review one clear description of how local bootstrap, local reseeding, and later automated setup should reuse the same canonical baseline contract.

**Why this priority**: Even correct behavior becomes hard to trust if contributors cannot tell which command to use, what it refreshes, and how later validation should reuse the same setup path.

**Independent Test**: A reviewer can read the maintained setup guidance and understand when to use the local bootstrap command, when to use the local seed command, and what reset boundary each command respects.

**Acceptance Scenarios**:

1. **Given** a contributor is preparing a local environment for the first time, **When** they read the setup guidance, **Then** they can identify the supported bootstrap workflow and what it prepares.
2. **Given** a contributor only needs to refresh the canonical seeded tenant baseline, **When** they read the setup guidance, **Then** they can distinguish the local seed command from the broader bootstrap workflow and understand the preserved boundary.

### Edge Cases

- What happens when validation is run after multiple canonical reruns and the same business-key lookups must still succeed?
- What happens when unrelated tenants, unrelated platform users, or unrelated platform history already exist locally?
- How should setup guidance describe the difference between a full local bootstrap and a canonical baseline refresh without implying a full database reset?
- How should later automated workflows reuse the same canonical baseline without redefining seeded identifiers or reset boundaries?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide validation coverage for the deterministic lookup-key contract established by `CROWN-31` and implemented by `CROWN-32`.
- **FR-002**: The validation coverage MUST prove that the canonical seeded baseline remains stable across repeated reruns.
- **FR-003**: The validation coverage MUST prove that canonical refresh workflows preserve unrelated tenants and unrelated platform records outside the approved reset boundary.
- **FR-004**: The validation coverage MUST reuse the canonical local seed and bootstrap workflows delivered by `CROWN-32` and `CROWN-33` rather than introduce a parallel setup contract.
- **FR-005**: The workflow guidance MUST explain when contributors should use the repository-level local bootstrap command versus the canonical local seed command.
- **FR-006**: The workflow guidance MUST make the reset boundary explicit so contributors understand that canonical refreshes do not wipe the whole local database.
- **FR-007**: The validation expectations MUST remain foundational and MUST NOT redefine the canonical baseline, seeded lookup keys, or migration scope established by `CROWN-29` through `CROWN-33`.
- **FR-008**: The validation surfaces MUST be clear enough that later e2e or container-based workflows can reuse the same canonical setup contract without inventing separate seeded-data assumptions.
- **FR-009**: The validation work MUST cover both direct local reseeding and the broader local bootstrap path where those workflows share the same canonical baseline.
- **FR-010**: The maintained documentation MUST describe the expected outcomes of a canonical rerun, including what is refreshed and what is preserved.

### Key Entities *(include if feature involves data)*

- **Canonical Validation Contract**: The set of expectations that proves the seeded baseline, stable lookup keys, and supported rerun path remain trustworthy.
- **Deterministic Seed Lookup**: A stable business identifier, slug, code, or email that downstream workflows and reviewers use to locate canonical seeded records.
- **Bootstrap Setup Guidance**: The documented explanation of when to use the repository-level bootstrap workflow and what it prepares.
- **Seed Refresh Guidance**: The documented explanation of when to use the canonical local seed workflow and what reset boundary it respects.

## Assumptions

- `CROWN-29` defines the foundational tenant-domain entities and stable fixture-identifier expectations for seeded records.
- `CROWN-30` provides the migration-backed tenant schema baseline that the seeded dataset and validation surfaces rely on.
- `CROWN-31` defines the canonical seed baseline, deterministic lookup-key contract, and rerun/recovery expectations.
- `CROWN-32` provides the runnable canonical local seed workflow and representative baseline dataset that this story validates.
- `CROWN-33` provides the repository-level local bootstrap workflow and setup guidance that this story validates and clarifies.
- Canonical validation examples should center on the tenant slug, tenant schema name, seeded operator emails, and representative business codes rather than generated IDs.
- This story validates and documents the existing canonical baseline contract; it does not expand fixture scope or widen reset boundaries.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Reviewers can identify one validation surface that proves the canonical seeded baseline remains reachable through the same stable lookup keys after repeated reruns.
- **SC-002**: Reviewers can identify validation evidence that canonical bootstrap and seed reruns preserve unrelated local data outside the approved reset boundary.
- **SC-003**: Contributors can read the maintained setup guidance and distinguish when to use `db:bootstrap:local` versus `db:seed:local` without external explanation.
- **SC-004**: Later workflow authors can point to one canonical setup-and-validation contract instead of redefining seeded baseline expectations for automated environments.
