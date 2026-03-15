import { RoleCodeEnum, type RoleCode } from "@crown/types";

export type PersonFixture = {
  organizationCode?: string;
  personCode: string;
  givenName: string;
  familyName: string;
  email?: string;
  phoneNumber?: string;
};

export type TenantRoleFixture = {
  roleCode: RoleCode;
  displayName: string;
  description: string;
};

export type TenantRoleAssignmentFixture = {
  personCode: string;
  roleCode: RoleCode;
};

export type EquipmentAssetFixture = {
  organizationCode?: string;
  assetCode: string;
  assetType: string;
};

export type LoadFixture = {
  loadCode: string;
  shipperOrganizationCode?: string;
  customerOrganizationCode?: string;
  dispatcherPersonCode?: string;
  equipmentAssetCode?: string;
  mode: "road" | "rail" | "air" | "ocean" | "intermodal";
  status: "planned" | "assigned" | "in_transit" | "completed" | "cancelled";
};

export type LoadStopFixture = {
  loadCode: string;
  locationCode: string;
  stopSequence: number;
  stopType: "pickup" | "delivery" | "handoff";
  plannedAt: string;
  status: "planned" | "arrived" | "completed" | "skipped";
};

export type ActivityFixture = {
  subjectLoadCode?: string;
  subjectStop?: { loadCode: string; stopSequence: number };
  subjectOrganizationCode?: string;
  subjectPersonCode?: string;
  subjectAssetCode?: string;
  actorPersonCode?: string;
  activityType: "note" | "status_change" | "arrival" | "departure" | "assignment" | "exception";
  details: string;
  occurredAt: string;
};

export const personFixtures: PersonFixture[] = [
  {
    organizationCode: "ACME-SHIPPER",
    personCode: "DISPATCH-CHI",
    givenName: "Dana",
    familyName: "Dispatch",
    email: "dispatch@acme-local.test"
  },
  {
    organizationCode: "ACME-CARRIER",
    personCode: "DRIVER-CLE",
    givenName: "Casey",
    familyName: "Driver",
    email: "driver@acme-local.test"
  },
  {
    organizationCode: "ACME-CUSTOMER",
    personCode: "OPS-DET",
    givenName: "Taylor",
    familyName: "Ops",
    email: "ops@acme-local.test"
  }
];

export const tenantRoleFixtures: TenantRoleFixture[] = [
  {
    roleCode: RoleCodeEnum.DISPATCHER,
    displayName: "Dispatcher",
    description: "Coordinates loads and assets"
  },
  {
    roleCode: RoleCodeEnum.DRIVER,
    displayName: "Driver",
    description: "Handles assigned moves"
  }
];

export const tenantRoleAssignmentFixtures: TenantRoleAssignmentFixture[] = [
  {
    personCode: "DISPATCH-CHI",
    roleCode: RoleCodeEnum.DISPATCHER
  },
  {
    personCode: "DRIVER-CLE",
    roleCode: RoleCodeEnum.DRIVER
  }
];

export const equipmentAssetFixtures: EquipmentAssetFixture[] = [
  {
    organizationCode: "ACME-CARRIER",
    assetCode: "TRACTOR-100",
    assetType: "tractor"
  },
  {
    organizationCode: "ACME-CARRIER",
    assetCode: "TRAILER-200",
    assetType: "trailer"
  }
];

export const loadFixtures: LoadFixture[] = [
  {
    loadCode: "LOAD-1000",
    shipperOrganizationCode: "ACME-SHIPPER",
    customerOrganizationCode: "ACME-CUSTOMER",
    dispatcherPersonCode: "DISPATCH-CHI",
    equipmentAssetCode: "TRACTOR-100",
    mode: "road",
    status: "assigned"
  },
  {
    loadCode: "LOAD-1001",
    shipperOrganizationCode: "ACME-SHIPPER",
    customerOrganizationCode: "ACME-CUSTOMER",
    dispatcherPersonCode: "DISPATCH-CHI",
    equipmentAssetCode: "TRAILER-200",
    mode: "road",
    status: "planned"
  }
];

export const loadStopFixtures: LoadStopFixture[] = [
  {
    loadCode: "LOAD-1000",
    locationCode: "CHI-WH1",
    stopSequence: 1,
    stopType: "pickup",
    plannedAt: "2026-03-10T08:00:00.000Z",
    status: "completed"
  },
  {
    loadCode: "LOAD-1000",
    locationCode: "DET-YARD1",
    stopSequence: 2,
    stopType: "delivery",
    plannedAt: "2026-03-10T16:00:00.000Z",
    status: "planned"
  },
  {
    loadCode: "LOAD-1001",
    locationCode: "CLE-PORT1",
    stopSequence: 1,
    stopType: "pickup",
    plannedAt: "2026-03-11T09:30:00.000Z",
    status: "planned"
  }
];

export const activityFixtures: ActivityFixture[] = [
  {
    subjectLoadCode: "LOAD-1000",
    actorPersonCode: "DISPATCH-CHI",
    activityType: "assignment",
    details: "Assigned tractor to active load",
    occurredAt: "2026-03-10T07:30:00.000Z"
  },
  {
    subjectStop: {
      loadCode: "LOAD-1000",
      stopSequence: 1
    },
    actorPersonCode: "DRIVER-CLE",
    activityType: "departure",
    details: "Departed Chicago warehouse",
    occurredAt: "2026-03-10T08:10:00.000Z"
  },
  {
    subjectOrganizationCode: "ACME-CUSTOMER",
    actorPersonCode: "OPS-DET",
    activityType: "note",
    details: "Customer confirmed inbound dock window",
    occurredAt: "2026-03-10T10:00:00.000Z"
  },
  {
    subjectAssetCode: "TRAILER-200",
    actorPersonCode: "DISPATCH-CHI",
    activityType: "status_change",
    details: "Trailer staged for next planned load",
    occurredAt: "2026-03-10T11:30:00.000Z"
  }
];
