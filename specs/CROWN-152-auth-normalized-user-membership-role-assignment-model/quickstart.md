# Quickstart: Using The CROWN-152 Auth Model Outputs

## Purpose

Use this feature's outputs to align follow-up schema, seed, auth, and admin work before implementation begins.

## Review Steps

1. Read [spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/spec.md) for scope, scenarios, requirements, and success criteria.
2. Read [research.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/research.md) for the key normalization decisions and rejected alternatives.
3. Read [data-model.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/data-model.md) for the target entities, role mappings, and migration outline.
4. Read [auth-normalized-model-handoff-contract.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-152-auth-normalized-user-membership-role-assignment-model/contracts/auth-normalized-model-handoff-contract.md) before planning downstream implementation stories.

## Downstream Usage

- Use `users` as the long-lived identity root when planning normalized Prisma changes.
- Use explicit platform-role assignments for `super_admin` handling.
- Use `tenant_memberships` as the tenant anchor and `tenant_membership_role_assignments` as the actual tenant authorization grant.
- Keep `tenant_memberships` even when a user has zero or many tenant-role assignments so tenant association stays separate from authorization.
- Keep `ManagementSystemTypeRole` limited to availability/default configuration during schema and API design.
- Keep `tenant_admin` as the canonical auth role code and treat `Admin` as a display label only.
- Preserve one effective tenant role per session while current JWT and RBAC contracts still expect one `role` and one optional `tenant_id`.

## Validation Command

```bash
pnpm specify.audit
```

## Review Completion Signal

The feature is ready for `/speckit.tasks` once reviewers agree that:

- the target model cleanly separates identity, platform authorization, tenant membership, and tenant authorization
- platform roles and tenant roles are no longer overloaded into legacy role columns
- `tenant_memberships` clearly answers "which tenant does this user belong to?" separately from "what can this user do in that tenant?"
- management-system role templates are clearly distinct from actual user auth grants
- the role mapping for `super_admin`, `tenant_admin`, `dispatcher`, `driver`, `accountant`, and `human_resources` is unambiguous
- the staged migration path is specific enough for downstream implementation planning
