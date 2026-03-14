# Feature Specification: Versioned Management-System Type And Shared Role Catalog Model

**Feature Branch**: `feat/CROWN-140-db-tenant-management-system-type-default-role-template-model`  
**Created**: 2026-03-14  
**Status**: Draft  
**Input**: Jira issue `CROWN-140` - "DB | Tenant management-system type and default role template model"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Persist Versioned Management-System Types (Priority: P1)

As a platform maintainer, I want management-system types stored as versioned control-plane records so that tenant onboarding can read a stable source of truth today and support future A/B variants without replacing type history in place.

**Independent Test**: Review the control-plane schema and baseline records to confirm the approved management-system types are persisted with stable `type_code` values and version `1.0`.

### User Story 2 - Persist A Shared Role Catalog (Priority: P1)

As a platform maintainer, I want a shared role catalog stored separately from management-system types so that multiple types can reuse the same role definition without duplicating role records per type.

**Independent Test**: Review the control-plane schema and baseline records to confirm roles are stored as first-class shared records keyed by `role_code`.

### User Story 3 - Persist Default Role Membership Per Type (Priority: P2)

As a platform maintainer, I want a junction between management-system types and roles so that each type can choose which shared roles it uses and which of those roles are part of its default/bootstrap baseline.

**Independent Test**: Review the junction records and baseline seed output to confirm each type-to-role association is persisted explicitly and `is_default` marks the bootstrap/default set.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The control-plane persistence model MUST store management-system types as versioned records.
- **FR-002**: `management_system_types` MUST be unique by `type_code` plus `version`, not by `type_code` alone.
- **FR-003**: New management-system type records MUST default `version` to `1.0`.
- **FR-004**: The control-plane persistence model MUST store roles in a shared `roles` catalog keyed by `role_code`.
- **FR-005**: The system MUST connect management-system types to roles through a many-to-many junction table.
- **FR-006**: The junction table MUST persist `is_default` to indicate whether a role belongs to the default/bootstrap set for that management-system type.
- **FR-007**: The deterministic baseline MUST seed the following type records at version `1.0`: `transportation`, `dealership`, and `inventory`.
- **FR-008**: The deterministic baseline MUST seed the following shared role codes: `tenant_admin`, `dispatcher`, `accountant`, `human_resources`, and `driver`.
- **FR-009**: The deterministic baseline MUST connect `transportation` to `tenant_admin`, `dispatcher`, `accountant`, `human_resources`, and `driver`, with `tenant_admin`, `dispatcher`, and `driver` marked `is_default = true`.
- **FR-010**: The deterministic baseline MUST connect `dealership` only to `tenant_admin`, marked `is_default = true`.
- **FR-011**: The deterministic baseline MUST connect `inventory` only to `tenant_admin`, marked `is_default = true`.
- **FR-012**: The story MUST remain limited to persistence modeling, migration SQL, seed data, and focused validation; API/UI consumption remains follow-up scope.

### Key Entities

- **Management System Type**: A versioned control-plane catalog record keyed by `type_code` and `version`.
- **Role**: A shared control-plane role catalog record keyed by `role_code`.
- **Management System Type Role**: A junction record connecting one management-system type version to one shared role and marking whether that association is part of the default/bootstrap set.

## Assumptions

- `tenant_admin` is the canonical shared admin role code, while the display name remains `Admin`.
- “Bootstrap roles” means the subset of junction rows where `is_default = true`.
- Only `tenant_admin` is initially connected to `dealership` and `inventory`.
- The current branch should be revised in place rather than layering a second competing persistence design on top.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Reviewers can identify the versioned management-system type catalog directly from persistence for 100% of seeded baseline types.
- **SC-002**: Reviewers can identify the shared role catalog directly from persistence for 100% of seeded baseline role codes.
- **SC-003**: Reviewers can identify the correct type-to-role mappings and `is_default` flags directly from persistence for 100% of seeded baseline associations.
- **SC-004**: Focused validation shows the seed baseline remains idempotent and does not create duplicate versioned type rows, shared role rows, or junction rows.
