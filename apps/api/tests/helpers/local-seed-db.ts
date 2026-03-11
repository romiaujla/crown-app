import { LOCAL_SEED_TENANT, LOCAL_SEED_USERS, LOCAL_SEED_RESET_TABLES } from "../../prisma/seed/constants.js";
import type { SeedPrismaClient, SeedSqlClient, SeedQueryResult } from "../../prisma/seed/types.js";

type TenantRow = {
  id: string;
  name: string;
  slug: string;
  schemaName: string;
  status: string;
};

type PlatformUserRow = {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  accountStatus: string;
  displayName: string;
  role: string;
};

type PlatformUserTenantRow = {
  id: string;
  platformUserId: string;
  tenantId: string;
  role: string;
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
  referenceDataSets: new Map(),
  organizations: new Map(),
  locations: new Map(),
  people: new Map(),
  tenantRoleDefinitions: new Map(),
  tenantRoleAssignments: new Map(),
  equipmentAssets: new Map(),
  loads: new Map(),
  loadStops: new Map(),
  activityRecords: []
});

const cloneState = (state: HarnessState): HarnessState => ({
  schemaReady: state.schemaReady,
  tenants: new Map(state.tenants),
  platformUsers: new Map(state.platformUsers),
  platformUserTenants: new Map(state.platformUserTenants),
  referenceDataSets: new Map(state.referenceDataSets),
  organizations: new Map(state.organizations),
  locations: new Map(state.locations),
  people: new Map(state.people),
  tenantRoleDefinitions: new Map(state.tenantRoleDefinitions),
  tenantRoleAssignments: new Map(state.tenantRoleAssignments),
  equipmentAssets: new Map(state.equipmentAssets),
  loads: new Map(state.loads),
  loadStops: new Map(state.loadStops),
  activityRecords: state.activityRecords.map((row) => ({ ...row }))
});

const createId = (prefix: string, key: string): string => `${prefix}-${key.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

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
            ...args.update
          };
          state.tenants.set(updated.slug, updated);
          return updated;
        }

        const created: TenantRow = {
          id: createId("tenant", args.create.slug),
          ...args.create
        };
        state.tenants.set(created.slug, created);
        return created;
      }
    },
    platformUser: {
      async upsert(args) {
        const existing = state.platformUsers.get(args.where.email);
        if (existing) {
          const updated: PlatformUserRow = {
            ...existing,
            ...args.update
          };
          state.platformUsers.set(updated.email, updated);
          return updated;
        }

        const created: PlatformUserRow = {
          id: createId("platform-user", args.create.email),
          ...args.create
        };
        state.platformUsers.set(created.email, created);
        return created;
      }
    },
    platformUserTenant: {
      async upsert(args) {
        const key = `${args.where.platformUserId_tenantId.platformUserId}:${args.where.platformUserId_tenantId.tenantId}`;
        const existing = state.platformUserTenants.get(key);
        if (existing) {
          const updated: PlatformUserTenantRow = {
            ...existing,
            role: args.update.role
          };
          state.platformUserTenants.set(key, updated);
          return updated;
        }

        const created: PlatformUserTenantRow = {
          id: createId("platform-user-tenant", key),
          ...args.create
        };
        state.platformUserTenants.set(key, created);
        return created;
      }
    }
  };

  const client: SeedSqlClient = {
    async connect() {},
    async end() {},
    async query(text: string, values: readonly unknown[] = []): Promise<SeedQueryResult> {
      queries.push(text.trim().replace(/\s+/g, " "));
      const normalized = text.trim().replace(/\s+/g, " ").toUpperCase();

      if (normalized === "BEGIN") {
        transactionState = cloneState(state);
        return { rows: [] };
      }

      if (normalized === "COMMIT") {
        transactionState = null;
        return { rows: [] };
      }

      if (normalized === "ROLLBACK") {
        if (transactionState) {
          state = cloneState(transactionState);
        }
        transactionState = null;
        return { rows: [] };
      }

      if (normalized.startsWith("SET LOCAL SEARCH_PATH TO")) {
        return { rows: [] };
      }

      if (normalized.includes("SELECT TO_REGCLASS($1) AS REGCLASS")) {
        return {
          rows: [{ regclass: state.schemaReady ? "organizations" : null }]
        };
      }

      if (normalized.includes("SELECT TO_REGCLASS('ORGANIZATIONS') AS REGCLASS")) {
        return {
          rows: [{ regclass: state.schemaReady ? "organizations" : null }]
        };
      }

      for (const tableName of LOCAL_SEED_RESET_TABLES) {
        if (normalized === `DELETE FROM "${tableName.toUpperCase()}"` || normalized === `DELETE FROM ${tableName.toUpperCase()}`) {
          clearTable(tableName, state);
          return { rows: [] };
        }
      }

      if (normalized.includes("INSERT INTO REFERENCE_DATA_SETS")) {
        const [dataSetCode, displayName, domainName, valuesJson] = values as [string, string, string, string];
        const row = state.referenceDataSets.get(dataSetCode) ?? {
          id: createId("reference-data", dataSetCode),
          dataSetCode,
          displayName,
          domainName,
          valuesJson
        };
        row.displayName = displayName;
        row.domainName = domainName;
        row.valuesJson = valuesJson;
        state.referenceDataSets.set(dataSetCode, row);
        return { rows: [{ id: row.id }] };
      }

      if (normalized.includes("INSERT INTO ORGANIZATIONS")) {
        const [organizationCode, displayName, organizationType] = values as [string, string, string];
        const row = state.organizations.get(organizationCode) ?? {
          id: createId("organization", organizationCode),
          organizationCode,
          displayName,
          organizationType
        };
        row.displayName = displayName;
        row.organizationType = organizationType;
        state.organizations.set(organizationCode, row);
        return { rows: [{ id: row.id }] };
      }

      if (normalized.includes("INSERT INTO LOCATIONS")) {
        const [organizationId, locationCode, displayName, locationType, city, regionCode, countryCode] = values as [
          string,
          string,
          string,
          string,
          string,
          string,
          string
        ];
        const row = state.locations.get(locationCode) ?? {
          id: createId("location", locationCode),
          organizationId,
          locationCode,
          displayName,
          locationType,
          city,
          regionCode,
          countryCode
        };
        Object.assign(row, { organizationId, displayName, locationType, city, regionCode, countryCode });
        state.locations.set(locationCode, row);
        return { rows: [{ id: row.id }] };
      }

      if (normalized.includes("INSERT INTO PEOPLE")) {
        const [organizationId, personCode, givenName, familyName, email, phoneNumber] = values as [
          string | null,
          string,
          string,
          string,
          string | null,
          string | null
        ];
        const row = state.people.get(personCode) ?? {
          id: createId("person", personCode),
          organizationId,
          personCode,
          givenName,
          familyName,
          email,
          phoneNumber
        };
        Object.assign(row, { organizationId, givenName, familyName, email, phoneNumber });
        state.people.set(personCode, row);
        return { rows: [{ id: row.id }] };
      }

      if (normalized.includes("INSERT INTO TENANT_ROLE_DEFINITIONS")) {
        const [roleCode, displayName, description] = values as [string, string, string];
        const row = state.tenantRoleDefinitions.get(roleCode) ?? {
          id: createId("role", roleCode),
          roleCode,
          displayName,
          description
        };
        Object.assign(row, { displayName, description });
        state.tenantRoleDefinitions.set(roleCode, row);
        return { rows: [{ id: row.id }] };
      }

      if (normalized.includes("INSERT INTO TENANT_ROLE_ASSIGNMENTS")) {
        const [personId, roleId] = values as [string, string];
        const key = `${personId}:${roleId}`;
        const row = state.tenantRoleAssignments.get(key) ?? {
          id: createId("role-assignment", key),
          personId,
          roleId
        };
        state.tenantRoleAssignments.set(key, row);
        return { rows: [{ id: row.id }] };
      }

      if (normalized.includes("INSERT INTO EQUIPMENT_ASSETS")) {
        const [organizationId, assetCode, assetType] = values as [string | null, string, string];
        const row = state.equipmentAssets.get(assetCode) ?? {
          id: createId("asset", assetCode),
          organizationId,
          assetCode,
          assetType
        };
        Object.assign(row, { organizationId, assetType });
        state.equipmentAssets.set(assetCode, row);
        return { rows: [{ id: row.id }] };
      }

      if (normalized.includes("INSERT INTO LOADS")) {
        const [loadCode, shipperOrganizationId, customerOrganizationId, dispatcherPersonId, equipmentAssetId, mode, status] = values as [
          string,
          string | null,
          string | null,
          string | null,
          string | null,
          string | null,
          string
        ];
        const row = state.loads.get(loadCode) ?? {
          id: createId("load", loadCode),
          loadCode,
          shipperOrganizationId,
          customerOrganizationId,
          dispatcherPersonId,
          equipmentAssetId,
          mode,
          status
        };
        Object.assign(row, {
          shipperOrganizationId,
          customerOrganizationId,
          dispatcherPersonId,
          equipmentAssetId,
          mode,
          status
        });
        state.loads.set(loadCode, row);
        return { rows: [{ id: row.id }] };
      }

      if (normalized.includes("INSERT INTO LOAD_STOPS")) {
        const [loadId, locationId, stopSequence, stopType, plannedAt, status] = values as [
          string,
          string,
          number,
          string,
          string | null,
          string
        ];
        const key = `${loadId}:${stopSequence}`;
        const row = state.loadStops.get(key) ?? {
          id: createId("load-stop", key),
          loadId,
          locationId,
          stopSequence,
          stopType,
          plannedAt,
          status
        };
        Object.assign(row, { locationId, stopType, plannedAt, status });
        state.loadStops.set(key, row);
        return { rows: [{ id: row.id }] };
      }

      if (normalized.includes("INSERT INTO ACTIVITY_RECORDS")) {
        const [loadId, loadStopId, organizationId, personId, equipmentAssetId, actorPersonId, activityType, details, occurredAt] = values as [
          string | null,
          string | null,
          string | null,
          string | null,
          string | null,
          string | null,
          string,
          string,
          string
        ];
        const row: ActivityRow = {
          id: createId("activity", `${activityType}-${state.activityRecords.length + 1}`),
          loadId,
          loadStopId,
          organizationId,
          personId,
          equipmentAssetId,
          actorPersonId,
          activityType,
          details,
          occurredAt
        };
        state.activityRecords.push(row);
        return { rows: [{ id: row.id }] };
      }

      throw new Error(`Unhandled test query: ${text}`);
    }
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
        id: createId("tenant", "other-tenant"),
        name: "Other Tenant",
        slug: "other-tenant",
        schemaName: "tenant_other_tenant",
        status: "active"
      };
      const unrelatedUser: PlatformUserRow = {
        id: createId("platform-user", "other-user@test"),
        email: "other-user@test.local",
        username: "other.user",
        passwordHash: "scrypt$other$hash",
        accountStatus: "active",
        displayName: "Other User",
        role: "viewer"
      };
      state.tenants.set(unrelatedTenant.slug, unrelatedTenant);
      state.platformUsers.set(unrelatedUser.email, unrelatedUser);
    },
    seedUnrelatedTenantDomainData() {
      state.organizations.set("OTHER-ORG", {
        id: createId("organization", "OTHER-ORG"),
        organizationCode: "OTHER-ORG",
        displayName: "Other Org",
        organizationType: "shipper"
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
        organizationCodes: Array.from(state.organizations.keys()).sort(),
        locationCodes: Array.from(state.locations.keys()).sort(),
        personCodes: Array.from(state.people.keys()).sort(),
        roleCodes: Array.from(state.tenantRoleDefinitions.keys()).sort(),
        assetCodes: Array.from(state.equipmentAssets.keys()).sort(),
        loadCodes: Array.from(state.loads.keys()).sort(),
        referenceDataCodes: Array.from(state.referenceDataSets.keys()).sort(),
        activityCount: state.activityRecords.length
      };
    }
  };
};

const clearTable = (tableName: (typeof LOCAL_SEED_RESET_TABLES)[number], state: HarnessState): void => {
  switch (tableName) {
    case "activity_records":
      state.activityRecords = [];
      return;
    case "load_stops":
      state.loadStops.clear();
      return;
    case "loads":
      state.loads.clear();
      return;
    case "equipment_assets":
      state.equipmentAssets.clear();
      return;
    case "tenant_role_assignments":
      state.tenantRoleAssignments.clear();
      return;
    case "tenant_role_definitions":
      state.tenantRoleDefinitions.clear();
      return;
    case "people":
      state.people.clear();
      return;
    case "locations":
      state.locations.clear();
      return;
    case "organizations":
      state.organizations.clear();
      return;
    case "reference_data_sets":
      state.referenceDataSets.clear();
      return;
  }
};

export const expectedCanonicalTenantSlug = LOCAL_SEED_TENANT.slug;
export const expectedCanonicalTenantSchemaName = LOCAL_SEED_TENANT.schemaName;
export const expectedSeededUserEmails = [
  LOCAL_SEED_USERS.superAdmin.email,
  LOCAL_SEED_USERS.tenantAdmin.email,
  LOCAL_SEED_USERS.tenantUser.email
];
export const expectedReferenceDataCodes = ["asset-types", "load-modes", "location-types", "org-types"];
export const expectedOrganizationCodes = ["ACME-CARRIER", "ACME-CUSTOMER", "ACME-SHIPPER"];
export const expectedLocationCodes = ["CHI-WH1", "CLE-PORT1", "DET-YARD1"];
export const expectedPersonCodes = ["DISPATCH-CHI", "DRIVER-CLE", "OPS-DET"];
export const expectedRoleCodes = ["dispatcher", "driver"];
export const expectedAssetCodes = ["TRACTOR-100", "TRAILER-200"];
export const expectedLoadCodes = ["LOAD-1000", "LOAD-1001"];
export const expectedCanonicalDeterministicLookupFields = [
  "tenant.slug",
  "tenant.schema_name",
  `platform_user.email:${LOCAL_SEED_USERS.superAdmin.email}`,
  `platform_user.username:${LOCAL_SEED_USERS.superAdmin.username}`,
  `platform_user.email:${LOCAL_SEED_USERS.tenantAdmin.email}`,
  `platform_user.username:${LOCAL_SEED_USERS.tenantAdmin.username}`,
  `platform_user.email:${LOCAL_SEED_USERS.tenantUser.email}`,
  `platform_user.username:${LOCAL_SEED_USERS.tenantUser.username}`,
  "reference_data_sets.data_set_code",
  "organizations.organization_code",
  "locations.location_code",
  "people.person_code",
  "tenant_role_definitions.role_code",
  "equipment_assets.asset_code",
  "loads.load_code"
];

export const createExpectedCanonicalSnapshot = (): Record<string, unknown> => ({
  schemaReady: true,
  tenantSlugs: [expectedCanonicalTenantSlug],
  platformUserEmails: [...expectedSeededUserEmails].sort(),
  platformUsernames: [
    LOCAL_SEED_USERS.superAdmin.username,
    LOCAL_SEED_USERS.tenantAdmin.username,
    LOCAL_SEED_USERS.tenantUser.username
  ].sort(),
  platformUserStatuses: [
    `${LOCAL_SEED_USERS.superAdmin.email}:${LOCAL_SEED_USERS.superAdmin.accountStatus}`,
    `${LOCAL_SEED_USERS.tenantAdmin.email}:${LOCAL_SEED_USERS.tenantAdmin.accountStatus}`,
    `${LOCAL_SEED_USERS.tenantUser.email}:${LOCAL_SEED_USERS.tenantUser.accountStatus}`
  ].sort(),
  organizationCodes: expectedOrganizationCodes,
  locationCodes: expectedLocationCodes,
  personCodes: expectedPersonCodes,
  roleCodes: expectedRoleCodes,
  assetCodes: expectedAssetCodes,
  loadCodes: expectedLoadCodes,
  referenceDataCodes: expectedReferenceDataCodes,
  activityCount: 4
});
