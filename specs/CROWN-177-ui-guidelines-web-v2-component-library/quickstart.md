# Quickstart: Validate CROWN-177 Locally

## 1. Review the feature artifacts

Open the `CROWN-177` spec files and confirm the planned scope remains limited to the UI-guideline document plus supporting Spec Kit artifacts.

## 2. Review the source references

1. Open `docs/process/ui-guidlines.md`.
2. Open `.github/agents/ui-ux.agent.md`.
3. Open `apps/web/app/globals.css`.
4. Confirm the planned additions align with the existing doc structure, UI-agent guidance, and real token names.

## 3. Validate formatting and workflow audit

```bash
pnpm specify.audit
```

## 4. Manual document smoke check

1. Open `docs/process/ui-guidlines.md`.
2. Confirm the component catalog is easy to locate.
3. Confirm the workflow section clearly states UI agent -> wireframe/spec -> implementation.
4. Confirm the design-token section references real CSS variables from `apps/web/app/globals.css`.
5. Confirm Rich Table, Toggle, Multi-toggle, Breadcrumb, Skeleton, and Empty State guidance are all present and non-contradictory.
