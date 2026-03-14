import { PlatformUserAccountStatus, TenantStatus } from "../../src/domain/status-enums.js";
import { deriveTenantSchemaName } from "../../src/tenant/slug.js";
import {
  ManagementSystemRoleTemplateBootstrapRoleEnum,
  ManagementSystemTypeAvailabilityStatusEnum
} from "../../src/generated/prisma/enums.js";
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

export const LOCAL_SEED_MANAGEMENT_SYSTEM_TYPES = [
  {
    typeCode: "tms",
    displayName: "Transportation Management System",
    description: "Baseline tenant product context for transportation operations workflows.",
    availabilityStatus: ManagementSystemTypeAvailabilityStatusEnum.active
  },
  {
    typeCode: "dms",
    displayName: "Dealer Management System",
    description: "Baseline tenant product context for dealer operations workflows.",
    availabilityStatus: ManagementSystemTypeAvailabilityStatusEnum.active
  }
] as const;

export const LOCAL_SEED_MANAGEMENT_SYSTEM_ROLE_TEMPLATES = [
  {
    managementSystemTypeCode: "tms",
    roleCode: "admin",
    displayName: "Admin",
    description: "Required tenant setup administrator for the transportation baseline.",
    isRequired: true,
    bootstrapRole: ManagementSystemRoleTemplateBootstrapRoleEnum.tenant_admin
  },
  {
    managementSystemTypeCode: "tms",
    roleCode: "dispatcher",
    displayName: "Dispatcher",
    description: "Coordinates transportation loads and assignments.",
    isRequired: false,
    bootstrapRole: ManagementSystemRoleTemplateBootstrapRoleEnum.none
  },
  {
    managementSystemTypeCode: "tms",
    roleCode: "driver",
    displayName: "Driver",
    description: "Executes assigned transportation work in the tenant workspace.",
    isRequired: false,
    bootstrapRole: ManagementSystemRoleTemplateBootstrapRoleEnum.none
  },
  {
    managementSystemTypeCode: "dms",
    roleCode: "admin",
    displayName: "Admin",
    description: "Required tenant setup administrator for the dealer baseline.",
    isRequired: true,
    bootstrapRole: ManagementSystemRoleTemplateBootstrapRoleEnum.tenant_admin
  },
  {
    managementSystemTypeCode: "dms",
    roleCode: "sales_manager",
    displayName: "Sales Manager",
    description: "Oversees dealer sales workflows and team setup.",
    isRequired: false,
    bootstrapRole: ManagementSystemRoleTemplateBootstrapRoleEnum.none
  },
  {
    managementSystemTypeCode: "dms",
    roleCode: "service_advisor",
    displayName: "Service Advisor",
    description: "Coordinates dealer service intake and follow-up workflows.",
    isRequired: false,
    bootstrapRole: ManagementSystemRoleTemplateBootstrapRoleEnum.none
  }
] as const;

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
