# CROWN-142 — Plan

## Overview

Replace the placeholder step 1 in the tenant-create wizard with a real form capturing tenant name, slug (with auto-derivation and availability check), and management-system type (fetched from reference-data API). Wire the form into shell state so downstream steps can consume it.

## Implementation Phases

### Phase 1 — API client functions

Add two new exported functions in `apps/web/lib/auth/api.ts`:

1. `checkTenantSlugAvailability(accessToken, slug)` — calls `POST /api/v1/platform/tenant/slug-availability`, validates response with `TenantSlugAvailabilityResponseSchema`
2. `getTenantCreateReferenceData(accessToken)` — calls `POST /api/v1/platform/tenant/reference-data`, validates response with `TenantCreateReferenceDataResponseSchema`

Both follow the established `request()` + Zod pattern.

### Phase 2 — Shell state refactor

In `tenant-create-shell.tsx`:

- Define `TenantInfoStepData` type (`name`, `slug`, `managementSystemTypeCode`)
- Add `tenantInfoData` state (replaces the generic `stepInputByKey` for step 1)
- Keep `stepInputByKey` for steps 2–4 until those stories ship
- Update `hasUnsavedChanges` to include `tenantInfoData` fields
- Add a `downstreamDataExists` computed boolean (true when any step 2–4 data is non-empty)

### Phase 3 — Tenant info step component

Create `apps/web/components/platform/tenant-create-step-tenant-info.tsx`:

**Props:**

- `data: TenantInfoStepData`
- `onChange: (update: Partial<TenantInfoStepData>) => void`
- `referenceData: TenantCreateReferenceData | null` (loaded from parent)
- `referenceDataLoading: boolean`
- `downstreamDataExists: boolean`

**Fields:**

1. **Tenant name** — `<Input>` with `<Label>`, validates 2–120 chars on blur
2. **Tenant slug** — `<Input>` with auto-derive from name, manual override support, inline availability indicator
3. **Management-system type** — `<Select>` populated from `referenceData.managementSystemTypeList`

**Behaviors:**

- Slug auto-derives from name until user manually edits the slug field
- Debounced (400ms) slug availability check using `checkTenantSlugAvailability`
- Inline slug status: idle, checking (spinner), available (green check), taken (red X), invalid (format error)
- Persistent info banner: "The tenant slug cannot be changed after creation"
- Downstream-reset warning dialog when management-system type changes and `downstreamDataExists` is true

### Phase 4 — Wire step component into shell

- Conditionally render `TenantCreateStepTenantInfo` when `currentStepKey === TENANT_INFO`, or the existing placeholder markup for other steps
- Fetch reference data on mount with `useEffect` + `getTenantCreateReferenceData`
- Pass `tenantInfoData`, `onChange`, `referenceData`, `referenceDataLoading`, and `downstreamDataExists` as props

### Phase 5 — Playwright test updates

In `apps/web/tests/auth-flow.spec.ts`:

- Mock `POST /api/v1/platform/tenant/slug-availability` and `POST /api/v1/platform/tenant/reference-data` in test setup
- Update existing step-navigation test to use real form fields instead of placeholder input
- Add test: fills name, verifies slug auto-derives, checks availability status appears
- Add test: slug immutability warning is visible
- Add test: changing management-system type with downstream data shows reset warning
- Preserve existing cancel/discard tests

## Risks & Mitigations

| Risk                                 | Mitigation                                                                   |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| Slug availability endpoint times out | Show "Unable to verify" fallback; do not block navigation                    |
| Reference-data fetch fails           | Show inline error with retry; management-system type select remains disabled |
| Flaky debounce timing in Playwright  | Use `waitForResponse` to synchronize on mocked API calls                     |

## File Change Summary

| File                                                              | Change                                                               |
| ----------------------------------------------------------------- | -------------------------------------------------------------------- |
| `apps/web/lib/auth/api.ts`                                        | Add `checkTenantSlugAvailability` and `getTenantCreateReferenceData` |
| `apps/web/components/platform/tenant-create-shell.tsx`            | Refactor state, conditional rendering for step 1                     |
| `apps/web/components/platform/tenant-create-step-tenant-info.tsx` | **New** — step 1 form component                                      |
| `apps/web/tests/auth-flow.spec.ts`                                | Add API mocks and step 1 form tests                                  |
