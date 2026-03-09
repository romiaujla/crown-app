# System Overview

Crown is a multi-tenant platform with a control plane and tenant data planes.

## Components
- `apps/api` exposes REST APIs for auth, platform administration, and tenant operations.
- `apps/web` provides super-admin and tenant user interfaces.
- PostgreSQL stores global control-plane records and tenant-scoped schemas.

## Deployment model
- One super-admin control plane manages tenants.
- The main Crown app entry experience is the super-admin control plane for platform operators.
- Each tenant has isolated runtime schema (`tenant_<slug>`) in PostgreSQL.
