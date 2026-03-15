# Data Model: API Tenant Slug Availability Lookup Endpoint

## Tenant Slug Availability Request

- **Purpose**: The top-level request payload sent by the tenant-create flow to evaluate one candidate slug.
- **Shape**:
  - `slug`
- **Rules**:
  - Carries one slug candidate per request.
  - Uses the same normalization and validation semantics as the provisioning path before lookup is evaluated.

## Tenant Slug Availability Result

- **Purpose**: The top-level response payload returned after evaluating one normalized slug candidate.
- **Shape**:
  - `data.slug`
  - `data.isAvailable`
- **Rules**:
  - `data.slug` reflects the normalized slug that was actually evaluated.
  - `data.isAvailable = true` only when no persisted tenant record currently owns that slug.
  - Does not include tenant metadata, reservation tokens, or mutation-oriented fields.

## Tenant Catalog Record

- **Purpose**: The persisted control-plane tenant record used to determine whether the checked slug is already taken.
- **Relevant Fields**:
  - `slug`
  - `status`
- **Rules**:
  - Any retained record that owns the normalized slug makes the candidate unavailable.
  - Lifecycle status does not reopen the slug for reuse in this story.
