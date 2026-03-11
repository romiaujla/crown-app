# Feature Specification: Auth Credential Foundation And Role Mapping

**Feature Branch**: `feat/CROWN-60-auth-credential-foundation`  
**Created**: 2026-03-10  
**Status**: Draft  
**Input**: User description: "CROWN-60 auth credential model and role mapping foundation"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Establish credential-backed identities for supported roles (Priority: P1)

As a maintainer, I need a persisted credential model for Crown users so the platform can stop relying on placeholder auth data and support real credential-based login for the three supported personas.

**Why this priority**: No later login, routing, or shell work can be trusted until the system has a real persisted identity and credential foundation.

**Independent Test**: A reviewer can inspect the control-plane auth records and confirm Crown can persist credential-backed identities for `super_admin`, `tenant_admin`, and `tenant_user` without using refresh-session storage.

**Acceptance Scenarios**:

1. **Given** a new Crown user record is created for a supported persona, **When** the auth foundation stores login credentials, **Then** the record includes the identity and credential data required for future credential-based sign-in.
2. **Given** an existing Crown user record already exists, **When** credential-backed auth is applied, **Then** the user can be represented without breaking their current role or tenant membership relationships.

---

### User Story 2 - Resolve authenticated users into the correct role context (Priority: P2)

As a maintainer, I need a consistent role-mapping rule so an authenticated identity can be resolved into `super_admin`, `tenant_admin`, or `tenant_user` context without ambiguous behavior.

**Why this priority**: The application can only route and authorize users correctly if authenticated identities resolve to one supported role context in a predictable way.

**Independent Test**: A reviewer can evaluate the model and confirm each supported persona resolves into a valid role context with the tenant context required for tenant-scoped users.

**Acceptance Scenarios**:

1. **Given** an authenticated `super_admin`, **When** the auth foundation resolves role context, **Then** the user is treated as a global platform operator with no tenant-scoped session target.
2. **Given** an authenticated tenant-scoped user, **When** the auth foundation resolves role context, **Then** the user is mapped to the correct tenant role with the tenant membership needed for later routing and authorization.

---

### User Story 3 - Bound the first authentication phase to access-token-only behavior (Priority: P3)

As a maintainer, I need the first auth foundation phase to stay intentionally narrow so later login work can build on a stable base without accidentally taking on refresh-session scope too early.

**Why this priority**: The team explicitly wants access-token-only authentication for the first phase, and that boundary needs to be part of the feature definition rather than an implicit assumption.

**Independent Test**: A reviewer can read the specification and supporting artifacts and confirm the foundation supports credential-based authentication without introducing persistent refresh-session behavior.

**Acceptance Scenarios**:

1. **Given** the auth foundation is implemented for the first phase, **When** the scope is reviewed, **Then** access-token-only behavior is included and persistent refresh-session storage is excluded.
2. **Given** future authentication work is planned, **When** maintainers review this feature boundary, **Then** they can distinguish the credential foundation from later session-management or recovery capabilities.

### Edge Cases

- A user has a valid platform identity but no valid tenant membership for a tenant-scoped role.
- A user is marked inactive or disabled and must remain non-authenticating even if credentials exist.
- A tenant-scoped user record has incomplete tenant relationship data and therefore cannot resolve cleanly into a supported role context.
- The same person needs both a global `super_admin` identity and tenant membership records without creating contradictory role resolution.
- Existing seeded users must gain deterministic credential support without changing the canonical tenant baseline beyond the minimum auth additions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST define and persist the credential-backed identity data required for credential-based authentication in the control-plane data model.
- **FR-002**: The system MUST support credential-backed identities for `super_admin`, `tenant_admin`, and `tenant_user`.
- **FR-003**: The system MUST store passwords in a secure hashed form rather than as plain-text values.
- **FR-004**: The system MUST define the password-handling expectations for local development and future hosted environments so the same credential model can be reused later.
- **FR-005**: The system MUST preserve existing platform-user and tenant-membership relationships while adding credential-backed authentication support.
- **FR-006**: The system MUST resolve an authenticated identity into exactly one supported role context for the current login attempt.
- **FR-007**: The system MUST require tenant-scoped users to resolve through valid tenant membership data before they can be treated as `tenant_admin` or `tenant_user`.
- **FR-008**: The system MUST allow `super_admin` identities to resolve without a tenant-scoped login target.
- **FR-009**: The system MUST define inactive or disabled-account behavior at the auth-foundation level so later login flows can reject those identities consistently.
- **FR-010**: The system MUST keep this phase scoped to access-token-only authentication.
- **FR-011**: The system MUST explicitly exclude persistent refresh sessions and refresh-token persistence from this feature scope.
- **FR-012**: The system MUST support deterministic local and seeded auth identities needed for later login-journey validation.

### Key Entities *(include if feature involves data)*

- **Credential Identity**: A Crown platform user record with the persisted identity and credential attributes required for credential-based sign-in.
- **Credential Secret**: The stored hashed-password representation and related auth metadata required to validate a login attempt safely.
- **Authenticated Role Context**: The resolved role outcome for a login attempt, including whether the user is a `super_admin` or a tenant-scoped user and whether tenant context is required.
- **Tenant Membership Context**: The tenant relationship used to validate and resolve tenant-scoped identities into `tenant_admin` or `tenant_user`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of supported Crown personas (`super_admin`, `tenant_admin`, `tenant_user`) can be represented by the persisted auth foundation without placeholder login data.
- **SC-002**: 100% of persisted passwords for this feature scope are stored only as hashed credential material.
- **SC-003**: 100% of authenticated identity evaluations resolve into either one supported role context or a clear invalid-state outcome.
- **SC-004**: Reviewers can verify from the final artifacts that access-token-only authentication is the shipped scope and that persistent refresh-session behavior remains excluded.

## Assumptions

- Login identifiers will be supported by later API work using username or email, but this story focuses on the credential and role-mapping foundation rather than the endpoint contract.
- Disabled and inactive account-management workflows will be delivered in later admin epics, but this story still needs a foundational status concept so those accounts can be rejected consistently.
- Deterministic local and seeded auth accounts remain part of the canonical seed baseline rather than a separate parallel fixture system.
