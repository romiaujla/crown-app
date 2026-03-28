# Implementation Plan: UI Guidelines For Web-v2 Component Library

**Branch**: `feat/CROWN-177-ui-guidelines-web-v2-component-library` | **Date**: 2026-03-28 | **Spec**: [/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-177-ui-guidelines-web-v2-component-library/spec.md](/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-177-ui-guidelines-web-v2-component-library/spec.md)
**Input**: Feature specification from `/specs/CROWN-177-ui-guidelines-web-v2-component-library/spec.md`

## Summary

Update `docs/process/ui-guidlines.md` so the web-v2 guidance behaves like a usable design-system reference for Crown’s management UI. The plan adds a reusable component catalog, a wireframe-first workflow anchored to the UI agent, a design-token reference grounded in `apps/web/app/globals.css`, a richer Rich Table pattern section, and explicit guidance for Toggle, Multi-toggle, Breadcrumb, Skeleton, and Empty State. The work stays documentation-only but should be implementation-ready enough to guide future web delivery without forcing engineers to reverse-engineer patterns from source.

## Technical Context

**Language/Version**: Markdown documentation in a TypeScript 5.x / Node.js 20 monorepo  
**Primary Dependencies**: Repository process docs, `.github/agents/ui-ux.agent.md`, `apps/web/app/globals.css` token definitions  
**Storage**: N/A  
**Testing**: Documentation review, `prettier` formatting, `pnpm specify.audit`, commit-hook validation  
**Target Platform**: Repository process documentation for `apps/web` contributors  
**Project Type**: Monorepo documentation/process update  
**Performance Goals**: Contributors should be able to identify the correct UI pattern or workflow step within a few sections of the guideline doc without cross-referencing multiple files  
**Constraints**: Stay aligned with `docs/process/engineering-constitution.md`, do not widen into implementation changes, keep guidance consistent with existing stack and actual token names, preserve the current document’s role as UI guidance rather than governance replacement  
**Scale/Scope**: One process document update plus `CROWN-177` Spec Kit artifacts

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Jira traceability and branch policy: PASS. `CROWN-177` is a Story and the active branch follows `feat/CROWN-<id>-<slug>`.
- Planning gate: PASS. `spec.md` exists before implementation changes begin.
- Scope discipline: PASS. Work is limited to UI-guideline documentation and `CROWN-177` Spec Kit artifacts.
- Testing discipline: PASS. The plan includes formatting/audit validation and review against explicit doc requirements.
- Process precedence: PASS. The update extends `docs/process/ui-guidlines.md` without conflicting with the engineering constitution or tagged workflow contract.
- UI-system alignment: PASS. The plan grounds new guidance in the existing UI stack, token source, and UI-agent workflow expectations.

Post-design re-check: PASS. Planned additions clarify component and workflow guidance without introducing code changes or conflicting process rules.

## Research Notes

- Ground token guidance in `apps/web/app/globals.css` so the documentation references actual CSS variables such as `--surface`, `--surface-strong`, `--surface-border`, and `--tenant-accent`.
- Use `.github/agents/ui-ux.agent.md` as the workflow and pattern reference for table-first CRM design, rich table expectations, empty states, breadcrumbs, skeleton-first loading behavior, and action hierarchy.
- Reorganize `docs/process/ui-guidlines.md` so the new component library catalog and workflow guidance are easy to scan instead of burying new rules inside unrelated sections.
- Keep the Rich Table section additive to the existing table guidance by expanding from general principles into a concrete enterprise list-view pattern.
- Treat Empty State and Skeleton guidance as part of a broader state-clarity goal so the document reinforces loading, empty, and filtered-empty behavior consistently.

## Project Structure

### Documentation (this feature)

```text
specs/CROWN-177-ui-guidelines-web-v2-component-library/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-guidelines-update-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
docs/
└── process/
    ├── engineering-constitution.md
    └── ui-guidlines.md

.github/
└── agents/
    └── ui-ux.agent.md

apps/
└── web/
    └── app/
        └── globals.css
```

**Structure Decision**: Keep implementation centered in `docs/process/ui-guidlines.md`, using the UI-agent guide and `apps/web/app/globals.css` only as reference sources. No production code or component files need to change for this story.

## Complexity Tracking

No constitution violations are expected for `CROWN-177`.
