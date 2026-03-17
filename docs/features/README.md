# Feature Docs Index

Use this directory for major feature artifacts and supporting records.

## Major Feature Folder Convention

- `docs/features/CROWN-<id>/spec.md`
- `docs/features/CROWN-<id>/plan.md`
- `docs/features/CROWN-<id>/tasks.md`

There is only one canonical engineering constitution:

- `docs/process/engineering-constitution.md`

Feature folders must not define alternative constitutions.

## Drift Records

Use:

```bash
pnpm specify.drift -- "<short reason>"
```

to append manual/small-change drift entries under:

- `docs/features/drift/CROWN-<id>.md`

## Traceability Rules

- Jira issues should link to repo artifacts by stable relative path.
- PR descriptions must include Jira key and artifact paths for major features.
- Update links if files move; avoid stale references.
