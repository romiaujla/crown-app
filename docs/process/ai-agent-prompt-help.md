# AI-Agent Prompt Help Registry

Use `--help` to discover the repository-supported AI-agent prompt patterns without scanning multiple files.

## Contract
- `--help` is the canonical discovery command for repository AI-agent prompts.
- The help surface is a registry: add new documented prompt patterns here instead of redefining the contract in multiple files.
- Workflow semantics for each prompt remain governed by `AGENTS.md`, `docs/process/spec-kit-workflow.md`, and `docs/process/engineering-constitution.md`.

## Supported Prompt Patterns

| Prompt pattern | Behavior |
| --- | --- |
| `--help` | Show this help registry so engineers can discover the supported repository AI-agent prompts. |
| `--speckit CROWN-<id>` | Start the full Spec Kit delivery path for the Jira issue: resolve the issue, create or validate the Jira-linked branch, then proceed through `/specify`, `/plan`, `/tasks`, implementation, and pull request creation. |
| `--implement CROWN-<id>` | Start the implementation-only path for the Jira issue: resolve the issue, create or validate the Jira-linked branch, then skip `/specify`, `/plan`, and `/tasks` and proceed directly to implementation. |

## Extending The Registry
When a new prompt pattern is introduced:

1. Add the prompt pattern and short behavior description to this registry.
2. Treat this registry as the future command catalog; add future prompt patterns here before repeating the contract elsewhere.
3. Update the governing workflow/policy documents only where the prompt changes actual behavior.
4. Extend `scripts/specify-audit.mjs` so documented help coverage does not drift.
