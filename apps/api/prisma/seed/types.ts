import type { PlatformUserAccountStatus, TenantStatus } from "../../src/domain/status-enums.js";
import type { ManagementSystemTypeAvailabilityStatusEnum } from "../../src/generated/prisma/enums.js";

export type SeedQueryResult<T = Record<string, unknown>> = {
  rows: T[];
  rowCount?: number | null;
};

export type SeedSqlClient = {
  connect(): Promise<void>;
  end(): Promise<void>;
  query(text: string, values?: readonly unknown[]): Promise<SeedQueryResult>;
};

export type SeedTenantDelegate = {
  upsert(args: {
    where: { slug: string };
    create: { name: string; slug: string; schemaName: string; status: TenantStatus };
    update: { name: string; schemaName: string; status: TenantStatus };
  }): Promise<{ id: string; name: string; slug: string; schemaName: string; status: TenantStatus }>;
};

export type SeedPlatformUserDelegate = {
  upsert(args: {
    where: { email: string };
    create: {
      email: string;
      username: string;
      passwordHash: string;
      accountStatus: PlatformUserAccountStatus;
      displayName: string;
      role: string;
    };
    update: {
      username: string;
      passwordHash: string;
      accountStatus: PlatformUserAccountStatus;
      displayName: string;
      role: string;
    };
  }): Promise<{
    id: string;
    email: string;
    username: string | null;
    passwordHash: string | null;
    accountStatus: PlatformUserAccountStatus;
    displayName: string;
    role: string;
  }>;
};

export type SeedPlatformUserTenantDelegate = {
  upsert(args: {
    where: { platformUserId_tenantId: { platformUserId: string; tenantId: string } };
    create: { platformUserId: string; tenantId: string; role: string };
    update: { role: string };
  }): Promise<{ id: string; platformUserId: string; tenantId: string; role: string }>;
};

export type SeedManagementSystemTypeDelegate = {
  upsert(args: {
    where: { typeCode_version: { typeCode: string; version: string } };
    create: {
      typeCode: string;
      version: string;
      displayName: string;
      description?: string | null;
      availabilityStatus: ManagementSystemTypeAvailabilityStatusEnum;
    };
    update: {
      version?: string;
      displayName: string;
      description?: string | null;
      availabilityStatus: ManagementSystemTypeAvailabilityStatusEnum;
    };
  }): Promise<{
    id: string;
    typeCode: string;
    version: string;
    displayName: string;
    description: string | null;
    availabilityStatus: ManagementSystemTypeAvailabilityStatusEnum;
  }>;
};

export type SeedRoleDelegate = {
  upsert(args: {
    where: { roleCode: string };
    create: {
      roleCode: string;
      displayName: string;
      description?: string | null;
    };
    update: {
      displayName: string;
      description?: string | null;
    };
  }): Promise<{
    id: string;
    roleCode: string;
    displayName: string;
    description: string | null;
  }>;
};

export type SeedManagementSystemTypeRoleDelegate = {
  upsert(args: {
    where: { managementSystemTypeId_roleId: { managementSystemTypeId: string; roleId: string } };
    create: {
      managementSystemTypeId: string;
      roleId: string;
      isDefault: boolean;
    };
    update: {
      isDefault: boolean;
    };
  }): Promise<{
    id: string;
    managementSystemTypeId: string;
    roleId: string;
    isDefault: boolean;
  }>;
};

export type SeedPrismaClient = {
  tenant: SeedTenantDelegate;
  platformUser: SeedPlatformUserDelegate;
  platformUserTenant: SeedPlatformUserTenantDelegate;
  managementSystemType: SeedManagementSystemTypeDelegate;
  role: SeedRoleDelegate;
  managementSystemTypeRole: SeedManagementSystemTypeRoleDelegate;
};

export type SeedPhaseName =
  | "after-control-plane"
  | "after-reset"
  | "after-reference-data"
  | "after-organizations"
  | "after-operations"
  | "after-load";

export type SeedControlPlaneBaseline = {
  tenantId: string;
  tenantSlug: string;
  schemaName: string;
  platformUserIds: {
    superAdmin: string;
    tenantAdmin: string;
    tenantUser: string;
  };
};

export type SeedLoadedCounts = {
  referenceDataSets: number;
  organizations: number;
  locations: number;
  people: number;
  tenantRoleDefinitions: number;
  tenantRoleAssignments: number;
  equipmentAssets: number;
  loads: number;
  loadStops: number;
  activityRecords: number;
};

export type SeedExecutionSummary = {
  tenantSlug: string;
  schemaName: string;
  loadedCounts: SeedLoadedCounts;
  deterministicKeys: string[];
};

export type SeedBootstrapContext = {
  tenantId: string;
  tenantSlug: string;
  schemaName: string;
  client: SeedSqlClient;
};

export class SeedExecutionError extends Error {
  readonly phase?: SeedPhaseName;

  constructor(message: string, phase?: SeedPhaseName) {
    super(message);
    this.name = "SeedExecutionError";
    this.phase = phase;
  }
}

export const createEmptyLoadedCounts = (): SeedLoadedCounts => ({
  referenceDataSets: 0,
  organizations: 0,
  locations: 0,
  people: 0,
  tenantRoleDefinitions: 0,
  tenantRoleAssignments: 0,
  equipmentAssets: 0,
  loads: 0,
  loadStops: 0,
  activityRecords: 0
});
