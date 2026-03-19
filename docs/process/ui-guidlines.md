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
- Use `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` as the only UI font stack
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

## 5.2 Shared App Components

Create reusable components for:

- PageHeader
- SectionCard
- FormSection
- EmptyState
- StatusBadge
- AppStepper
- ConfirmDialog

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

---

# 9. UI States

Every component must support:

- Default
- Hover
- Focus
- Active
- Disabled
- Loading
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

| Use Case                        | Pattern      |
| ------------------------------- | ------------ |
| Form validation errors          | Inline Alert |
| Contextual info banners         | Inline Alert |
| Page-level error/degraded state | Inline Alert |
| Operation success confirmation  | Toast        |
| Async error after network call  | Toast        |
| Transient notification          | Toast        |

**Rule**: Use inline alerts when the message relates to content already on the page. Use toasts for ephemeral feedback from an action the user just performed.

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
import { useAlerts } from '@/components/ui/alert-toast';

const { showAlert, dismissAlert } = useAlerts();

// Fire-and-forget
showAlert({ severity: 'success', title: 'Tenant created' });

// With all options
const id = showAlert({
  severity: 'error',
  title: 'Save failed',
  description: 'Please retry.',
  position: 'top-right',
  duration: 8000,
  dismissible: true,
});

// Programmatic dismiss
dismissAlert(id);
```

## 17.5 Positioning (Toast Only)

Supported positions: `top-right` (default), `top-left`, `top-center`, `bottom-right`, `bottom-left`, `bottom-center`, `center`.

- **Default**: `top-right` — use for most transient notifications.
- **Center**: reserve for critical blocking alerts only.
- Keep one consistent position per flow when possible.

## 17.6 Auto-Dismiss Conventions

| Severity | Default Duration |
| -------- | ---------------- |
| success  | 5 000 ms         |
| info     | 5 000 ms         |
| warning  | 5 000 ms         |
| error    | 5 000 ms         |

Pass `duration={0}` for persistent toasts that require explicit dismissal.

---

# 18. Final Rule

If a UI decision is unclear:
→ Choose the option that increases consistency across the product.

Consistency beats preference.
