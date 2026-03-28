# Research: CROWN-177 UI Guidelines For Web-v2 Component Library

## Decision 1: Use `docs/process/ui-guidlines.md` as the single implementation target

- **Decision**: Keep the story’s implementation limited to extending `docs/process/ui-guidlines.md`.
- **Rationale**: Jira names that file as the deliverable, and the engineering constitution requires scope discipline.
- **Alternatives considered**:
  - Split guidance across new markdown files: rejected because it would make discovery harder and drift from the stated deliverable.
  - Encode guidance only in `.github/agents/ui-ux.agent.md`: rejected because the agent file is a helper source, not the durable process document named by Jira.

## Decision 2: Ground token guidance in existing CSS variables

- **Decision**: Reference `apps/web/app/globals.css` as the authoritative token source for the new design-token section.
- **Rationale**: The story specifically asks for a token reference from `globals.css`, and grounding the doc in real token names avoids aspirational or stale guidance.
- **Alternatives considered**:
  - Document abstract token categories without file references: rejected because reviewers could not verify whether the guidance matches implementation reality.

## Decision 3: Import table-first and state-clarity guidance from the UI agent

- **Decision**: Reflect the CRM/table-first principles from `.github/agents/ui-ux.agent.md` in the Rich Table, Empty State, Skeleton, and action-hierarchy guidance.
- **Rationale**: The user explicitly asked to use UI-agent help, and the agent file contains the most specific current guidance for enterprise management-system UI behavior.
- **Alternatives considered**:
  - Only extend the current UI guideline doc without agent-informed additions: rejected because it would underspecify the new component patterns and workflow expectations.

## Decision 4: Treat the wireframe-first workflow as a lightweight handoff contract

- **Decision**: Document the workflow as UI agent input -> wireframe/spec -> implementation handoff, with required outputs rather than tool-specific ceremony.
- **Rationale**: This keeps the workflow durable, readable, and aligned with Spec Kit without overloading the UI guideline doc with repository-governance details already covered elsewhere.
- **Alternatives considered**:
  - Add a deeply procedural multi-step workflow with branch and PR rules: rejected because those rules belong in the engineering constitution and tagged workflow docs.

## Decision 5: Validate primarily through formatting and policy audit

- **Decision**: Use formatting review, `pnpm specify.audit`, and commit-hook validation as the main validation path for this documentation story.
- **Rationale**: The story changes process documentation, not runnable product behavior, so documentation integrity and workflow compliance matter more than runtime tests.
- **Alternatives considered**:
  - Add code-level tests: rejected because the story intentionally avoids implementation changes.
