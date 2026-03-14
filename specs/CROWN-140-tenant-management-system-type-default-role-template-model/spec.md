# Feature Specification: Tenant Management-System Type And Default Role Template Model

**Feature Branch**: `feat/CROWN-140-db-tenant-management-system-type-default-role-template-model`  
**Created**: 2026-03-14  
**Status**: Draft  
**Input**: Jira issue `CROWN-140` - "DB | Tenant management-system type and default role template model"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Persist Approved Management-System Types (Priority: P1)

As a platform maintainer, I want approved tenant management-system types stored in persistence so that tenant onboarding can select from a stable source of truth instead of relying on hard-coded application values.

**Why this priority**: The onboarding flow cannot safely depend on default role templates until the supported management-system catalog exists and is durable.

**Independent Test**: Review the control-plane schema and baseline records to confirm the approved management-system types are represented as first-class persisted records with stable lookup keys.

**Acceptance Scenarios**:

1. **Given** the platform provisions or prepares a tenant-create flow, **When** the supported management-system catalog is reviewed, **Then** each approved management-system type is represented in persistence with a stable business key.
2. **Given** a later API or UI story needs management-system options, **When** it reads the persisted catalog, **Then** it can distinguish the approved types without relying on hard-coded arrays.
3. **Given** a management-system type needs lifecycle control later, **When** the model is reviewed, **Then** the persisted shape can support enabling, disabling, or extending types without changing unrelated tenant records.

---

### User Story 2 - Persist Default Role Templates Per Management-System Type (Priority: P1)

As a platform maintainer, I want each management-system type to own a default role-template set so that tenant onboarding can bootstrap consistent baseline roles for the selected product context.

**Why this priority**: The management-system catalog alone does not satisfy the Jira goal; onboarding also needs the baseline role template definitions tied to each type.

**Independent Test**: Review the control-plane schema and baseline records to confirm each supported management-system type can reference one or more default role templates through persisted relations and stable role codes.

**Acceptance Scenarios**:

1. **Given** an approved management-system type exists in persistence, **When** its default role templates are reviewed, **Then** the templates are stored as related records rather than implied by code.
2. **Given** later onboarding logic needs deterministic default roles, **When** it reads the persisted templates for one management-system type, **Then** it can identify each role template by a stable role code and display-oriented metadata.
3. **Given** one management-system type needs a different role baseline than another, **When** the persisted model is reviewed, **Then** the role-template set can vary by management-system type without duplicating the type catalog itself.

---

### User Story 3 - Represent The Required Admin Template For Tenant Bootstrap (Priority: P2)

As a platform maintainer, I want the required admin role template represented explicitly so that later stories can map it both to mandatory setup behavior and to the v1 tenant-admin bootstrap path.

**Why this priority**: The required admin role is the key integration point between onboarding defaults and the existing tenant-admin auth path.

**Independent Test**: Review the persisted role-template model and baseline records to confirm the required admin template is explicitly marked for setup/bootstrap mapping instead of being inferred only from a display label.

**Acceptance Scenarios**:

1. **Given** the default role templates for a management-system type are reviewed, **When** the required admin role is identified, **Then** it is represented with explicit metadata that marks it as required for baseline setup.
2. **Given** a later onboarding story needs to map one default role template to the current tenant-admin bootstrap path, **When** the model is reviewed, **Then** that mapping can be determined from persisted metadata without hard-coding a special-case role label.
3. **Given** richer role-management stories arrive later, **When** the current model is reviewed, **Then** the admin-template representation remains extensible and does not block adding more role-behavior metadata in later scope.

### Edge Cases

- A management-system type is temporarily unsupported for onboarding but should remain in persistence for auditability or future reactivation.
- Two management-system types use the same human-readable role label but require separate role-template records and stable role codes.
- A management-system type needs multiple required templates later, even though the current bootstrap path only requires one admin-template mapping.
- The default role-template set evolves over time and later stories need to add templates without rewriting tenant-domain role assignments already created in tenant schemas.
- The current product direction is heavily TMS-oriented, but the persisted catalog should not hard-code TMS-only assumptions so strongly that later management-system types cannot be added cleanly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The control-plane persistence model MUST store the approved tenant management-system types as first-class records.
- **FR-002**: Each persisted management-system type MUST include a stable business key suitable for later API, UI, seed, and provisioning lookups.
- **FR-003**: The persisted management-system type model MUST support lifecycle or availability control without deleting historical records.
- **FR-004**: The control-plane persistence model MUST store default role templates as records related to one management-system type.
- **FR-005**: Each persisted default role template MUST include a stable role code and human-readable display metadata.
- **FR-006**: The persisted model MUST allow different management-system types to own different default role-template sets.
- **FR-007**: The required `admin` default role template MUST be represented explicitly with metadata that later stories can use for baseline setup mapping.
- **FR-008**: The required `admin` default role template MUST be representable in a way that later stories can map to the v1 tenant-admin bootstrap path without depending only on display text.
- **FR-009**: The model MUST stay limited to persistence modeling, schema design, baseline records, and implementation-safe validation for this source-of-truth layer.
- **FR-010**: The story MUST NOT implement tenant-create API consumption, UI consumption, or tenant-schema role assignment behavior beyond what is required to establish the persistence source of truth.
- **FR-011**: New persistence entities introduced by this story MUST follow the engineering constitution naming rules for model names, table names, and stable business keys.
- **FR-012**: The implementation MUST provide a deterministic baseline dataset for the approved management-system types and their default role templates so local environments and later stories can consume a known source of truth.

### Key Entities *(include if feature involves data)*

- **Management System Type**: A control-plane catalog record representing one approved tenant product context, such as a transportation or dealer management system.
- **Default Role Template**: A control-plane role-definition record linked to one management-system type and intended for tenant onboarding defaults.
- **Bootstrap Mapping Marker**: Persisted metadata on a default role template that signals whether it is required for baseline setup and whether it maps to the current tenant-admin bootstrap path.

## Assumptions

- The current approved baseline management-system types are `tms` and `dms`, based on repository planning references to shared-web management-system routes such as `app/tms` and `app/dms`; later stories can expand this catalog if product direction changes.
- These source-of-truth records belong in the shared control-plane schema managed by `apps/api/prisma/schema.prisma`, not inside each `tenant_<tenant_slug>` schema.
- Tenant-domain tables such as `tenant_role_definitions` remain tenant-scoped; this story only adds the control-plane defaults that later onboarding flows can translate into tenant-specific role records.
- The current v1 bootstrap path that needs explicit mapping is the existing `tenant_admin` path used by local auth and role-resolution flows.
- Baseline records created by this story are internal product defaults rather than tenant-customizable role-management workflows.

## Dependencies

- Existing control-plane Prisma schema in `apps/api/prisma/schema.prisma`
- Existing tenant provisioning and seed/bootstrap workflows in `apps/api/src/tenant/` and `apps/api/prisma/seed/`
- Existing auth role baseline in `apps/api/src/auth/claims.ts` and local auth/seed fixtures
- Future tenant onboarding and management-system selection stories under the provisioning roadmap, especially `CROWN-43`

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Reviewers can identify the approved management-system type catalog and stable lookup keys directly from the control-plane schema and baseline records without relying on hard-coded application values.
- **SC-002**: Reviewers can identify the default role-template set for each approved management-system type directly from persistence and confirm the templates are relation-backed records rather than implicit code assumptions.
- **SC-003**: Reviewers can identify the required admin template and its v1 tenant-admin bootstrap mapping metadata directly from persistence for 100% of approved management-system types.
- **SC-004**: Focused validation shows the local control-plane baseline loads deterministic management-system types and default role templates in 100% of tested seed runs.
- **SC-005**: The delivered changes remain limited to control-plane persistence modeling, baseline records, and focused validation, without widening into tenant-create API or UI implementation.
