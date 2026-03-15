# Quickstart: Using The CROWN-153 Schema Outputs

## Purpose

Use this feature’s outputs to implement and review the normalized control-plane schema safely.

## Review Steps

1. Read [spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-153-normalize-control-plane-schema-users-memberships-role-assignments/spec.md) for scope, requirements, and success criteria.
2. Read [data-model.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-153-normalize-control-plane-schema-users-memberships-role-assignments/data-model.md) for the target tables, relationships, and compatibility notes.
3. Read [normalized-control-plane-schema-contract.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-153-normalize-control-plane-schema-users-memberships-role-assignments/contracts/normalized-control-plane-schema-contract.md) before widening into downstream auth or admin work.

## Implementation Focus

- Update `apps/api/prisma/schema.prisma` first.
- Generate and inspect the migration SQL before treating the schema change as final.
- Update seed/auth-support code only as needed to keep validation meaningful against the new schema.
- Preserve the distinction between `tenant_memberships` and `tenant_membership_role_assignments`.

## Validation Command

```bash
pnpm specify.audit
```

## Review Completion Signal

The feature is ready for implementation review once reviewers agree that:

- the normalized tables and relations exist in Prisma and migration SQL
- platform roles and tenant roles are separated
- tenant membership and tenant authorization are separated
- management-system role templates remain configuration only
- seed and focused auth-support validation reflect the new schema shape
