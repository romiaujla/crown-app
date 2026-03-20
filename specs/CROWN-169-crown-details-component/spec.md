# Feature Specification: CrownDetailsComponent Generic Details Primitive

**Feature Branch**: `feat/CROWN-169-crown-details-component`
**Created**: 2026-03-19
**Status**: Draft
**Input**: Jira issue `CROWN-169` - "Create CrownDetailsComponent generic details component"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Render Config-Driven Details Fields In A Shared Layout (Priority: P1)

As a frontend developer, I want a reusable `CrownDetailsComponent` that renders ordered label/value fields in a shared layout so that detail pages stop duplicating ad-hoc metadata markup.

**Why this priority**: This is the core Jira deliverable and the prerequisite for every other behavior in scope.

**Independent Test**: Render the component with a populated field list and verify the title, subheading, field order, and responsive grid structure remain consistent across desktop and mobile widths.

**Acceptance Scenarios**:

1. **Given** a consumer provides a title and three fields, **When** the component renders, **Then** the header shows the title and the fields render in the exact array order provided.
2. **Given** a field provides both `label` and `value`, **When** the component renders, **Then** the label uses muted supporting text styling and the value uses primary body styling.
3. **Given** the consumer omits `subheading`, **When** the component renders, **Then** only the required title appears in the header.
4. **Given** the consumer provides `desktopCol`, `tabletCol`, and `mobileCol`, **When** the viewport changes, **Then** the grid respects those counts instead of hardcoded values.
5. **Given** the final row is incomplete, **When** the component renders, **Then** remaining fields stay left-aligned rather than stretching awkwardly.
6. **Given** a field value is `undefined`, `null`, or an empty string, **When** the component renders, **Then** that field is omitted instead of showing an empty label/value shell.

---

### User Story 2 - Present Header Actions With Safe Primary/Overflow Behavior (Priority: P1)

As a user on a detail page, I want actions to appear in a consistent header area so that the most important action is obvious and secondary actions do not crowd the layout.

**Why this priority**: The Jira issue explicitly requires single-primary behavior and overflow handling as part of the reusable primitive.

**Independent Test**: Render the component with one action, then with multiple actions including a destructive action, and verify the visible primary action and overflow menu behavior.

**Acceptance Scenarios**:

1. **Given** the consumer provides one non-destructive action, **When** the component renders, **Then** that action is shown as the only visible primary button and no overflow trigger is rendered.
2. **Given** the consumer provides multiple actions, **When** the component renders, **Then** only the first eligible non-destructive action is promoted to primary and the remaining actions appear in the overflow menu.
3. **Given** the first configured action is destructive, **When** the component renders, **Then** it is not promoted to primary and remains in the overflow menu.
4. **Given** secondary actions exist, **When** the user activates the kebab trigger, **Then** the overflow menu opens and lists only non-primary actions in configuration order.
5. **Given** the overflow menu is open, **When** the user clicks outside it or selects an action, **Then** the menu closes.
6. **Given** no secondary actions exist, **When** the component renders, **Then** the overflow trigger is not present.

---

### User Story 3 - Support Dense And Empty States Without Creating Alternate Layout Systems (Priority: P2)

As a UX maintainer, I want the same component to handle compact presentations and empty data so that detail pages stay visually consistent without bespoke one-off states.

**Why this priority**: Dense mode and empty-state handling are explicit Jira acceptance criteria and keep future consumers from branching into new patterns.

**Independent Test**: Render the component once in default mode, once in dense mode, and once with no displayable fields, then verify structure, copy, and spacing rules.

**Acceptance Scenarios**:

1. **Given** `density="dense"` is enabled, **When** the component renders, **Then** fields use reduced spacing and may display inline `label: value` formatting.
2. **Given** `density="default"` or no density override is provided, **When** the component renders, **Then** fields use the standard stacked label-over-value layout.
3. **Given** no fields have displayable values, **When** the component renders, **Then** the title remains visible, the component shows `No data available`, and no empty fields render.
4. **Given** header visibility is disabled, **When** the component renders, **Then** the header chrome is hidden without changing the field layout pattern below it.
5. **Given** actions visibility is disabled, **When** the component renders, **Then** the action area is suppressed even if action configs are provided.
6. **Given** any component instance renders, **When** it is reviewed, **Then** it uses one coherent layout mode for that instance rather than mixing dense and default field presentations together.

### Edge Cases

- All configured actions are destructive; the component should render no primary action and place all actions in the overflow menu.
- A formatter returns `0`, `false`, or another falsy display value; the component should render that output rather than treat it as missing.
- Column counts larger than the field count should not create visual artifacts or centered orphan items.
- Long values may wrap naturally within a cell, but the container may also overflow horizontally when the consumer config or content demands it.
- Dense mode should remain readable on mobile widths without collapsing labels into ambiguous text runs.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: `apps/web` MUST provide a reusable `CrownDetailsComponent` with a typed props interface.
- **FR-002**: The component MUST require a `title` prop and MAY accept an optional `subheading`.
- **FR-003**: The component MUST render detail fields from configuration data rather than hardcoded labels or values.
- **FR-004**: Each field config MUST support a `label` and raw input `value`.
- **FR-005**: The component MUST render fields in the order supplied by the consumer.
- **FR-006**: The default grid column counts MUST be `desktopCol = 3`, `tabletCol = 3`, and `mobileCol = 3`.
- **FR-007**: The component MUST allow consumers to override `desktopCol`, `tabletCol`, and `mobileCol` independently.
- **FR-008**: The component MUST keep incomplete final rows left-aligned.
- **FR-009**: The component MUST omit fields whose displayed value would otherwise be empty (`undefined`, `null`, or empty string) unless an explicit formatter returns a displayable value.
- **FR-010**: The component MUST support an optional formatter per field and MUST render formatter output exactly as returned.
- **FR-011**: The component MUST support a header area with left-aligned title content and right-aligned actions.
- **FR-012**: When exactly one eligible non-destructive action exists, the component MUST show it as the only visible primary action.
- **FR-013**: When multiple actions exist, the component MUST show at most one visible primary action and place the remaining actions in an overflow menu.
- **FR-014**: Destructive actions MUST NOT be promoted to primary by default.
- **FR-015**: The overflow trigger MUST use an icon-button affordance and MUST close on outside click or action selection.
- **FR-016**: The component MUST support configuration for header visibility, actions visibility, density mode, optional subheading, and per-breakpoint column counts.
- **FR-017**: The component MUST support a dense mode with reduced spacing and inline `label: value` presentation.
- **FR-018**: When no displayable fields remain, the component MUST render the title plus a `No data available` message and MUST NOT render empty field shells.
- **FR-019**: The implementation MUST include at least one in-repository consumer demonstrating the shared component on the platform tenant-details entry route.
- **FR-020**: The implementation MUST remain scoped to `apps/web` and supporting spec artifacts only.

### Non-Functional Requirements

- **NFR-001**: The component MUST follow `docs/process/ui-guidlines.md` for hierarchy, spacing, typography, and responsive behavior.
- **NFR-002**: Interactive controls in the header and overflow menu MUST remain keyboard accessible with visible focus states.
- **NFR-003**: The field/action API SHOULD stay presentation-focused and avoid embedding route, fetch, or domain-specific business logic.
- **NFR-004**: The shared component SHOULD reuse existing Crown UI primitives (`Button`, `Card`, `Popover`) where practical instead of introducing a parallel interaction stack.

### Key Entities

- **Details Field**: A config entry containing a stable key, label, raw value, and optional formatter that resolves the display value.
- **Details Action**: A config entry containing label, click handler, and presentation intent used to determine primary vs. overflow placement.
- **Details Density**: The per-instance layout mode, either standard stacked detail rows or compact inline label/value rows.
- **Breakpoint Column Config**: The `desktopCol`, `tabletCol`, and `mobileCol` values that drive grid column behavior.

### Assumptions

- This story delivers the shared UI primitive plus a minimal in-app adoption on the existing tenant-details entry route, not a full tenant-details data-integration project.
- The first consumer may use route-derived placeholder values where backend-backed tenant details are still out of scope.
- The component will live in `apps/web/components/ui` so both platform and future tenant surfaces can adopt it.
- A lightweight overflow interaction built from existing Radix-backed primitives is sufficient; a new dropdown abstraction is out of scope for this story.

### Dependencies

- Existing `apps/web` shared UI primitives: `Button`, `Card`, and `Popover`.
- Existing platform tenant-details route at `apps/web/app/platform/tenants/[slug]/page.tsx`.
- Existing Playwright web validation surface in `apps/web/tests`.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A reusable `CrownDetailsComponent` exists in `apps/web` with typed field and action configuration props.
- **SC-002**: The component renders populated, dense, and empty states while preserving the Jira-required primary/overflow action rules.
- **SC-003**: The platform tenant-details entry route uses the shared component instead of a one-off placeholder card layout.
- **SC-004**: `pnpm --filter @crown/web typecheck` passes with zero errors.
- **SC-005**: Focused Playwright coverage for the tenant-details entry route passes and confirms the shared component behavior.
