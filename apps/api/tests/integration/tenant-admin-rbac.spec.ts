import request from "supertest";
import { describe, expect, it } from "vitest";

import { buildApp } from "../../src/app.js";
import { createJwtToken, tenantAdminClaims } from "../helpers/auth-fixtures.js";

describe("tenant admin rbac integration", () => {
  const app = buildApp();

  it("allows matching tenant scope", async () => {
    const response = await request(app)
      .post("/api/v1/tenant/access")
      .send({ authClass: "tenant_admin", tenantId: tenantAdminClaims.tenant_id })
      .set("Authorization", `Bearer ${createJwtToken(tenantAdminClaims)}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, namespace: "tenant-admin" });
  });

  it("denies tenant mismatch", async () => {
    const response = await request(app)
      .post("/api/v1/tenant/access")
      .send({ authClass: "tenant_admin", tenantId: "tenant-other" })
      .set("Authorization", `Bearer ${createJwtToken(tenantAdminClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body.error_code).toBe("forbidden_tenant");
  });
});
