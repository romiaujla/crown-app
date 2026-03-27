# Feature Specification: Tenant Details Collapsible Users Section

**Feature Branch**: `feat/CROWN-174-tenant-details-collapsible-users-section`
**Created**: 2026-03-26
**Status**: Draft
**Input**: Jira issue `CROWN-174` - "UI | Tenant details collapsible users section"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Replace The Placeholder Administration Card With Reusable Collapsible Sections (Priority: P1)

As a super admin, I want the Tenant Details page to organize administration content into collapsible sections so that the route can grow without stacking disconnected cards.

**Why this priority**: This is the core Jira deliverable and the prerequisite for the Users section and any follow-on tenant administration surfaces.

**Independent Test**: Open the tenant-details route and verify the placeholder card is replaced by one shared section-group container with independently toggleable sections.

**Acceptance Scenarios**:

1. **Given** the Tenant Details page renders successfully, **When** the administration area is shown, **Then** it uses one section-group container with soft dividers instead of separate cards per section.
2. **Given** a consumer renders a collapsible section, **When** the header is displayed, **Then** it shows the configured `title`, optional `count`, and toggle affordance within one fully clickable header row.
3. **Given** a section header receives keyboard focus, **When** the user activates it with Enter or Space, **Then** the section toggles open or closed.
4. **Given** a section is toggled, **When** its state changes, **Then** the header exposes the correct `aria-expanded` state and references the content region with `aria-controls`.
5. **Given** multiple sections exist in the group, **When** one section is opened, **Then** other open sections remain open and the pattern does not collapse siblings like an accordion.

---

### User Story 2 - Reveal A Users Table Inside The First Collapsible Section (Priority: P1)

As a super admin, I want the first tenant-details section to expose a users table so that I can inspect tenant membership information without leaving the details route.

**Why this priority**: The Jira issue explicitly requires `Users` as the first implemented section and defines the required table columns.

**Independent Test**: Expand the `Users` section on the tenant-details route and verify the table structure, columns, and row actions render using the established directory-table visual pattern.

**Acceptance Scenarios**:

1. **Given** the Tenant Details page loads, **When** the administration sections render, **Then** the first section is titled `Users`.
2. **Given** the page first loads, **When** the `Users` section is visible, **Then** it is collapsed by default.
3. **Given** the user expands `Users`, **When** the section content renders, **Then** it shows a users table rather than placeholder paragraph content.
4. **Given** the users table renders, **When** the header row is displayed, **Then** it includes columns for Name, Email, Role, Status, Last Active, and Actions.
5. **Given** user rows are present, **When** the table renders, **Then** the table styling and spacing follow the existing tenant directory table pattern rather than introducing a disconnected layout system.

---

### User Story 3 - Support Loading And Empty States Without Expanding Scope Into New APIs (Priority: P2)

As a UX maintainer, I want the Users section to support loading and empty states so that the new pattern is ready for live tenant-member data even before a dedicated platform-side tenant-members endpoint exists.

**Why this priority**: Jira requires loading and empty-state support, but the current repository surface does not expose a platform-tenant-members client for this page.

**Independent Test**: Verify the Users section can render success, loading, and empty states using a scoped view model without changing backend routes.

**Acceptance Scenarios**:

1. **Given** the users view model is loading, **When** the section expands, **Then** the content renders a loading state aligned with the existing Tenant Details visual language.
2. **Given** no users are available for the current tenant view model, **When** the section expands, **Then** the content renders an empty state with a clear primary action labeled `Add first user`.
3. **Given** the implementation is reviewed, **When** the data source is inspected, **Then** the story remains scoped to `apps/web` and Spec Kit artifacts rather than introducing new backend routes or contract changes.
4. **Given** the section opens or closes, **When** the animation runs, **Then** height and opacity transition together in roughly the 150 to 250 ms range.

### Edge Cases

- A section may omit `count`; the header should still align correctly without empty badge chrome.
- The Users table may have zero rows for a tenant that is inactive, deprovisioned, or not yet populated; the empty state must still be actionable and readable.
- A tenant in provisioning state may not have user records ready yet; the section should be able to render a loading state without breaking the page shell.
- Long display names and email addresses should wrap or truncate without breaking the table layout.
- Future sections such as Roles and Permissions, API Keys, Billing, and Audit Logs must fit into the same section group without changing the toggle behavior contract.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: `apps/web` MUST replace the existing `Administration sections` placeholder card on the Tenant Details page with one shared section-group container.
- **FR-002**: `apps/web` MUST provide a reusable collapsible section component that accepts `title`, optional `count`, optional `defaultOpen`, and arbitrary children.
- **FR-003**: The collapsible section header MUST be fully clickable and keyboard accessible.
- **FR-004**: The collapsible section header MUST expose `aria-expanded` and `aria-controls` that track the controlled content region.
- **FR-005**: The collapsible pattern MUST allow multiple sections to remain open at the same time.
- **FR-006**: The first implemented tenant-details section MUST be `Users`.
- **FR-007**: The `Users` section MUST default to collapsed.
- **FR-008**: Expanding the `Users` section MUST reveal a table-based presentation.
- **FR-009**: The `Users` table MUST include columns for Name, Email, Role, Status, Last Active, and Actions.
- **FR-010**: The `Users` table MUST reuse the established tenant directory table styling and shared table primitives where practical.
- **FR-011**: The `Users` section MUST support success, loading, and empty states.
- **FR-012**: The empty state MUST include a clear action labeled `Add first user`.
- **FR-013**: The administration area MUST use soft dividers between sections and MUST NOT render one standalone card per section.
- **FR-014**: The administration structure MUST be extensible for future sections including Roles and Permissions, API Keys, Billing, and Audit Logs.
- **FR-015**: The implementation MUST remain scoped to `apps/web` and supporting Spec Kit artifacts only.

### Non-Functional Requirements

- **NFR-001**: Open and close transitions MUST animate height and opacity in roughly the 150 to 250 ms range.
- **NFR-002**: The implementation MUST follow `docs/process/ui-guidlines.md` for hierarchy, spacing, typography, and responsive behavior.
- **NFR-003**: The implementation MUST preserve the existing Tenant Details page framing and action hierarchy.
- **NFR-004**: The users table MUST remain readable on mobile and desktop widths using the shared table container behavior.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: The Tenant Details route no longer renders the static `Administration sections` placeholder card.
- **SC-002**: The `Users` section is collapsed on initial render and expands via mouse and keyboard interaction.
- **SC-003**: The expanded `Users` section renders the required six-column table structure.
- **SC-004**: Focused web validation confirms the updated tenant-details route behavior without requiring backend or OpenAPI changes.
