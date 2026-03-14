# Quickstart: Versioned Management-System Type And Shared Role Catalog Model

## Review Order

1. Read [spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/spec.md)
2. Read [data-model.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/data-model.md)
3. Read [contracts/management-system-type-role-template-contract.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-140-tenant-management-system-type-default-role-template-model/contracts/management-system-type-role-template-contract.md)

## Implementation Touchpoints

- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/`
- `apps/api/prisma/seed/`
- `apps/api/tests/integration/`

## Validation Focus

- versioned management-system types
- shared role catalog
- correct type-to-role junction rows
- correct `is_default` flags
- idempotent rerun behavior
