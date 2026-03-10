export type ReferenceDataFixture = {
  dataSetCode: string;
  displayName: string;
  domainName: string;
  valuesJson: Record<string, string[]>;
};

export const referenceDataFixtures: ReferenceDataFixture[] = [
  {
    dataSetCode: "org-types",
    displayName: "Organization Types",
    domainName: "organizations",
    valuesJson: {
      values: ["shipper", "customer", "carrier"]
    }
  },
  {
    dataSetCode: "location-types",
    displayName: "Location Types",
    domainName: "locations",
    valuesJson: {
      values: ["warehouse", "port", "yard"]
    }
  },
  {
    dataSetCode: "asset-types",
    displayName: "Equipment Asset Types",
    domainName: "equipment_assets",
    valuesJson: {
      values: ["tractor", "trailer"]
    }
  },
  {
    dataSetCode: "load-modes",
    displayName: "Load Modes",
    domainName: "loads",
    valuesJson: {
      values: ["road", "rail", "intermodal"]
    }
  }
];
