# Feature Specification: UI Guidelines For Web-v2 Component Library

**Feature Branch**: `feat/CROWN-177-ui-guidelines-web-v2-component-library`  
**Created**: 2026-03-28  
**Status**: Draft  
**Input**: Jira issue `CROWN-177` - "UI | Update UI guidelines for web-v2 component library"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Find Approved Web-v2 UI Patterns Quickly (Priority: P1)

As a frontend engineer, I want the UI guidelines to catalog the approved reusable web-v2 component patterns so that I can choose the right building blocks without guessing or inventing inconsistent alternatives.

**Why this priority**: The component catalog is the core Jira deliverable. Without it, the guideline update does not actually help engineers converge on a shared component library.

**Independent Test**: Open `docs/process/ui-guidlines.md` and verify it contains a clearly labeled component-library catalog covering the approved reusable patterns, including Rich Table, Toggle, Multi-toggle, Breadcrumb, Skeleton, and Empty State.

**Acceptance Scenarios**:

1. **Given** a contributor opens the UI guidelines for web work, **When** they review the component guidance section, **Then** they can find a catalog of approved reusable components and the intended use for each one.
2. **Given** a contributor needs a table-first management UI pattern, **When** they review the catalog and related guidance, **Then** the document explicitly points them to the Rich Table pattern and its supporting filter, chip, pagination, and toolbar behaviors.
3. **Given** a contributor needs a loading, navigation, or blank-state pattern, **When** they review the document, **Then** the catalog includes Skeleton, Breadcrumb, and Empty State guidance instead of leaving those patterns implicit.

---

### User Story 2 - Follow A Wireframe-First UI Delivery Workflow (Priority: P2)

As a product or implementation agent, I want the UI guidelines to define a wireframe-first workflow that routes UI work through the UI agent before implementation so that design intent, states, and component reuse are clarified before code is written.

**Why this priority**: Jira explicitly requires the workflow addition, and it is the process control that keeps future web-v2 work aligned with the same UI system rather than drifting feature by feature.

**Independent Test**: Review `docs/process/ui-guidlines.md` and verify it documents the required workflow order of UI agent input, wireframe/spec output, and implementation handoff, including what each stage must define.

**Acceptance Scenarios**:

1. **Given** a contributor starts a new UI task, **When** they read the workflow section, **Then** the document states that UI work begins with UI-agent-assisted wireframe/spec definition before implementation.
2. **Given** a wireframe or UI spec is being prepared, **When** the workflow guidance is applied, **Then** the required output includes layout intent, primary action hierarchy, supported states, accessibility expectations, and responsive considerations.
3. **Given** implementation begins after the design stage, **When** engineers use the guideline workflow, **Then** the document makes the handoff expectations explicit enough that the implementation can stay aligned to the approved wireframe/spec.

---

### User Story 3 - Apply Tokens And Advanced Data Patterns Consistently (Priority: P3)

As a frontend engineer maintaining Crown’s management surfaces, I want the UI guidelines to document design-token references and advanced data-view patterns so that tables, toggles, breadcrumbs, and stateful components remain visually and behaviorally consistent across the product.

**Why this priority**: The remaining Jira scope is about consistency and completeness. These additions reduce design drift in the high-frequency surfaces that matter most in a CRM-style interface.

**Independent Test**: Review `docs/process/ui-guidlines.md` and confirm it references the authoritative CSS variables in `apps/web/app/globals.css`, defines the Rich Table pattern in enough detail to guide implementation, and adds guidance for Toggle, Multi-toggle, Breadcrumb, Skeleton, and Empty State states and usage.

**Acceptance Scenarios**:

1. **Given** a contributor needs color or surface guidance, **When** they read the updated document, **Then** it references the shared CSS variable tokens from `apps/web/app/globals.css` instead of relying on hardcoded color guidance alone.
2. **Given** a contributor is implementing a data-heavy listing surface, **When** they consult the Rich Table guidance, **Then** the document defines filters, active chips, pagination, toolbar behavior, and required loading/empty/error states.
3. **Given** a contributor is implementing Toggle, Multi-toggle, Breadcrumb, Skeleton, or Empty State patterns, **When** they consult the guidelines, **Then** the document describes intended usage, hierarchy, and state expectations clearly enough to avoid one-off behavior.

### Edge Cases

- The current document may already define overlapping patterns; the update must extend and reorganize guidance without creating duplicate or contradictory rules.
- The design token guidance must stay anchored to the actual CSS variables that exist in `apps/web/app/globals.css`, not aspirational or nonexistent token names.
- The Rich Table section must work for dense enterprise tables without contradicting the existing general table guidance already documented in the file.
- The workflow guidance must stay process-oriented and implementation-ready without turning `docs/process/ui-guidlines.md` into a repository-wide engineering constitution replacement.
- New component-pattern guidance must cover loading, empty, error, disabled, and accessibility expectations where they materially affect the user’s understanding of state.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: `docs/process/ui-guidlines.md` MUST include a component-library catalog section that lists the approved reusable web-v2 UI components or patterns and their intended use.
- **FR-002**: The component-library catalog MUST explicitly cover Rich Table, Toggle, Multi-toggle, Breadcrumb, Skeleton, and Empty State patterns.
- **FR-003**: The document MUST add a wireframe-first workflow section that defines the required delivery order as UI agent input, wireframe/spec preparation, and implementation handoff.
- **FR-004**: The workflow guidance MUST describe the minimum design outputs needed before implementation, including layout intent, primary action hierarchy, state coverage, accessibility expectations, and responsive behavior.
- **FR-005**: The document MUST reference the authoritative CSS variable token source in `apps/web/app/globals.css` when describing design-token usage for web-v2 UI.
- **FR-006**: The document MUST include a design-token reference section that maps guideline usage back to the shared token categories already defined in `apps/web/app/globals.css`.
- **FR-007**: The document MUST define a Rich Table pattern section covering inline filters, active filter chips, pagination, toolbar or bulk-action behavior, and required loading, empty, and error states.
- **FR-008**: The Rich Table guidance MUST reinforce Crown’s table-first, data-dense management-system UX expectations for list views.
- **FR-009**: The document MUST define intended usage and key behavior guidance for Toggle and Multi-toggle patterns, including when each control type should be used.
- **FR-010**: The document MUST define Breadcrumb guidance for nested navigation and positional orientation in admin flows.
- **FR-011**: The document MUST define Skeleton guidance as the preferred loading placeholder pattern for component and page sections where structure is known.
- **FR-012**: The document MUST define Empty State guidance for both no-data and filtered-no-results conditions, including expected copy and action behavior.
- **FR-013**: All new guidance MUST stay consistent with the existing UI stack of React, shadcn/ui, Tailwind CSS, and lucide-react.
- **FR-014**: All new guidance MUST remain aligned with the engineering constitution and MUST NOT introduce process rules that conflict with the tagged Spec Kit workflow.
- **FR-015**: The implementation scope for this story MUST remain limited to documentation artifacts for the UI guidelines and supporting Spec Kit artifacts for `CROWN-177`.

### Key Entities _(include if feature involves data)_

- **UI Component Library Catalog**: The documentation section that names approved reusable web-v2 patterns and explains when contributors should use each one.
- **Wireframe-First Workflow**: The documented process that requires UI-agent-assisted wireframe/spec definition before implementation begins.
- **Design Token Reference**: The documentation mapping between guideline usage and the shared CSS variable categories defined in `apps/web/app/globals.css`.
- **Rich Table Pattern**: The canonical table-first management UI pattern covering filters, chips, pagination, toolbar actions, and stateful table behavior.
- **State Pattern Guidance**: The documentation for reusable loading, empty, navigation, and selection patterns such as Skeleton, Empty State, Breadcrumb, Toggle, and Multi-toggle.

### Assumptions

- `apps/web/app/globals.css` is the authoritative source for currently available product-level CSS custom properties referenced by the guidelines.
- The new `.github/agents/ui-ux.agent.md` file represents the preferred UI-agent workflow and should inform, but not replace, the durable guidance captured in `docs/process/ui-guidlines.md`.
- This story is documentation-only and does not require code changes to the existing web-v2 component implementations.
- The component library catalog may describe approved patterns that are a mix of existing components and documented target patterns, as long as the guidance is explicit about intended reuse.

### Dependencies

- `docs/process/engineering-constitution.md` for repository policy and documentation precedence.
- `docs/process/ui-guidlines.md` as the sole implementation target for the guideline update.
- `.github/agents/ui-ux.agent.md` for UI-agent workflow and management-system UX expectations that should be reflected in the guidelines.
- `apps/web/app/globals.css` for the current design token source of truth referenced by the guideline update.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Reviewers can locate the approved web-v2 component library catalog in `docs/process/ui-guidlines.md` within one screen of scrolling from the component guidance area.
- **SC-002**: Reviewers can identify explicit guidance for Rich Table, Toggle, Multi-toggle, Breadcrumb, Skeleton, and Empty State without needing to inspect source code or other documents.
- **SC-003**: Reviewers can identify the required UI delivery order of UI agent, wireframe/spec, and implementation directly from `docs/process/ui-guidlines.md` with no ambiguous workflow step.
- **SC-004**: Reviewers can trace the documented token guidance back to `apps/web/app/globals.css` without finding references to nonexistent token categories.
- **SC-005**: Reviewers find no contradictions between the updated UI guidelines, the engineering constitution, and the UI-agent workflow expectations used for web-v2 component design.
