# Development Workflow

**Purpose:** Define the mandatory development flow for all UI/UX feature work in Crown.

---

## 1. Governing References

| Document                                   | Scope                                  |
| ------------------------------------------ | -------------------------------------- |
| `docs/process/engineering-constitution.md` | Branching, commits, PRs, release gates |
| `docs/process/ui-guidlines.md`             | UI rules, component library, tokens    |
| `docs/process/component-development.md`    | Storybook-first component delivery     |
| `docs/process/spec-kit-workflow.md`        | Spec Kit phase sequence and gates      |

---

## 2. Feature Development Flow

Every UI-related feature must follow this ordered sequence. No phase may be skipped.

### Phase 1 — API Contract (if applicable)

- Define or reference the API contract the UI will consume.
- For new endpoints, update `apps/api/src/docs/openapi.ts`.
- Shared request/response shapes go in `@crown/types`.

### Phase 2 — UI Wireframe Spec

- Generate a wireframe spec before any implementation task.
- Save to: `specs/CROWN-<id>/wireframe.md`
- The spec must define:
  - Layout structure (which approved layout pattern from `ui-guidlines.md`)
  - Action hierarchy (primary, secondary, tertiary, destructive)
  - Required states: loading, empty, filtered-empty, error, success
  - Accessibility behavior (keyboard nav, focus management, ARIA)
  - Responsive behavior (desktop → tablet → mobile degradation)
  - Component reuse (which existing components are used, which are new)
  - Design token usage (reference semantic tokens, not raw colors)

### Phase 3 — Storybook Component Identification / Creation

- Inventory which components the wireframe requires.
- Check existing components in `apps/web/components/ui/` and `apps/web/components/platform/`.
- For each new reusable component:
  - Create a Storybook story covering all required states.
  - Build the component in isolation before page integration.
- See `docs/process/component-development.md` for the full component workflow.

### Phase 4 — Page Assembly

- Compose the page using Storybook-validated components.
- Do not build reusable UI directly inside page files.
- Follow the approved layout pattern from the wireframe spec.

### Phase 5 — Implementation

- Wire API integration, state management, and business logic.
- Validate against the wireframe spec.
- Run lint, typecheck, and tests.

### Phase 6 — PR Creation

- Run the pre-PR validation checklist (see Section 4).
- Create the PR with Jira linkage, spec references, and validation notes.

---

## 3. Speckit Integration

When running `--speckit CROWN-<id>` for a UI feature:

### `/specify` phase

- Include the API contract surface (if applicable).
- Include the UI wireframe spec requirements.

### `/plan` phase

- Plan must reference the wireframe spec location.
- Plan must identify which components are new vs. reused.

### `/tasks` phase

Tasks must be structured in this order:

1. **UI Spec Tasks**
   - Create/update wireframe spec at `specs/CROWN-<id>/wireframe.md`
   - Identify required components (new and existing)

2. **Component Tasks** (for each new reusable component)
   - Build component in Storybook with all required states:
     - default, hover, focus, disabled, loading, error (if applicable)
   - Add Storybook stories

3. **Page Tasks**
   - Assemble page UI using Storybook-validated components
   - Integrate API calls and state management

4. **API Tasks** (if applicable)
   - Implement or update API endpoints
   - Update OpenAPI documentation

### Implementation phase

- Execute tasks in the order defined above.
- Do not start page tasks until component tasks are complete.
- Do not start component tasks until the wireframe spec exists.

### PR creation phase

- Run pre-PR validation (Section 4).
- Include wireframe spec link in PR description.

---

## 4. Pre-PR Validation Checklist

Before creating a pull request for UI work, validate:

| Check                        | Requirement                                                              |
| ---------------------------- | ------------------------------------------------------------------------ |
| Wireframe spec exists        | `specs/CROWN-<id>/wireframe.md` is present and covers all required areas |
| Components in Storybook      | Every new reusable component has Storybook stories                       |
| UI matches wireframe         | Implementation follows the approved wireframe structure                  |
| UI guidelines compliance     | No violations of `docs/process/ui-guidlines.md`                          |
| No new patterns without docs | Any new UI pattern is justified and documented                           |
| States covered               | Loading, empty, error states are implemented                             |
| Accessibility                | Keyboard navigation, focus states, labels are present                    |
| Responsive                   | Layout degrades cleanly on smaller screens                               |

---

## 5. Prohibited Practices

- Do not generate UI directly from vague descriptions without a wireframe spec.
- Do not skip Storybook for reusable components.
- Do not build reusable UI directly inside page files.
- Do not duplicate existing components.
- Do not introduce UI patterns that violate the Rich Table / CRM-first guidelines.
- Do not bypass the wireframe spec step for any UI feature.
