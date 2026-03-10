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
    displayName: "Seed Super Admin",
    role: "super_admin"
  },
  tenantAdmin: {
    email: "tenant-admin@acme-local.test",
    displayName: "Seed Tenant Admin",
    role: "tenant_admin"
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
