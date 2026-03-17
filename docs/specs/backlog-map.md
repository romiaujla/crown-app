# Backlog Map

## Epic

- `CROWN-1`: Crown MVP Foundation

## Epic Status

- `CROWN-1`: Completed

## Child issues

- `CROWN-2`: Architecture and Planning Baseline
- `CROWN-3`: Monorepo Scaffold and Toolchain Setup
- `CROWN-4`: Global Auth + RBAC foundation
- `CROWN-5`: Tenant provisioning + schema bootstrap
- `CROWN-6`: Core management-system domain skeleton
- `CROWN-7`: Super-admin control plane UI shell for the Crown platform
- `CROWN-8`: Tenant app UI shell powered by Crown
- `CROWN-9`: CI quality gates and test harness hardening

## Next Epics

- `CROWN-23`: Detailed Tenant DB Schema Expansion and Local Seed Baseline
- `CROWN-24`: Identity and Role-Based Login Experiences (super admin, tenant admin, tenant user)
- `CROWN-25`: Super-Admin Capability Expansion (platform schemas, routes, components)
- `CROWN-26`: Tenant Admin Capability Expansion (tenant schemas, routes, components, RBAC controls)
- `CROWN-27`: Tenant User Capability Expansion for TMS Roles (dispatcher, driver, role-restricted actions)
- `CROWN-28`: Tenant TMS Product Depth (dashboards, load management, and operational modules)
- `CROWN-36`: Data Lifecycle, Auditability, and Schema Metadata Foundation
- `CROWN-42`: Future Tenant Schema Management GUI
- `CROWN-43`: Management System Tenant Onboarding and Provisioning
- `CROWN-50`: Management System Module Registry and Enablement

## Milestone Sequence (Proposed)

- Milestone 1: Detailed DB schema scaffold + local seed baseline (must complete before login work)
- Milestone 2: Access and identity bootstrap (role-based login journeys)
- Milestone 3: Administrative control surfaces (super admin + tenant admin capabilities)
- Milestone 4: Tenant role execution model (tenant user RBAC and TMS role permissions)
- Milestone 5: Domain depth (TMS dashboards, load management, and related modules)
- Milestone 6: Cross-cutting data governance and schema metadata foundation
- Milestone 7: Profile-driven onboarding and provisioning for new management systems
- Milestone 8: Shared-web module registry and enablement for management-system contexts
- Milestone 9: Future schema-management GUI on top of governance foundations

## Additional Notes

- `CROWN-36` is a prerequisite foundation for future schema-management GUI work in `CROWN-42`.
- `CROWN-43` depends on the tenant schema baseline from `CROWN-23` and the governance direction from `CROWN-36`.
- `CROWN-50` captures the shared `apps/web` strategy for management-system-specific routes such as `app/tms` and `app/dms`, rather than early separate deployable apps.
