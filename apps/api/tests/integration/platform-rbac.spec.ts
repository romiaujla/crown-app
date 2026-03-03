import request from "supertest";
import { describe, expect, it } from "vitest";

import { buildApp } from "../../src/app.js";
import { createJwtToken, tenantAdminClaims, tenantUserClaims } from "../helpers/auth-fixtures.js";

describe("platform rbac integration", () => {
  const app = buildApp();

  it("denies tenant_admin", async () => {
    const response = await request(app)
      .get("/api/v1/platform/ping")
      .set("Authorization", `Bearer ${createJwtToken(tenantAdminClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body.error_code).toBe("forbidden_role");
  });

  it("denies tenant_user", async () => {
    const response = await request(app)
      .get("/api/v1/platform/ping")
      .set("Authorization", `Bearer ${createJwtToken(tenantUserClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body.error_code).toBe("forbidden_role");
  });
});
