# Research: CROWN-79 Prompt-Driven End-To-End Spec Kit Implementation Workflow

## Decision: Put the prompt-driven start instructions in `AGENTS.md`

- **Why**: `AGENTS.md` is the mandatory AI-agent entrypoint in this repository. If the new workflow is not described there, the agent still lacks a single canonical execution path for `Start implementing <JIRA ISSUE>`.
- **Alternatives considered**:
  - Document the workflow only in `README.md`: rejected because agents are required to follow `AGENTS.md`, and README-only guidance is easier to miss.
  - Create a separate agent-only process document with no `AGENTS.md` update: rejected because it introduces another discovery step and weakens the single-entrypoint goal.

## Decision: Keep `docs/process/spec-kit-workflow.md` as the human-readable phase reference

- **Why**: The workflow document already defines the required Spec Kit phases and PR checklist gates. Extending it with the explicit prompt-driven sequence keeps agent and human guidance aligned.
- **Alternatives considered**:
  - Put every detail only in `AGENTS.md`: rejected because maintainers also need a process-facing document for review and PR traceability.
  - Add a second process workflow document: rejected because it risks competing instructions.

## Decision: Use documentation guidance instead of introducing new execution scripts

- **Why**: The Jira story asks for a prompt-driven execution path and deterministic workflow behavior, not a new automation runtime. Existing repository scripts already cover branch auditing and plan setup where needed.
- **Alternatives considered**:
  - Build a new orchestration script for all phases: rejected because it adds tooling surface that the acceptance criteria do not require.
  - Leave the workflow implicit in existing scattered docs: rejected because that is the current problem described in Jira.

## Decision: Make commit-and-push phase gates explicit at each transition

- **Why**: The story is specifically about preserving reviewable boundaries between `/specify`, `/plan`, `/tasks`, implementation, and PR creation. The instructions should call out those gates directly instead of leaving them as an implication.
- **Alternatives considered**:
  - Require only a final implementation commit: rejected because it loses the staged reviewability that the story requires.
  - Mention commits generally without tying them to phase boundaries: rejected because the workflow would remain ambiguous.

## Decision: Treat ambiguity and dirty repository state as stop conditions

- **Why**: The acceptance criteria require the workflow to pause rather than auto-advance when scope, requirements, or repository state are ambiguous or blocked.
- **Alternatives considered**:
  - Continue automatically and log assumptions later: rejected because it can widen scope or hide repository-state conflicts.
  - Restrict pauses to requirements ambiguity only: rejected because dirty state and branch/spec drift can also invalidate the workflow.
