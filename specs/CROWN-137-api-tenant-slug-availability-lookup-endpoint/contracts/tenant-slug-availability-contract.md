# Contract: Tenant Slug Availability Lookup

## Route

- **Method**: `POST`
- **Path**: `/api/v1/platform/tenant/slug-availability`
- **Auth**: Bearer JWT required
- **Allowed role**: `super_admin`

## Request Shape

```json
{
  "slug": "acme-logistics"
}
```

## Request Rules

- `slug` is required.
- The API normalizes the slug using the same trim and lowercase behavior as the provisioning path before evaluating availability.
- The normalized slug must still satisfy the existing lowercase kebab-case tenant slug rule.

## Response Shape

```json
{
  "data": {
    "slug": "acme-logistics",
    "isAvailable": true
  }
}
```

## Contract Rules

- Return the normalized slug that was evaluated.
- Return `isAvailable = false` when any persisted tenant record already owns the slug.
- Keep the payload limited to the availability result; do not return tenant details or reservation metadata.
- Reject invalid slug input using the existing protected-route validation error contract.
