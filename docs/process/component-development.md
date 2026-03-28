# Component Development

**Purpose:** Define the mandatory component development workflow for Crown web-v2.

---

## 1. Governing References

| Document                                   | Scope                                |
| ------------------------------------------ | ------------------------------------ |
| `docs/process/ui-guidlines.md`             | UI rules, approved component library |
| `docs/process/development-workflow.md`     | Feature development flow             |
| `docs/process/engineering-constitution.md` | Coding standards and PR gates        |

---

## 2. Component Classification

### Primitives (`apps/web/components/ui/`)

Reusable, presentational, design-system-level components. Examples: Button, Card, Input, Badge, Alert, Table, Stepper.

### Feature Components (`apps/web/components/platform/`, `apps/web/components/auth/`)

Domain-specific compositions of primitives. Examples: TenantDirectoryPage, DashboardMetricCards, LoginForm.

### Page Components (`apps/web/app/`)

Route-level assemblies that compose feature components and primitives.

---

## 3. Component Development Flow

### Step 1 — Check Existing Components

Before creating a new component:

1. Search `apps/web/components/ui/` for an existing primitive.
2. Search `apps/web/components/platform/` for an existing feature component.
3. Check the approved component library in `docs/process/ui-guidlines.md` Section 5.2.
4. If a suitable component exists, use it. Do not duplicate.

### Step 2 — Create Storybook Story First

For every new reusable component:

1. Create the story file alongside the component:
   - Primitives: `apps/web/components/ui/<component>.stories.tsx`
   - Feature: `apps/web/components/platform/<component>.stories.tsx`
2. Stories must cover all required states (see Section 4).
3. Build and validate the component in Storybook before page integration.

### Step 3 — Build the Component

1. Keep the component presentational. Separate business logic.
2. Follow the styling order from `ui-guidlines.md` Section 13.1:
   - shadcn component → Tailwind utilities → `cn()` helper → reusable wrapper → custom CSS (last resort)
3. Accept data and callbacks via props. Do not embed API calls.
4. Use semantic tokens from `apps/web/app/globals.css`, not raw color literals.

### Step 4 — Integrate into Page

1. Import the Storybook-validated component into the page.
2. Wire props, API data, and event handlers at the page level.
3. Do not modify the component to accommodate page-specific logic.

---

## 4. Required Component States

Every component must support the applicable states from this list:

| State          | Required        | Notes                                 |
| -------------- | --------------- | ------------------------------------- |
| Default        | Always          | Base visual state                     |
| Hover          | Always          | Interactive feedback                  |
| Focus          | Always          | Keyboard navigation support           |
| Active         | Always          | Pressed / engaged state               |
| Disabled       | Always          | Non-interactive variant               |
| Loading        | Often           | Skeleton or spinner for async content |
| Empty          | When applicable | No-data state                         |
| Filtered Empty | When applicable | No-results-for-filter state           |
| Error          | When applicable | Validation or fetch failure           |
| Success        | When applicable | Confirmation feedback                 |

### Storybook Story Requirements

Each story file must include:

- A `Default` story showing the base state
- Stories for each applicable state listed above
- Stories for key prop variations (sizes, variants)
- A story demonstrating responsive behavior when relevant

---

## 5. Storybook Conventions

### File Naming

```
<component-name>.stories.tsx
```

Collocated with the component file.

### Story Organization

```tsx
export default {
  title: 'UI/<ComponentName>', // or 'Platform/<ComponentName>'
  component: ComponentName,
};
```

### Data

- Use realistic mock data, not lorem ipsum.
- Define shared mock data in story files or a `__mocks__/` directory.

---

## 6. Component Checklist

Before a component is considered complete:

- [ ] Storybook stories exist for all required states
- [ ] Component is presentational (no embedded API calls)
- [ ] Uses semantic design tokens, not raw colors
- [ ] Follows `ui-guidlines.md` styling order
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Labels and ARIA attributes are present
- [ ] Responsive behavior is handled
- [ ] No duplicate of an existing component

---

## 7. Prohibited Practices

- Do not build reusable components directly inside page files.
- Do not create a component without a Storybook story.
- Do not duplicate an existing component from `apps/web/components/ui/`.
- Do not embed API calls or business logic inside presentational components.
- Do not use raw hex/HSL values when a semantic token exists.
- Do not skip state coverage (loading, empty, error) for data-driven components.
