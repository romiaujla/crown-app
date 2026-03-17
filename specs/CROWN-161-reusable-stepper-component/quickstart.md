# Quickstart: Validate CROWN-161 Locally

## 1. Typecheck web app

```bash
pnpm --filter @crown/web typecheck
```

## 2. Run focused tenant-create flow coverage

```bash
pnpm --filter @crown/web test -- tests/auth-flow.spec.ts
```

## 3. Manual smoke check in browser

1. Run web dev server:

```bash
pnpm --filter @crown/web dev
```

2. Open `/platform/tenants/new` as a super-admin session.
3. Verify the left progress rail renders shared Stepper visuals.
4. Verify Next/Back still move the active step and update state styling.
5. Verify Cancel still prompts when step text is entered and does not prompt when no step input exists.
