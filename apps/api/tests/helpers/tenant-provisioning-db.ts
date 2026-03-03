export type VersionRow = {
  tenantId: string;
  version: string;
  appliedBy: string;
};

export const collectVersionsForTenant = (rows: VersionRow[], tenantId: string) =>
  rows.filter((row) => row.tenantId === tenantId).map((row) => row.version);

export const assertNoDuplicateVersions = (rows: VersionRow[], tenantId: string) => {
  const versions = collectVersionsForTenant(rows, tenantId);
  return new Set(versions).size === versions.length;
};
