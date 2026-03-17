import request from "supertest";
import { describe, expect, it } from "vitest";

import { buildApp } from "../../src/app.js";
import { createJwtToken, tenantUserClaims } from "../helpers/auth-fixtures.js";

describe("tenant user auth contract", () => {
  const app = buildApp();

  it("allows tenant_user for matching tenant user route", async () => {
    const response = await request(app)
      .get(`/api/v1/tenant/user/${tenantUserClaims.tenant_id}`)
      .set("Authorization", `Bearer ${createJwtToken(tenantUserClaims)}`);

    expect(response.status).toBe(200);
  });

  it("denies tenant_user for non-matching tenant", async () => {
    const response = await request(app)
      .get("/api/v1/tenant/user/tenant-other")
      .set("Authorization", `Bearer ${createJwtToken(tenantUserClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body.error_code).toBe("forbidden_tenant");
  });

  it("denies tenant_user on tenant admin route", async () => {
    const response = await request(app)
      .get("/api/v1/tenant/admin/tenant-acme")
      .set("Authorization", `Bearer ${createJwtToken(tenantUserClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body.error_code).toBe("forbidden_role");
  });
});
