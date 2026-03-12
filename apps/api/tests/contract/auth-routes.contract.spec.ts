import request from "supertest";
import { describe, expect, it } from "vitest";

import { buildApp } from "../../src/app.js";
import {
  createJwtToken,
  loginFixtures,
  superAdminClaims,
  tenantAdminMultiTenantClaims,
  tenantUserClaims,
  tenantUserWithoutMembershipClaims
} from "../helpers/auth-fixtures.js";

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
    expect(response.body.current_user.routing).toEqual({
      status: "allowed",
      target_app: "platform",
      reason_code: null
    });
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

  it("returns structured tenant-membership denial when login cannot resolve tenant context", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(loginFixtures.tenantUserWithoutMembership);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error_code: "tenant_membership_required",
      message: "An active tenant membership is required for this user",
      routing: {
        status: "access_denied",
        target_app: null,
        reason_code: "missing_active_tenant_membership"
      }
    });
  });

  it("returns tenant-selection-required when multiple active memberships exist", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(loginFixtures.tenantAdminMultiTenant);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error_code: "tenant_selection_required",
      message: "Tenant selection is required and is not yet supported",
      routing: {
        status: "selection_required",
        target_app: null,
        reason_code: "multiple_active_tenant_memberships"
      }
    });
  });

  it("returns current-user context for the authenticated principal", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${createJwtToken(tenantUserClaims)}`);

    expect(response.status).toBe(200);
    expect(response.body.principal.role).toBe("tenant_user");
    expect(response.body.role_context.tenant_id).toBe("tenant-acme");
    expect(response.body.target_app).toBe("tenant");
    expect(response.body.routing).toEqual({
      status: "allowed",
      target_app: "tenant",
      reason_code: null
    });
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

  it("returns structured 403 when an authenticated tenant user lacks active membership", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${createJwtToken(tenantUserWithoutMembershipClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error_code: "tenant_membership_required",
      message: "An active tenant membership is required for this user",
      routing: {
        status: "access_denied",
        target_app: null,
        reason_code: "missing_active_tenant_membership"
      }
    });
  });

  it("returns structured selection-required response when multiple memberships are detected", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${createJwtToken(tenantAdminMultiTenantClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error_code: "tenant_selection_required",
      message: "Tenant selection is required and is not yet supported",
      routing: {
        status: "selection_required",
        target_app: null,
        reason_code: "multiple_active_tenant_memberships"
      }
    });
  });

  it("returns 204 on logout", async () => {
    const response = await request(app).post("/api/v1/auth/logout").send({});
    expect(response.status).toBe(204);
  });
});
