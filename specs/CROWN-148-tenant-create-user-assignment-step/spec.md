# Feature Specification: Tenant Create User-Assignment Step

**Feature Branch**: `feat/CROWN-148-tenant-create-user-assignment-step`  
**Created**: 2026-03-18  
**Status**: Draft  
**Input**: Jira issue `CROWN-148` - "UI | Tenant create user-assignment step"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Assign Required Tenant Admin Users (Priority: P1)

As a super admin, I want the user-assignment step to start with a required tenant-admin section so that every new tenant has at least one bootstrap administrator before the flow can continue.

**Why this priority**: The Jira acceptance criteria explicitly block progression when no tenant admin has been added. Without this flow, the onboarding wizard cannot safely prepare a valid v1 payload.

**Independent Test**: Navigate to step 3 after completing steps 1 and 2, leave the tenant-admin group empty, and verify the step shows the required-state error and prevents advancing. Then add a valid tenant-admin row and confirm the step allows progress.

**Acceptance Scenarios**:

1. **Given** the user selected one or more roles in step 2, **When** they navigate to step 3, **Then** the first assignment group is `Tenant Admins`, it is visually marked as required, and it stays visible without needing to be expanded.
2. **Given** the tenant-admin group contains no completed users, **When** the super admin attempts to continue, **Then** the step blocks progression and shows a clear required-state error.
3. **Given** at least one tenant-admin row is completed with valid input, **When** the super admin continues, **Then** the step no longer shows the required-state error and can advance.

---

### User Story 2 - Assign New Users For Each Selected Role (Priority: P1)

As a super admin, I want step 3 to group user rows by the role selections from step 2 so that I can assign the tenant's initial operating team in one guided screen.

**Why this priority**: The core Jira outcome is one combined assignment experience, grouped by the previously selected roles rather than separate disconnected pages or dialogs.

**Independent Test**: Select optional roles in step 2, navigate to step 3, and verify the page renders one assignment section per selected role with independent row entry and removal behavior.

**Acceptance Scenarios**:

1. **Given** `tenant_admin`, `dispatcher`, and `driver` are selected in step 2, **When** step 3 renders, **Then** it shows one assignment section for `Tenant Admins`, one for `Dispatcher`, and one for `Driver`, in that order.
2. **Given** a selected optional role has no completed users, **When** step 3 renders or validation runs, **Then** that role remains editable, is not blocking, and shows a warning that the role is currently unstaffed.
3. **Given** the super admin adds and removes rows inside an optional role section, **When** the page updates, **Then** each section maintains its own draft rows without affecting other role sections.

---

### User Story 3 - Keep Assignment Rules Aligned With The V1 Onboarding Contract (Priority: P2)

As a maintainer, I want the user-assignment step to enforce the current v1 onboarding rules so that the UI stays consistent with the contract already defined for onboarding submission.

**Why this priority**: The step must not collect data the existing API contract cannot accept, and it must preserve the v1 constraints already agreed in prior stories.

**Independent Test**: Enter duplicate emails, attempt to leave tenant-admin unassigned, and verify that only new-user rows using the current onboarding-contract fields are accepted while invalid combinations stay blocked.

**Acceptance Scenarios**:

1. **Given** the current onboarding contract supports only new-user entries with `firstName`, `lastName`, `email`, and one `roleCode`, **When** step 3 is reviewed, **Then** the UI collects only those required identity fields per row and does not add existing-user lookup or multi-role assignment behavior.
2. **Given** a role group is rendered for `tenant_admin`, **When** the super admin enters users for that section, **Then** those rows remain scoped to `tenant_admin` and are not duplicated into other selected role groups.
3. **Given** duplicate email addresses are entered across assignment rows, **When** validation runs, **Then** the step surfaces inline errors and keeps progression blocked until the duplicates are resolved.

### Edge Cases

- Step 3 is opened before step 2 has any selected roles; the screen must show a recovery-oriented empty state that directs the user back to role selection instead of rendering broken assignment groups.
- The management-system type changes in step 1 after step 3 has draft assignments; the shell's downstream reset flow must clear assignment data together with role-selection state.
- An optional role is removed in step 2 after rows were previously entered for that role; those rows must not survive in hidden state.
- The super admin removes the only completed tenant-admin row while other optional-role rows remain; the step must immediately return to the blocking required-admin state.
- Compact row entry must still satisfy the repository UI guideline that fields have labels and accessible validation; placeholder-only inputs are not acceptable.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The user-assignment step MUST combine tenant-admin assignment and selected-role assignment in one guided step inside the existing tenant-create shell.
- **FR-002**: The step MUST derive its assignment groups from the selected role codes saved in step 2 rather than from the full reference-data catalog.
- **FR-003**: The `tenant_admin` assignment group MUST render first, be visually distinguished as required, and remain part of the step whenever step 3 is available.
- **FR-004**: The step MUST require at least one completed tenant-admin user before the `Next` action can advance to step 4.
- **FR-005**: Selected non-admin roles MUST remain optional and MAY have zero completed users, but the UI MUST surface a visible warning when a selected optional role is unstaffed.
- **FR-006**: Each assignment row MUST represent one new user for one role only and MUST collect only the v1 onboarding identity fields needed by the current contract: `firstName`, `lastName`, and `email`.
- **FR-007**: The step MUST NOT introduce existing-user search, username generation, or multi-role-per-user behavior in this story.
- **FR-008**: Assignment rows MUST be grouped by role and persisted in shell state so their data survives normal back/next navigation within the tenant-create flow.
- **FR-009**: When step-1 or step-2 changes trigger the existing downstream reset behavior, the user-assignment state MUST also be cleared so it cannot drift from the selected roles.
- **FR-010**: The step MUST validate required user fields and duplicate emails inline before allowing progression.
- **FR-011**: The step MUST surface a recovery-oriented empty state when no selected roles are available for assignment.
- **FR-012**: The implementation MUST stay limited to step-3 user assignment UX and draft-state wiring; it MUST NOT implement final review, submission, or provisioning side effects.

### Key Entities

- **Role Assignment Group**: A step-3 section bound to one selected role code and containing the draft user rows for that role.
- **Tenant Create Initial User Draft**: One in-progress new-user row with `firstName`, `lastName`, `email`, and the implicit role represented by its group.
- **User Assignment Step State**: The shell-level client state that tracks grouped user drafts by role and determines whether the step is valid.

### Assumptions

- `CROWN-145` remains the source of truth for the onboarding submission contract, so step 3 aligns to `firstName`, `lastName`, `email`, and one `roleCode` per user instead of the Jira wireframe's username concept.
- `tenant_admin` is the canonical required tenant bootstrap role, while the product label shown to super admins may remain `Admin` or `Tenant Admin` depending on the selected-role metadata.
- Step 4 remains a placeholder review step in this story; successful step-3 completion only means the wizard can advance locally.
- The tenant-create shell continues to own the authoritative draft state for all steps.

### Dependencies

- `CROWN-142` for step-1 tenant info, management-system type selection, and downstream reset behavior.
- `CROWN-143` for step-2 role selection and persisted `selectedRoleCodes`.
- `CROWN-145` for the existing onboarding submission contract and v1 initial-user constraints in `@crown/types`.
- Existing tenant-create shell and stepper surfaces in `apps/web/components/platform/`.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: In browser validation, 100% of tested step-3 visits show the tenant-admin group first and visibly required whenever selected roles are available.
- **SC-002**: In browser validation, 100% of tested attempts to continue without a completed tenant-admin user are blocked with a clear error state.
- **SC-003**: In browser validation, selected optional roles remain editable and non-blocking even when they have zero assigned users, while showing an unstaffed warning.
- **SC-004**: In review and automated validation, the step collects only the current onboarding-contract fields for new users and does not add username, existing-user lookup, or submission logic.
- **SC-005**: In browser validation, step-3 assignment rows survive back/next navigation but are cleared when upstream reset behavior changes the selected management-system type or selected roles.
