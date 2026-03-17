import { LOCAL_SEED_USERS } from "./constants.js";
import type { SeedExecutionSummary, SeedLoadedCounts } from "./types.js";

const deterministicKeys = [
  "tenant.slug",
  "tenant.schema_name",
  `platform_user.email:${LOCAL_SEED_USERS.superAdmin.email}`,
  `platform_user.username:${LOCAL_SEED_USERS.superAdmin.username}`,
  `platform_user.email:${LOCAL_SEED_USERS.tenantAdmin.email}`,
  `platform_user.username:${LOCAL_SEED_USERS.tenantAdmin.username}`,
  `platform_user.email:${LOCAL_SEED_USERS.tenantUser.email}`,
  `platform_user.username:${LOCAL_SEED_USERS.tenantUser.username}`,
  "management_system_types.type_code",
  "management_system_types.version",
  "roles.role_code",
  "management_system_type_roles.is_default",
  "reference_data_sets.data_set_code",
  "organizations.organization_code",
  "locations.location_code",
  "people.person_code",
  "tenant_role_definitions.role_code",
  "equipment_assets.asset_code",
  "loads.load_code"
];

export const createSeedExecutionSummary = (
  tenantSlug: string,
  schemaName: string,
  loadedCounts: SeedLoadedCounts,
  tenantId: string,
  platformUserIds: { superAdmin: string; tenantAdmin: string; tenantUser: string },
  edgeCaseUserIds: { disabledUser: string; tenantUserOrphan: string; tenantAdminMulti: string }
): SeedExecutionSummary => ({
  tenantId,
  tenantSlug,
  schemaName,
  loadedCounts,
  deterministicKeys,
  platformUserIds,
  edgeCaseUserIds
});

export const formatSeedExecutionSummary = (summary: SeedExecutionSummary): string => {
  const countLines = Object.entries(summary.loadedCounts).map(([label, count]) => `${label}: ${count}`);
  const keyLines = summary.deterministicKeys.map((key) => `- ${key}`);

  return [
    `Seeded tenant ${summary.tenantSlug} (${summary.schemaName})`,
    ...countLines,
    "Deterministic lookup keys:",
    ...keyLines
  ].join("\n");
};
