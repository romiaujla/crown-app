# Future Epics and Milestones (Post `CROWN-1`)

This document drafts Jira-ready epic definitions using the mandatory Lean Jira template from the engineering constitution.

Jira IDs are intentionally left as `TBD` until you create each issue in Jira.

## Epic `TBD`: Detailed Tenant DB Schema Expansion and Local Seed Baseline

### Problem
Current tenant-domain schema depth is not yet sufficient for realistic role-path testing, and local environments need deterministic seeded data aligned to expanded tables.

### Goal
Define and implement the next-level tenant schema and deliver repeatable local seed data so downstream auth, RBAC, and workflow work has stable foundations.

### User Story
As a developer, I want a detailed schema scaffold plus one-command seeding so I can build and verify later login and role behavior on realistic local data.

### Acceptance Criteria
- Detailed tenant schema additions are defined and implemented before login work starts.
- Seed process creates:
  - 1 super admin
  - 2 tenant admins (1 per tenant)
  - 6 tenant users (3 per tenant)
- Seed process is idempotent or safely resettable and documented.
- Seeded accounts and related domain rows are usable for local auth and role-path testing.
- Epic includes a mandatory pre-implementation question gate to collect missing account details from you.

### Mandatory Question Gate (Do Not Skip)
Before `/plan` and `/tasks` for this epic, Jira must include a checklist item requiring explicit answers from you for:
- Account identifiers and naming conventions per seeded user
- Email/username patterns and password policy for local-only accounts
- Tenant names, slugs, and default metadata
- Role assignments beyond base counts (if any)
- Any required seeded domain objects linked to these users

If this checklist is incomplete, implementation is blocked.

## Epic `TBD`: Identity and Role-Based Login Experiences

### Problem
The product needs explicit role-based login and post-login routing behavior for `super_admin`, `tenant_admin`, and `tenant_user` personas.

### Goal
Deliver clear and enforceable login journeys that route each role to the correct platform or tenant experience with no role confusion.

### User Story
As a Crown user with one of the supported roles, I want role-aware authentication and entry routing so that I land in the correct workspace and only see allowed functionality.

### Acceptance Criteria
- Login supports `super_admin`, `tenant_admin`, and `tenant_user` personas.
- Post-login routing sends each role to the correct shell and default landing route.
- Unauthorized route access is denied consistently at API and UI boundaries.
- Session and claim validation behavior is documented for each role path.
- Jira explicitly links this epic as dependent on completion of the schema-and-seed epic.

## Epic `TBD`: Super-Admin Capability Expansion

### Problem
The super-admin shell exists as a foundation, but deeper platform-management capabilities across schema, routes, and UI components are still undefined.

### Goal
Expand super-admin abilities to operate tenant lifecycle, platform configuration, and cross-tenant governance from the Crown control plane.

### User Story
As a super admin, I want full platform-level controls so that I can configure and govern tenant systems centrally.

### Acceptance Criteria
- Platform-level schema requirements for super-admin workflows are defined and implemented.
- Super-admin API routes and UI routes/components are delivered for in-scope workflows.
- Access boundaries remain strictly platform-scoped and separated from tenant-only operations.
- Auditability expectations for super-admin actions are defined.

## Epic `TBD`: Tenant Admin Capability Expansion

### Problem
Tenant admins need deeper operational controls in their tenant workspace, but current capabilities are only foundational.

### Goal
Deliver tenant-admin-focused schema, API, UI routes, and components for day-to-day tenant operations and governance.

### User Story
As a tenant admin, I want broad tenant-management controls so that I can configure and operate my tenant environment without platform intervention.

### Acceptance Criteria
- Tenant-admin schema additions for in-scope management workflows are implemented.
- Tenant-admin API and UI routes/components support create, read, update, and delete flows where allowed.
- Tenant admin permissions are clearly documented and enforced via RBAC.
- Tenant admin experience remains isolated to their tenant boundary.

## Epic `TBD`: Tenant User RBAC and TMS Role Controls

### Problem
Tenant-user roles in TMS scenarios require explicit action boundaries (for example, dispatcher vs driver), but these rules are not yet codified end to end.

### Goal
Implement tenant-user RBAC behaviors aligned to TMS role responsibilities and restricted actions.

### User Story
As a tenant user in a specific role, I want permissions that match my operational responsibilities so that I can perform allowed work and cannot execute restricted actions.

### Acceptance Criteria
- RBAC matrix defines capabilities for at least `tenant_admin`, `dispatcher`, and `driver`.
- Dispatcher workflows include job creation and assignment management.
- Driver restrictions include inability to self-unassign from assigned jobs.
- Restricted actions return clear and testable authorization outcomes.

## Epic `TBD`: Tenant TMS Product Depth

### Problem
Core tenant shell and role foundations exist, but deeper TMS modules (dashboards, load management, operations) are not yet sequenced.

### Goal
Expand tenant product depth with prioritized TMS capabilities that are coherent with prior RBAC and domain decisions.

### User Story
As a tenant operations team, I want core TMS modules so that I can manage daily transportation workflows in one tenant workspace.

### Acceptance Criteria
- MVP module list for tenant TMS depth is agreed and prioritized (for example, dashboard, load management, operations queue).
- Each module has scoped stories with clear role-based access rules.
- Data model and API contracts are defined per module before implementation.
- Dependencies on earlier epics are explicitly listed in Jira links.

## Proposed Milestones

- Milestone 1: Schema and seed foundation
  - Detailed tenant DB schema scaffold
  - Local seed data and fixtures
- Milestone 2: Identity and access bootstrap
  - Role-based login experiences
- Milestone 3: Administration layers
  - Super-admin capability expansion
  - Tenant-admin capability expansion
- Milestone 4: Tenant role execution
  - Tenant user RBAC and TMS role controls
- Milestone 5: Tenant product depth
  - Dashboards, load management, and additional TMS modules
