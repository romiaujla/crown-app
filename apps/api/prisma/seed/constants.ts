import { deriveTenantSchemaName } from "../../src/tenant/slug.js";
import { PlatformUserAccountStatus, TenantStatus } from "../../src/domain/status-enums.js";
import { SEEDED_AUTH_PASSWORDS } from "../../src/auth/seeded-credentials.js";

export const LOCAL_SEED_TENANT = {
  name: "Acme Local Logistics",
  slug: "acme-local",
  schemaName: deriveTenantSchemaName("acme-local"),
  status: TenantStatus.active
} as const;

export const LOCAL_SEED_USERS = {
  superAdmin: {
    email: "super-admin@acme-local.test",
    username: "super.admin",
    password: SEEDED_AUTH_PASSWORDS.superAdmin,
    accountStatus: PlatformUserAccountStatus.active,
    displayName: "Super Admin",
    role: "super_admin"
  },
  tenantAdmin: {
    email: "tenant-admin@acme-local.test",
    username: "tenant.admin",
    password: SEEDED_AUTH_PASSWORDS.tenantAdmin,
    accountStatus: PlatformUserAccountStatus.active,
    displayName: "Tenant Admin",
    role: "tenant_admin"
  },
  tenantUser: {
    email: "tenant-user@acme-local.test",
    username: "tenant.user",
    password: SEEDED_AUTH_PASSWORDS.tenantUser,
    accountStatus: PlatformUserAccountStatus.active,
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
