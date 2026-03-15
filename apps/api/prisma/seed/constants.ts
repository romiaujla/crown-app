import { ManagementSystemTypeCodeEnum } from "@crown/types";
import { PlatformUserAccountStatus, TenantStatus } from "../../src/domain/status-enums.js";
import { deriveTenantSchemaName } from "../../src/tenant/slug.js";
import { ManagementSystemTypeAvailabilityStatusEnum } from "../../src/generated/prisma/enums.js";
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
    typeCode: ManagementSystemTypeCodeEnum.TRANSPORTATION,
    version: "1.0",
    displayName: "Transportation Management System",
    description: "Baseline tenant product context for transportation operations workflows.",
    availabilityStatus: ManagementSystemTypeAvailabilityStatusEnum.active
  },
  {
    typeCode: ManagementSystemTypeCodeEnum.DEALERSHIP,
    version: "1.0",
    displayName: "Dealer Management System",
    description: "Baseline tenant product context for dealer operations workflows.",
    availabilityStatus: ManagementSystemTypeAvailabilityStatusEnum.active
  },
  {
    typeCode: ManagementSystemTypeCodeEnum.INVENTORY,
    version: "1.0",
    displayName: "Inventory Management System",
    description: "Baseline tenant product context for inventory operations workflows.",
    availabilityStatus: ManagementSystemTypeAvailabilityStatusEnum.active
  }
] as const;

export const LOCAL_SEED_ROLES = [
  {
    roleCode: "tenant_admin",
    displayName: "Admin",
    description: "Baseline administrator role shared across management-system types."
  },
  {
    roleCode: "dispatcher",
    displayName: "Dispatcher",
    description: "Coordinates transportation loads and assignments."
  },
  {
    roleCode: "accountant",
    displayName: "Accountant",
    description: "Handles financial workflows for the tenant."
  },
  {
    roleCode: "human_resources",
    displayName: "Human Resources",
    description: "Handles people and staffing workflows for the tenant."
  },
  {
    roleCode: "driver",
    displayName: "Driver",
    description: "Executes assigned transportation work in the tenant workspace."
  }
] as const;

export const LOCAL_SEED_MANAGEMENT_SYSTEM_TYPE_ROLES = [
  {
    managementSystemTypeCode: ManagementSystemTypeCodeEnum.TRANSPORTATION,
    managementSystemTypeVersion: "1.0",
    roleCode: "tenant_admin",
    isDefault: true
  },
  {
    managementSystemTypeCode: ManagementSystemTypeCodeEnum.TRANSPORTATION,
    managementSystemTypeVersion: "1.0",
    roleCode: "dispatcher",
    isDefault: true
  },
  {
    managementSystemTypeCode: ManagementSystemTypeCodeEnum.TRANSPORTATION,
    managementSystemTypeVersion: "1.0",
    roleCode: "accountant",
    isDefault: false
  },
  {
    managementSystemTypeCode: ManagementSystemTypeCodeEnum.TRANSPORTATION,
    managementSystemTypeVersion: "1.0",
    roleCode: "human_resources",
    isDefault: false
  },
  {
    managementSystemTypeCode: ManagementSystemTypeCodeEnum.TRANSPORTATION,
    managementSystemTypeVersion: "1.0",
    roleCode: "driver",
    isDefault: true
  },
  {
    managementSystemTypeCode: ManagementSystemTypeCodeEnum.DEALERSHIP,
    managementSystemTypeVersion: "1.0",
    roleCode: "tenant_admin",
    isDefault: true
  },
  {
    managementSystemTypeCode: ManagementSystemTypeCodeEnum.INVENTORY,
    managementSystemTypeVersion: "1.0",
    roleCode: "tenant_admin",
    isDefault: true
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
