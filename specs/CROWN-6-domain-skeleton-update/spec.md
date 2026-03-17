# Feature Specification: Align Domain Schemas With Management-System Pivot

**Feature Branch**: `feat/CROWN-6-domain-skeleton-update`  
**Created**: 2026-03-08  
**Status**: Draft  
**Input**: User description: "Align existing tenant domain schemas with the management-system pivot for CROWN-6"

**Artifact Path**: `/Users/ramanpreetaujla/Documents/AI-Projects/crown-app/specs/CROWN-6-domain-skeleton-update/` is the canonical feature directory for this story.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Audit Existing Tenant Domain Baseline (Priority: P1)

As a platform owner, I want all existing tenant-domain schema artifacts reviewed against the management-system pivot so that already-created CRM-shaped structures do not silently lock the platform into the wrong domain model.

**Why this priority**: The platform cannot pivot cleanly until the existing baseline is inventoried and each CRM-specific artifact is either kept intentionally, renamed, generalized, or removed.

**Independent Test**: Review the current tenant-domain baseline and produce a complete disposition for each existing domain artifact, including whether it is retained, generalized, replaced, or deprecated.

**Acceptance Scenarios**:

1. **Given** tenant-domain artifacts already exist from earlier work, **When** the audit is performed, **Then** every existing artifact is listed with its current purpose and pivot-fit assessment.
2. **Given** an existing artifact uses CRM-only language, **When** the audit is completed, **Then** it has an explicit disposition rather than remaining ambiguous.

**Current Audit Outcome**:

- `accounts` -> generalize to `organizations`
- `contacts` -> generalize to `people`
- `deals` -> replace with `work_items`
- `activities` -> generalize to `activity_records`

---

### User Story 2 - Define Management-System Domain Baseline (Priority: P2)

As a product and domain designer, I want the tenant-domain baseline reframed around management-system concepts so that new tenant systems can extend the platform without inheriting CRM-only assumptions.

**Why this priority**: Once the current state is audited, the next highest-value step is establishing the neutral tenant-domain baseline that future work will build on.

**Independent Test**: Review the updated domain baseline and confirm that its entity names, relationships, and boundaries support multiple tenant system types without depending on CRM-only terminology.

**Acceptance Scenarios**:

1. **Given** the audited current-state inventory, **When** the new domain baseline is defined, **Then** tenant-domain concepts use management-system-oriented naming.
2. **Given** at least two tenant system examples with different business models, **When** the baseline is reviewed, **Then** both can be described without forcing CRM-specific meanings onto the entities.

**Approved Baseline Examples**:

- Dealer-management tenants use `organizations`, `people`, `work_items`, and `activity_records` to describe dealer, buyer, service, and financing workflows.
- Transportation-management tenants use the same baseline to describe shipper, carrier, dispatcher, shipment, and event-history workflows.

---

### User Story 3 - Preserve Existing Tenant Continuity (Priority: P3)

As an operator responsible for existing tenants, I want the schema pivot to include compatibility and transition rules so that current environments can be understood and upgraded safely.

**Why this priority**: The platform needs a forward path, but the pivot is incomplete unless existing tenant environments can be reconciled with the new baseline.

**Independent Test**: Review the transition guidance and verify that an operator can determine how previously created tenant-domain artifacts map into the updated baseline.

**Acceptance Scenarios**:

1. **Given** a tenant already provisioned with the earlier baseline, **When** the transition guidance is reviewed, **Then** the operator can determine whether each existing artifact is preserved, transformed, or phased out.
2. **Given** a previously created artifact has no direct equivalent in the new baseline, **When** the transition plan is finalized, **Then** the rationale and handling path are explicitly documented.

### Edge Cases

- What happens when an existing CRM-shaped artifact represents a concept that is still broadly useful across management-system tenants?
- What happens when an existing artifact has data or naming assumptions that do not fit the new domain baseline but also cannot be removed immediately?
- How does the pivot handle tenants provisioned before the new baseline is introduced?
- How does the domain model stay generic enough for multiple tenant system types without becoming so abstract that it loses business clarity?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system definition for `CROWN-6` MUST include a complete audit of existing tenant-domain schema artifacts that were introduced under the prior CRM framing.
- **FR-002**: Each existing tenant-domain artifact MUST receive an explicit disposition of retain, generalize, replace, or deprecate, including the business rationale for that decision.
- **FR-003**: The tenant-domain baseline MUST use management-system-oriented naming that can support multiple tenant system types rather than only CRM workflows.
- **FR-004**: The updated tenant-domain baseline MUST define the primary tenant-facing entities and their relationships in business terms.
- **FR-005**: The feature MUST identify which existing artifacts remain valid cross-domain concepts and which are CRM-specific carryovers.
- **FR-006**: The feature MUST define tenant-domain boundaries in a way that does not require CRM-specific terminology for core workflows.
- **FR-007**: The feature MUST document how existing tenant environments created before the pivot relate to the updated domain baseline.
- **FR-008**: The feature MUST preserve traceability from earlier tenant-domain work so teams can understand what changed, what stayed the same, and why.
- **FR-009**: The feature MUST include at least two concrete tenant-system examples to demonstrate that the updated baseline supports more than one tenant domain type.
- **FR-010**: The feature MUST provide a documented mapping from the pre-pivot tenant baseline (`accounts`, `contacts`, `deals`, `activities`) to the approved management-system baseline.
- **FR-011**: Architecture and backlog artifacts that currently describe tenant-scoped CRM operations MUST be updated to reflect the approved management-system baseline.

### Key Entities _(include if feature involves data)_

- **Tenant Domain Artifact**: Any existing tenant-facing schema element, data structure, or named domain concept that was previously introduced for tenant operations.
- **Management-System Domain Baseline**: The neutral set of tenant-facing domain concepts and relationships intended to support multiple tenant system types.
- **Disposition Record**: The decision outcome for an existing artifact, including whether it is retained, generalized, replaced, or deprecated and why.
- **Tenant System Type Example**: A representative tenant category used to validate that the baseline works across multiple business models.

## Assumptions

- Existing control-plane concepts such as tenant identity, memberships, and tenant version tracking remain valid unless the tenant-domain audit proves otherwise.
- The pivot work for `CROWN-6` is focused on tenant-domain language and schema structure, not on changing GitHub or Jira naming, which has already been addressed elsewhere.
- The updated baseline should support multiple management-system tenant types, with dealer-management and transportation-management use cases serving as reference examples unless later stories expand that set.
- The canonical feature artifacts remain under the Jira-linked `specs/CROWN-6-domain-skeleton-update/` path rather than a numeric spec-only alias.

## Dependencies

- Prior tenant provisioning work that introduced the current tenant-domain baseline.
- Updated platform positioning work establishing `Crown` and the management-system tenant direction.
- Follow-on implementation work that will apply the approved baseline to future tenant-domain features.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of existing tenant-domain artifacts created so far are reviewed and assigned a documented disposition before new tenant-domain expansion proceeds.
- **SC-002**: Stakeholders can explain how the updated tenant-domain baseline supports at least two distinct tenant system types without relying on CRM-only terminology.
- **SC-003**: Reviewers can determine the handling path for any pre-pivot tenant-domain artifact in under 5 minutes using the published audit and transition guidance.
- **SC-004**: No unresolved CRM-only tenant-domain terms remain in the approved `CROWN-6` feature specification for the future baseline.
