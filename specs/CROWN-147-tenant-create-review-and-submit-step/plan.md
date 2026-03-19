# Implementation Plan: Tenant Create Review And Submit Step

**Branch**: `feat/CROWN-147-tenant-create-review-and-submit-step` | **Date**: 2026-03-19 | **Spec**: [spec.md](/specs/CROWN-147-tenant-create-review-and-submit-step/spec.md)
**Input**: Feature specification from `/specs/CROWN-147-tenant-create-review-and-submit-step/spec.md`

## Summary

Replace the placeholder step 4 in the tenant-create wizard with a read-only review-and-submit experience. The tenant-create shell will derive a validated onboarding payload from the existing step-1 through step-3 draft state, a new review-step component will render the summary and warnings, the web auth API client will call the existing `POST /api/v1/platform/tenant` route, and Playwright coverage will verify success, blocking validation, and retry-safe error handling.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Next.js 14 App Router, React 18  
**Primary Dependencies**: shadcn/ui primitives (`Alert`, `Badge`, `Button`, `Card`, `Table`-style layout via existing primitives), Tailwind CSS, `lucide-react`, `@crown/types`  
**Storage**: Client-side React state in the existing shell; backend provisioning continues through the existing platform API and PostgreSQL-backed services  
**Testing**: Playwright E2E in `apps/web/tests/auth-flow.spec.ts`, `pnpm --filter @crown/web typecheck`, `pnpm specify.audit`  
**Target Platform**: Super-admin control-plane web app  
**Project Type**: Monorepo web application  
**Performance Goals**: Review step remains client-side and responsive; submission shows immediate in-flight feedback without duplicate requests  
**Constraints**: Reuse the existing onboarding request/response schemas; no new API route; preserve wizard draft state on failure; keep the review step read-only  
**Scale/Scope**: One new step-4 component, shell submit-state wiring, a web API client addition, and focused browser test updates

## Implementation Approach

1. **Add the onboarding submission client** — `apps/web/lib/auth/api.ts`
   - Export `submitTenantCreateOnboarding(accessToken, input)`.
   - Validate request and response with `TenantCreateOnboardingSubmissionRequestSchema` and `TenantCreateOnboardingSubmissionResponseSchema`.
   - Reuse the existing `request()` helper and auth header pattern.

2. **Create the review-step component** — `apps/web/components/platform/tenant-create-step-review.tsx`
   - Presentational component that receives:
     - read-only tenant info
     - selected role metadata
     - grouped assignment drafts
     - derived submission validity flags
     - submit-state and API error messaging
   - Render four visually distinct sections aligned to the Jira wireframe and UI guidelines:
     - tenant info summary
     - selected roles summary
     - tenant-admin table
     - per-role assignment tables or empty states
   - Show one blocking validation panel for missing/invalid admin coverage and one non-blocking warning for unstaffed optional roles.

3. **Wire review and submit state into the shell** — `apps/web/components/platform/tenant-create-shell.tsx`
   - Derive a normalized onboarding payload from `tenantInfoData`, `selectedRoleCodes`, and assignment drafts.
   - Reuse existing assignment validation so step 4 reflects the same blocking rules as step 3.
   - Add submit state (`idle` / `submitting` / `error`) plus API error text.
   - Replace the step-4 placeholder with `TenantCreateStepReview`.
   - Disable cancel, back, next/create, and stepper clicks during submission.
   - On success, show a success toast and route to `/platform/tenants/${slug}`.

4. **Extend browser coverage** — `apps/web/tests/auth-flow.spec.ts`
   - Add a step-4 summary test that verifies read-only sections reflect current draft state.
   - Add a successful submission test that mocks `POST /platform/tenant`, verifies loading treatment, and confirms redirect to the tenant detail route.
   - Add a failure test that mocks a 409/500 response, verifies the error alert, and confirms the draft remains on step 4 for retry/back navigation.

## Constitution Check

- Branch naming: PASS — `feat/CROWN-147-tenant-create-review-and-submit-step` matches the Story branch convention.
- Commit/PR convention: PASS — commits must use `feat: CROWN-147 - ...` and the final PR title must remain squash-safe.
- Planning gate: PASS — `CROWN-147` is following the required `specify -> plan -> tasks -> implementation` sequence.
- Shared contract discipline: PASS — the plan reuses `TenantCreateOnboardingSubmissionRequestSchema` and `TenantCreateOnboardingSubmissionResponseSchema` from `@crown/types`.
- API/OpenAPI discipline: PASS — no API route contract changes are planned; existing route wiring is reused.
- UI guideline discipline: PASS — the new step follows the existing shell structure, uses visible headings/labels, and keeps one primary action in the sticky footer.
- Testing discipline: PASS — the plan includes focused Playwright coverage, web typecheck, and `pnpm specify.audit`.
- Scope discipline: PASS — work remains limited to the step-4 review/submit experience and frontend submission wiring.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-147-tenant-create-review-and-submit-step/
├── spec.md
├── plan.md
└── tasks.md
```

### Source Code (changed files)

```text
apps/web/
├── components/platform/
│   ├── tenant-create-shell.tsx        (modified — review step wiring, submission state)
│   └── tenant-create-step-review.tsx  (new — step 4 review and submit UI)
├── lib/auth/
│   └── api.ts                         (modified — onboarding submission client)
└── tests/
    └── auth-flow.spec.ts              (modified — step 4 review and submit coverage)
```

**Structure Decision**: Keep `CROWN-147` fully inside `apps/web`. The backend provisioning route and shared onboarding contracts already exist, so the cleanest delivery is one new presentational step component plus shell wiring, API-client reuse, and browser coverage.

## Complexity Tracking

No constitutional violations or exceptions required.
