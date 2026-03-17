# Feature Specification: Frontend Reusable Stepper Component (Horizontal + Vertical Support)

**Feature Branch**: `feat/CROWN-161-reusable-stepper-component-horizontal-vertical-support`  
**Created**: 2026-03-17  
**Status**: Draft  
**Input**: Jira issue `CROWN-161` - "Frontend | Reusable Stepper Component (Horizontal + Vertical Support)"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Render Reusable Stepper States Across Horizontal And Vertical Layouts (Priority: P1)

As a frontend developer, I want one reusable Stepper component with orientation and position variants so that multi-step flows can share the same state rendering behavior instead of duplicating one-off stepper markup.

**Why this priority**: This is the core Jira deliverable and unblocks future consumer stories that must adopt a shared Stepper primitive.

**Independent Test**: Render the Stepper in both horizontal and vertical orientations with active/completed/inactive steps and verify the state icon, title, optional description, and connector rendering are correct in each variant.

**Acceptance Scenarios**:

1. **Given** a consumer renders the Stepper with `orientation="horizontal"`, **When** no explicit horizontal position is provided, **Then** the Stepper defaults to horizontal `top` positioning behavior.
2. **Given** a consumer renders the Stepper with `orientation="vertical"`, **When** no explicit vertical position is provided, **Then** the Stepper defaults to vertical `left` positioning behavior.
3. **Given** a Stepper step index is before the current step, **When** the Stepper renders, **Then** the step uses completed styling and a checkmark icon.
4. **Given** a Stepper step index equals the current step, **When** the Stepper renders, **Then** the step is highlighted as active/current.
5. **Given** a Stepper step index is after the current step, **When** the Stepper renders, **Then** the step uses inactive/upcoming styling.
6. **Given** steps include optional descriptions, **When** the Stepper renders, **Then** each step shows title plus optional subtext without requiring hardcoded content.
7. **Given** steps are adjacent, **When** the Stepper renders, **Then** connector lines appear between steps with clear active/completed/inactive distinction.

---

### User Story 2 - Support Accessible Optional Interactivity For Step Selection (Priority: P2)

As a keyboard and assistive-technology user, I want interactive steppers to expose clear focus, current-step semantics, and keyboard operability so that step navigation is accessible when consumers enable clickable behavior.

**Why this priority**: Jira acceptance criteria explicitly require keyboard and ARIA support for interactive mode.

**Independent Test**: Render the Stepper in interactive mode, tab to steps, use keyboard activation, and verify ARIA semantics and focus-visible behavior for current and non-current steps.

**Acceptance Scenarios**:

1. **Given** `clickable` mode is enabled, **When** a user tabs through step controls, **Then** each step is focusable and shows a visible focus style.
2. **Given** `clickable` mode is enabled, **When** a user activates a focused step with keyboard input, **Then** `onStepClick` is called with the selected index.
3. **Given** the Stepper renders, **When** assistive technology reads step state, **Then** the active step exposes current-step semantics and all steps expose clear labels/state.
4. **Given** `clickable` mode is disabled, **When** the Stepper renders, **Then** steps remain non-interactive while preserving semantic progress presentation.

---

### User Story 3 - Replace Bespoke Tenant Create Progress With Shared Stepper (Priority: P3)

As a platform UX maintainer, I want the tenant create shell to use the reusable Stepper so that the flow demonstrates the shared component and avoids a bespoke progress implementation.

**Why this priority**: CROWN-161 is a foundational component story intended to unblock adoption in tenant-create follow-up work.

**Independent Test**: Open `/platform/tenants/new`, verify the progress rail uses the shared Stepper behavior, and confirm existing step navigation and cancel-guard behavior continue to work.

**Acceptance Scenarios**:

1. **Given** the tenant create page renders, **When** progress is shown, **Then** the UI is powered by the new shared Stepper component rather than bespoke list markup.
2. **Given** a user advances or goes back between steps, **When** the shell updates `currentStep`, **Then** the Stepper reflects completed/current/upcoming states correctly.
3. **Given** existing tenant-create placeholder interactions are exercised, **When** navigation and cancel protections run, **Then** behavior remains unchanged by the Stepper refactor.

### Edge Cases

- `currentStep` values lower than `0` or higher than the final index should clamp safely to the supported range.
- Step arrays with one item should render without connector artifacts.
- Optional descriptions should not create spacing regressions when omitted.
- Position variants must not break connector alignment in horizontal `bottom` and vertical `right` modes.
- Interactive mode without `onStepClick` should remain safe and not throw runtime errors.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The web app MUST provide a reusable Stepper component in `apps/web` with a typed props interface.
- **FR-002**: The Stepper component MUST support `horizontal` and `vertical` orientations.
- **FR-003**: Horizontal orientation MUST support `top` (default) and `bottom` position variants.
- **FR-004**: Vertical orientation MUST support `left` (default) and `right` position variants.
- **FR-005**: Step data MUST be passed as a config array; labels and descriptions MUST NOT be hardcoded inside the Stepper implementation.
- **FR-006**: Each rendered step MUST support a state icon, title, and optional description/subtext.
- **FR-007**: Completed steps MUST render completed styling and a checkmark icon.
- **FR-008**: The current step MUST render an active highlight distinct from inactive steps.
- **FR-009**: Inactive steps MUST render with upcoming-state styling distinct from active and completed states.
- **FR-010**: Connector lines MUST render between steps with clear state distinction for active/completed/inactive progression.
- **FR-011**: Interactive mode MUST be optional and controlled by props.
- **FR-012**: When interactive mode is enabled, keyboard activation and `onStepClick(index)` behavior MUST be supported.
- **FR-013**: The Stepper MUST expose ARIA semantics that communicate current-step status and interactive intent.
- **FR-014**: Focus-visible styling MUST be present for keyboard users when interactive mode is enabled.
- **FR-015**: The tenant create shell MUST adopt the shared Stepper for its progress UI in this story as the usage example.
- **FR-016**: Existing tenant-create placeholder behavior (next/back progression and cancel unsaved-changes guard) MUST remain unchanged.
- **FR-017**: The implementation MUST remain scoped to `apps/web` component and consumer updates without backend/API changes.

### Key Entities _(include if feature involves data)_

- **Stepper Step**: A config-driven display object containing per-step title, optional description, and optional accessibility label metadata.
- **Stepper Orientation**: A finite enum-like value defining axis rendering: `horizontal` or `vertical`.
- **Stepper Position Variant**: Orientation-aware positioning choice (`top` or `bottom` for horizontal, `left` or `right` for vertical).
- **Stepper Interaction Mode**: Optional behavior that toggles step click/keyboard activation support and callback emission.

### Assumptions

- Step order is determined by the order of the provided `steps` array.
- The consumer owns workflow state (`currentStep`) and passes it into the Stepper as a controlled input.
- Existing `apps/web` design tokens/classes are sufficient; no new design system package is required.
- Animation support can be implemented with CSS transitions only and does not require new animation libraries.

### Dependencies

- `CROWN-91` epic context for super-admin tenant-management flow work.
- Follow-up adoption story `CROWN-162`, which depends on this shared Stepper foundation.
- Existing tenant create shell in `apps/web/components/platform/tenant-create-shell.tsx` as the first consumer.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: The shared Stepper renders correct active/completed/inactive state visuals and connectors in 100% of tested orientation/position combinations used by this story.
- **SC-002**: Interactive-mode keyboard and ARIA behavior passes focused browser assertions for current-step semantics and keyboard activation.
- **SC-003**: Tenant create flow assertions continue to pass for step progression and cancel-guard behavior after the shared Stepper adoption.
- **SC-004**: Reviewers can identify one reusable, prop-driven Stepper implementation in `apps/web` and no remaining bespoke tenant-create progress list markup.
