# Contract: UI Guidelines Update Coverage

## Implementation Target

- `docs/process/ui-guidlines.md`

## Required Additions

- Add a component-library catalog section for approved reusable web-v2 patterns.
- Add a wireframe-first workflow section describing UI agent input, wireframe/spec output, and implementation handoff.
- Add a design-token reference section grounded in `apps/web/app/globals.css`.
- Add a Rich Table pattern section covering filters, chips, pagination, toolbar or bulk actions, and required loading, empty, and error states.
- Add or extend guidance for Toggle, Multi-toggle, Breadcrumb, Skeleton, and Empty State patterns.

## Content Integrity Rules

- New guidance must remain consistent with `docs/process/engineering-constitution.md`.
- New workflow guidance must not replace or contradict the tagged Spec Kit workflow.
- Token references must use CSS variable names that exist in `apps/web/app/globals.css`.
- Pattern guidance should emphasize Crown’s table-first, management-system UX model.
- New sections should be easy to scan and should not duplicate existing rules unnecessarily.

## Review Expectations

- Reviewers should be able to identify the approved component catalog without searching outside the guideline document.
- Reviewers should be able to identify the UI delivery order from the workflow section alone.
- Reviewers should be able to trace token guidance back to `globals.css`.
- Reviewers should be able to distinguish no-data empty states from filtered-no-results states in the documented guidance.
