import { RoleCodeEnum } from '@crown/types';
import {
  LOCAL_SEED_EDGE_CASE_USERS,
  LOCAL_SEED_RESET_TABLES,
  LOCAL_SEED_SECONDARY_TENANT,
  LOCAL_SEED_TENANT,
  LOCAL_SEED_USERS,
} from '../../prisma/seed/constants.js';
import type { SeedPrismaClient, SeedQueryResult, SeedSqlClient } from '../../prisma/seed/types.js';
import type { PlatformUserAccountStatus, TenantStatus } from '../../src/domain/status-enums.js';
import {
  PlatformUserAccountStatus as PlatformUserAccountStatusValues,
  TenantStatus as TenantStatusValues,
} from '../../src/domain/status-enums.js';
import type { ManagementSystemTypeAvailabilityStatusEnum } from '../../src/generated/prisma/enums.js';

type TenantRow = {
  id: string;
  name: string;
  slug: string;
  schemaName: string;
  status: TenantStatus;
};

type PlatformUserRow = {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  accountStatus: PlatformUserAccountStatus;
  displayName: string;
};

type PlatformUserTenantRow = {
  id: string;
  platformUserId: string;
  tenantId: string;
};

type ControlPlaneRoleRow = {
  id: string;
  roleCode: string;
  scope: 'platform' | 'tenant';
  authClass: 'super_admin' | 'tenant_admin' | 'tenant_user';
  displayName: string;
  description: string | null;
};

type UserPlatformRoleAssignmentRow = {
  id: string;
  userId: string;
  roleId: string;
};

type TenantMembershipRow = {
  id: string;
  userId: string;
  tenantId: string;
};

type TenantMembershipRoleAssignmentRow = {
  id: string;
  tenantMembershipId: string;
  roleId: string;
  isPrimary: boolean;
};

type ManagementSystemTypeRow = {
  id: string;
  typeCode: string;
  version: string;
  displayName: string;
  description: string | null;
  availabilityStatus: ManagementSystemTypeAvailabilityStatusEnum;
};

type ManagementSystemTypeRoleRow = {
  id: string;
  managementSystemTypeId: string;
  roleId: string;
  isDefault: boolean;
};

type ReferenceDataRow = {
  id: string;
  dataSetCode: string;
  displayName: string;
  domainName: string;
  valuesJson: string;
};

type OrganizationRow = {
  id: string;
  organizationCode: string;
  displayName: string;
  organizationType: string;
};

type LocationRow = {
  id: string;
  organizationId: string;
  locationCode: string;
  displayName: string;
  locationType: string;
  city: string;
  regionCode: string;
  countryCode: string;
};

type PersonRow = {
  id: string;
  organizationId: string | null;
  personCode: string;
  givenName: string;
  familyName: string;
  email: string | null;
  phoneNumber: string | null;
};

type RoleRow = {
  id: string;
  roleCode: string;
  displayName: string;
  description: string;
};

type RoleAssignmentRow = {
  id: string;
  personId: string;
  roleId: string;
};

type AssetRow = {
  id: string;
  organizationId: string | null;
  assetCode: string;
  assetType: string;
};

type LoadRow = {
  id: string;
  loadCode: string;
  shipperOrganizationId: string | null;
  customerOrganizationId: string | null;
  dispatcherPersonId: string | null;
  equipmentAssetId: string | null;
  mode: string | null;
  status: string;
};

type LoadStopRow = {
  id: string;
  loadId: string;
  locationId: string;
  stopSequence: number;
  stopType: string;
  plannedAt: string | null;
  status: string;
};

type ActivityRow = {
  id: string;
  loadId: string | null;
  loadStopId: string | null;
  organizationId: string | null;
  personId: string | null;
  equipmentAssetId: string | null;
  actorPersonId: string | null;
  activityType: string;
  details: string;
  occurredAt: string;
};

type HarnessState = {
  schemaReady: boolean;
  tenants: Map<string, TenantRow>;
  platformUsers: Map<string, PlatformUserRow>;
  platformUserTenants: Map<string, PlatformUserTenantRow>;
  controlPlaneRoles: Map<string, ControlPlaneRoleRow>;
  userPlatformRoleAssignments: Map<string, UserPlatformRoleAssignmentRow>;
  tenantMemberships: Map<string, TenantMembershipRow>;
  tenantMembershipRoleAssignments: Map<string, TenantMembershipRoleAssignmentRow>;
  managementSystemTypes: Map<string, ManagementSystemTypeRow>;
  managementSystemTypeRoles: Map<string, ManagementSystemTypeRoleRow>;
  referenceDataSets: Map<string, ReferenceDataRow>;
  organizations: Map<string, OrganizationRow>;
  locations: Map<string, LocationRow>;
  people: Map<string, PersonRow>;
  tenantRoleDefinitions: Map<string, RoleRow>;
  tenantRoleAssignments: Map<string, RoleAssignmentRow>;
  equipmentAssets: Map<string, AssetRow>;
  loads: Map<string, LoadRow>;
  loadStops: Map<string, LoadStopRow>;
  activityRecords: ActivityRow[];
};

const createState = (): HarnessState => ({
  schemaReady: true,
  tenants: new Map(),
  platformUsers: new Map(),
  platformUserTenants: new Map(),
  controlPlaneRoles: new Map(),
  userPlatformRoleAssignments: new Map(),
  tenantMemberships: new Map(),
  tenantMembershipRoleAssignments: new Map(),
  managementSystemTypes: new Map(),
  managementSystemTypeRoles: new Map(),
  referenceDataSets: new Map(),
  organizations: new Map(),
  locations: new Map(),
  people: new Map(),
  tenantRoleDefinitions: new Map(),
  tenantRoleAssignments: new Map(),
  equipmentAssets: new Map(),
  loads: new Map(),
  loadStops: new Map(),
  activityRecords: [],
});

const cloneState = (state: HarnessState): HarnessState => ({
  schemaReady: state.schemaReady,
  tenants: new Map(state.tenants),
  platformUsers: new Map(state.platformUsers),
  platformUserTenants: new Map(state.platformUserTenants),
  controlPlaneRoles: new Map(state.controlPlaneRoles),
  userPlatformRoleAssignments: new Map(state.userPlatformRoleAssignments),
  tenantMemberships: new Map(state.tenantMemberships),
  tenantMembershipRoleAssignments: new Map(state.tenantMembershipRoleAssignments),
  managementSystemTypes: new Map(state.managementSystemTypes),
  managementSystemTypeRoles: new Map(state.managementSystemTypeRoles),
  referenceDataSets: new Map(state.referenceDataSets),
  organizations: new Map(state.organizations),
  locations: new Map(state.locations),
  people: new Map(state.people),
  tenantRoleDefinitions: new Map(state.tenantRoleDefinitions),
  tenantRoleAssignments: new Map(state.tenantRoleAssignments),
  equipmentAssets: new Map(state.equipmentAssets),
  loads: new Map(state.loads),
  loadStops: new Map(state.loadStops),
  activityRecords: state.activityRecords.map((row) => ({ ...row })),
});

const createId = (prefix: string, key: string): string =>
  `${prefix}-${key.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

export const createSeedTestHarness = (): {
  prisma: SeedPrismaClient;
  client: SeedSqlClient;
  queries: string[];
  state: HarnessState;
  seedUnrelatedPlatformData(): void;
  seedUnrelatedTenantDomainData(): void;
  setTenantSchemaReady(ready: boolean): void;
  snapshot(): Record<string, unknown>;
} => {
  let state = createState();
  let transactionState: HarnessState | null = null;
  const queries: string[] = [];

  const prisma: SeedPrismaClient = {
    tenant: {
      async upsert(args) {
        const existing = state.tenants.get(args.where.slug);
        if (existing) {
          const updated: TenantRow = {
            ...existing,
            ...args.update,
          };
          state.tenants.set(updated.slug, updated);
          return updated;
        }

        const created: TenantRow = {
          id: createId('tenant', args.create.slug),
          ...args.create,
        };
        state.tenants.set(created.slug, created);
        return created;
      },
    },
    user: {
      async upsert(args) {
        const existing = state.platformUsers.get(args.where.email);
        if (existing) {
          const updated: PlatformUserRow = {
            ...existing,
            ...args.update,
          };
          state.platformUsers.set(updated.email, updated);
          return updated;
        }

        const created: PlatformUserRow = {
          id: createId('platform-user', args.create.email),
          ...args.create,
        };
        state.platformUsers.set(created.email, created);
        return created;
      },
    },
    role: {
      async upsert(args) {
        const existing = state.controlPlaneRoles.get(args.where.roleCode);
        if (existing) {
          const updated: ControlPlaneRoleRow = {
            ...existing,
            ...args.update,
            description: args.update.description ?? null,
          };
          state.controlPlaneRoles.set(updated.roleCode, updated);
          return updated;
        }

        const created: ControlPlaneRoleRow = {
          id: createId('control-plane-role', args.create.roleCode),
          ...args.create,
          description: args.create.description ?? null,
        };
        state.controlPlaneRoles.set(created.roleCode, created);
        return created;
      },
    },
    userPlatformRoleAssignment: {
      async upsert(args) {
        const uniqueKey = args.where.userId_roleId as { userId: string; roleId: string };
        const createInput = args.create as { userId: string; roleId: string };
        const key = `${uniqueKey.userId}:${uniqueKey.roleId}`;
        const existing = state.userPlatformRoleAssignments.get(key);
        if (existing) return existing;

        const created: UserPlatformRoleAssignmentRow = {
          id: createId('user-platform-role-assignment', key),
          userId: createInput.userId,
          roleId: createInput.roleId,
        };
        state.userPlatformRoleAssignments.set(key, created);
        return created;
      },
    },
    tenantMembership: {
      async upsert(args) {
        const key = `${args.where.userId_tenantId.userId}:${args.where.userId_tenantId.tenantId}`;
        const existing = state.tenantMemberships.get(key);
        if (existing) {
          state.tenantMemberships.set(key, existing);
          return existing;
        }

        const created: TenantMembershipRow = {
          id: createId('tenant-membership', key),
          userId: args.create.userId,
          tenantId: args.create.tenantId,
        };
        state.tenantMemberships.set(key, created);
        return created;
      },
    },
    tenantMembershipRoleAssignment: {
      async upsert(args) {
        const uniqueKey = args.where.tenantMembershipId_roleId as {
          tenantMembershipId: string;
          roleId: string;
        };
        const createInput = args.create as {
          tenantMembershipId: string;
          roleId: string;
          isPrimary: boolean;
        };
        const updateInput = args.update as { isPrimary: boolean };
        const key = `${uniqueKey.tenantMembershipId}:${uniqueKey.roleId}`;
        const existing = state.tenantMembershipRoleAssignments.get(key);
        if (existing) {
          const updated: TenantMembershipRoleAssignmentRow = {
            ...existing,
            isPrimary: updateInput.isPrimary,
          };
          state.tenantMembershipRoleAssignments.set(key, updated);
          return updated;
        }

        const created: TenantMembershipRoleAssignmentRow = {
          id: createId('tenant-membership-role-assignment', key),
          tenantMembershipId: createInput.tenantMembershipId,
          roleId: createInput.roleId,
          isPrimary: createInput.isPrimary,
        };
        state.tenantMembershipRoleAssignments.set(key, created);
        return created;
      },
    },
    managementSystemType: {
      async upsert(args) {
        const key = `${args.where.typeCode_version.typeCode}:${args.where.typeCode_version.version}`;
        const existing = state.managementSystemTypes.get(key);
        if (existing) {
          const updated: ManagementSystemTypeRow = {
            ...existing,
            ...args.update,
            description: args.update.description ?? null,
          };
          state.managementSystemTypes.set(key, updated);
          return updated;
        }

        const created: ManagementSystemTypeRow = {
          id: createId('management-system-type', key),
          ...args.create,
          description: args.create.description ?? null,
        };
        state.managementSystemTypes.set(key, created);
        return created;
      },
    },
    managementSystemTypeRole: {
      async upsert(args) {
        const key = `${args.where.managementSystemTypeId_roleId.managementSystemTypeId}:${args.where.managementSystemTypeId_roleId.roleId}`;
        const existing = state.managementSystemTypeRoles.get(key);
        if (existing) {
          const updated: ManagementSystemTypeRoleRow = {
            ...existing,
            isDefault: args.update.isDefault,
          };
          state.managementSystemTypeRoles.set(key, updated);
          return updated;
        }

        const created: ManagementSystemTypeRoleRow = {
          id: createId('management-system-type-role', key),
          ...args.create,
        };
        state.managementSystemTypeRoles.set(key, created);
        return created;
      },
    },
  };

  const client: SeedSqlClient = {
    async connect() {},
    async end() {},
    async query(text: string, values: readonly unknown[] = []): Promise<SeedQueryResult> {
      queries.push(text.trim().replace(/\s+/g, ' '));
      const normalized = text.trim().replace(/\s+/g, ' ').toUpperCase();

      if (normalized === 'BEGIN') {
        transactionState = cloneState(state);
        return { rows: [] };
      }

      if (normalized === 'COMMIT') {
        transactionState = null;
        return { rows: [] };
      }

      if (normalized === 'ROLLBACK') {
        if (transactionState) {
          state = cloneState(transactionState);
        }
        transactionState = null;
        return { rows: [] };
      }

      if (normalized.startsWith('SET LOCAL SEARCH_PATH TO')) {
        return { rows: [] };
      }

      if (normalized.includes('SELECT TO_REGCLASS($1) AS REGCLASS')) {
        return {
          rows: [{ regclass: state.schemaReady ? 'organizations' : null }],
        };
      }

      if (normalized.includes("SELECT TO_REGCLASS('ORGANIZATIONS') AS REGCLASS")) {
        return {
          rows: [{ regclass: state.schemaReady ? 'organizations' : null }],
        };
      }

      for (const tableName of LOCAL_SEED_RESET_TABLES) {
        if (
          normalized === `DELETE FROM "${tableName.toUpperCase()}"` ||
          normalized === `DELETE FROM ${tableName.toUpperCase()}`
        ) {
          clearTable(tableName, state);
          return { rows: [] };
        }
      }

      if (normalized.includes('INSERT INTO REFERENCE_DATA_SETS')) {
        const [dataSetCode, displayName, domainName, valuesJson] = values as [
          string,
          string,
          string,
          string,
        ];
        const row = state.referenceDataSets.get(dataSetCode) ?? {
          id: createId('reference-data', dataSetCode),
          dataSetCode,
          displayName,
          domainName,
          valuesJson,
        };
        row.displayName = displayName;
        row.domainName = domainName;
        row.valuesJson = valuesJson;
        state.referenceDataSets.set(dataSetCode, row);
        return { rows: [{ id: row.id }] };
      }

      if (normalized.includes('INSERT INTO ORGANIZATIONS')) {
        const [organizationCode, displayName, organizationType] = values as [
          string,
          string,
          string,
        ];
        const row = state.organizations.get(organizationCode) ?? {
          id: createId('organization', organizationCode),
          organizationCode,
          displayName,
          organizationType,
        };
        row.displayName = displayName;
        row.organizationType = organizationType;
        state.organizations.set(organizationCode, row);
        return { rows: [{ id: row.id }] };
      }

      if (normalized.includes('INSERT INTO LOCATIONS')) {
        const [
          organizationId,
          locationCode,
          displayName,
          locationType,
          city,
          regionCode,
          countryCode,
        ] = values as [string, string, string, string, string, string, string];
        const row = state.locations.get(locationCode) ?? {
          id: createId('location', locationCode),
          organizationId,
          locationCode,
          displayName,
          locationType,
          city,
          regionCode,
          countryCode,
        };
        Object.assign(row, {
          organizationId,
          displayName,
          locationType,
          city,
          regionCode,
          countryCode,
        });
        state.locations.set(locationCode, row);
        return { rows: [{ id: row.id }] };
      }

      if (normalized.includes('INSERT INTO PEOPLE')) {
        const [organizationId, personCode, givenName, familyName, email, phoneNumber] = values as [
          string | null,
          string,
          string,
          string,
          string | null,
          string | null,
        ];
        const row = state.people.get(personCode) ?? {
          id: createId('person', personCode),
          organizationId,
          personCode,
          givenName,
          familyName,
          email,
          phoneNumber,
        };
        Object.assign(row, { organizationId, givenName, familyName, email, phoneNumber });
        state.people.set(personCode, row);
        return { rows: [{ id: row.id }] };
      }

      if (normalized.includes('INSERT INTO TENANT_ROLE_DEFINITIONS')) {
        const [roleCode, displayName, description] = values as [string, string, string];
        const row = state.tenantRoleDefinitions.get(roleCode) ?? {
          id: createId('role', roleCode),
          roleCode,
          displayName,
          description,
        };
        Object.assign(row, { displayName, description });
        state.tenantRoleDefinitions.set(roleCode, row);
        return { rows: [{ id: row.id }] };
      }

      if (normalized.includes('INSERT INTO TENANT_ROLE_ASSIGNMENTS')) {
        const [personId, roleId] = values as [string, string];
        const key = `${personId}:${roleId}`;
        const row = state.tenantRoleAssignments.get(key) ?? {
          id: createId('role-assignment', key),
          personId,
          roleId,
        };
        state.tenantRoleAssignments.set(key, row);
        return { rows: [{ id: row.id }] };
      }

      if (normalized.includes('INSERT INTO EQUIPMENT_ASSETS')) {
        const [organizationId, assetCode, assetType] = values as [string | null, string, string];
        const row = state.equipmentAssets.get(assetCode) ?? {
          id: createId('asset', assetCode),
          organizationId,
          assetCode,
          assetType,
        };
        Object.assign(row, { organizationId, assetType });
        state.equipmentAssets.set(assetCode, row);
        return { rows: [{ id: row.id }] };
      }

      if (normalized.includes('INSERT INTO LOADS')) {
        const [
          loadCode,
          shipperOrganizationId,
          customerOrganizationId,
          dispatcherPersonId,
          equipmentAssetId,
          mode,
          status,
        ] = values as [
          string,
          string | null,
          string | null,
          string | null,
          string | null,
          string | null,
          string,
        ];
        const row = state.loads.get(loadCode) ?? {
          id: createId('load', loadCode),
          loadCode,
          shipperOrganizationId,
          customerOrganizationId,
          dispatcherPersonId,
          equipmentAssetId,
          mode,
          status,
        };
        Object.assign(row, {
          shipperOrganizationId,
          customerOrganizationId,
          dispatcherPersonId,
          equipmentAssetId,
          mode,
          status,
        });
        state.loads.set(loadCode, row);
        return { rows: [{ id: row.id }] };
      }

      if (normalized.includes('INSERT INTO LOAD_STOPS')) {
        const [loadId, locationId, stopSequence, stopType, plannedAt, status] = values as [
          string,
          string,
          number,
          string,
          string | null,
          string,
        ];
        const key = `${loadId}:${stopSequence}`;
        const row = state.loadStops.get(key) ?? {
          id: createId('load-stop', key),
          loadId,
          locationId,
          stopSequence,
          stopType,
          plannedAt,
          status,
        };
        Object.assign(row, { locationId, stopType, plannedAt, status });
        state.loadStops.set(key, row);
        return { rows: [{ id: row.id }] };
      }

      if (normalized.includes('INSERT INTO ACTIVITY_RECORDS')) {
        const [
          loadId,
          loadStopId,
          organizationId,
          personId,
          equipmentAssetId,
          actorPersonId,
          activityType,
          details,
          occurredAt,
        ] = values as [
          string | null,
          string | null,
          string | null,
          string | null,
          string | null,
          string | null,
          string,
          string,
          string,
        ];
        const row: ActivityRow = {
          id: createId('activity', `${activityType}-${state.activityRecords.length + 1}`),
          loadId,
          loadStopId,
          organizationId,
          personId,
          equipmentAssetId,
          actorPersonId,
          activityType,
          details,
          occurredAt,
        };
        state.activityRecords.push(row);
        return { rows: [{ id: row.id }] };
      }

      throw new Error(`Unhandled test query: ${text}`);
    },
  };

  return {
    prisma,
    client,
    queries,
    get state() {
      return state;
    },
    seedUnrelatedPlatformData() {
      const unrelatedTenant: TenantRow = {
        id: createId('tenant', 'other-tenant'),
        name: 'Other Tenant',
        slug: 'other-tenant',
        schemaName: 'tenant_other_tenant',
        status: TenantStatusValues.active,
      };
      const unrelatedUser: PlatformUserRow = {
        id: createId('platform-user', 'other-user@test'),
        email: 'other-user@test.local',
        username: 'other.user',
        passwordHash: 'scrypt$other$hash',
        accountStatus: PlatformUserAccountStatusValues.active,
        displayName: 'Other User',
      };
      state.tenants.set(unrelatedTenant.slug, unrelatedTenant);
      state.platformUsers.set(unrelatedUser.email, unrelatedUser);
    },
    seedUnrelatedTenantDomainData() {
      state.organizations.set('OTHER-ORG', {
        id: createId('organization', 'OTHER-ORG'),
        organizationCode: 'OTHER-ORG',
        displayName: 'Other Org',
        organizationType: 'shipper',
      });
    },
    setTenantSchemaReady(ready: boolean) {
      state.schemaReady = ready;
    },
    snapshot() {
      return {
        schemaReady: state.schemaReady,
        tenantSlugs: Array.from(state.tenants.keys()).sort(),
        platformUserEmails: Array.from(state.platformUsers.keys()).sort(),
        platformUsernames: Array.from(state.platformUsers.values())
          .map((user) => user.username)
          .sort(),
        platformUserStatuses: Array.from(state.platformUsers.values())
          .map((user) => `${user.email}:${user.accountStatus}`)
          .sort(),
        managementSystemTypeKeys: Array.from(state.managementSystemTypes.values())
          .map((type) => `${type.typeCode}:${type.version}`)
          .sort(),
        managementSystemRoleCodes: Array.from(state.controlPlaneRoles.keys()).sort(),
        managementSystemTypeRoleKeys: Array.from(state.managementSystemTypeRoles.values())
          .map((typeRole) => {
            const managementSystemType = Array.from(state.managementSystemTypes.values()).find(
              (type) => type.id === typeRole.managementSystemTypeId,
            );
            const role = Array.from(state.controlPlaneRoles.values()).find(
              (candidate) => candidate.id === typeRole.roleId,
            );

            return `${managementSystemType?.typeCode ?? 'unknown'}:${managementSystemType?.version ?? 'unknown'}:${role?.roleCode ?? 'unknown'}:${typeRole.isDefault}`;
          })
          .sort(),
        organizationCodes: Array.from(state.organizations.keys()).sort(),
        locationCodes: Array.from(state.locations.keys()).sort(),
        personCodes: Array.from(state.people.keys()).sort(),
        roleCodes: Array.from(state.tenantRoleDefinitions.keys()).sort(),
        assetCodes: Array.from(state.equipmentAssets.keys()).sort(),
        loadCodes: Array.from(state.loads.keys()).sort(),
        referenceDataCodes: Array.from(state.referenceDataSets.keys()).sort(),
        activityCount: state.activityRecords.length,
      };
    },
  };
};

const clearTable = (
  tableName: (typeof LOCAL_SEED_RESET_TABLES)[number],
  state: HarnessState,
): void => {
  switch (tableName) {
    case 'activity_records':
      state.activityRecords = [];
      return;
    case 'load_stops':
      state.loadStops.clear();
      return;
    case 'loads':
      state.loads.clear();
      return;
    case 'equipment_assets':
      state.equipmentAssets.clear();
      return;
    case 'tenant_role_assignments':
      state.tenantRoleAssignments.clear();
      return;
    case 'tenant_role_definitions':
      state.tenantRoleDefinitions.clear();
      return;
    case 'people':
      state.people.clear();
      return;
    case 'locations':
      state.locations.clear();
      return;
    case 'organizations':
      state.organizations.clear();
      return;
    case 'reference_data_sets':
      state.referenceDataSets.clear();
      return;
  }
};

export const expectedCanonicalTenantSlug = LOCAL_SEED_TENANT.slug;
export const expectedCanonicalTenantSchemaName = LOCAL_SEED_TENANT.schemaName;
export const expectedSeededUserEmails = [
  LOCAL_SEED_USERS.superAdmin.email,
  LOCAL_SEED_USERS.tenantAdmin.email,
  LOCAL_SEED_USERS.tenantUser.email,
  LOCAL_SEED_EDGE_CASE_USERS.disabledUser.email,
  LOCAL_SEED_EDGE_CASE_USERS.tenantUserOrphan.email,
  LOCAL_SEED_EDGE_CASE_USERS.tenantAdminMulti.email,
];
export const expectedSeededUsernames = [
  LOCAL_SEED_USERS.superAdmin.username,
  LOCAL_SEED_USERS.tenantAdmin.username,
  LOCAL_SEED_USERS.tenantUser.username,
  LOCAL_SEED_EDGE_CASE_USERS.disabledUser.username,
  LOCAL_SEED_EDGE_CASE_USERS.tenantUserOrphan.username,
  LOCAL_SEED_EDGE_CASE_USERS.tenantAdminMulti.username,
];
export const expectedReferenceDataCodes = [
  'asset-types',
  'load-modes',
  'location-types',
  'org-types',
];
export const expectedOrganizationCodes = ['ACME-CARRIER', 'ACME-CUSTOMER', 'ACME-SHIPPER'];
export const expectedLocationCodes = ['CHI-WH1', 'CLE-PORT1', 'DET-YARD1'];
export const expectedPersonCodes = ['DISPATCH-CHI', 'DRIVER-CLE', 'OPS-DET'];
export const expectedRoleCodes = [RoleCodeEnum.DISPATCHER, RoleCodeEnum.DRIVER];
export const expectedAssetCodes = ['TRACTOR-100', 'TRAILER-200'];
export const expectedLoadCodes = ['LOAD-1000', 'LOAD-1001'];
export const expectedCanonicalDeterministicLookupFields = [
  'tenant.slug',
  'tenant.schema_name',
  `platform_user.email:${LOCAL_SEED_USERS.superAdmin.email}`,
  `platform_user.username:${LOCAL_SEED_USERS.superAdmin.username}`,
  `platform_user.email:${LOCAL_SEED_USERS.tenantAdmin.email}`,
  `platform_user.username:${LOCAL_SEED_USERS.tenantAdmin.username}`,
  `platform_user.email:${LOCAL_SEED_USERS.tenantUser.email}`,
  `platform_user.username:${LOCAL_SEED_USERS.tenantUser.username}`,
  'management_system_types.type_code',
  'management_system_types.version',
  'roles.role_code',
  'management_system_type_roles.is_default',
  'reference_data_sets.data_set_code',
  'organizations.organization_code',
  'locations.location_code',
  'people.person_code',
  'tenant_role_definitions.role_code',
  'equipment_assets.asset_code',
  'loads.load_code',
];

export const createExpectedCanonicalSnapshot = (): Record<string, unknown> => ({
  schemaReady: true,
  tenantSlugs: [expectedCanonicalTenantSlug, LOCAL_SEED_SECONDARY_TENANT.slug].sort(),
  platformUserEmails: [...expectedSeededUserEmails].sort(),
  platformUsernames: [...expectedSeededUsernames].sort(),
  platformUserStatuses: [
    `${LOCAL_SEED_USERS.superAdmin.email}:${LOCAL_SEED_USERS.superAdmin.accountStatus}`,
    `${LOCAL_SEED_USERS.tenantAdmin.email}:${LOCAL_SEED_USERS.tenantAdmin.accountStatus}`,
    `${LOCAL_SEED_USERS.tenantUser.email}:${LOCAL_SEED_USERS.tenantUser.accountStatus}`,
    `${LOCAL_SEED_EDGE_CASE_USERS.disabledUser.email}:${LOCAL_SEED_EDGE_CASE_USERS.disabledUser.accountStatus}`,
    `${LOCAL_SEED_EDGE_CASE_USERS.tenantUserOrphan.email}:${LOCAL_SEED_EDGE_CASE_USERS.tenantUserOrphan.accountStatus}`,
    `${LOCAL_SEED_EDGE_CASE_USERS.tenantAdminMulti.email}:${LOCAL_SEED_EDGE_CASE_USERS.tenantAdminMulti.accountStatus}`,
  ].sort(),
  managementSystemTypeKeys: ['dealership:1.0', 'inventory:1.0', 'transportation:1.0'],
  managementSystemRoleCodes: [
    RoleCodeEnum.ADMIN,
    RoleCodeEnum.ACCOUNTANT,
    RoleCodeEnum.DISPATCHER,
    RoleCodeEnum.DRIVER,
    RoleCodeEnum.HUMAN_RESOURCES,
    RoleCodeEnum.TENANT_ADMIN,
    'super_admin',
  ].sort(),
  managementSystemTypeRoleKeys: [
    `dealership:1.0:${RoleCodeEnum.ADMIN}:true`,
    `inventory:1.0:${RoleCodeEnum.ADMIN}:true`,
    `transportation:1.0:${RoleCodeEnum.ACCOUNTANT}:false`,
    `transportation:1.0:${RoleCodeEnum.ADMIN}:true`,
    `transportation:1.0:${RoleCodeEnum.DISPATCHER}:true`,
    `transportation:1.0:${RoleCodeEnum.DRIVER}:true`,
    `transportation:1.0:${RoleCodeEnum.HUMAN_RESOURCES}:false`,
  ].sort(),
  organizationCodes: expectedOrganizationCodes,
  locationCodes: expectedLocationCodes,
  personCodes: expectedPersonCodes,
  roleCodes: expectedRoleCodes,
  assetCodes: expectedAssetCodes,
  loadCodes: expectedLoadCodes,
  referenceDataCodes: expectedReferenceDataCodes,
  activityCount: 4,
});
