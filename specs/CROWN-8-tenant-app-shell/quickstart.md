# Quickstart: Tenant App UI Shell

## Goal

Validate the `CROWN-8` planning artifacts and prepare for `/speckit.tasks` and implementation of the first tenant-facing workspace shell in `apps/web`.

## Prerequisites

- Working branch: `feat/CROWN-8-tenant-app-shell`
- Planning artifacts path: `specs/CROWN-8-tenant-app-shell`
- Dependencies installed: `pnpm install`
- Existing auth/RBAC context available from prior platform work

## 1. Review planning artifacts

- Feature spec: `specs/CROWN-8-tenant-app-shell/spec.md`
- Plan: `specs/CROWN-8-tenant-app-shell/plan.md`
- Research decisions: `specs/CROWN-8-tenant-app-shell/research.md`
- Data model: `specs/CROWN-8-tenant-app-shell/data-model.md`
- Contracts:
  - `specs/CROWN-8-tenant-app-shell/contracts/tenant-shell-ui-contract.md`
  - `specs/CROWN-8-tenant-app-shell/contracts/tenant-role-entry-contract.md`

## 2. Validate tenant-shell scope

- Confirm the feature is limited to the tenant app shell, not the full tenant application workflow set.
- Confirm the shell remains distinct from the `super_admin` control plane.
- Confirm branding presents the workspace as powered by Crown.
- Confirm all copy and orientation content reflects the management-system pivot rather than CRM wording.

## 3. Prepare implementation test matrix

- Browser behavior checks:
  - tenant-scoped user reaches the tenant shell
  - `super_admin` does not remain in the tenant shell
  - shell renders meaningful tenant navigation and overview content
- Content checks:
  - powered-by-Crown branding is visible in the tenant shell
  - no CRM framing in shell headings, labels, or empty states
- Responsive checks:
  - primary shell remains usable on desktop and mobile widths

## 4. Ready state for `/speckit.tasks`

Proceed to task decomposition when:

- No unresolved clarifications remain in `research.md`.
- The tenant-shell UI and role-entry contracts are accepted.
- The relationship between the tenant shell and the `CROWN-7` platform shell is clearly understood.

## 5. Implementation notes

- `apps/web` already contains the `CROWN-7` platform shell and will need tenant-shell separation without collapsing the role boundary.
- `apps/web/tests/smoke.spec.ts` already exists and can be expanded or split for tenant-shell coverage.
- Expected validation commands for implementation:
  - `pnpm --filter @crown/web typecheck`
  - `pnpm --filter @crown/web exec playwright test tests/smoke.spec.ts --config=playwright.config.ts`
- Temporary spec-kit stub cleanup:
  - remove or reconcile `specs/001-tenant-app-shell` once the Jira-aligned feature path is complete
