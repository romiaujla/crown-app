import type { Tenant } from "../generated/prisma/client.js";

export type TenantMigrationDefinition = {
  version: string;
  description: string;
  sqlPath: string;
  sequence: number;
};

export type TenantMigrationExecutionResult = {
  status: "provisioned" | "failed";
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

export type ProvisionTenantInput = {
  name: string;
  slug: string;
  actorSub: string;
};

export type ProvisionTenantSuccessResult = {
  status: "provisioned";
  tenantId: string;
  slug: string;
  schemaName: string;
  appliedVersions: string[];
  skippedVersions: string[];
  tenant: Tenant;
};

export type ProvisionTenantConflictResult = {
  status: "conflict";
  message: string;
};

export type ProvisionTenantFailureResult = {
  status: "failed";
  errorCode: "migration_failed";
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
