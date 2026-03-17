import request from "supertest";
import { describe, expect, it } from "vitest";

import { buildApp } from "../../src/app.js";
import { createJwtToken, tenantAdminClaims } from "../helpers/auth-fixtures.js";

describe("tenant admin auth contract", () => {
  const app = buildApp();

  it("allows tenant_admin for matching tenant", async () => {
    const response = await request(app)
      .post("/api/v1/tenant/access")
      .send({ authClass: "tenant_admin", tenantId: tenantAdminClaims.tenant_id })
      .set("Authorization", `Bearer ${createJwtToken(tenantAdminClaims)}`);

    expect(response.status).toBe(200);
  });

  it("denies tenant_admin for non-matching tenant", async () => {
    const response = await request(app)
      .post("/api/v1/tenant/access")
      .send({ authClass: "tenant_admin", tenantId: "tenant-other" })
      .set("Authorization", `Bearer ${createJwtToken(tenantAdminClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body.error_code).toBe("forbidden_tenant");
  });
});
