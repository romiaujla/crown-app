import { describe, expect, it } from "vitest";

import { loadTenantMigrations } from "../../src/tenant/migration-loader.js";

describe("tenant migration loader integration", () => {
  it("loads the canonical Prisma-generated foundational baseline first", async () => {
    const migrations = await loadTenantMigrations();

    expect(migrations[0]).toMatchObject({
      version: "0001_base.001_foundational_tms_schema",
      description: "foundational tms schema"
    });
  });
});
