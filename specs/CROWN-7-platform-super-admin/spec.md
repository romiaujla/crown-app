# Feature Specification: Super-Admin Control Plane UI Shell

**Feature Branch**: `feat/CROWN-7-platform-super-admin`  
**Created**: 2026-03-08  
**Status**: Draft  
**Input**: User description: "CROWn-7 is what i want to work on. This issue was written before we had decided to pivot from crm to management systems. I would still want the super admin for the main app, so keep that in mind when working on this. if there are any changes needed to JIRA confirm with me and we can do those as well."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enter the Platform Control Plane (Priority: P1)

As a platform super admin, I want a dedicated main-app shell so that I can enter Crown as the platform operator and access global administration functions without tenant-scoped confusion.

**Why this priority**: The super-admin shell is the top-level operator experience for the platform. Without it, the app cannot clearly separate platform control from tenant usage.

**Independent Test**: Can be fully tested by signing in as a `super_admin` and confirming the user lands in a platform-specific shell with global navigation, platform identity, and no tenant-user framing.

**Acceptance Scenarios**:

1. **Given** an authenticated `super_admin`, **When** they open the main app, **Then** they are shown a platform control-plane shell branded for Crown rather than a tenant workspace.
2. **Given** an authenticated non-super-admin user, **When** they attempt to access the super-admin shell, **Then** the system denies access or redirects them to the appropriate non-platform experience.

---

### User Story 2 - Navigate Platform Management Areas (Priority: P2)

As a platform super admin, I want clear navigation to platform management areas so that I can move between tenants, platform operations, and future management-system administration work from one control plane.

**Why this priority**: Once the shell exists, the next value is operator orientation and navigation. The super admin needs a structure that reflects the platform pivot rather than legacy CRM assumptions.

**Independent Test**: Can be fully tested by opening the shell and confirming that all primary navigation options are platform-oriented, clearly labeled, and usable without entering a tenant app first.

**Acceptance Scenarios**:

1. **Given** a `super_admin` in the control plane, **When** they view the primary navigation, **Then** they can identify platform sections for tenant management, platform oversight, and future expansion areas.
2. **Given** the platform has no tenant selected, **When** the `super_admin` uses the shell, **Then** the experience remains usable and clearly platform-scoped.

---

### User Story 3 - See Platform State Without CRM Framing (Priority: P3)

As a platform super admin, I want the control plane to summarize platform state using management-system language so that the product direction is clear and the shell does not carry forward outdated CRM positioning.

**Why this priority**: The pivot is not just visual; it affects how the platform explains itself. The super-admin shell should reinforce the new management-system direction from the first screen.

**Independent Test**: Can be fully tested by reviewing the shell copy, summary areas, and empty states to confirm they describe Crown as a platform for tenant management systems rather than a CRM.

**Acceptance Scenarios**:

1. **Given** a `super_admin` enters the control plane, **When** they review headings, labels, and summary content, **Then** the shell uses management-system-oriented language instead of CRM-specific terms.
2. **Given** the platform has limited or no live tenant data, **When** the shell renders summaries or empty states, **Then** it still communicates the platform purpose clearly to a super admin.

### Edge Cases

- A valid `super_admin` has access to the platform shell but no tenants have been provisioned yet.
- A user session is authenticated but does not contain the required global `super_admin` role.
- Platform summary areas have no data yet and must show meaningful empty states instead of broken or misleading CRM-style placeholders.
- A `super_admin` enters the shell from a direct link to a platform area and must still see consistent platform navigation and orientation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a dedicated super-admin control-plane shell for the main Crown app.
- **FR-002**: The super-admin shell MUST be accessible only to authenticated users with the `super_admin` role.
- **FR-003**: The super-admin shell MUST clearly identify itself as a platform-level experience distinct from tenant-scoped experiences.
- **FR-004**: The super-admin shell MUST provide primary navigation for platform-level management areas.
- **FR-005**: The super-admin shell MUST allow a super admin to reach tenant-management entry points without first entering a tenant app.
- **FR-006**: The super-admin shell MUST use management-system-oriented language and MUST NOT frame the platform as a CRM.
- **FR-007**: The super-admin shell MUST present an initial platform overview state appropriate for a global operator.
- **FR-008**: The super-admin shell MUST provide meaningful empty or no-data states for a newly set up platform.
- **FR-009**: The system MUST prevent non-super-admin roles from using the super-admin shell.
- **FR-010**: The shell MUST preserve consistent platform navigation and orientation across all platform sections included in scope.
- **FR-011**: The shell MUST support future platform-management expansion without requiring a rename or reframing of the top-level experience.
- **FR-012**: The feature definition MUST preserve `super_admin` as the main-app operator role even after the product pivot from CRM to management systems.

### Key Entities *(include if feature involves data)*

- **Super-Admin Shell**: The top-level platform experience used by a `super_admin` to access Crown administration functions.
- **Platform Navigation Item**: A primary control-plane destination representing a platform management area.
- **Platform Overview State**: The summary and orientation content shown when a super admin lands in the control plane.
- **Tenant Management Entry Point**: A platform-level access point that leads to tenant administration or tenant-specific follow-up actions.

### Assumptions

- `super_admin` remains the global operator role for the Crown platform and is not replaced by tenant-specific roles.
- This feature defines and delivers the shell and platform-facing navigation/orientation experience, not every downstream tenant-management workflow.
- Existing auth and RBAC work provides the role boundary needed to distinguish `super_admin` from tenant roles.
- The product-facing platform name remains `Crown`, while tenant-facing experiences continue to present themselves as powered by Crown.

### Dependencies

- `CROWN-4` or equivalent auth/RBAC behavior is available to identify and enforce the `super_admin` role.
- `CROWN-5` and `CROWN-6` provide the platform/tenant concepts that the shell will point to, summarize, or frame.
- Product and Jira issue language should align with the management-system pivot before implementation begins if the current issue still describes CRM behavior.

### Jira Alignment Note

- If `CROWN-7` still references CRM framing, the Jira wording should be updated to describe a Crown super-admin control plane for tenant management systems while preserving `super_admin` as the main-app operator role.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of authenticated `super_admin` users can reach a distinct platform shell without entering a tenant-scoped experience first.
- **SC-002**: 100% of tested non-super-admin users are denied access to the super-admin shell or redirected to the correct experience.
- **SC-003**: 100% of top-level shell labels and summary copy reviewed for this feature use management-system-oriented language rather than CRM terminology.
- **SC-004**: In acceptance testing, a `super_admin` can identify and navigate to all in-scope platform sections within 30 seconds of landing in the shell.
- **SC-005**: At least 90% of feature reviewers confirm that the shell clearly communicates Crown as a platform control plane for tenant management systems.
