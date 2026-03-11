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
    username: "seed.super.admin",
    password: "SeedPassword123!",
    accountStatus: "active",
    displayName: "Seed Super Admin",
    role: "super_admin"
  },
  tenantAdmin: {
    email: "tenant-admin@acme-local.test",
    username: "seed.tenant.admin",
    password: "SeedPassword123!",
    accountStatus: "active",
    displayName: "Seed Tenant Admin",
    role: "tenant_admin"
  },
  tenantUser: {
    email: "tenant-user@acme-local.test",
    username: "seed.tenant.user",
    password: "SeedPassword123!",
    accountStatus: "active",
    displayName: "Seed Tenant User",
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
