export type OrganizationFixture = {
  organizationCode: string;
  displayName: string;
  organizationType: string;
};

export type LocationFixture = {
  organizationCode: string;
  locationCode: string;
  displayName: string;
  locationType: string;
  city: string;
  regionCode: string;
  countryCode: string;
};

export const organizationFixtures: OrganizationFixture[] = [
  {
    organizationCode: "ACME-SHIPPER",
    displayName: "Acme Shipper",
    organizationType: "shipper"
  },
  {
    organizationCode: "ACME-CUSTOMER",
    displayName: "Acme Customer",
    organizationType: "customer"
  },
  {
    organizationCode: "ACME-CARRIER",
    displayName: "Acme Carrier",
    organizationType: "carrier"
  }
];

export const locationFixtures: LocationFixture[] = [
  {
    organizationCode: "ACME-SHIPPER",
    locationCode: "CHI-WH1",
    displayName: "Chicago Warehouse",
    locationType: "warehouse",
    city: "Chicago",
    regionCode: "IL",
    countryCode: "US"
  },
  {
    organizationCode: "ACME-CUSTOMER",
    locationCode: "DET-YARD1",
    displayName: "Detroit Yard",
    locationType: "yard",
    city: "Detroit",
    regionCode: "MI",
    countryCode: "US"
  },
  {
    organizationCode: "ACME-CARRIER",
    locationCode: "CLE-PORT1",
    displayName: "Cleveland Port",
    locationType: "port",
    city: "Cleveland",
    regionCode: "OH",
    countryCode: "US"
  }
];
