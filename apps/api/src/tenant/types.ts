import type { DeprovisionTypeEnum } from '@crown/types';
import type { Tenant } from '../generated/prisma/client.js';
import type { TenantStatus } from '../domain/status-enums.js';

export type TenantMigrationDefinition = {
  version: string;
  description: string;
  sqlPath: string;
  sequence: number;
};

export type TenantMigrationExecutionResult = {
  status: 'provisioned' | 'failed';
  appliedVersions: string[];
  skippedVersions: string[];
  failedVersion?: string;
  message?: string;
};

export type ExecuteTenantMigrationsInput = {
  tenantId: string;
  schemaName: string;
  actorSub: string;
  migrations: TenantMigrationDefinition[];
};

export type ProvisionTenantInitialUser = {
  firstName: string;
  lastName: string;
  email: string;
  roleCode: string;
};

export type ProvisionTenantInput = {
  name: string;
  slug: string;
  actorSub: string;
  managementSystemTypeCode: string;
  selectedRoleCodes: string[];
  initialUsers: ProvisionTenantInitialUser[];
};

export type ProvisionTenantSuccessResult = {
  status: 'provisioned';
  tenantId: string;
  slug: string;
  schemaName: string;
  appliedVersions: string[];
  skippedVersions: string[];
  managementSystemTypeCode: string;
  tenant: Tenant;
};

export type ProvisionTenantConflictResult = {
  status: 'conflict';
  message: string;
};

export type ProvisionTenantFailureResult = {
  status: 'failed';
  errorCode: 'migration_failed';
  message: string;
  failedVersion?: string;
  tenantId: string;
  slug: string;
  schemaName: string;
  appliedVersions: string[];
};

export type ProvisionTenantResult =
  | ProvisionTenantSuccessResult
  | ProvisionTenantConflictResult
  | ProvisionTenantFailureResult;

export type SoftDeprovisionTenantInput = {
  tenantId: string;
};

export type HardDeprovisionTenantInput = {
  tenantId: string;
};

export type DeprovisionTenantInput = {
  tenantId: string;
  deprovisionType: DeprovisionTypeEnum;
};

export type SoftDeprovisionTenantSuccessResult = {
  status: 'soft_deprovisioned';
  tenantId: string;
  slug: string;
  schemaName: string;
  previousStatus: TenantStatus;
  tenant: Tenant;
};

export type HardDeprovisionTenantSuccessResult = {
  status: 'hard_deprovisioned';
  tenantId: string;
  slug: string;
  schemaName: string;
  previousStatus: TenantStatus;
  tenant: Tenant;
};

export type SoftDeprovisionTenantConflictResult = {
  status: 'conflict';
  message: string;
  tenantId: string;
};

export type SoftDeprovisionTenantNotFoundResult = {
  status: 'not_found';
  message: string;
  tenantId: string;
};

export type SoftDeprovisionTenantResult =
  | SoftDeprovisionTenantSuccessResult
  | SoftDeprovisionTenantConflictResult
  | SoftDeprovisionTenantNotFoundResult;

export type HardDeprovisionTenantResult =
  | HardDeprovisionTenantSuccessResult
  | SoftDeprovisionTenantConflictResult
  | SoftDeprovisionTenantNotFoundResult;

export type DeprovisionTenantResult = SoftDeprovisionTenantResult | HardDeprovisionTenantResult;
