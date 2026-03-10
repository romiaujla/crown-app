# Quickstart: Using The CROWN-29 Model Outputs

## Purpose

Use this feature’s outputs to align downstream schema, seed, and validation work before implementation begins.

## Review Steps

1. Read [spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/spec.md) for scope, scenarios, requirements, and success criteria.
2. Read [research.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/research.md) for the decisions behind the foundational TMS-oriented model.
3. Read [data-model.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/data-model.md) for the proposed entity set, relationships, and boundary rules.
4. Read [tenant-model-handoff-contract.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-29-tenant-domain-model/contracts/tenant-model-handoff-contract.md) before planning `CROWN-30` through `CROWN-34`.

## Downstream Usage

- Use the `data-model.md` entity set as the baseline for migration planning in `CROWN-30`.
- Use the explicit `core` versus `tenant_<tenant_slug>` placement rules before assigning tables to shared or tenant schemas in `CROWN-30`.
- Use the reference-data and fixture-key rules for deterministic seed design in `CROWN-31`.
- Use the stable fixture expectations to keep `CROWN-32` local seed implementation predictable and rerunnable.
- Use the fixture profile and multi-tenant boundary guidance when integrating local/test workflows in `CROWN-33`.
- Use the deterministic-key expectations when defining validation coverage in `CROWN-34`.

## Validation Command

```bash
pnpm specify.audit
```

## Review Completion Signal

The feature is ready for `/speckit.tasks` once reviewers agree that:

- the foundational tenant entities are sufficient for the next TMS baseline
- shared `core` concerns versus tenant-schema concerns are explicit
- reference data and seeded fixture boundaries are explicit
- deterministic fixture identifiers are defined where later seed/test workflows need them
- later capability behavior remains intentionally out of scope
