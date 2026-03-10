# Feature Specification: Detailed Tenant-Domain Model For Foundational TMS Baseline

**Feature Branch**: `feat/CROWN-29-tenant-domain-model`  
**Created**: 2026-03-09  
**Status**: Draft  
**Input**: User description: "crown-29"

## Clarifications

### Session 2026-03-09

- Q: Should `CROWN-29` require Prisma 7+ now? → A: No. Keep `CROWN-29` on the current Prisma baseline and track Prisma 7+ as a separate upgrade task under `CROWN-23`.
- Q: What tenant schema naming pattern should downstream work use? → A: Use `tenant_<tenant_slug>` for tenant schemas.
- Q: What belongs in the shared `core` schema versus tenant schemas? → A: Only platform-wide shared tables belong in `core`; tenant reference data and tenant operational data stay inside each `tenant_<tenant_slug>` schema unless a table is truly global.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Define The Foundational Tenant Model (Priority: P1)

The maintainer defines the foundational tenant-domain entities, relationships, lifecycle states, and naming boundaries needed for the next TMS-oriented baseline.

**Why this priority**: Every later migration, seed, login, admin, and product story depends on an approved domain model.

**Independent Test**: The story is complete when a reviewer can inspect the model definition and determine the foundational tenant entities, their relationships, and their lifecycle boundaries without relying on later implementation work.

**Acceptance Scenarios**:

1. **Given** the current minimal tenant baseline, **When** the maintainer reviews the new model, **Then** the next foundational tenant entities and relationships are explicitly defined.
2. **Given** later schema and seed stories depend on this output, **When** the model is reviewed, **Then** it provides enough structure to drive migration and seed planning, including what belongs in `core` versus `tenant_<tenant_slug>`.

---

### User Story 2 - Define Reference Data And Deterministic Fixture Boundaries (Priority: P2)

The maintainer distinguishes reusable reference data from seeded fixtures and defines stable identifiers that later local development and tests can depend on.

**Why this priority**: Seed and test drift becomes expensive quickly if catalogs, fixtures, and stable lookup keys are not defined up front.

**Independent Test**: The story is complete when a reviewer can identify which records are reusable catalogs versus seeded fixtures and which stable keys later seeds/tests are expected to rely on.

**Acceptance Scenarios**:

1. **Given** the foundational tenant model, **When** reference data is reviewed, **Then** reusable catalogs and seeded fixtures are clearly separated.
2. **Given** later seed and test workflows will depend on predictable records, **When** the model is reviewed, **Then** stable identifiers or slugs are defined where deterministic fixtures are required and tenant-local reference data remains tenant-scoped unless it is truly global.

---

### User Story 3 - Establish Foundational Handoff For Migration And Seed Design (Priority: P3)

The maintainer produces a model definition that is intentionally foundational, so later migration and seed stories can build on it without pulling capability-specific APIs into this story.

**Why this priority**: This keeps `CROWN-29` scoped to foundation rather than allowing later admin or product behavior to leak into the data-model story.

**Independent Test**: The story is complete when migration and seed stories can reference the output directly and a reviewer can see that later capability behavior remains out of scope.

**Acceptance Scenarios**:

1. **Given** `CROWN-30` through `CROWN-34` depend on this work, **When** the model is reviewed, **Then** it provides a clear foundational handoff for downstream schema and seed implementation.
2. **Given** later epics will introduce capability-specific behavior, **When** the model scope is reviewed, **Then** it stays limited to foundational tenant-domain structure rather than feature APIs or separate frontend app decisions.

### Edge Cases

- How is the model handled when the current minimal baseline cannot express a needed foundational TMS relationship cleanly?
- What happens when a record could reasonably be treated as either reusable reference data or seeded fixture data?
- How are stable identifiers defined when human-readable names may change over time?
- How is a table handled when it appears reusable across tenants but still contains tenant-owned reference data?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The specification MUST define the foundational tenant-domain entities required for the next TMS baseline.
- **FR-002**: The specification MUST define the core relationships between those foundational entities.
- **FR-003**: The specification MUST define lifecycle states or state boundaries where later schema and seed work depend on them.
- **FR-004**: The specification MUST define naming boundaries for foundational tenant-domain concepts so later implementation work uses consistent terminology.
- **FR-005**: The specification MUST distinguish reusable reference data from seeded fixture data where the difference affects downstream schema or seed work.
- **FR-006**: The specification MUST define stable identifiers, slugs, or lookup keys where later deterministic seed and test workflows are expected to rely on predictable records.
- **FR-007**: The specification MUST provide enough detail for downstream migration and seed stories to proceed without redefining the foundational model.
- **FR-008**: The specification MUST remain limited to foundational tenant-domain structure and MUST NOT absorb later capability-specific API behavior.
- **FR-009**: The specification MUST remain compatible with the repository's current Prisma baseline; Prisma 7+ evaluation and upgrade work MUST be handled separately from this story.
- **FR-010**: The specification MUST treat `core` as the shared schema for platform-wide tables used across tenants.
- **FR-011**: The specification MUST treat tenant-domain tables as belonging to tenant-specific schemas named `tenant_<tenant_slug>`.
- **FR-012**: The specification MUST keep tenant reference data inside each tenant schema unless the data is truly platform-global.
- **FR-013**: The specification MUST identify which foundational entities are shared `core` concerns and which are tenant-schema concerns so downstream migration work can place them correctly.

### Key Entities *(include if feature involves data)*

- **Foundational Tenant Entity**: A top-level tenant-domain record type required for the next TMS baseline.
- **Core Shared Entity**: A platform-wide table or catalog in the `core` schema that is reused across tenants.
- **Reference Data Set**: A reusable catalog or controlled list intended to be shared across seeded or operational records.
- **Seed Fixture Record**: A representative baseline record intended for deterministic local development and future automated test usage.
- **Stable Fixture Identifier**: A slug, code, or other predictable lookup key that later seeds and tests can rely on.

## Assumptions

- The domain model is being defined for foundational TMS use cases, not for all future tenant capabilities.
- Later stories in `CROWN-23` will implement migrations, seeds, and validation based on this model.
- Stable fixture identifiers are required because local development and future e2e/container workflows will depend on deterministic seeded data.
- Prisma 7+ may be evaluated later, but it is not part of `CROWN-29` scope and does not block this story's design outputs.
- Platform-wide shared tables will live in the `core` schema.
- Tenant-specific tables, including tenant reference data, will live in schemas named `tenant_<tenant_slug>` unless a table is explicitly global.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Reviewers can identify all foundational tenant-domain entities, core relationships, and lifecycle boundaries from the specification without needing follow-up clarification.
- **SC-002**: Reviewers can classify each modeled baseline data type as reference data, seeded fixture data, or out of scope for this story.
- **SC-003**: At least one downstream story can proceed directly from the model definition without reopening foundational scope questions.
- **SC-004**: The resulting specification avoids capability-specific API scope while still providing enough detail for migration and seed design handoff.
