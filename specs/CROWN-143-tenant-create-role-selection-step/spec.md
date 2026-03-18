# Feature Specification: Tenant Create Role-Selection Step

**Feature Branch**: `feat/CROWN-143-tenant-create-role-selection-step`
**Created**: 2026-03-17
**Status**: Draft
**Input**: Jira issue `CROWN-143` — "UI | Tenant create role-selection step"

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Display Role Options For The Selected Management-System Type (Priority: P1)

As a super admin, I want the role-selection step to display the default role list for the management-system type I chose in step 1 so that I can see which roles apply to the new tenant.

**Independent Test**: Navigate to step 2 after selecting a management-system type in step 1 and verify the role list matches the reference-data role options for that type.

**Acceptance Scenarios**:

1. **Given** the user selected `Transportation` in step 1, **When** they advance to step 2, **Then** the role list shows `Tenant Admin`, `Dispatcher`, and `Driver`.
2. **Given** the user selected `Dealership` in step 1, **When** they advance to step 2, **Then** the role list shows only `Tenant Admin`.
3. **Given** reference data has not loaded or no management-system type was selected, **When** the user navigates to step 2, **Then** the step shows an empty-state message.

### User Story 2 — Enforce Required Admin Role (Priority: P1)

As a super admin, I want the `admin` role to be automatically selected and immovable so that every tenant always starts with an admin.

**Independent Test**: Verify the `Tenant Admin` role card is visually checked and its checkbox is disabled or locked.

**Acceptance Scenarios**:

1. **Given** the role list is rendered, **When** the user examines the `Tenant Admin` entry, **Then** it is selected and the selection control is disabled.
2. **Given** the user attempts to deselect the required role, **When** they interact with the control, **Then** nothing changes and the role remains selected.

### User Story 3 — Toggle Optional Roles (Priority: P1)

As a super admin, I want to select or deselect the optional default roles so that the tenant operating model reflects my needs.

**Independent Test**: Toggle an optional role on and off and verify the selection state persists across back/next navigation.

**Acceptance Scenarios**:

1. **Given** `Dispatcher` is listed as an optional default role, **When** the user deselects it, **Then** the role card switches to an unselected visual state.
2. **Given** the user deselects `Dispatcher` and navigates back to step 1 then forward again, **When** step 2 renders, **Then** `Dispatcher` remains deselected.
3. **Given** the user re-selects `Dispatcher`, **When** they examine the role list, **Then** the role card returns to the selected visual state.

### User Story 4 — Show Inline Rationale Per Role (Priority: P2)

As a super admin, I want each role to include a short description explaining its purpose so that I make informed selections.

**Independent Test**: Verify each role card shows a rationale line of text.

**Acceptance Scenarios**:

1. **Given** a role has a non-null `description` from reference data, **When** the step renders, **Then** the description is displayed inline below the role name.
2. **Given** a role has a null `description`, **When** the step renders, **Then** a static fallback rationale is displayed based on the role code.

### Edge Cases

- The user navigates directly to step 2 without selecting a management-system type — show empty state.
- The management-system type has only one role (the required admin) — the list still renders the single locked card.
- The user changes management-system type in step 1 after making role selections — the shell's existing downstream-reset flow clears the role-selection state.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The role-selection step MUST render the role options for the management-system type selected in step 1, sourced from the already-loaded reference data.
- **FR-002**: The required admin role (`isRequired: true`) MUST be automatically selected and its selection control MUST be disabled.
- **FR-003**: Optional roles (`isRequired: false`) MUST be toggleable between selected and deselected states.
- **FR-004**: Default roles (`isDefault: true`) MUST start in the selected state when the step first renders for a given management-system type.
- **FR-005**: Each role card MUST display the role's `displayName` and inline rationale text.
- **FR-006**: When no management-system type is selected or reference data is unavailable, the step MUST show an empty-state message directing the user back to step 1.
- **FR-007**: The selected role codes MUST be stored in the tenant-create shell state so they survive back/next navigation.
- **FR-008**: When the management-system type changes in step 1 (triggering the existing downstream-reset confirmation), the role-selection state MUST be cleared and re-initialized from the new type's defaults.
- **FR-009**: The step MUST NOT implement user assignment, tenant provisioning, or final submission.
- **FR-010**: The step MUST support keyboard navigation and accessible checkbox semantics.

### Key Entities

- **Role Option Card**: A selectable list item representing one `TenantCreateRoleOption`, showing display name, rationale, and a checkbox control.
- **Selected Role Codes**: The set of `RoleCode` values currently selected by the user, persisted in the shell's state.

### Non-Functional Requirements

- **NFR-001**: The step component MUST be presentational, receiving data and callbacks via props following the existing step-1 pattern.
- **NFR-002**: The step MUST follow the project's UI guidelines (shadcn primitives, consistent spacing, accessible states).

### Assumptions

- The reference data is already fetched on shell mount (CROWN-141). No additional API call is required for this step.
- The static fallback rationale map for null-description roles lives in the step component.
- `tenant_admin` is the only role code with `isRequired: true` in the current baseline.
- The `placeholderLabel` field in the step definition becomes unused once the real component ships.

### Dependencies

- **CROWN-140**: Control-plane persistence model for management-system types and role catalog.
- **CROWN-141**: API tenant-create reference-data contract (provides `roleOptions` per type).
- **CROWN-142**: Tenant-create high-level info step (step 1 form, management-system type selection, reference-data loading).
- **CROWN-161**: Reusable stepper component.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Selecting `Transportation` in step 1 and advancing to step 2 renders exactly the three baseline role options (`Tenant Admin`, `Dispatcher`, `Driver`).
- **SC-002**: The `Tenant Admin` role is selected and locked for 100% of management-system types.
- **SC-003**: Optional roles can be toggled and their state persists across back/next navigation.
- **SC-004**: Each role card displays a rationale line.
- **SC-005**: Playwright tests cover role-list rendering, required-role lock, optional-role toggle, and empty-state behavior.
- **SC-006**: `pnpm --filter @crown/web typecheck` passes with no errors.
