# Quickstart: Using The CROWN-34 Validation Outputs

## Purpose

Use this feature’s outputs to verify that the canonical seed and bootstrap foundation remains deterministic, rerunnable, and understandable for contributors and later automated workflows.

## Review Steps

1. Read [spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/spec.md) for scope, scenarios, requirements, and success criteria.
2. Read [plan.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/plan.md) for validation scope, constraints, and implementation surfaces.
3. Read [research.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/research.md) for decisions on deterministic keys, preserved boundaries, and setup guidance.
4. Read [data-model.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/data-model.md) for validation objects and completed-state expectations.
5. Read [validation-setup-contract.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-34-seed-validation-expectations/contracts/validation-setup-contract.md) before breaking implementation into tasks.

## Implementation Guidance

- Reuse the current canonical local seed and bootstrap workflows instead of introducing a new setup path.
- Validate seeded records through stable business identifiers, slugs, and seeded email addresses rather than generated IDs.
- Keep preserved-boundary assertions explicit for unrelated tenants and unrelated platform records.
- Make the contributor choice between `pnpm db:bootstrap:local` and `pnpm db:seed:local` direct and unambiguous.
- Keep later automated workflow guidance tied to the same canonical baseline and validation contract.

## Validation Focus

- deterministic seeded lookups across repeated reruns
- preserved unrelated tenant and platform data outside the reset boundary
- aligned validation across direct reseeding and repository-level bootstrap
- contributor-facing guidance for bootstrap versus reseed command choice
- later workflow reuse of the same canonical setup contract

## Validation Commands

```bash
pnpm --filter @crown/api typecheck
pnpm --filter @crown/api exec vitest
pnpm specify.audit
```

## Review Completion Signal

The feature is ready for `/speckit.tasks` once reviewers agree that:

- canonical seeded lookup keys are validated through stable business identifiers
- preserved-boundary behavior is explicit and reviewable
- bootstrap and reseed guidance are clearly distinguished
- later automated workflows can reuse one canonical setup-and-validation contract
