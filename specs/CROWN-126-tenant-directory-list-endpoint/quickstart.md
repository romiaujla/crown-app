# Quickstart: CROWN-126 Tenant Directory List Endpoint

## Goal

Verify that the super-admin tenant directory endpoint returns the agreed `{ data, meta }` contract and applies `search` plus `status` filtering.

## Preconditions

1. Local control-plane data includes at least:
   - one `active` tenant
   - one non-`active` tenant
2. The API app is running locally.
3. You have a valid `super_admin` bearer token.

## Manual Verification

1. Request the unfiltered directory:

```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/api/v1/platform/tenants"
```

Expected:
- `200 OK`
- response includes `data.tenantList`
- response includes `meta.totalRecords`
- response includes `meta.filters.search` and `meta.filters.status`

2. Request the directory with a name search:

```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/api/v1/platform/tenants?search=acme"
```

Expected:
- only matching tenant names are returned
- `meta.filters.search` echoes `"acme"`

3. Request the directory with a status filter:

```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3001/api/v1/platform/tenants?status=active"
```

Expected:
- only `active` tenants are returned
- `meta.filters.status` echoes `"active"`

4. Request the directory without auth or as a non-super-admin caller.

Expected:
- request is rejected with the existing protected-route error behavior

## Automated Verification

Run:

```bash
pnpm --filter @crown/api test
pnpm --filter @crown/api typecheck
pnpm specify.audit
```
