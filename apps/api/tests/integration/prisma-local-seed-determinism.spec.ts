import { describe, expect, it } from "vitest";

import { runLocalSeed } from "../../prisma/seed.js";
import { createSeedTestHarness } from "../helpers/local-seed-db.js";

describe("prisma local seed determinism", () => {
  it("preserves stable fixture keys and representative seeded data across reruns", async () => {
    const harness = createSeedTestHarness();

    const firstRun = await runLocalSeed({
      prismaClient: harness.prisma,
      client: harness.client
    });
    const firstSnapshot = harness.snapshot();

    const secondRun = await runLocalSeed({
      prismaClient: harness.prisma,
      client: harness.client
    });
    const secondSnapshot = harness.snapshot();

    expect(secondSnapshot).toEqual(firstSnapshot);
    expect(secondRun.deterministicKeys).toEqual(firstRun.deterministicKeys);
    expect(secondRun.deterministicKeys).toContain("organizations.organization_code");
    expect(secondRun.deterministicKeys).toContain("loads.load_code");
    expect(secondSnapshot).toMatchObject({
      referenceDataCodes: ["asset-types", "load-modes", "location-types", "org-types"],
      loadCodes: ["LOAD-1000", "LOAD-1001"],
      roleCodes: ["dispatcher", "driver"]
    });
  });
});
