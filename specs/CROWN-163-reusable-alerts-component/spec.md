# Feature Specification: Reusable Alerts Component with Configurable State and Positioning

**Feature Branch**: `feat/CROWN-163-reusable-alerts-component`
**Created**: 2026-03-17
**Status**: Draft
**Input**: Jira issue `CROWN-163` — "UI | Reusable alerts component with configurable state and positioning"

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Render Inline Alert with Severity Variants (Priority: P1)

As a frontend developer, I want a reusable inline Alert component with success, info, warning, and error severity variants so that feedback messages across the application render consistently without duplicating ad-hoc markup.

**Why this priority**: This is the core primitive required by every other story and by the existing ad-hoc migration.

**Independent Test**: Render the Alert with each severity variant and verify the correct color scheme, icon, and semantic markup.

**Acceptance Scenarios**:

1. **Given** a consumer renders `<Alert severity="success">`, **When** the Alert mounts, **Then** it displays a green-themed card with a `CircleCheck` icon.
2. **Given** a consumer renders `<Alert severity="info">`, **When** the Alert mounts, **Then** it displays a blue-themed card with an `Info` icon.
3. **Given** a consumer renders `<Alert severity="warning">`, **When** the Alert mounts, **Then** it displays an amber-themed card with an `AlertTriangle` icon.
4. **Given** a consumer renders `<Alert severity="error">`, **When** the Alert mounts, **Then** it displays a red-themed card with a `CircleX` icon.
5. **Given** an Alert of any severity renders, **When** assistive technology reads it, **Then** the element carries `role="alert"` for error/warning and `role="status"` for success/info.
6. **Given** a consumer does not provide an explicit icon, **When** the Alert renders, **Then** the default icon for that severity is displayed.
7. **Given** a consumer passes children containing a title and body text, **When** the Alert renders, **Then** the title and body are composed through `AlertTitle` and `AlertDescription` sub-components.

---

### User Story 2 — Display Positioned Toast Alert with Auto-Dismiss (Priority: P1)

As a user, I want transient feedback notifications to appear at a configurable screen position and disappear automatically so that success confirmations and error messages do not require manual interaction to clear.

**Why this priority**: Positioned auto-dismissing toasts are an explicit acceptance criterion and the primary feature gap in the current codebase.

**Independent Test**: Trigger a toast alert via the provider API, verify it appears at the requested screen position, and assert it auto-dismisses after the configured duration.

**Acceptance Scenarios**:

1. **Given** a toast is dispatched with `position="top-right"`, **When** the toast renders, **Then** it is visually fixed to the top-right viewport area.
2. **Given** a toast is dispatched with `position="center"`, **When** the toast renders, **Then** it is visually fixed to the center of the viewport.
3. **Given** a toast is dispatched with position values `top-left`, `top-center`, `bottom-right`, `bottom-left`, or `bottom-center`, **When** the toast renders, **Then** it appears at the corresponding viewport edge/area.
4. **Given** a toast is dispatched with `duration={5000}`, **When** 5 000 ms elapses, **Then** the toast is removed from the DOM.
5. **Given** a toast is dispatched without an explicit `duration`, **When** it renders, **Then** it uses the default duration of 5 000 ms before auto-dismissing.
6. **Given** a toast is dispatched with `dismissible={true}`, **When** the user clicks the close control, **Then** the toast is removed immediately.
7. **Given** a toast is dispatched with `dismissible={false}`, **When** the toast renders, **Then** no close control is visible and the toast only disappears on auto-dismiss.
8. **Given** multiple toasts are dispatched to the same position, **When** they render, **Then** they stack vertically without overlapping.

---

### User Story 3 — Expose an Imperative Toast API via React Context (Priority: P1)

As a frontend developer, I want an `useAlerts` hook backed by a React context provider so that any component in the tree can dispatch toast notifications without prop-threading.

**Why this priority**: An imperative dispatch API is required for async operations (form submissions, API calls) to show feedback without wiring toast state through every intermediate component.

**Independent Test**: Wrap a test tree in `AlertProvider`, call `showAlert()` from a child component, and assert the toast renders with the specified severity and message.

**Acceptance Scenarios**:

1. **Given** a component tree is wrapped with `<AlertProvider>`, **When** a child calls `showAlert({ severity: 'success', title: 'Saved' })`, **Then** a success toast appears at the default position.
2. **Given** a child calls `showAlert()` with all options (severity, title, description, position, duration, dismissible), **When** the toast renders, **Then** each option is respected.
3. **Given** a child calls `dismissAlert(id)`, **When** the matching toast exists, **Then** it is removed immediately.
4. **Given** an `AlertProvider` is not mounted, **When** `useAlerts()` is called, **Then** a descriptive error is thrown.

---

### User Story 4 — Migrate Existing Ad-Hoc Alert Usages to Shared Component (Priority: P2)

As a UX maintainer, I want all existing one-off alert/banner markup migrated to the shared Alert component so that there is a single visual and behavioral pattern for feedback messages.

**Why this priority**: The Jira acceptance criteria explicitly require migration of all existing ad-hoc usages.

**Independent Test**: After migration, verify that each page/component renders the same visual output using the shared Alert and that existing test assertions continue to pass.

**Acceptance Scenarios**:

1. **Given** the login form renders a banner message, **When** the migration is complete, **Then** the login form uses `<Alert severity="error">` for the banner instead of a bespoke div.
2. **Given** the tenant info step renders a validation error summary, **When** the migration is complete, **Then** it uses `<Alert severity="error">` with a composed error list instead of inline markup.
3. **Given** the tenant info step renders a slug-immutability info banner, **When** the migration is complete, **Then** it uses `<Alert severity="info">` instead of an inline div.
4. **Given** the tenant directory page renders an error state, **When** the migration is complete, **Then** it uses `<Alert severity="warning">` instead of bespoke amber markup.
5. **Given** the platform dashboard renders an error card, **When** the migration is complete, **Then** it uses `<Alert severity="warning">` instead of a bespoke Card with amber styling.
6. **Given** the session expiry notification renders, **When** the migration is complete, **Then** it uses the Alert toast system with `severity="warning"` and `position="top-right"` instead of its custom fixed-position Card.
7. **Given** all migrations are complete, **When** existing Playwright and unit tests run, **Then** they pass without regressions.

---

### User Story 5 — Update UI Guidelines with Alerts Section (Priority: P2)

As a contributor, I want the UI guidelines to include an alerts section so that future usage follows the same rules for severity semantics, positioning, and when to use inline vs. toast alerts.

**Why this priority**: Documentation is an explicit acceptance criterion.

**Independent Test**: Verify the UI guidelines file contains a new alerts section with usage rules, severity semantics, positioning guidance, and code examples.

**Acceptance Scenarios**:

1. **Given** a contributor opens `docs/process/ui-guidlines.md`, **When** they read the document, **Then** there is an alerts section covering severity states, when to use each, and positioning guidance.
2. **Given** the alerts section exists, **When** it is reviewed, **Then** it contains code examples for inline Alert and imperative toast usage.

### Edge Cases

- Toasts dispatched with `duration={0}` or `duration={Infinity}` should persist until explicitly dismissed or until `dismissAlert` is called.
- The close button on a toast must be keyboard-accessible and visible on focus.
- Stacked toasts at the same position must not obscure page content beyond the stacking area.
- Rendering an Alert with no children should display only the icon and be visually balanced.
- The provider must be safe to nest; the nearest `AlertProvider` in the tree wins.
- Unmounting a component that dispatched a toast must not leave a dangling timer or cause a React state-update-on-unmounted-component warning.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: `apps/web` MUST provide a reusable `Alert` inline component at `components/ui/alert.tsx` with a typed props interface.
- **FR-002**: The `Alert` component MUST support four severity variants: `success`, `info`, `warning`, `error`.
- **FR-003**: Each severity variant MUST have a distinct visual treatment (color palette, default icon) consistent with the existing design system tokens.
- **FR-004**: The `Alert` component MUST expose `AlertTitle` and `AlertDescription` compound sub-components for flexible content composition.
- **FR-005**: Error and warning severity MUST use `role="alert"`; success and info severity MUST use `role="status"`.
- **FR-006**: `apps/web` MUST provide a toast alert system consisting of `AlertProvider`, `AlertViewport`, and a `useAlerts` hook.
- **FR-007**: The toast system MUST support configurable positioning: `center`, `top-right`, `top-left`, `top-center`, `bottom-right`, `bottom-left`, `bottom-center`.
- **FR-008**: Toast alerts MUST support auto-dismiss with a configurable `duration` (default 5 000 ms).
- **FR-009**: Toast alerts MUST support an optional `dismissible` prop that shows a manual close control.
- **FR-010**: The `useAlerts` hook MUST expose `showAlert(options): string` (returns alert ID) and `dismissAlert(id): void`.
- **FR-011**: Multiple toasts at the same position MUST stack vertically without overlapping.
- **FR-012**: All existing ad-hoc alert/banner/notification markup in `apps/web` MUST be migrated to the shared `Alert` or toast system.
- **FR-013**: The login form banner MUST be migrated to `<Alert severity="error">`.
- **FR-014**: The tenant create validation error summary MUST be migrated to `<Alert severity="error">`.
- **FR-015**: The slug-immutability info banner MUST be migrated to `<Alert severity="info">`.
- **FR-016**: The tenant directory error banner MUST be migrated to `<Alert severity="warning">`.
- **FR-017**: The platform dashboard error card MUST be migrated to `<Alert severity="warning">`.
- **FR-018**: The session expiry notification MUST be migrated to the toast system with `severity="warning"` and `position="top-right"`.
- **FR-019**: `docs/process/ui-guidlines.md` MUST be updated with an alerts section covering usage rules, severity semantics, positioning guidance, inline vs. toast decision, and code examples.
- **FR-020**: The implementation MUST remain scoped to `apps/web` and documentation; no backend/API changes.

### Non-Functional Requirements

- **NFR-001**: The inline Alert must have zero JavaScript runtime cost when rendered server-side (no `useEffect`, no timers).
- **NFR-002**: Toast auto-dismiss timers MUST be cleaned up on unmount to prevent memory leaks.
- **NFR-003**: The Alert component MUST use CVA (class-variance-authority) for variant styling, consistent with Badge, Button, and other UI primitives in the project.
- **NFR-004**: Toast entry/exit SHOULD include subtle transition animation consistent with the motion guidelines in the UI guidelines.

### Key Entities

- **Alert Severity**: An enum-like value set: `success`, `info`, `warning`, `error`.
- **Alert Position**: An enum-like value set: `center`, `top-right`, `top-left`, `top-center`, `bottom-right`, `bottom-left`, `bottom-center`.
- **Toast Alert**: A transient notification dispatched via the imperative API with severity, title, optional description, position, duration, and dismissible configuration.
- **Alert Context**: React context that holds the toast queue state and exposes `showAlert` / `dismissAlert` methods.

### Assumptions

- Step-level validation error summaries (lists of messages) will use the inline Alert with composed children rather than a dedicated "error list" variant.
- The Card-based error states in the dashboard/directory pages will be replaced with the inline Alert since they function as in-flow status messaging, not overlay toasts.
- The session expiry notification is the only existing usage that maps to the toast pattern; all other migrations use inline Alert.
- No animation library is needed; CSS transitions are sufficient per the motion guidelines.
- The `AlertProvider` will be placed in the root layout so toasts are available application-wide.

### Dependencies

- Existing `apps/web` Tailwind config and design tokens (colors, spacing).
- `class-variance-authority` package already in `apps/web`.
- `lucide-react` icons already in `apps/web`.
- CROWN-161 Stepper component as a structural reference for CVA-based reusable UI primitives.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A reusable Alert component exists at `apps/web/components/ui/alert.tsx` with success, info, warning, and error variants that pass visual and accessibility assertions.
- **SC-002**: A toast alert system exists with `AlertProvider`, `useAlerts`, and `AlertViewport` that supports all seven position values and auto-dismiss behavior.
- **SC-003**: All five identified ad-hoc alert sites are migrated to the shared component and existing test suites pass without regressions.
- **SC-004**: `docs/process/ui-guidlines.md` contains an alerts section with severity semantics, positioning guidance, and code examples.
- **SC-005**: `pnpm --filter @crown/web typecheck` passes with zero errors.
