# UI Guidelines

**Stack:** React, shadcn/ui, Tailwind CSS, lucide-react
**Purpose:** Define consistent, scalable UI implementation rules across the application.

---

# 1. Core Principles

## 1.1 Consistency over customization

Prefer existing patterns over creating new ones. Every screen should feel part of the same system.

## 1.2 Composition over custom components

Use shadcn/ui primitives first. Build reusable wrappers before introducing custom UI.

## 1.3 Clear hierarchy

Each screen must clearly communicate:

- where the user is
- what they are doing
- what action is primary

## 1.4 Accessibility by default

Keyboard navigation, focus states, labels, and semantic structure are required—not optional.

## 1.5 Wireframe-First Workflow

All new or materially changed UI work must follow this order:

1. UI agent input
2. Wireframe / UI spec
3. Implementation

### Required workflow outputs

- **UI agent input** must define the target surface, primary user, core task, layout pattern, and component reuse expectations.
- **Wireframe / UI spec** must define structure, primary action hierarchy, required states, responsive behavior, accessibility notes, and token usage.
- **Implementation handoff** must reference the approved wireframe/spec and stay within the documented component patterns unless the spec is updated.

### Rules

- Do not begin implementation from a loose idea or screenshot alone.
- For Jira-scoped UI work, save the wireframe spec to `specs/CROWN-<id>/wireframe.md`.
- Treat the UI agent as the design-system guide, not as a replacement for this document.
- For the full ordered development flow, see `docs/process/development-workflow.md`.
- For component delivery rules and Storybook requirements, see `docs/process/component-development.md`.

---

# 2. Layout System

## 2.1 Page Shell Structure

All pages should follow:
PageHeader
ContentContainer
Sections / Cards
Actions (if applicable)

---

## 2.2 Approved Layout Patterns

### Pattern 1 — Standard Admin Page

- Left-aligned
- Used for dashboards, tables, settings

### Pattern 2 — Form Page

- Constrained width (`max-w-2xl` to `max-w-3xl`)
- Used for create/edit flows

### Pattern 3 — Wizard Page

- Centered content
- Stepper + constrained form
- Used for onboarding / multi-step flows

⚠️ Do not mix patterns within a single page.

---

## 2.3 Width Guidelines

| Use Case     | Max Width  |
| ------------ | ---------- |
| Forms        | 600–720px  |
| Detail Pages | 720–900px  |
| Dashboards   | responsive |
| Tables       | full width |

---

## 2.4 Spacing Scale

Use consistent spacing tokens:

| Size | Usage            |
| ---- | ---------------- |
| 4px  | micro spacing    |
| 8px  | tight spacing    |
| 16px | standard spacing |
| 24px | section spacing  |
| 32px | major separation |
| 48px | page sections    |

### Common Rules

- Label → Input: 6–8px
- Input → Input: 16px
- Section → Section: 24–32px
- Header → Content: 24px

---

# 3. Typography

## 3.1 Hierarchy Levels

- Page Title (largest, singular)
- Section Title
- Card Title
- Body Text
- Muted Text

## 3.2 Rules

- Do not introduce arbitrary font sizes
- Avoid excessive uppercase usage
- Keep descriptions concise (1–2 lines max)
- Use the web-v2 control-plane typography pairing from `apps/web2/app/globals.css` and `apps/web2/tailwind.config.ts`:
  - Headings and prominent action labels: `"Manrope", sans-serif`
  - Body copy, form fields, table text, helper text, and metadata: `"Inter", sans-serif`
- Stay within the approved type scale only:
  - `text-xs` = 12px
  - `text-sm` = 13px
  - `text-base` = 14px
  - `text-lg` = 16px
  - `text-xl` = 18px
  - `text-2xl` = 20px
  - `text-3xl` = 24px
- Do not use sizes below 12px or above 24px in the product UI
- Limit font weights to `400`, `500`, and `600`
- Keep headings within `1.2` to `1.3` line height
- Keep form copy within `1.4` to `1.5` line height
- Keep table text within `1.3` to `1.4` line height and apply `tabular-nums` for numeric data

## 3.3 Component Typography

- Page titles: `text-2xl` to `text-3xl`, `font-semibold`
- Section titles: `text-xl`, `font-semibold`
- Form labels: `text-sm`, `font-medium`
- Form inputs/selects: `text-base`, `font-normal`
- Helper text and validation hints: `text-xs`
- Table body cells: `text-sm`, `font-normal`

## 3.4 Web-v2 Control Plane Typography Application

- Use `Manrope` for page titles, section titles, card titles, and primary CTA emphasis.
- Use `Inter` for paragraphs, forms, tables, badges, helper text, and navigation labels.
- Do not introduce a third font family into the control plane product UI.
- Keep button typography aligned to the surrounding surface:
  - primary CTA labels may use `Manrope` when the button is the dominant action
  - secondary and ghost button labels should default to `Inter`

---

# 4. Color & Visual Hierarchy

## 4.1 Color Usage

- Primary → main actions
- Secondary → supporting UI
- Destructive → dangerous actions
- Muted → low emphasis content

## 4.2 Rules

- One primary color per product
- Avoid overusing colored backgrounds
- Borders should be subtle

## 4.3 Design Token Reference

Use CSS custom properties from `apps/web2/app/globals.css` as the source of truth for web-v2 styling decisions. Do not introduce hex values in product guidance when a shared token already exists.

### Foundational tokens

- HSL-backed shadcn tokens: `--background-hsl`, `--foreground-hsl`, `--card-hsl`, `--popover-hsl`, `--primary-hsl`, `--secondary-hsl`, `--muted-hsl`, `--accent-hsl`, `--destructive-hsl`, `--border-hsl`, `--input-hsl`, `--ring-hsl`
- Typography scale: `--text-xs`, `--text-sm`, `--text-md`, `--text-lg`, `--text-xl`, `--text-2xl`, `--text-3xl`
- Radius: `--radius`

### Product surface tokens

- Page background: `--background`
- Standard panel surface: `--surface`
- Elevated panel surface: `--surface-strong`
- Surface border: `--surface-border`
- Primary text: `--ink`
- Muted text: `--muted`

### Action and status tokens

- Primary accent: `--accent`
- Soft accent / highlight: `--accent-soft`
- Strong accent / hover: `--accent-strong`
- Tenant accent: `--tenant-accent`
- Destructive / error: `--danger`

### Usage rules

- Use semantic tokens, not raw color literals, in specs and implementation guidance.
- Prefer `--surface` and `--surface-strong` for layered panels and cards.
- Use `--accent` and `--accent-strong` for primary-action emphasis.
- Use `--danger` for destructive and error treatments.
- Use `--tenant-accent` only for tenant-branded surfaces.

## 4.4 Web-v2 Control Plane Palette

For the web-v2 control plane, use a `Slate + Blue` palette:

- Light theme:
  - cloud-gray page background
  - white or near-white surfaces
  - muted cobalt primary accent
  - soft slate borders
- Dark theme:
  - deep navy-slate page background
  - blue-gray surfaces
  - electric-but-controlled blue primary accent
  - subdued slate borders

### Palette intent

- The control plane should feel familiar SaaS, clean, and dependable.
- Avoid gradients in core product surfaces.
- Use blue for action hierarchy and orientation, not decoration.
- Keep dark mode contrast strong enough for dense tables and forms.
- Prefer neutral surfaces with blue reserved for focus, selection, and primary actions.

---

# 5. Component Guidelines

## 5.1 Use shadcn components first

Preferred components:

- Card
- Button
- Input
- Select
- Dialog
- Sheet
- Tabs
- Table
- Badge
- Alert
- Tooltip

---

## 5.2 Approved Web-v2 Component Library

Prefer the following reusable patterns before introducing new UI:

| Component / Pattern  | Use When                                                                 |
| -------------------- | ------------------------------------------------------------------------ |
| `PageHeader`         | A page needs title, description, status, and top-level actions           |
| `SectionCard`        | Related information should be grouped within a bounded surface           |
| `FormSection`        | A form needs grouped fields and section-level copy                       |
| `Rich Table`         | A management view is primarily a list of records, filters, and actions   |
| `Filter Bar`         | A list needs inline search and filter controls above the data surface    |
| `Smart Filter Chips` | Active filters need to stay visible and removable after selection        |
| `EmptyState`         | A view has no records or no results for the current filter state         |
| `Skeleton`           | A known layout is loading and should preserve structure without spinners |
| `StatusBadge`        | Status needs a compact semantic indicator with text, not color alone     |
| `Breadcrumb`         | A user needs orientation inside nested admin navigation                  |
| `AppStepper`         | A multi-step workflow needs explicit progress and sequence visibility    |
| `ConfirmDialog`      | A destructive or irreversible action needs confirmation                  |
| `Action Group`       | Primary, secondary, and overflow actions must stay organized             |

---

## 5.3 Buttons

### Rules

- One primary button per section
- Secondary = outline/ghost
- Destructive = destructive variant

### Priority Order

1. Primary
2. Secondary
3. Tertiary (ghost)
4. Destructive

---

## 5.4 Forms

Each field must include:

- Label
- Input
- Optional helper/error text

### Rules

- Labels are required
- Placeholder ≠ label
- Validation must be inline

---

## 5.5 Cards

Use cards for:

- grouped forms
- settings sections
- dashboards

Do not wrap everything in cards unnecessarily.

## 5.6 Toggle And Multi-Toggle

### Toggle

Use a single toggle for a binary state where the effect is immediate and easy to reverse.

- Best for: enabled/disabled, active/inactive, on/off settings
- Show the current state clearly in adjacent text or helper copy
- If the toggle triggers an async save, reflect loading and failure feedback immediately
- Do not use a toggle for destructive actions or multi-step confirmation flows

### Multi-toggle

Use a multi-toggle when the user must choose exactly one option from a small set of mutually exclusive modes.

- Best for: view mode, density mode, week/month/year window selection
- Limit to 2–4 options; larger sets should become Tabs, Select, or segmented filters
- Only one option can be active at a time
- The active option must be visually distinct and keyboard reachable

## 5.7 Breadcrumb

Use Breadcrumbs for nested admin navigation where users need to understand position quickly.

- Show breadcrumbs in the page header when the user is 2 or more levels deep
- Order: highest-level context → current location
- Keep labels short and entity-based
- Breadcrumbs should orient the user, not duplicate sidebar navigation labels

## 5.8 Empty State

Every empty state must explain what would normally appear here and what the user can do next.

### Required parts

- Contextual icon or illustration
- Clear headline
- One-sentence explanation
- Primary CTA when the user can create or recover from the state

### Variants

- **No data**: show a create or get-started CTA
- **Filtered empty**: show "Clear filters" rather than a create CTA
- **Not found**: explain that the record no longer exists and offer a path back

## 5.9 Skeleton

Use `Skeleton` placeholders for known layouts while content is loading.

- Prefer skeletons over spinners for page and section loading
- Match the shape and approximate dimensions of the real content
- Use page-level skeletons for full-page first load
- Use section-level skeletons when only one card, table, or panel is loading
- Reserve inline spinners for button-level actions only

---

# 6. Icons (lucide-react)

## 6.1 Usage

Use icons for:

- navigation
- actions
- status indicators

Avoid decorative overuse.

## 6.2 Sizes

- Small: 16px
- Default: 18–20px
- Large: 24px

Keep consistent across the page.

---

# 7. Forms & Workflows

## 7.1 Structure

Group fields by meaning:

- identity
- settings
- permissions
- integrations

## 7.2 Multi-step Forms

Use a stepper when:

- steps depend on previous input
- user needs progress visibility

## 7.3 Action Placement

- Default: bottom-right inside form/card
- Sticky footer: only for long forms

---

# 8. Data & Tables

## 8.1 Usage

Use tables for:

- comparison
- sorting
- bulk actions

Avoid tables for single-record views.

## 8.2 States (Required)

Every data view must include:

- Loading state
- Empty state
- Error state

## 8.3 Rich Table Pattern

Rich Table is the default pattern for Crown management-system list views.

### Use Rich Table when

- users need to scan many records quickly
- sorting, filtering, or bulk actions are part of the workflow
- row-level actions should stay close to the data

### Required table capabilities

- sortable column headers when sorting is meaningful
- inline filter bar directly above the table
- active filter chips shown below the filter bar
- pagination with total count and page-size controls
- row selection when bulk actions exist
- toolbar actions for refresh, export, import, or bulk operations

### Column rules

- Put identifier or name columns first
- Put status near the beginning of the table
- Put dates, metrics, and utility actions toward the end
- Use `tabular-nums` for numeric and date-heavy columns

### Filter and toolbar rules

- Keep simple filters inline and visible
- When filters grow beyond 3 primary dimensions, move overflow filters behind a "More filters" affordance
- Show active filters as removable chips, not hidden state
- Bulk action controls appear only after one or more rows are selected

### Pagination rules

- Pagination is the default for entity listings
- Default page size: `25`
- Expose page-size options and total record count
- Infinite scroll is reserved for timelines and feed-like activity, not admin record lists

### State rules

- Loading: use a table-shaped Skeleton, not a centered spinner
- Empty (no data): show an Empty State with create-oriented CTA
- Filtered empty: explain that no results match the current filters and provide a "Clear filters" action
- Error: replace the table section with a contained error state and retry action

### Responsive behavior

- Keep full tables on desktop and larger tablet layouts
- On smaller screens, degrade gracefully into stacked card rows or another readable mobile presentation
- Do not hide critical identifiers or status cues when adapting the layout

---

# 9. UI States

Every component must support:

- Default
- Hover
- Focus
- Active
- Disabled
- Loading
- Empty / Filtered Empty (if applicable)
- Error (if applicable)
- Success (if applicable)

---

# 10. Accessibility

## 10.1 Requirements

- Keyboard navigation must work
- Focus states must be visible
- Inputs must have labels
- Color must not be the only signal

---

# 11. Responsive Design

## 11.1 Rules

- Layout must adapt cleanly
- Cards stack vertically on small screens
- Tables degrade gracefully

---

# 12. Motion

## 12.1 Guidelines

- Motion should explain interactions
- Keep transitions fast and subtle
- Avoid unnecessary animation

---

# 13. Code Standards

## 13.1 Styling Order

1. shadcn component
2. Tailwind utilities
3. `cn()` helper
4. Reusable wrapper
5. Custom CSS (last resort)

---

## 13.2 Component Design

- Keep UI components presentational
- Separate business logic
- Avoid large inline class strings

---

# 14. Admin UX Rules

## 14.1 Every page must answer

- What is this?
- What is the current state?
- What can I do next?

## 14.2 Progressive disclosure

Show advanced options only when needed.

---

# 15. PR Review Checklist

Before merging:

### Layout

- Consistent pattern used?
- Proper spacing?

### Hierarchy

- Primary action clear?
- Easy to scan?

### Components

- Reused existing patterns?
- No unnecessary custom UI?

### States

- Loading, empty, error covered?

### Accessibility

- Keyboard + focus working?

### Responsiveness

- Works on smaller screens?

---

# 16. Required Team Standards

## Must Have

- Shared PageHeader component
- Shared spacing scale
- Shared form patterns
- Shared button hierarchy
- Shared state handling patterns

## Recommended

- Storybook or examples
- PR UI checklist enforcement
- Reusable pattern library

---

# 17. Alerts & Notifications

## 17.1 Severity States

The shared `Alert` component (`components/ui/alert.tsx`) supports four severity variants:

| Severity  | Color | Default Icon    | ARIA Role | When to Use                                          |
| --------- | ----- | --------------- | --------- | ---------------------------------------------------- |
| `success` | Green | `CircleCheck`   | `status`  | Confirmation of a completed action                   |
| `info`    | Blue  | `Info`          | `status`  | Contextual information, hints, or reminders          |
| `warning` | Amber | `AlertTriangle` | `alert`   | Degraded state, potential issues, recoverable errors |
| `error`   | Red   | `CircleX`       | `alert`   | Validation failures, hard errors, blocked actions    |

## 17.2 Inline Alert vs. Toast

| Use Case                        | Pattern                                 |
| ------------------------------- | --------------------------------------- |
| Form validation errors          | Inline Alert                            |
| Contextual info banners         | Inline Alert                            |
| Page-level error/degraded state | Inline Alert                            |
| Operation success confirmation  | Toast                                   |
| Async error after network call  | Inline Alert + optional secondary toast |
| Transient notification          | Toast                                   |

**Rule**: Use inline alerts when the message relates to content already on the page. Use toasts for ephemeral feedback from an action the user just performed. Do not rely on toast-only delivery for blocked or recoverable error states.

## 17.3 Inline Alert Usage

```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

<Alert severity="error">
  <AlertTitle>Validation failed</AlertTitle>
  <AlertDescription>Please fix the highlighted fields before continuing.</AlertDescription>
</Alert>;
```

- Compose with `AlertTitle` and `AlertDescription` sub-components.
- Pass `data-testid` for test targeting.
- The default icon per severity is rendered automatically; pass `icon={false}` to suppress.

## 17.4 Toast Usage

```tsx
import { NotificationSeverityEnum, useNotifications } from '@/components/ui/notification-center';

const { showNotification, startTask, completeTask } = useNotifications();

showNotification({
  severity: NotificationSeverityEnum.SUCCESS,
  title: 'Tenant created',
});

showNotification({
  action: { href: '/notifications', label: 'View incident' },
  description: 'Please review the sync logs before retrying.',
  severity: NotificationSeverityEnum.ERROR,
  title: 'Save failed',
});

const taskId = startTask({
  action: { href: '/activity', label: 'View details' },
  description: 'Preparing the latest export package.',
  title: 'Preparing export',
});

completeTask(taskId, {
  description: 'The export is ready to download.',
  title: 'Export complete',
});
```

- Warning and error toasts must communicate both the issue and the next step in compact copy.
- Notification logs or centers should group attention-needed items separately from passive history.
- Severity iconography is required but not sufficient on its own for dense lists; add a category icon or label when users need to distinguish billing, exports, access, sync, or system events quickly.

## 17.5 Positioning (Toast Only)

Supported positions in web2: `top-right` (default), `top-middle`, `top-left`, `bottom-right`, `bottom-middle`, `bottom-left`.

- **Default**: `top-right` — use for most transient notifications.
- Keep one consistent position per flow when possible.
- Reserve top and bottom middle placements for workflow-specific exceptions; do not make them the product-wide default.

## 17.6 Auto-Dismiss Conventions

| Severity             | Default Duration         |
| -------------------- | ------------------------ |
| success              | 5 000–8 000 ms           |
| info                 | 5 000–8 000 ms           |
| warning              | persistent by default    |
| error                | persistent by default    |
| progress/system task | persistent while running |

- Success and informational toasts may auto-dismiss, and should pause on hover.
- If a toast contains interactive controls, prefer persistent behavior rather than a short timeout.
- Warnings should usually be inline or message-bar based when the condition is ongoing.
- Errors must pair durable recovery guidance with any toast cue.
- Progress notifications should remain visible until completion, then update to success/info and dismiss after completion.

## 17.7 Queueing And Recovery

- Show at most four visible toasts at once and queue the rest.
- Aggregate repeated events instead of stacking identical notifications repeatedly.
- Do not move focus for ordinary toasts; announce them via live regions instead.
- Provide a durable notification log or panel so missed messages remain recoverable.

---

# 18. Final Rule

If a UI decision is unclear:
→ Choose the option that increases consistency across the product.

Consistency beats preference.
