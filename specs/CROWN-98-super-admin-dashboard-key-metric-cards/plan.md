# Implementation Plan: UI Super Admin Dashboard Key Metric Cards

**Branch**: `feat/CROWN-98-super-admin-dashboard-key-metric-cards` | **Date**: 2026-03-13 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-98-super-admin-dashboard-key-metric-cards/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-98-super-admin-dashboard-key-metric-cards/spec.md)
**Input**: Feature specification from `/specs/CROWN-98-super-admin-dashboard-key-metric-cards/spec.md`

## Summary

Extend the existing protected `/platform` dashboard so `CROWN-98` renders the first super-admin key metric cards from the already-aligned overview API contract. Keep the current control-plane shell and auth flow intact, elevate total tenants and total users into prominent cards, add week/month/year cards for new-tenant counts and tenant growth rates using the `CROWN-119` definitions, and preserve readable loading/error states plus room for follow-on dashboard widgets.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20, Next.js 14 App Router, React 18  
**Primary Dependencies**: Next.js App Router, React, Tailwind CSS, Lucide React, Zod 4, Playwright  
**Storage**: N/A for the web layer directly; consumes the existing protected platform overview API  
**Testing**: `pnpm --filter @crown/web test`, `pnpm --filter @crown/web typecheck`, `pnpm specify.audit`  
**Target Platform**: `apps/web` protected super-admin dashboard at `/platform`  
**Project Type**: Monorepo web frontend consuming an existing API contract  
**Performance Goals**: Keep dashboard rendering to one overview request with lightweight client-side formatting only  
**Constraints**: Preserve `super_admin` access boundaries, keep labels aligned to `CROWN-119` metric definitions, avoid widening into unrelated dashboard sections, preserve current loading/error behavior, and keep the layout readable on desktop and mobile widths  
**Scale/Scope**: One dashboard page enhancement, small supporting UI helpers/formatters, aligned Playwright coverage, and the `CROWN-98` Spec Kit artifacts

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Jira traceability and branch policy: PASS. `CROWN-98` is a Story and the active branch matches `feat/CROWN-<id>-<slug>`.
- Planning gate: PASS. `spec.md` exists before implementation work begins.
- Scope discipline: PASS. Work is limited to the existing platform dashboard page, supporting UI presentation helpers, aligned browser coverage, and `CROWN-98` feature docs.
- Testing discipline: PASS. The plan includes focused web validation for successful rendering plus error-state behavior.
- API/OpenAPI discipline: PASS. No API route surface changes are planned in this story; `CROWN-119` remains the contract source.
- Auth boundary discipline: PASS. The design reuses the current protected-shell behavior and does not alter auth routing rules.

Post-design re-check: PASS. The design keeps the story inside the dashboard home, consumes the existing overview contract, and avoids unrelated shell or auth changes.

## Research Notes

- Reuse the current `DashboardOverviewSection` request flow instead of adding a second dashboard fetch path.
- Promote the new metric-card content ahead of the tenant-status breakdown so the requested platform totals and trend windows become the first visual focus.
- Keep the time-window copy grounded in the `CROWN-119` contract by referring to trailing week, month, and year windows rather than inventing calendar-based labels.
- Format growth-rate values in the web layer for readability while preserving the API-provided numeric meaning.
- Keep the tenant-status breakdown available as supporting context so the earlier `CROWN-93` dashboard work remains present without competing with the new cards.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-98-super-admin-dashboard-key-metric-cards/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── dashboard-metric-cards-ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/web/
├── app/
│   └── platform/
│       └── page.tsx
├── lib/
│   └── auth/
│       ├── api.ts
│       └── types.ts
└── tests/
    └── auth-flow.spec.ts
```

**Structure Decision**: Keep the implementation centered in the existing platform dashboard page. Reuse the current overview API client and schemas, adjust only the presentation and formatting logic needed for the new metric cards, and verify the user-visible behavior through the existing Playwright auth/dashboard flow coverage.

## Complexity Tracking

No constitution violations are expected for `CROWN-98`.
