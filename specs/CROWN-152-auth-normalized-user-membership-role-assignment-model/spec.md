# Feature Specification: Auth Normalized User, Membership, And Role-Assignment Model

**Feature Branch**: `feat/CROWN-152-auth-normalized-user-membership-role-assignment-model`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: Jira issue `CROWN-152` - "Auth | Design normalized user, membership, and role-assignment model"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Separate Identity, Membership, And Role Concepts (Priority: P1)

As a maintainer, I want the auth model to separate user identity, platform roles, tenant memberships, and tenant role assignments so downstream schema and auth work can evolve without overloading one `role` column for multiple meanings.

**Why this priority**: The current `platform_users.role` plus `platform_user_tenants.role` structure mixes persona, membership, and authorization intent, which blocks safe migration for `CROWN-149`.

**Independent Test**: A reviewer can inspect the specification and data model artifacts and clearly identify the target entities for identity, platform authorization, tenant membership, and tenant role assignment, along with the relationships between them.

**Acceptance Scenarios**:

1. **Given** the current control-plane auth model, **When** the target design is reviewed, **Then** user identity, platform roles, tenant memberships, and tenant role assignments are defined as separate concepts.
2. **Given** downstream stories need normalized control-plane persistence, **When** the target model is reviewed, **Then** each relationship boundary is explicit enough to drive migration and API follow-up work.
3. **Given** auth resolution depends on both tenant context and role context, **When** the target model is reviewed, **Then** tenant membership is described as a separate prerequisite from tenant-role assignment.

---

### User Story 2 - Separate Role Templates From Actual User Grants (Priority: P2)

As a maintainer, I want management-system role templates kept distinct from actual user auth-role assignments so onboarding defaults and user access grants do not share the same persistence meaning.

**Why this priority**: `ManagementSystemTypeRole` currently represents role availability/defaults per product type, but `CROWN-149` needs a clear answer for how real user access is assigned and resolved.

**Independent Test**: A reviewer can inspect the artifacts and determine which records describe role templates/default availability versus which records represent actual user authorization.

**Acceptance Scenarios**:

1. **Given** a management-system type such as `transportation`, **When** the target model is reviewed, **Then** its role-template records are defined as configuration metadata rather than user auth grants.
2. **Given** a user needs tenant-scoped access, **When** the target model is reviewed, **Then** the design shows how the user receives actual tenant-role assignments separate from template/default configuration.
3. **Given** the supported tenant-scoped roles include `tenant_admin`, `dispatcher`, `driver`, `accountant`, and `human_resources`, **When** the target model is reviewed, **Then** their place in the reusable role catalog and assignment flow is explicit.

---

### User Story 3 - Define The Migration And Rollout Path (Priority: P3)

As a maintainer, I want a concrete migration and rollout outline so follow-up schema, seed, JWT, and API stories can move from the legacy role columns to the normalized model without breaking existing auth behavior.

**Why this priority**: The target model only helps if follow-up implementation stories can migrate toward it incrementally and know when legacy fields can be removed.

**Independent Test**: A reviewer can read the design package and trace a safe rollout path covering schema, backfill, seeded data, JWT claim derivation, admin/API follow-up work, and eventual legacy-column removal.

**Acceptance Scenarios**:

1. **Given** current auth behavior still depends on legacy role columns, **When** the rollout plan is reviewed, **Then** it defines how follow-up work can introduce normalized tables without breaking current login and routing behavior.
2. **Given** JWTs and route authorization currently resolve one effective role per session, **When** the rollout plan is reviewed, **Then** the design explains how that behavior is preserved while the schema supports future many-to-many assignments.
3. **Given** the migration eventually needs to remove legacy role fields, **When** the rollout plan is reviewed, **Then** the design defines the compatibility window and the removal trigger for those fields.

### Edge Cases

- A single person needs both `super_admin` platform access and one or more tenant-scoped assignments.
- A single tenant membership eventually needs more than one stored tenant-role assignment, but current JWT claims and route policies still expect one effective tenant role at a time.
- A tenant is inactive or deprovisioned while the user identity remains valid in the control plane.
- A management-system type exposes a role template that is not yet assigned to any user.
- A legacy user currently stores `tenant_user` on `platform_users.role` even though the normalized catalog prefers explicit tenant auth-role assignments.
- Existing seeded display labels use `Admin`, but the canonical auth role code remains `tenant_admin`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The target design MUST define a user-identity entity that remains separate from both platform authorization and tenant authorization.
- **FR-002**: The target design MUST define platform-role concepts separately from tenant memberships and tenant auth-role assignments.
- **FR-003**: The target design MUST define tenant membership as a user-to-tenant relationship that can exist independently from tenant auth-role assignments.
- **FR-003a**: The target design MUST explain that tenant membership exists to capture tenant association separately from tenant authorization so a user can belong to a tenant before, after, or independently of a specific tenant-role grant.
- **FR-004**: The target design MUST define tenant auth-role assignment as a separate relationship from tenant membership and from management-system role-template configuration.
- **FR-005**: The target design MUST explicitly state that `ManagementSystemTypeRole`-style records represent role availability/default templates rather than actual user access grants.
- **FR-006**: The target design MUST define how `super_admin` fits into the normalized model as a platform-scoped authorization concern.
- **FR-007**: The target design MUST define how `tenant_admin`, `dispatcher`, `driver`, `accountant`, and `human_resources` fit into the normalized model as reusable tenant-scoped auth roles.
- **FR-008**: The target design MUST define how the product label `Admin` maps to the canonical auth role model.
- **FR-009**: The target design MUST document whether initial product behavior limits each active tenant membership to one effective auth role at a time even though the schema supports many-to-many assignments.
- **FR-010**: The target design MUST define the initial effective-role selection rule used to derive JWT claims and route authorization during the compatibility phase.
- **FR-011**: The design MUST include a migration outline covering schema changes, seed/backfill work, JWT claim derivation, API/admin follow-up work, and legacy-field removal.
- **FR-012**: The design MUST preserve the existing concept that a user identity can outlive any one tenant membership or tenant assignment.
- **FR-013**: The design MUST remain limited to the normalized auth data model and rollout guidance; implementation of schema migrations, auth APIs, and UI flows remains follow-up scope.

### Key Entities *(include if feature involves data)*

- **User**: The global person/account record used for login credentials, account status, and profile identity.
- **Platform Role Assignment**: The platform-scoped authorization grant that enables global permissions such as `super_admin`.
- **Tenant Membership**: The user-to-tenant relationship that establishes tenant association independently from a concrete tenant auth role.
- **Tenant Auth Role**: The reusable tenant-scoped auth role definition, such as `tenant_admin`, `dispatcher`, `driver`, `accountant`, or `human_resources`.
- **Tenant Role Assignment**: The actual user authorization grant that links a tenant membership to one tenant auth role.
- **Role Template Mapping**: The management-system-type configuration that determines which tenant auth roles are available or default for a tenant type without granting access to a specific user.

## Assumptions

- The current `platform_users` identity root remains the preferred anchor for credentials, account status, and user profile metadata, even if the normalized table is renamed to `users`.
- The existing shared `roles` catalog introduced for management-system templates can evolve into the canonical `tenant_roles` catalog rather than introducing a second competing tenant-role definition table.
- The product label `Admin` remains a display name for the canonical tenant auth role code `tenant_admin`, not a separate assignable auth role.
- The normalized schema will support many-to-many tenant-role assignments over time, but the initial auth runtime will continue to resolve one effective tenant auth role per session for compatibility with the current JWT and RBAC contracts.
- Schema, seed, JWT, and API/UI implementation work will be delivered in follow-up stories under `CROWN-149` once this target design is approved.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Reviewers can identify the normalized target entities and relationships for identity, platform authorization, tenant membership, and tenant authorization without needing follow-up clarification.
- **SC-002**: Reviewers can explain the difference between management-system role templates and actual user role assignments directly from the design artifacts.
- **SC-003**: Reviewers can map `super_admin`, `tenant_admin`, `dispatcher`, `driver`, `accountant`, and `human_resources` to one clear place in the target model without contradictory interpretations.
- **SC-004**: Reviewers can trace a staged migration path from the current legacy role columns to the normalized model, including the trigger for legacy-field removal.
