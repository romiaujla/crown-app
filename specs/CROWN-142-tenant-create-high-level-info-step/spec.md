# CROWN-142 — Tenant Create High-Level Info Step (Step 1/4)

## Problem

The guided tenant-create flow has a placeholder first step with no real form fields. Super admins cannot yet enter the basic tenant information required to proceed to role selection, user assignment, and review.

## Goal

Replace the placeholder input in step 1 of the tenant-create wizard with a real form that captures tenant name, slug, and management-system type — including slug-availability feedback and a downstream-reset warning when management-system type changes.

## User Story

As a super admin, I want to enter the tenant's basic setup information first so that the later onboarding steps can build on a clear tenant context.

## Acceptance Criteria

| #    | Criterion                                                                                                                                         | Verification        |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| AC-1 | Step 1 captures **tenant name**, **slug**, and **management-system type**                                                                         | Manual + Playwright |
| AC-2 | A persistent warning informs the user that **tenant slug cannot be changed** after creation                                                       | Manual + Playwright |
| AC-3 | Slug field integrates **slug-availability feedback** by calling `POST /api/v1/platform/tenant/slug-availability` (CROWN-137) with debounced input | Manual + Playwright |
| AC-4 | If the user changes **management-system type** after downstream step data exists, the UI warns that later selections may reset                    | Manual + Playwright |
| AC-5 | The story is limited to step 1; it does **not** implement role selection, user assignment, or final submission                                    | Code review         |

## Scope

### In scope

- Tenant name text input with validation (2–120 characters, trimmed)
- Tenant slug text input with validation (1–48 chars, kebab-case per `TenantSlugSchema`)
- Auto-derivation of slug from tenant name (user can override)
- Slug immutability warning (persistent info banner)
- Debounced slug availability check via `POST /api/v1/platform/tenant/slug-availability`
- Availability status indicator (available / taken / checking / invalid)
- Management-system type select populated from `POST /api/v1/platform/tenant/reference-data`
- Downstream-reset warning when management-system type changes and step 2+ data exists
- Step 1 form data lifted into the shell-level state so later steps can consume it
- API client functions for slug-availability and reference-data endpoints in `apps/web/lib/auth/api.ts`
- Updated Playwright tests for the real step 1 form replacing the placeholder assertions
- Discard-progress protection preserved for the real form fields

### Out of scope

- Role selection (step 2)
- User assignment (step 3)
- Review & submit (step 4)
- Tenant provisioning API calls
- OpenAPI changes (no new API routes)

## Dependencies

| Dependency                               | Status |
| ---------------------------------------- | ------ |
| CROWN-137 — Slug availability endpoint   | Merged |
| CROWN-141 — Reference-data endpoint      | Merged |
| CROWN-140 — Management-system type model | Merged |
| CROWN-161 — Reusable stepper component   | Merged |

## Technical Context

### Existing infrastructure

- **Shell**: `apps/web/components/platform/tenant-create-shell.tsx` — 4-step wizard with `TenantCreateStepKeyEnum`, stepper, back/next/cancel navigation, and `beforeunload` protection
- **Stepper**: `apps/web/components/ui/stepper.tsx` — clickable stepper with step states
- **UI primitives**: Input, Label, Select (Radix), Button, Card components in `apps/web/components/ui/`
- **API pattern**: `request()` helper in `apps/web/lib/auth/api.ts` — fetch + Zod `.parse()` validation
- **Shared types**: `@crown/types` exports `TenantSlugSchema`, `ManagementSystemTypeCodeEnum`, `TenantSlugAvailabilityRequestSchema`, `TenantSlugAvailabilityResponseSchema`, `TenantCreateReferenceDataRequestSchema`, `TenantCreateReferenceDataResponseSchema`
- **Form pattern**: Manual `useState` + field-error objects (no react-hook-form), as established in `login-form.tsx`

### Slug auto-derivation logic

Convert tenant name to slug candidate:

1. Trim and lowercase
2. Replace non-alphanumeric runs with a single hyphen
3. Strip leading/trailing hyphens
4. Truncate to 48 characters

User can override the auto-derived slug at any time; once manually edited, auto-derivation stops until the slug field is cleared.

### Debounced slug availability

- Debounce interval: 400ms after the user stops typing
- Only check when slug matches `TenantSlugSchema` format
- Show inline status: spinner while checking, green check if available, red X if taken
- Do not block form navigation; availability is advisory in step 1

### Management-system type options

Fetched once on step 1 mount from `POST /api/v1/platform/tenant/reference-data`. The response provides `managementSystemTypeList` with `typeCode`, `displayName`, and `description`. The select renders `displayName` as the label and `typeCode` as the value.

### State shape

The shell-level state gains a typed `tenantInfoData` object:

```typescript
type TenantInfoStepData = {
  name: string;
  slug: string;
  managementSystemTypeCode: ManagementSystemTypeCodeEnum | null;
};
```

This replaces the generic `stepInputByKey` for step 1, while steps 2–4 remain placeholders.
