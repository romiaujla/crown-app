import request from "supertest";
import { describe, expect, it } from "vitest";

import { buildApp } from "../../src/app.js";
import { createJwtToken, loginFixtures, superAdminClaims, tenantUserClaims } from "../helpers/auth-fixtures.js";

describe("auth routes contract", () => {
  const app = buildApp();

  it("issues an access token for email login", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(loginFixtures.superAdminByEmail);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
    expect(response.body.claims.role).toBe("super_admin");
    expect(response.body.current_user.target_app).toBe("platform");
  });

  it("issues the same contract for username login", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(loginFixtures.superAdminByUsername);

    expect(response.status).toBe(200);
    expect(response.body.claims.role).toBe("super_admin");
    expect(response.body.current_user.principal.username).toBe(loginFixtures.superAdminByUsername.identifier);
  });

  it("returns invalid credentials for bad passwords", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ identifier: loginFixtures.tenantAdminByEmail.identifier, password: "WrongPassword123!" });

    expect(response.status).toBe(401);
    expect(response.body.error_code).toBe("invalid_credentials");
  });

  it("returns disabled-account error for disabled users", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(loginFixtures.disabledUser);

    expect(response.status).toBe(403);
    expect(response.body.error_code).toBe("disabled_account");
  });

  it("returns current-user context for the authenticated principal", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${createJwtToken(tenantUserClaims)}`);

    expect(response.status).toBe(200);
    expect(response.body.principal.role).toBe("tenant_user");
    expect(response.body.role_context.tenant_id).toBe("tenant-acme");
    expect(response.body.target_app).toBe("tenant");
  });

  it("returns invalid claims when current-user token cannot be resolved", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set(
        "Authorization",
        `Bearer ${createJwtToken({ ...superAdminClaims, sub: "missing-user" })}`
      );

    expect(response.status).toBe(401);
    expect(response.body.error_code).toBe("invalid_claims");
  });

  it("returns 204 on logout", async () => {
    const response = await request(app).post("/api/v1/auth/logout").send({});
    expect(response.status).toBe(204);
  });
});
