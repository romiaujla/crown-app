# Tenant Domain Audit Contract

## Purpose

Define the required output of the `CROWN-6` audit for pre-pivot tenant-domain artifacts.

## Contract

Every existing tenant-domain artifact introduced before the pivot must be documented with:

- current artifact name
- artifact kind
- current business meaning
- pivot-fit assessment
- disposition decision
- replacement concept, if applicable
- compatibility handling for existing tenants
- rationale

## Required Artifact Coverage

At minimum, the audit must cover:

- baseline tenant migration tables already introduced
- tenant-domain examples in architecture docs
- tenant-scoped API boundary language
- spec and contract artifacts that describe the tenant baseline

## Decision Rules

- `retain`: use only when the artifact is already cross-domain and does not require CRM-only meaning
- `generalize`: use when the artifact remains useful but needs broader naming or semantics
- `replace`: use when the artifact should be superseded by a new baseline concept
- `deprecate`: use when the artifact should remain understandable for history but should not be used for new baseline work

## Acceptance Signal

The contract is satisfied when reviewers can trace every pre-pivot tenant artifact to exactly one documented disposition.

## Audit Completeness Checklist

- every pre-pivot migration artifact is listed
- every tenant-domain documentation reference is listed
- every tenant-domain contract example is listed
- every listed artifact has one disposition
- every generalized or replaced artifact has a named target concept
- every replaced or deprecated artifact has compatibility handling for existing tenants

## Compatibility Acceptance Rules

- Existing tenants must remain explainable using the documented artifact mapping even before implementation migration work is completed.
- Replacement concepts must preserve a clear operator-visible mapping from pre-pivot baseline artifacts.
- No legacy artifact may remain undocumented once the audit is approved.
