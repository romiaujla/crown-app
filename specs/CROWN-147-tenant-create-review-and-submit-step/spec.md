# Feature Specification: Tenant Create Review And Submit Step

**Feature Branch**: `feat/CROWN-147-tenant-create-review-and-submit-step`  
**Created**: 2026-03-19  
**Status**: Draft  
**Input**: Jira issue `CROWN-147` - "UI | Tenant create review and submit step"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Review The Full Tenant Setup Before Submission (Priority: P1)

As a super admin, I want the final wizard step to show a read-only summary of the tenant info, selected roles, and assigned users so I can verify the onboarding setup before creating the tenant.

**Why this priority**: The core outcome of `CROWN-147` is the review step itself. Without an accurate summary, the wizard still ends in a placeholder and the operator cannot safely confirm the setup.

**Independent Test**: Complete steps 1-3, open step 4, and verify the review page renders the latest tenant info, selected roles, tenant-admin assignments, and role-based assignment sections in a read-only summary layout.

**Acceptance Scenarios**:

1. **Given** the super admin has entered tenant info, selected roles, and drafted initial users, **When** step 4 loads, **Then** the page shows a read-only summary of the current wizard state instead of placeholder content.
2. **Given** the super admin navigates back and changes data in steps 1-3, **When** they return to step 4, **Then** the summary reflects the latest saved draft state with no stale values.
3. **Given** selected non-admin roles have no assigned users, **When** step 4 renders, **Then** each selected role still appears with a clear empty-state message and a non-blocking warning that some roles do not have assigned users.

---

### User Story 2 - Submit A Valid Tenant Create Request From Step 4 (Priority: P1)

As a super admin, I want the final review step to submit the existing onboarding payload to the platform tenant provisioning API so I can create the tenant from the guided wizard.

**Why this priority**: The Jira story requires submit behavior, loading state, success state, and error state. The flow is still incomplete until the final step can perform the real create action.

**Independent Test**: Complete a valid tenant-create draft, submit from step 4, and verify the web app sends the existing onboarding contract payload to `POST /api/v1/platform/tenant`, disables actions while the request is in flight, and routes to the created tenant detail page on success.

**Acceptance Scenarios**:

1. **Given** the review step is valid, **When** the super admin clicks `Create tenant`, **Then** the web app submits the existing onboarding request contract with tenant info, selected role codes, and initial users.
2. **Given** submission is in progress, **When** the request is pending, **Then** the submit and navigation actions are disabled and the UI shows a loading state.
3. **Given** the API returns success, **When** submission completes, **Then** the app routes to `/platform/tenants/[slug]` for the newly created tenant and surfaces a success confirmation.

---

### User Story 3 - Keep Review-Step Validation And Failure Handling Clear (Priority: P2)

As a super admin, I want the review step to repeat critical validation outcomes and handle API failures clearly so I can understand whether I need to go back and fix draft data or simply retry submission.

**Why this priority**: The wizard already validates earlier steps, but the final review step needs clear blocking vs non-blocking states and retry-safe failure handling to prevent confusing dead ends.

**Independent Test**: Attempt to submit with no valid tenant admin or with a mocked API failure, and verify the review step blocks invalid submission, shows the right error treatment, and allows retry after a server-side failure.

**Acceptance Scenarios**:

1. **Given** the wizard draft no longer satisfies the onboarding contract, **When** step 4 renders or submission is attempted, **Then** the page blocks submission and explains the blocking issue.
2. **Given** at least one tenant admin is assigned but optional selected roles are unstaffed, **When** step 4 renders, **Then** the page shows a non-blocking warning and still allows submission.
3. **Given** the provisioning request fails, **When** the API responds with an error, **Then** the page stays on step 4, shows a clear error message, and allows the super admin to retry or navigate back.

### Edge Cases

- The super admin reaches step 4 after deselecting optional roles in step 2; the summary must render only currently selected roles and must not show removed-role assignments.
- The super admin returns from step 4 to step 3, edits assignments, and comes back; the warnings and read-only tables must immediately reflect the revised assignments.
- A selected optional role has no assigned users; the role section must show an explicit empty state instead of collapsing or disappearing.
- The submit request fails with a conflict such as a now-taken slug or duplicate user identity; the error message must be visible on step 4 without losing the draft state.
- The super admin tries to cancel while a submission is in progress; the UI must not allow accidental navigation away during the in-flight request.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Step 4 of the existing tenant-create shell MUST replace the placeholder content with a read-only review-and-submit experience.
- **FR-002**: The review step MUST summarize the current tenant info draft, including tenant name, tenant slug, and management-system type.
- **FR-003**: The review step MUST summarize all selected roles and visually distinguish required admin coverage from optional unstaffed roles.
- **FR-004**: The review step MUST render a dedicated tenant-admin summary section and role-based user-assignment sections derived from the current selected role codes and assignment drafts.
- **FR-005**: When a selected role has no assigned users, the review step MUST display a clear empty-state message for that role instead of hiding the section.
- **FR-006**: The review step MUST repeat the blocking admin-validation status and the non-blocking optional-role warning state using the latest draft data.
- **FR-007**: The review step MUST construct the submission payload from the existing onboarding contract in `@crown/types` and submit it to `POST /api/v1/platform/tenant`.
- **FR-008**: The review step MUST block submission when the current draft fails the onboarding request contract or no valid tenant-admin assignment exists.
- **FR-009**: While submission is in progress, the step MUST disable submit, back, cancel, and direct step navigation interactions.
- **FR-010**: On successful provisioning, the flow MUST navigate to the tenant details route for the returned slug and surface a success confirmation.
- **FR-011**: On failed provisioning, the flow MUST keep the user on step 4, preserve the draft state, and show a retry-friendly error message.
- **FR-012**: The implementation MUST stay limited to the step-4 review and submit behavior, frontend API wiring, and focused automated validation; it MUST NOT widen into draft persistence, edit-in-place review controls, or post-create tenant editing workflows.

### Key Entities

- **Tenant Review Summary**: The read-only projection of the existing wizard draft shown on step 4 before submission.
- **Provisioning Submission State**: The client-side state that tracks idle, submitting, success handoff, and error treatment for the create request.
- **Onboarding Submission Payload**: The existing `TenantCreateOnboardingSubmissionRequest` contract assembled from the shell’s tenant info, selected role codes, and initial users.

### Assumptions

- The existing onboarding contract in `@crown/types` remains the source of truth for request and response validation and uses `displayName`, `email`, `username`, and one `roleCode` per initial user.
- The created-tenant success destination is the existing tenant details page at `/platform/tenants/[slug]`.
- Earlier steps continue to own draft editing; the review step is read-only and sends users backward for corrections.
- Backend provisioning behavior already exists behind `POST /api/v1/platform/tenant`, so this story only needs the web flow to call it and handle the response.

### Dependencies

- `CROWN-142` for step-1 tenant info state and management-system label selection.
- `CROWN-143` for selected role codes and role metadata shown in the review summary.
- `CROWN-145` for the canonical onboarding request/response contract shared through `@crown/types`.
- `CROWN-146` for backend provisioning support that consumes selected roles and initial users.
- `CROWN-148` for grouped assignment drafts, validation state, and role-based initial-user rows used by the review step.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: In automated browser coverage, 100% of tested step-4 visits render a read-only review summary instead of placeholder UI.
- **SC-002**: In automated browser coverage, 100% of valid step-4 submissions send the existing onboarding payload and route to the created tenant detail page on success.
- **SC-003**: In automated browser coverage, 100% of invalid review states with no valid tenant-admin assignment remain blocked from submission with a visible blocking message.
- **SC-004**: In automated browser coverage, optional selected roles with no assigned users remain visible as non-blocking empty states and warnings.
- **SC-005**: In automated browser coverage, API failures keep the user on step 4 with preserved draft state and a visible retry-friendly error message.
