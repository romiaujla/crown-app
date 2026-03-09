# Quickstart: Super-Admin Control Plane UI Shell

## Goal

Validate the `CROWN-7` planning artifacts and prepare for `/speckit.tasks` and implementation of the first real platform shell in `apps/web`.

## Prerequisites

- Working branch: `feat/CROWN-7-platform-super-admin`
- Planning artifacts path: `specs/CROWN-7-platform-super-admin`
- Dependencies installed: `pnpm install`
- Existing auth/RBAC context available from prior platform work

## 1. Review planning artifacts

- Feature spec: `specs/CROWN-7-platform-super-admin/spec.md`
- Plan: `specs/CROWN-7-platform-super-admin/plan.md`
- Research decisions: `specs/CROWN-7-platform-super-admin/research.md`
- Data model: `specs/CROWN-7-platform-super-admin/data-model.md`
- Contracts:
  - `specs/CROWN-7-platform-super-admin/contracts/platform-shell-ui-contract.md`
  - `specs/CROWN-7-platform-super-admin/contracts/platform-role-entry-contract.md`

## 2. Validate shell scope

- Confirm the feature is limited to the platform super-admin shell, not full tenant UI delivery.
- Confirm the shell remains the main-app control plane for `super_admin`.
- Confirm all copy and orientation content reflects the management-system pivot rather than CRM wording.

## 3. Prepare implementation test matrix

- Browser behavior checks:
  - `super_admin` reaches the platform shell
  - non-super-admin roles do not remain in the shell
  - shell renders meaningful navigation and overview content
- Content checks:
  - no CRM framing in shell headings, labels, or empty states
  - tenant-facing “powered by Crown” phrasing is not reused as platform shell framing
- Responsive checks:
  - primary shell remains usable on desktop and mobile widths

## 4. Ready state for `/speckit.tasks`

Proceed to task decomposition when:

- No unresolved clarifications remain in `research.md`.
- The UI and role-entry contracts are accepted.
- Jira wording drift is understood and, if needed, queued for confirmation with the user before Jira updates.

## 5. Implementation notes

- `apps/web/app/page.tsx` is currently a minimal placeholder and is the likely entry point for the first shell implementation.
- `apps/web/tests/smoke.spec.ts` already exists and can be expanded for shell-level behavior validation.
- The feature should preserve a clear split between platform control-plane presentation and tenant workspace presentation.
- Validation commands for implementation:
  - `pnpm --filter @crown/web typecheck`
  - `pnpm --filter @crown/web exec playwright test tests/smoke.spec.ts --config=playwright.config.ts`
