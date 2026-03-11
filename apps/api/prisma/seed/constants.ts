import { deriveTenantSchemaName } from "../../src/tenant/slug.js";

export const LOCAL_SEED_TENANT = {
  name: "Acme Local Logistics",
  slug: "acme-local",
  schemaName: deriveTenantSchemaName("acme-local"),
  status: "active"
} as const;

export const LOCAL_SEED_USERS = {
  superAdmin: {
    email: "super-admin@acme-local.test",
    username: "super.admin",
    password: "Password123!",
    accountStatus: "active",
    displayName: "Super Admin",
    role: "super_admin"
  },
  tenantAdmin: {
    email: "tenant-admin@acme-local.test",
    username: "tenant.admin",
    password: "Password123!",
    accountStatus: "active",
    displayName: "Tenant Admin",
    role: "tenant_admin"
  },
  tenantUser: {
    email: "tenant-user@acme-local.test",
    username: "tenant.user",
    password: "Password123!",
    accountStatus: "active",
    displayName: "Tenant User",
    role: "tenant_user"
  }
} as const;

export const LOCAL_SEED_ACTOR_SUB = "seed-local-runner";

export const LOCAL_SEED_RESET_TABLES = [
  "activity_records",
  "load_stops",
  "loads",
  "equipment_assets",
  "tenant_role_assignments",
  "tenant_role_definitions",
  "people",
  "locations",
  "organizations",
  "reference_data_sets"
] as const;
