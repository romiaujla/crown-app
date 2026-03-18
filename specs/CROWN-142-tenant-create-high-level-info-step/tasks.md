# CROWN-142 — Tasks

## Task 1 — Add API client functions for slug availability and reference data

- [ ] In `apps/web/lib/auth/api.ts`, add `checkTenantSlugAvailability(accessToken: string, slug: string)` that calls `POST /api/v1/platform/tenant/slug-availability` and validates with `TenantSlugAvailabilityResponseSchema`
- [ ] In `apps/web/lib/auth/api.ts`, add `getTenantCreateReferenceData(accessToken: string)` that calls `POST /api/v1/platform/tenant/reference-data` and validates with `TenantCreateReferenceDataResponseSchema`
- [ ] Import required schemas/types from `@crown/types`

## Task 2 — Refactor shell state to support typed step data

- [ ] Define `TenantInfoStepData` type in `tenant-create-shell.tsx` (`name: string`, `slug: string`, `managementSystemTypeCode: ManagementSystemTypeCodeEnum | null`)
- [ ] Add `tenantInfoData` state with initial values (`name: ''`, `slug: ''`, `managementSystemTypeCode: null`)
- [ ] Add `referenceData` state and loading flag; fetch on mount via `getTenantCreateReferenceData`
- [ ] Compute `downstreamDataExists` from step 2–4 `stepInputByKey` entries
- [ ] Update `hasUnsavedChanges` to also check `tenantInfoData` fields

## Task 3 — Build tenant-info step component

- [ ] Create `apps/web/components/platform/tenant-create-step-tenant-info.tsx`
- [ ] Implement tenant name input with label, 2–120 char validation, field error display
- [ ] Implement tenant slug input with label, auto-derivation from name, manual override toggle
- [ ] Add slug immutability warning banner ("The tenant slug cannot be changed after creation")
- [ ] Implement debounced (400ms) slug availability check with status indicators (checking/available/taken/invalid)
- [ ] Implement management-system type select populated from `referenceData.managementSystemTypeList`
- [ ] Implement downstream-reset warning when management-system type changes and `downstreamDataExists` is true
- [ ] Wire `data`/`onChange` props for controlled form state

## Task 4 — Wire step component into shell

- [ ] Conditionally render `TenantCreateStepTenantInfo` when step key is `TENANT_INFO`
- [ ] Keep existing placeholder markup for steps 2–4
- [ ] Pass all required props (`data`, `onChange`, `referenceData`, `referenceDataLoading`, `downstreamDataExists`)
- [ ] Update card header description text to remove placeholder language for step 1

## Task 5 — Update Playwright tests

- [ ] Add API route mocks for slug-availability and reference-data endpoints
- [ ] Update existing step-navigation test to work with real form fields
- [ ] Add test: fills tenant name, verifies slug auto-derives
- [ ] Add test: slug immutability warning is visible
- [ ] Add test: slug availability indicator appears after typing
- [ ] Add test: management-system type select shows options from reference data
- [ ] Preserve existing cancel/discard protection tests

## Task 6 — Typecheck and commit

- [ ] Run `pnpm --filter @crown/web typecheck`
- [ ] Run `pnpm --filter @crown/web test`
- [ ] Commit all changes with `feat: CROWN-142 - implement tenant create high-level info step`
- [ ] Push branch
