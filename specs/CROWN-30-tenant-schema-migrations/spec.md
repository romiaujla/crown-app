# Feature Specification: Expand Tenant Schema Migrations For Foundational TMS Entities

**Feature Branch**: `feat/CROWN-30-tenant-schema-migrations`  
**Created**: 2026-03-09  
**Status**: Draft  
**Input**: User description: "crown-30"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Expand The Foundational Tenant Migration Baseline (Priority: P1)

The maintainer expands the tenant migration set so the tenant schema can represent the approved foundational TMS entities instead of the earlier minimal baseline.

**Why this priority**: Downstream seed, bootstrap, identity, and product stories cannot proceed until the tenant schema exists in migration form.

**Independent Test**: The story is complete when a reviewer can inspect the migration set and verify that the approved foundational TMS entities now exist in tenant schemas named `tenant_<tenant_slug>`.

**Acceptance Scenarios**:

1. **Given** the approved `CROWN-29` tenant-domain model, **When** the migration set is reviewed, **Then** the required foundational TMS entities are represented in migration-backed tenant tables.
2. **Given** tenant tables must live in `tenant_<tenant_slug>`, **When** the migration scope is reviewed, **Then** no tenant-domain tables are incorrectly placed in `core`.

---

### User Story 2 - Preserve Foundational Boundaries And Migration Safety (Priority: P2)

The maintainer keeps the migration work limited to foundational schema structure and documents how it relates to the existing baseline without absorbing later capability-specific behavior.

**Why this priority**: Migration work can easily over-expand into admin or product logic if foundational boundaries are not kept explicit.

**Independent Test**: The story is complete when a reviewer can compare the old and new migration baseline and confirm that it stays foundational, schema-focused, and aligned to the approved model.

**Acceptance Scenarios**:

1. **Given** the earlier minimal migration baseline, **When** the new migration set is reviewed, **Then** the delta from the earlier baseline is explicit and limited to foundational TMS schema concerns.
2. **Given** later epics own capability-specific APIs and workflows, **When** the migration scope is reviewed, **Then** those concerns remain out of scope for this story.

---

### User Story 3 - Prepare Downstream Seed And Bootstrap Work (Priority: P3)

The maintainer produces a tenant migration set that downstream seed and bootstrap stories can build on without redefining schema placement, entity shape, or foundational relationships.

**Why this priority**: `CROWN-31` through `CROWN-34` depend on the migration set being stable enough to use as their implementation baseline.

**Independent Test**: The story is complete when downstream stories can reference the migration outputs directly for seed design, seed implementation, and bootstrap integration.

**Acceptance Scenarios**:

1. **Given** later seed and bootstrap work depends on this story, **When** the migration outputs are reviewed, **Then** they provide a stable schema baseline for downstream implementation.
2. **Given** deterministic local development and future automated testing depend on seeded tenant data, **When** the migration set is reviewed, **Then** it supports the entity relationships and placement rules required by those later workflows.

### Edge Cases

- What happens when an entity from the approved model still cannot be represented cleanly inside the current tenant migration structure?
- How is a reference-data-backed table handled when it appears reusable across tenants but is still tenant-owned?
- What happens when the current minimal baseline uses a table name or shape that conflicts with the approved foundational TMS model?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The migration set MUST expand beyond the current minimal tenant baseline to represent the approved foundational TMS entity model from `CROWN-29`.
- **FR-002**: Tenant-domain tables introduced or updated by this story MUST be defined for schemas named `tenant_<tenant_slug>`.
- **FR-003**: Platform-wide shared tables MUST remain in `core` and MUST NOT be used for tenant-domain tables introduced by this story.
- **FR-004**: The migration set MUST reflect the foundational entities, relationships, and lifecycle boundaries approved in `CROWN-29`.
- **FR-005**: The migration set MUST preserve the distinction between truly global shared data and tenant-owned reference data.
- **FR-006**: The migration outputs MUST be suitable for downstream seed and bootstrap stories without requiring those stories to redefine schema placement or foundational entity structure.
- **FR-007**: The story MUST remain limited to foundational tenant schema structure and MUST NOT absorb later capability-specific APIs, workflows, or UI behavior.
- **FR-008**: The migration set MUST make the delta from the previous minimal baseline reviewable for maintainers.
- **FR-009**: Foundational tenant migration SQL MUST be generated from Prisma-authored tenant schema definitions and inspected before use as the canonical migration baseline.

### Key Entities _(include if feature involves data)_

- **Tenant Schema Migration Set**: The ordered tenant-domain migration files that define foundational TMS tables inside `tenant_<tenant_slug>`.
- **Foundational TMS Entity Table**: A tenant-domain table representing an approved `CROWN-29` entity such as organizations, locations, people, loads, stops, equipment assets, or activity records.
- **Tenant-Owned Reference Table**: A tenant-scoped table that stores reusable catalogs for a specific tenant and remains outside `core` unless later promoted to a truly global shared concern.
- **Migration Baseline Delta**: The documented change set between the earlier minimal tenant baseline and the new foundational TMS migration baseline.

## Assumptions

- `CROWN-29` is the approved source of truth for foundational tenant-domain entities and schema placement rules.
- Platform-wide shared tables belong in `core`, while tenant-domain tables belong in `tenant_<tenant_slug>`.
- Tenant reference data remains tenant-scoped unless later governance explicitly promotes a catalog to a truly global shared concern.
- Downstream stories `CROWN-31` through `CROWN-34` will consume this migration baseline for seed design, seed implementation, bootstrap, and validation.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Reviewers can map every in-scope foundational TMS entity from `CROWN-29` to a tenant migration-backed table without additional clarification.
- **SC-002**: Reviewers can verify that tenant-domain tables are placed in `tenant_<tenant_slug>` and that no tenant-domain table has been incorrectly moved into `core`.
- **SC-003**: At least one downstream story can use the migration outputs directly without reopening foundational schema-placement or entity-shape questions.
- **SC-004**: The migration change set is reviewable enough that a maintainer can distinguish foundational schema expansion from out-of-scope capability work.
