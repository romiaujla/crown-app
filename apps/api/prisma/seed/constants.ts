import { ManagementSystemTypeCodeEnum, RoleCodeEnum } from '@crown/types';
import {
  DEFAULT_SEEDED_PASSWORD,
  SEEDED_AUTH_PASSWORDS,
} from '../../src/auth/seeded-credentials.js';
import { PlatformUserAccountStatus, TenantStatus } from '../../src/domain/status-enums.js';
import {
  ManagementSystemTypeAvailabilityStatusEnum,
  RoleAuthClassEnum,
} from '../../src/generated/prisma/enums.js';
import { deriveTenantSchemaName } from '../../src/tenant/slug.js';

export const LOCAL_SEED_TENANT = {
  name: 'Acme Local Logistics',
  slug: 'acme-local',
  schemaName: deriveTenantSchemaName('acme-local'),
  status: TenantStatus.active,
} as const;

export const LOCAL_SEED_SECONDARY_TENANT = {
  name: 'Zenith Logistics',
  slug: 'zenith-local',
  schemaName: deriveTenantSchemaName('zenith-local'),
  status: TenantStatus.active,
} as const;

export const LOCAL_SEED_USERS = {
  superAdmin: {
    email: 'super-admin@acme-local.test',
    username: 'super.admin',
    password: SEEDED_AUTH_PASSWORDS.superAdmin,
    accountStatus: PlatformUserAccountStatus.active,
    displayName: 'Super Admin',
    role: RoleAuthClassEnum.super_admin,
  },
  tenantAdmin: {
    email: 'tenant-admin@acme-local.test',
    username: 'tenant.admin',
    password: SEEDED_AUTH_PASSWORDS.tenantAdmin,
    accountStatus: PlatformUserAccountStatus.active,
    displayName: 'Tenant Admin',
    role: RoleCodeEnum.TENANT_ADMIN,
  },
  tenantUser: {
    email: 'tenant-user@acme-local.test',
    username: 'tenant.user',
    password: SEEDED_AUTH_PASSWORDS.tenantUser,
    accountStatus: PlatformUserAccountStatus.active,
    displayName: 'Tenant User',
    role: RoleCodeEnum.DISPATCHER,
  },
} as const;

export const LOCAL_SEED_EDGE_CASE_USERS = {
  disabledUser: {
    email: 'disabled-user@acme-local.test',
    username: 'disabled.user',
    password: DEFAULT_SEEDED_PASSWORD,
    accountStatus: PlatformUserAccountStatus.disabled,
    displayName: 'Disabled User',
  },
  tenantUserOrphan: {
    email: 'tenant-user-orphan@acme-local.test',
    username: 'tenant.user.orphan',
    password: DEFAULT_SEEDED_PASSWORD,
    accountStatus: PlatformUserAccountStatus.active,
    displayName: 'Tenant User Orphan',
  },
  tenantAdminMulti: {
    email: 'tenant-admin-multi@acme-local.test',
    username: 'tenant.admin.multi',
    password: DEFAULT_SEEDED_PASSWORD,
    accountStatus: PlatformUserAccountStatus.active,
    displayName: 'Tenant Admin Multi',
  },
} as const;

export const LOCAL_SEED_ACTOR_SUB = 'seed-local-runner';

export const LOCAL_SEED_MANAGEMENT_SYSTEM_TYPES = [
  {
    typeCode: ManagementSystemTypeCodeEnum.TRANSPORTATION,
    version: '1.0',
    displayName: 'Transportation Management System',
    description: 'Baseline tenant product context for transportation operations workflows.',
    availabilityStatus: ManagementSystemTypeAvailabilityStatusEnum.active,
  },
  {
    typeCode: ManagementSystemTypeCodeEnum.DEALERSHIP,
    version: '1.0',
    displayName: 'Dealer Management System',
    description: 'Baseline tenant product context for dealer operations workflows.',
    availabilityStatus: ManagementSystemTypeAvailabilityStatusEnum.active,
  },
  {
    typeCode: ManagementSystemTypeCodeEnum.INVENTORY,
    version: '1.0',
    displayName: 'Inventory Management System',
    description: 'Baseline tenant product context for inventory operations workflows.',
    availabilityStatus: ManagementSystemTypeAvailabilityStatusEnum.active,
  },
] as const;

export const LOCAL_SEED_ROLES = [
  {
    roleCode: 'super_admin',
    scope: 'platform',
    authClass: RoleAuthClassEnum.super_admin,
    displayName: 'Super Admin',
    description: 'Platform-wide operator role.',
  },
  {
    roleCode: RoleCodeEnum.TENANT_ADMIN,
    scope: 'tenant',
    authClass: RoleAuthClassEnum.tenant_admin,
    displayName: 'Tenant Admin',
    description: 'Tenant shell administrator role.',
  },
  {
    roleCode: RoleCodeEnum.ADMIN,
    scope: 'tenant',
    authClass: RoleAuthClassEnum.tenant_user,
    displayName: 'Admin',
    description: 'Management-system administrator role inside the tenant workspace.',
  },
  {
    roleCode: RoleCodeEnum.DISPATCHER,
    scope: 'tenant',
    authClass: RoleAuthClassEnum.tenant_user,
    displayName: 'Dispatcher',
    description: 'Coordinates transportation loads and assignments.',
  },
  {
    roleCode: RoleCodeEnum.ACCOUNTANT,
    scope: 'tenant',
    authClass: RoleAuthClassEnum.tenant_user,
    displayName: 'Accountant',
    description: 'Handles financial workflows for the tenant.',
  },
  {
    roleCode: RoleCodeEnum.HUMAN_RESOURCES,
    scope: 'tenant',
    authClass: RoleAuthClassEnum.tenant_user,
    displayName: 'Human Resources',
    description: 'Handles people and staffing workflows for the tenant.',
  },
  {
    roleCode: RoleCodeEnum.DRIVER,
    scope: 'tenant',
    authClass: RoleAuthClassEnum.tenant_user,
    displayName: 'Driver',
    description: 'Executes assigned transportation work in the tenant workspace.',
  },
] as const;

export const LOCAL_SEED_MANAGEMENT_SYSTEM_TYPE_ROLES = [
  {
    managementSystemTypeCode: ManagementSystemTypeCodeEnum.TRANSPORTATION,
    managementSystemTypeVersion: '1.0',
    roleCode: RoleCodeEnum.ADMIN,
    isDefault: true,
  },
  {
    managementSystemTypeCode: ManagementSystemTypeCodeEnum.TRANSPORTATION,
    managementSystemTypeVersion: '1.0',
    roleCode: RoleCodeEnum.DISPATCHER,
    isDefault: true,
  },
  {
    managementSystemTypeCode: ManagementSystemTypeCodeEnum.TRANSPORTATION,
    managementSystemTypeVersion: '1.0',
    roleCode: RoleCodeEnum.ACCOUNTANT,
    isDefault: false,
  },
  {
    managementSystemTypeCode: ManagementSystemTypeCodeEnum.TRANSPORTATION,
    managementSystemTypeVersion: '1.0',
    roleCode: RoleCodeEnum.HUMAN_RESOURCES,
    isDefault: false,
  },
  {
    managementSystemTypeCode: ManagementSystemTypeCodeEnum.TRANSPORTATION,
    managementSystemTypeVersion: '1.0',
    roleCode: RoleCodeEnum.DRIVER,
    isDefault: true,
  },
  {
    managementSystemTypeCode: ManagementSystemTypeCodeEnum.DEALERSHIP,
    managementSystemTypeVersion: '1.0',
    roleCode: RoleCodeEnum.ADMIN,
    isDefault: true,
  },
  {
    managementSystemTypeCode: ManagementSystemTypeCodeEnum.INVENTORY,
    managementSystemTypeVersion: '1.0',
    roleCode: RoleCodeEnum.ADMIN,
    isDefault: true,
  },
] as const;

export const LOCAL_SEED_RESET_TABLES = [
  'activity_records',
  'load_stops',
  'loads',
  'tenant_role_assignments',
  'people',
  'locations',
  'equipment_assets',
  'organizations',
  'tenant_role_definitions',
  'reference_data_sets',
] as const;
