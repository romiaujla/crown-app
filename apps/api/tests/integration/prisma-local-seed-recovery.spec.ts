import { describe, expect, it } from "vitest";

import { runLocalSeed } from "../../prisma/seed.js";
import { createSeedTestHarness } from "../helpers/local-seed-db.js";

describe("prisma local seed recovery", () => {
  it("preserves out-of-scope platform data and recovers after a controlled partial failure", async () => {
    const harness = createSeedTestHarness();
    harness.seedUnrelatedPlatformData();

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
    expect(Array.from(harness.state.platformUsers.keys()).sort()).toContain("other-user@test.local");
  });
});
