import { describe, expect, it } from "vitest";

import { runLocalSeed } from "../../prisma/seed.js";
import {
  createExpectedCanonicalSnapshot,
  createSeedTestHarness,
  expectedCanonicalTenantSchemaName,
  expectedCanonicalTenantSlug,
  expectedOrganizationCodes,
  expectedSeededUserEmails,
  expectedSeededUsernames
} from "../helpers/local-seed-db.js";

describe("prisma local seed baseline", () => {
  it("creates the canonical baseline on first run and replaces stale tenant-domain data on rerun", async () => {
    const harness = createSeedTestHarness();
    harness.seedUnrelatedPlatformData();
    harness.seedUnrelatedTenantDomainData();

    const firstRun = await runLocalSeed({
      prismaClient: harness.prisma,
      client: harness.client
    });

    expect(firstRun.tenantSlug).toBe(expectedCanonicalTenantSlug);
    expect(firstRun.schemaName).toBe(expectedCanonicalTenantSchemaName);
    expect(firstRun.loadedCounts.organizations).toBe(3);
    expect(firstRun.loadedCounts.loads).toBe(2);
    expect(harness.snapshot()).toMatchObject({
      tenantSlugs: ["acme-local", "other-tenant"],
      platformUserEmails: [...expectedSeededUserEmails, "other-user@test.local"].sort(),
      platformUsernames: ["other.user", ...expectedSeededUsernames].sort(),
      managementSystemTypeKeys: ["dealership:1.0", "inventory:1.0", "transportation:1.0"],
      organizationCodes: expectedOrganizationCodes
    });

    harness.state.organizations.set("STALE-ORG", {
      id: "organization-stale-org",
      organizationCode: "STALE-ORG",
      displayName: "Stale Org",
      organizationType: "customer"
    });

    const secondRun = await runLocalSeed({
      prismaClient: harness.prisma,
      client: harness.client
    });
    const expectedCanonicalSnapshot = createExpectedCanonicalSnapshot() as {
      platformUsernames: string[];
      platformUserStatuses: string[];
    };

    expect(secondRun.loadedCounts.organizations).toBe(3);
    expect(secondRun.schemaName).toBe(expectedCanonicalTenantSchemaName);
    expect(harness.snapshot()).toMatchObject({
      ...expectedCanonicalSnapshot,
      tenantSlugs: ["acme-local", "other-tenant"],
      platformUserEmails: [...expectedSeededUserEmails, "other-user@test.local"].sort(),
      platformUsernames: [...expectedCanonicalSnapshot.platformUsernames, "other.user"].sort(),
      platformUserStatuses: [...expectedCanonicalSnapshot.platformUserStatuses, "other-user@test.local:active"].sort()
    });
    expect(harness.queries).toContain('DELETE FROM "organizations"');
  });

  it("bootstraps the canonical tenant schema automatically when it is missing", async () => {
    const harness = createSeedTestHarness();
    harness.setTenantSchemaReady(false);

    const summary = await runLocalSeed({
      prismaClient: harness.prisma,
      client: harness.client,
      bootstrapTenantSchema: async () => {
        harness.setTenantSchemaReady(true);
      }
    });

    expect(summary.tenantSlug).toBe(expectedCanonicalTenantSlug);
    expect(summary.schemaName).toBe(expectedCanonicalTenantSchemaName);
    expect(harness.snapshot()).toMatchObject({
      schemaReady: true,
      managementSystemTypeKeys: ["dealership:1.0", "inventory:1.0", "transportation:1.0"],
      organizationCodes: expectedOrganizationCodes
    });
  });
});
