import request from "supertest";
import { describe, expect, it } from "vitest";

import { buildApp } from "../../src/app.js";
import { createJwtToken, tenantUserClaims } from "../helpers/auth-fixtures.js";

describe("tenant user rbac integration", () => {
  const app = buildApp();

  it("denies admin path", async () => {
    const response = await request(app)
      .get("/api/v1/tenant/admin/tenant-acme")
      .set("Authorization", `Bearer ${createJwtToken(tenantUserClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body.error_code).toBe("forbidden_role");
  });

  it("denies malformed claims", async () => {
    const malformed = Buffer.from(JSON.stringify({ sub: "user", role: "tenant_user" }), "utf8").toString("base64url");
    const token = `${Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" }), "utf8").toString("base64url")}.${malformed}.sig`;

    const response = await request(app).get("/api/v1/tenant/user/tenant-acme").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.error_code).toBe("invalid_claims");
  });
});
