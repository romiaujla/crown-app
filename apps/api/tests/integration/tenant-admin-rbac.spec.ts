import request from "supertest";
import { describe, expect, it } from "vitest";

import { buildApp } from "../../src/app.js";
import { createJwtToken, tenantAdminClaims } from "../helpers/auth-fixtures.js";

describe("tenant admin rbac integration", () => {
  const app = buildApp();

  it("denies tenant mismatch", async () => {
    const response = await request(app)
      .get("/api/v1/tenant/admin/tenant-other")
      .set("Authorization", `Bearer ${createJwtToken(tenantAdminClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body.error_code).toBe("forbidden_tenant");
  });
});
