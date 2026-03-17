# Feature Specification: Normalize Control-Plane Schema For Users, Memberships, And Role Assignments

**Feature Branch**: `feat/CROWN-153-normalize-control-plane-schema-users-memberships-role-assignments`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: Jira issue `CROWN-153` - "DB | Normalize control-plane schema for users, memberships, and role assignments"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Persist The Normalized Identity And Direct User Role Model (Priority: P1)

As a maintainer, I want the control-plane schema to persist users and direct user-role assignments separately so global authorization no longer depends on the legacy `platform_users.role` string.

**Why this priority**: The normalized auth model cannot be enforced from relational data until the schema introduces explicit user and direct role-assignment structures.

**Independent Test**: Review the Prisma schema, migration SQL, and focused validation to confirm the database stores `users`, `roles`, and `user_platform_role_assignments` with the expected relations and uniqueness rules.

**Acceptance Scenarios**:

1. **Given** the current control-plane schema, **When** the normalized schema is reviewed, **Then** the long-lived identity record is modeled as `users` rather than the legacy `platform_users` table shape.
2. **Given** a user needs direct platform-scoped access such as `super_admin`, **When** the schema is reviewed, **Then** that access is modeled through explicit user-role assignment records against the shared `roles` table.
3. **Given** downstream auth readers need compatibility during rollout, **When** the schema change is reviewed, **Then** the migration path for the legacy `platform_users.role` column is explicit.

---

### User Story 2 - Persist Tenant Memberships And Tenant Role Assignments Separately (Priority: P1)

As a maintainer, I want tenant association stored separately from tenant authorization so a user can belong to a tenant independently of which tenant roles they hold.

**Why this priority**: `tenant_memberships` is the core normalization boundary that lets the system distinguish “belongs to tenant” from “has this role in tenant.”

**Independent Test**: Review the Prisma schema, migration SQL, and focused validation to confirm the schema stores `tenant_memberships` and `tenant_membership_role_assignments` as separate relational concepts while both assignment paths reference the shared `roles` catalog.

**Acceptance Scenarios**:

1. **Given** a user belongs to a tenant, **When** the schema is reviewed, **Then** that relationship is stored in `tenant_memberships` even if no tenant role has yet been assigned.
2. **Given** a tenant membership holds one or more tenant roles, **When** the schema is reviewed, **Then** those grants are stored in `tenant_membership_role_assignments` rather than on the membership row itself.
3. **Given** the shared `roles` table stores `super_admin`, `tenant_admin`, `admin`, `dispatcher`, `driver`, `accountant`, and `human_resources`, **When** the schema is reviewed, **Then** each role carries scope and auth-class metadata so runtime auth can treat non-admin tenant roles as `tenant_user` behavior for now.

---

### User Story 3 - Keep Management-System Role Templates And Migration Compatibility Intact (Priority: P2)

As a maintainer, I want the normalized schema migration to preserve management-system role templates and provide a safe phased rollout so current seeds and auth flows can move to the new model without ambiguous sources of truth.

**Why this priority**: The new tables are only useful if existing role-template data and current auth baselines can transition safely.

**Independent Test**: Review the migration and validation outputs to confirm `management_system_type_roles` still describe template/default configuration only and that seed/auth compatibility paths are updated or explicitly staged.

**Acceptance Scenarios**:

1. **Given** management-system role templates already exist, **When** the normalized schema is reviewed, **Then** template/default mappings remain separate from actual user grants.
2. **Given** the migration introduces normalized tables, **When** focused validation runs, **Then** the deterministic control-plane baseline can still be seeded against the new schema shape.
3. **Given** legacy role columns still exist during the compatibility window, **When** the migration is reviewed, **Then** their transitional status is explicit and downstream removal remains follow-up scope unless completed safely in this story.

### Edge Cases

- A user has a tenant membership but no active tenant-role assignments yet.
- A user has multiple tenant-role assignments within one tenant membership.
- A user has `super_admin` platform access and also tenant-scoped memberships.
- Existing seed data and auth resolution still expect legacy role values during rollout.
- A management-system type exposes a tenant role that no user has been assigned yet.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The Prisma schema MUST introduce the normalized `users` persistence model for global identity records.
- **FR-002**: The Prisma schema MUST introduce `user_platform_role_assignments` as the direct user-role assignment structure for platform-scoped access.
- **FR-003**: The Prisma schema MUST introduce `tenant_memberships` as the user-to-tenant association table independent from tenant-role assignment.
- **FR-004**: The Prisma schema MUST use a single shared `roles` table for both direct user-role assignments and tenant membership role assignments.
- **FR-005**: The shared `roles` table MUST include role metadata that distinguishes scope and auth behavior, so `super_admin` can remain platform-scoped while tenant roles map to either `tenant_admin` or `tenant_user` auth behavior.
- **FR-006**: The shared `roles` table MUST support at least `super_admin`, `tenant_admin`, `admin`, `dispatcher`, `driver`, `accountant`, and `human_resources`.
- **FR-007**: The schema MUST support many-to-many tenant-role assignment by allowing multiple role-assignment rows per tenant membership.
- **FR-008**: `management_system_type_roles` MUST continue referencing the shared `roles` table for management-system defaults/templates without becoming a user authorization table.
- **FR-009**: `management_system_type_roles` MUST remain the role-template/default mapping for management-system types and MUST NOT be repurposed as a user-grant table.
- **FR-010**: Legacy string role columns MUST either be removed safely in this story or retained only as clearly transitional compatibility fields.
- **FR-011**: Prisma schema changes, generated migration SQL, and focused validation MUST be included.
- **FR-012**: Seed and auth-support code that directly depends on the normalized control-plane schema MUST be updated enough to keep the story’s validation path coherent.
- **FR-013**: The story MUST remain limited to control-plane schema normalization, migration/backfill-safe structure, and focused compatibility updates; broader auth API and UI redesign remain follow-up scope.

### Key Entities

- **User**: The global identity record for credentials, account status, and profile metadata.
- **Role**: A shared role definition that includes both business meaning and the metadata needed to derive platform vs tenant scope and effective auth behavior.
- **User Platform Role Assignment**: The direct role grant linking a user to a shared role for platform-scoped authorization.
- **Tenant Membership**: The user-to-tenant association that exists independently from tenant authorization.
- **Tenant Membership Role Assignment**: The actual tenant authorization grant linking a membership to a shared role.
- **Management System Type Role**: The template/default mapping between a management-system type and an available tenant role.

## Assumptions

- The approved target model from `CROWN-152` is the source of truth for the normalized table layout and relationship boundaries.
- The story may keep selected legacy columns temporarily if that is safer for the current compatibility window than removing every old reader in one change.
- The shared role catalog can carry both management-system meaning and auth metadata as long as runtime auth still resolves to the current `super_admin` / `tenant_admin` / `tenant_user` behavior.
- Focused validation can rely on Prisma schema generation, migration review, and targeted typecheck/test coverage rather than a full repository-wide rewrite of every auth consumer in this story.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Reviewers can identify all normalized control-plane tables and relations for users, the shared `roles` table, tenant memberships, and both role-assignment paths directly from the Prisma schema and migration.
- **SC-002**: Focused validation confirms the schema supports multiple tenant-role assignments per membership without collapsing tenant association into authorization.
- **SC-003**: Reviewers can confirm from the schema and validation path that role scope and auth behavior are explicit even though the role catalog is shared.
- **SC-004**: Reviewers can confirm management-system role templates remain distinct from actual user grants and that legacy role fields have an explicit migration status.
