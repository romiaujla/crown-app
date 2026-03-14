# Quickstart: Tenant Management-System Type And Default Role Template Model

## Review Flow

1. Read [spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/spec.md) for the scope, assumptions, and acceptance criteria.
2. Read [research.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/research.md) for the control-plane placement and bootstrap-metadata decisions.
3. Read [data-model.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/data-model.md) for the entity, enum, and baseline-catalog definitions.
4. Read [contracts/management-system-type-role-template-contract.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/contracts/management-system-type-role-template-contract.md) for the persisted baseline contract that later onboarding stories should consume.

## Implementation Touchpoints

- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/`
- `apps/api/prisma/seed/constants.ts`
- `apps/api/prisma/seed/control-plane.ts`
- `apps/api/prisma/seed/types.ts`
- `apps/api/tests/integration/`

## Validation Focus

- Confirm the new models live in the control-plane Prisma schema rather than tenant schemas.
- Confirm each approved management-system type has deterministic baseline records.
- Confirm each type owns related default role templates with stable `role_code` values.
- Confirm the required `admin` template is explicitly marked as required and mapped to the v1 `tenant_admin` bootstrap path.
- Confirm local seed reruns preserve idempotent behavior while keeping the baseline catalog present.
