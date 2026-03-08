# Tenant Domain Boundaries Contract

## Purpose

Define the domain-language boundary for tenant-scoped functionality after the management-system pivot.

## Boundary Rules

- Tenant-domain concepts must be expressed in management-system language rather than CRM-only language.
- Control-plane concepts may remain platform-oriented and generic.
- Tenant API and architecture references must not assume that every tenant workflow is a sales pipeline.

## Baseline Concepts

The tenant-domain baseline is expected to center on:

- organizations
- people
- work items
- activity records

## Example Applicability

The boundary is acceptable only if the same baseline can describe:

- a dealer-management tenant
- a transportation-management tenant

without renaming the core concepts for each tenant type.

## Baseline Fit Examples

- A dealer-management service order must be representable as a `work_item` owned by an `organization` and associated with one or more `people`.
- A transportation shipment must be representable as a `work_item` with `activity_records` capturing movement and exception history.
- A tenant-domain concept fails the boundary if it only makes sense inside a sales pipeline.

## Validation Review Prompts

- Can the baseline describe a dealer-management workflow without introducing CRM-only nouns?
- Can the baseline describe a transportation-management workflow without renaming the core entities?
- Does each baseline concept keep a concrete business meaning instead of becoming a generic placeholder?

## Out of Bounds

The following patterns are out of bounds for the baseline unless explicitly justified in the audit:

- CRM-only tables presented as universal tenant-domain concepts
- API boundaries described as inherently CRM-scoped
- tenant bootstrap artifacts that assume all tenants manage deals or sales pipelines
