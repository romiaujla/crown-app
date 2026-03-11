import { describe, expect, it } from "vitest";

import { runLocalSeed } from "../../prisma/seed.js";
import { createExpectedCanonicalSnapshot, createSeedTestHarness } from "../helpers/local-seed-db.js";

describe("prisma local seed recovery", () => {
  it("preserves out-of-scope platform data and recovers after a controlled partial failure", async () => {
    const harness = createSeedTestHarness();
    harness.seedUnrelatedPlatformData();
    harness.seedUnrelatedTenantDomainData();

    await runLocalSeed({
      prismaClient: harness.prisma,
      client: harness.client
    });
    const baselineSnapshot = harness.snapshot();

    await expect(
      runLocalSeed({
        prismaClient: harness.prisma,
        client: harness.client,
        failAtPhase: "after-reference-data"
      })
    ).rejects.toThrow("Injected seed failure");

    expect(harness.snapshot()).toEqual(baselineSnapshot);

    const recovered = await runLocalSeed({
      prismaClient: harness.prisma,
      client: harness.client
    });

    expect(recovered.loadedCounts.activityRecords).toBe(4);
    expect(harness.snapshot()).toEqual(baselineSnapshot);
    const expectedCanonicalSnapshot = createExpectedCanonicalSnapshot() as {
      platformUsernames: string[];
      platformUserStatuses: string[];
    };
    expect(harness.snapshot()).toMatchObject({
      ...expectedCanonicalSnapshot,
      tenantSlugs: ["acme-local", "other-tenant"],
      platformUserEmails: [
        "other-user@test.local",
        "super-admin@acme-local.test",
        "tenant-admin@acme-local.test",
        "tenant-user@acme-local.test"
      ],
      platformUsernames: [...expectedCanonicalSnapshot.platformUsernames, "other.user"].sort(),
      platformUserStatuses: [...expectedCanonicalSnapshot.platformUserStatuses, "other-user@test.local:active"].sort()
    });
  });
});
