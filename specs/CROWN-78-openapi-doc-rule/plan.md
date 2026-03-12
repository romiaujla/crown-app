# Implementation Plan: Require OpenAPI Document Updates For API Route Changes

**Branch**: `feat/CROWN-78-openapi-doc-rule` | **Date**: 2026-03-11 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-78-openapi-doc-rule/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-78-openapi-doc-rule/spec.md)
**Input**: Feature specification from `/specs/CROWN-78-openapi-doc-rule/spec.md`

## Summary

Codify a repo-wide workflow rule that any API route creation, update, or removal must keep the manual OpenAPI source in `apps/api/src/docs/openapi.ts` in sync. Implement that rule in `AGENTS.md`, the engineering constitution, and the Spec Kit workflow guidance, then validate the documentation changes with focused repository checks.

## Technical Context

**Language/Version**: Markdown repository policy/process docs on a TypeScript/Node.js monorepo baseline  
**Primary Dependencies**: Existing repo governance docs, Spec Kit workflow docs, and the current manual OpenAPI source at `apps/api/src/docs/openapi.ts`  
**Storage**: N/A  
**Testing**: Focused review of changed docs plus any repo checks appropriate for documentation/process changes; `pnpm --filter @crown/api exec tsc -p tsconfig.typecheck.json --noEmit` is sufficient runtime validation if code references are untouched  
**Target Platform**: Repository contributors and AI agents working in the monorepo  
**Project Type**: Process/governance documentation update  
**Performance Goals**: Guidance should be discoverable and unambiguous with no meaningful runtime impact  
**Constraints**: Must reflect the current manual OpenAPI maintenance model accurately; must stay scoped to repo guidance rather than automated enforcement; must align with the constitution and not create competing policy sources  
**Scale/Scope**: One story touching a small set of repo workflow files plus planning artifacts and focused validation

## CROWN-78 Implementation Outline

- Add an explicit OpenAPI-maintenance rule to `AGENTS.md`.
- Add the same requirement to the engineering constitution as a repository standard.
- Add a Spec Kit workflow note that API route changes must keep `apps/api/src/docs/openapi.ts` aligned.
- Verify the resulting guidance is internally consistent and does not imply automatic OpenAPI generation.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Branch naming: PASS. `feat/CROWN-78-openapi-doc-rule` matches the constitution for a Story.
- Commit/PR convention: PASS. Work on this branch will use `feat: CROWN-78 - ...` subjects and a squash-safe PR title.
- Planning gate: PASS. `CROWN-78` is progressing through `specify`, `plan`, and `tasks` before implementation.
- Testing discipline: PASS. The story is process documentation work, so focused validation of the touched files and any impacted repo checks is sufficient.
- Scope control: PASS. The plan is limited to repository guidance and does not widen into automation or product-surface changes.
- Policy precedence: PASS. The plan updates the canonical policy sources instead of creating alternate rule documents.

Post-design re-check: PASS. The design keeps the rule aligned across the existing governance hierarchy: constitution, AGENTS, and Spec Kit workflow guidance.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-78-openapi-doc-rule/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi-doc-rule-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
AGENTS.md
docs/
└── process/
    ├── engineering-constitution.md
    └── spec-kit-workflow.md

apps/api/
└── src/
    └── docs/
        └── openapi.ts
```

**Structure Decision**: `CROWN-78` is a documentation/process change only. The implementation surface is confined to the repository’s policy and workflow docs, with `apps/api/src/docs/openapi.ts` referenced as the manual OpenAPI source of truth.

## Complexity Tracking

No constitutional violations require exception rationale for this feature.
