import { organizationFixtures, locationFixtures } from "./baseline/organizations.js";
import { activityFixtures, equipmentAssetFixtures, loadFixtures, loadStopFixtures, personFixtures, tenantRoleAssignmentFixtures, tenantRoleFixtures } from "./baseline/operations.js";
import { referenceDataFixtures } from "./baseline/reference-data.js";
import { SeedLookupStore } from "./lookups.js";
import { createEmptyLoadedCounts, SeedExecutionError, type SeedLoadedCounts, type SeedPhaseName, type SeedSqlClient } from "./types.js";

type LoadCanonicalBaselineOptions = {
  client: SeedSqlClient;
  failAtPhase?: SeedPhaseName;
};

type IdRow = { id: string };

const maybeFail = (failAtPhase: SeedPhaseName | undefined, phase: SeedPhaseName): void => {
  if (failAtPhase === phase) {
    throw new SeedExecutionError(`Injected seed failure at phase ${phase}`, phase);
  }
};

const queryOne = async (client: SeedSqlClient, text: string, values: readonly unknown[]): Promise<IdRow> => {
  const result = (await client.query(text, values)) as { rows: IdRow[] };

  if (!result.rows[0]?.id) {
    throw new Error(`Expected returning row for query: ${text}`);
  }

  return result.rows[0];
};

export const loadCanonicalBaseline = async ({
  client,
  failAtPhase
}: LoadCanonicalBaselineOptions): Promise<SeedLoadedCounts> => {
  const lookups = new SeedLookupStore();
  const loadedCounts = createEmptyLoadedCounts();

  for (const referenceDataSet of referenceDataFixtures) {
    await queryOne(
      client,
      `
        INSERT INTO reference_data_sets (data_set_code, display_name, domain_name, values_json)
        VALUES ($1, $2, $3, $4::jsonb)
        ON CONFLICT (data_set_code) DO UPDATE
        SET display_name = EXCLUDED.display_name,
            domain_name = EXCLUDED.domain_name,
            values_json = EXCLUDED.values_json,
            status = 'active',
            updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `,
      [
        referenceDataSet.dataSetCode,
        referenceDataSet.displayName,
        referenceDataSet.domainName,
        JSON.stringify(referenceDataSet.valuesJson)
      ]
    );
    loadedCounts.referenceDataSets += 1;
  }

  maybeFail(failAtPhase, "after-reference-data");

  for (const organization of organizationFixtures) {
    const row = await queryOne(
      client,
      `
        INSERT INTO organizations (organization_code, display_name, organization_type)
        VALUES ($1, $2, $3)
        ON CONFLICT (organization_code) DO UPDATE
        SET display_name = EXCLUDED.display_name,
            organization_type = EXCLUDED.organization_type,
            status = 'active',
            updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `,
      [organization.organizationCode, organization.displayName, organization.organizationType]
    );
    lookups.setOrganization(organization.organizationCode, row.id);
    loadedCounts.organizations += 1;
  }

  for (const location of locationFixtures) {
    const row = await queryOne(
      client,
      `
        INSERT INTO locations (organization_id, location_code, display_name, location_type, city, region_code, country_code)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (location_code) DO UPDATE
        SET organization_id = EXCLUDED.organization_id,
            display_name = EXCLUDED.display_name,
            location_type = EXCLUDED.location_type,
            city = EXCLUDED.city,
            region_code = EXCLUDED.region_code,
            country_code = EXCLUDED.country_code,
            status = 'active',
            updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `,
      [
        lookups.getOrganization(location.organizationCode),
        location.locationCode,
        location.displayName,
        location.locationType,
        location.city,
        location.regionCode,
        location.countryCode
      ]
    );
    lookups.setLocation(location.locationCode, row.id);
    loadedCounts.locations += 1;
  }

  maybeFail(failAtPhase, "after-organizations");

  for (const person of personFixtures) {
    const row = await queryOne(
      client,
      `
        INSERT INTO people (organization_id, person_code, given_name, family_name, email, phone_number)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (person_code) DO UPDATE
        SET organization_id = EXCLUDED.organization_id,
            given_name = EXCLUDED.given_name,
            family_name = EXCLUDED.family_name,
            email = EXCLUDED.email,
            phone_number = EXCLUDED.phone_number,
            status = 'active',
            updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `,
      [
        person.organizationCode ? lookups.getOrganization(person.organizationCode) : null,
        person.personCode,
        person.givenName,
        person.familyName,
        person.email ?? null,
        person.phoneNumber ?? null
      ]
    );
    lookups.setPerson(person.personCode, row.id);
    loadedCounts.people += 1;
  }

  for (const roleDefinition of tenantRoleFixtures) {
    const row = await queryOne(
      client,
      `
        INSERT INTO tenant_role_definitions (role_code, display_name, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (role_code) DO UPDATE
        SET display_name = EXCLUDED.display_name,
            description = EXCLUDED.description,
            status = 'active',
            updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `,
      [roleDefinition.roleCode, roleDefinition.displayName, roleDefinition.description]
    );
    lookups.setRole(roleDefinition.roleCode, row.id);
    loadedCounts.tenantRoleDefinitions += 1;
  }

  for (const assignment of tenantRoleAssignmentFixtures) {
    await queryOne(
      client,
      `
        INSERT INTO tenant_role_assignments (person_id, tenant_role_definition_id)
        VALUES ($1, $2)
        ON CONFLICT (person_id, tenant_role_definition_id) DO UPDATE
        SET assignment_status = 'active',
            ended_at = NULL,
            updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `,
      [lookups.getPerson(assignment.personCode), lookups.getRole(assignment.roleCode)]
    );
    loadedCounts.tenantRoleAssignments += 1;
  }

  for (const asset of equipmentAssetFixtures) {
    const row = await queryOne(
      client,
      `
        INSERT INTO equipment_assets (organization_id, asset_code, asset_type)
        VALUES ($1, $2, $3)
        ON CONFLICT (asset_code) DO UPDATE
        SET organization_id = EXCLUDED.organization_id,
            asset_type = EXCLUDED.asset_type,
            status = 'active',
            updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `,
      [asset.organizationCode ? lookups.getOrganization(asset.organizationCode) : null, asset.assetCode, asset.assetType]
    );
    lookups.setAsset(asset.assetCode, row.id);
    loadedCounts.equipmentAssets += 1;
  }

  for (const load of loadFixtures) {
    const row = await queryOne(
      client,
      `
        INSERT INTO loads (load_code, shipper_organization_id, customer_organization_id, dispatcher_person_id, equipment_asset_id, mode, status)
        VALUES ($1, $2, $3, $4, $5, $6::"LoadMode", $7::"LoadStatus")
        ON CONFLICT (load_code) DO UPDATE
        SET shipper_organization_id = EXCLUDED.shipper_organization_id,
            customer_organization_id = EXCLUDED.customer_organization_id,
            dispatcher_person_id = EXCLUDED.dispatcher_person_id,
            equipment_asset_id = EXCLUDED.equipment_asset_id,
            mode = EXCLUDED.mode,
            status = EXCLUDED.status,
            updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `,
      [
        load.loadCode,
        load.shipperOrganizationCode ? lookups.getOrganization(load.shipperOrganizationCode) : null,
        load.customerOrganizationCode ? lookups.getOrganization(load.customerOrganizationCode) : null,
        load.dispatcherPersonCode ? lookups.getPerson(load.dispatcherPersonCode) : null,
        load.equipmentAssetCode ? lookups.getAsset(load.equipmentAssetCode) : null,
        load.mode,
        load.status
      ]
    );
    lookups.setLoad(load.loadCode, row.id);
    loadedCounts.loads += 1;
  }

  for (const stop of loadStopFixtures) {
    const row = await queryOne(
      client,
      `
        INSERT INTO load_stops (load_id, location_id, stop_sequence, stop_type, planned_at, status)
        VALUES ($1, $2, $3, $4::"LoadStopType", $5::timestamp, $6::"LoadStopStatus")
        ON CONFLICT (load_id, stop_sequence) DO UPDATE
        SET location_id = EXCLUDED.location_id,
            stop_type = EXCLUDED.stop_type,
            planned_at = EXCLUDED.planned_at,
            status = EXCLUDED.status,
            updated_at = CURRENT_TIMESTAMP
        RETURNING id
      `,
      [
        lookups.getLoad(stop.loadCode),
        lookups.getLocation(stop.locationCode),
        stop.stopSequence,
        stop.stopType,
        stop.plannedAt,
        stop.status
      ]
    );
    lookups.setStop(stop.loadCode, stop.stopSequence, row.id);
    loadedCounts.loadStops += 1;
  }

  for (const activity of activityFixtures) {
    await queryOne(
      client,
      `
        INSERT INTO activity_records (
          load_id,
          load_stop_id,
          organization_id,
          person_id,
          equipment_asset_id,
          actor_person_id,
          activity_type,
          details,
          occurred_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7::"ActivityType", $8, $9::timestamp)
        RETURNING id
      `,
      [
        activity.subjectLoadCode ? lookups.getLoad(activity.subjectLoadCode) : null,
        activity.subjectStop ? lookups.getStop(activity.subjectStop.loadCode, activity.subjectStop.stopSequence) : null,
        activity.subjectOrganizationCode ? lookups.getOrganization(activity.subjectOrganizationCode) : null,
        activity.subjectPersonCode ? lookups.getPerson(activity.subjectPersonCode) : null,
        activity.subjectAssetCode ? lookups.getAsset(activity.subjectAssetCode) : null,
        activity.actorPersonCode ? lookups.getPerson(activity.actorPersonCode) : null,
        activity.activityType,
        activity.details,
        activity.occurredAt
      ]
    );
    loadedCounts.activityRecords += 1;
  }

  maybeFail(failAtPhase, "after-operations");

  return loadedCounts;
};
