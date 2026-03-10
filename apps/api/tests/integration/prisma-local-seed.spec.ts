import { describe, expect, it } from "vitest";

import { runLocalSeed } from "../../prisma/seed.js";
import { createSeedTestHarness, expectedCanonicalTenantSlug, expectedSeededUserEmails } from "../helpers/local-seed-db.js";

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
    expect(firstRun.loadedCounts.organizations).toBe(3);
    expect(firstRun.loadedCounts.loads).toBe(2);
    expect(harness.snapshot()).toMatchObject({
      tenantSlugs: ["acme-local", "other-tenant"],
      platformUserEmails: [...expectedSeededUserEmails, "other-user@test.local"].sort(),
      organizationCodes: ["ACME-CARRIER", "ACME-CUSTOMER", "ACME-SHIPPER"]
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

    expect(secondRun.loadedCounts.organizations).toBe(3);
    expect(Array.from(harness.state.organizations.keys()).sort()).toEqual(["ACME-CARRIER", "ACME-CUSTOMER", "ACME-SHIPPER"]);
    expect(harness.queries).toContain('DELETE FROM "organizations"');
  });
});
