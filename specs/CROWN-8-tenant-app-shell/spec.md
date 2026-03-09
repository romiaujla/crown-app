# Feature Specification: Tenant App UI Shell

**Feature Branch**: `feat/CROWN-8-tenant-app-shell`  
**Created**: 2026-03-08  
**Status**: Draft  
**Input**: User description: "CROWN-8"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enter a Tenant Workspace (Priority: P1)

As a tenant user, I want a dedicated tenant app shell so that I can enter my workspace and immediately know I am in a tenant-scoped experience rather than the Crown platform control plane.

**Why this priority**: The tenant shell is the primary entry point for customer-facing work. Without it, the product does not provide a distinct workspace for tenant users.

**Independent Test**: Can be fully tested by loading the tenant app shell and confirming the user sees a tenant-scoped workspace with powered-by-Crown branding and no platform-control framing.

**Acceptance Scenarios**:

1. **Given** an authenticated tenant-scoped user, **When** they enter the tenant app, **Then** they see a tenant workspace shell rather than the super-admin control plane.
2. **Given** a tenant workspace shell is shown, **When** the user reviews the top-level branding and orientation text, **Then** the workspace identifies itself as powered by Crown and scoped to the tenant.

---

### User Story 2 - Navigate Core Tenant Areas (Priority: P2)

As a tenant user, I want clear navigation within the tenant app so that I can move through the core management-system workspace without confusion.

**Why this priority**: Once the tenant shell exists, the next highest value is giving users a usable workspace structure with stable tenant-oriented navigation.

**Independent Test**: Can be fully tested by loading the shell and confirming the tenant-facing navigation exposes clear workspace destinations that remain distinct from platform administration.

**Acceptance Scenarios**:

1. **Given** a tenant user is in the workspace shell, **When** they view the primary navigation, **Then** they can identify the main workspace sections for tenant operations.
2. **Given** the tenant workspace has limited or placeholder data, **When** the user navigates the shell, **Then** the structure remains understandable and usable.

---

### User Story 3 - See Tenant Context With Management-System Language (Priority: P3)

As a tenant user, I want the tenant app shell to describe my workspace using management-system language so that the product direction is clear and the tenant app does not carry forward CRM-only framing.

**Why this priority**: The tenant shell is where end users experience the product day to day, so it must reflect the management-system pivot in a tenant-facing way.

**Independent Test**: Can be fully tested by reviewing the shell headings, summary areas, and empty states to confirm they describe a tenant management-system workspace rather than a CRM.

**Acceptance Scenarios**:

1. **Given** a tenant workspace loads, **When** the user reviews headings, labels, and summary content, **Then** the shell uses management-system-oriented language.
2. **Given** the workspace has little or no current data, **When** the shell renders empty or overview states, **Then** the user still understands the purpose of the tenant workspace.

### Edge Cases

- A tenant user reaches the app with a valid session but limited tenant data and still needs a meaningful workspace shell.
- A super admin or unauthenticated visitor attempts to enter the tenant shell and must not be shown the tenant workspace as if it were valid for them.
- Tenant-facing branding must remain clearly separate from the super-admin control plane while still showing the connection to Crown.
- The shell must remain understandable before deeper tenant workflows are implemented.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a dedicated tenant app shell in the main web app.
- **FR-002**: The tenant app shell MUST be visually and structurally distinct from the super-admin control plane.
- **FR-003**: The tenant app shell MUST identify the workspace as tenant-scoped and powered by Crown.
- **FR-004**: The tenant app shell MUST provide primary navigation for core tenant workspace areas.
- **FR-005**: The tenant app shell MUST remain usable even when tenant-specific operational data is minimal or unavailable.
- **FR-006**: The tenant app shell MUST use management-system-oriented language and MUST NOT frame the tenant workspace as a CRM.
- **FR-007**: The tenant app shell MUST provide overview or orientation content that helps a tenant user understand the workspace immediately after entry.
- **FR-008**: The tenant app shell MUST provide meaningful empty or no-data states for early-stage tenant workspaces.
- **FR-009**: The system MUST preserve a clear access and presentation boundary between tenant-scoped experiences and the super-admin control plane.
- **FR-010**: The shell MUST support future tenant-management expansion without requiring a rename or reframing of the top-level tenant experience.

### Key Entities *(include if feature involves data)*

- **Tenant App Shell**: The top-level tenant-facing workspace experience shown to a tenant-scoped user.
- **Tenant Workspace Navigation Item**: A primary destination within the tenant app shell.
- **Tenant Overview State**: The summary and orientation content shown when a tenant user lands in the workspace.
- **Powered-by-Crown Brand Context**: The tenant-facing brand treatment that links the workspace to Crown without making it a platform-control surface.

### Assumptions

- The tenant app shell is the customer-facing complement to the `super_admin` control-plane shell delivered in `CROWN-7`.
- Tenant-facing branding should present workspaces as powered by Crown rather than as the Crown platform control plane itself.
- This feature defines the shell, navigation frame, and overview orientation for tenant users, not every downstream tenant workflow.
- Existing auth and RBAC work provides the tenant-scoped role boundaries needed to distinguish tenant users from `super_admin`.

### Dependencies

- `CROWN-4` or equivalent auth/RBAC behavior is available to distinguish tenant-scoped users from `super_admin`.
- `CROWN-6` provides the management-system tenant-domain concepts that the tenant shell should reference or frame.
- `CROWN-7` establishes the platform control-plane shell that this feature must remain distinct from.

### Implementation Note

- The tenant shell may initially coexist inside the same top-level web app route as the platform shell as long as role-aware presentation keeps the two experiences clearly separated.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of tested tenant-scoped users can enter a tenant workspace shell without being shown the platform control plane.
- **SC-002**: 100% of reviewed tenant-shell branding and orientation copy presents the workspace as powered by Crown rather than as a platform-admin surface.
- **SC-003**: 100% of in-scope tenant navigation labels and overview text use management-system language rather than CRM terminology.
- **SC-004**: In acceptance testing, a tenant user can identify and navigate to all in-scope tenant shell sections within 30 seconds of landing in the workspace.
- **SC-005**: At least 90% of reviewers confirm that the tenant shell clearly communicates a tenant management-system workspace distinct from the super-admin control plane.
