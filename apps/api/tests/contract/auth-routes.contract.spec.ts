import request from "supertest";
import { describe, expect, it } from "vitest";

import { buildApp } from "../../src/app.js";
import { AuthErrorCodeEnum } from "../../src/auth/claims.js";
import { AUTH_ACCESS_TOKEN_TTL_SECONDS } from "../../src/auth/default-auth-service.js";
import { AuthRoutingReasonCodeEnum, AuthRoutingStatusEnum } from "../../src/auth/service.js";
import {
  createJwtToken,
  createTamperedJwtToken,
  loginFixtures,
  superAdminClaims,
  tenantAdminMultiTenantClaims,
  tenantUserClaims,
  tenantUserWithoutMembershipClaims
} from "../helpers/auth-fixtures.js";

describe("auth routes contract", () => {
  const app = buildApp();

  it("issues an access token for email login", async () => {
    const startedAt = Math.floor(Date.now() / 1000);
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(loginFixtures.superAdminByEmail);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
    expect(response.body.access_token.split(".")).toHaveLength(3);
    expect(response.body.claims.role).toBe("super_admin");
    expect(response.body.claims.exp).toEqual(expect.any(Number));
    expect(response.body.claims.exp - startedAt).toBeGreaterThanOrEqual(AUTH_ACCESS_TOKEN_TTL_SECONDS - 5);
    expect(response.body.claims.exp - startedAt).toBeLessThanOrEqual(AUTH_ACCESS_TOKEN_TTL_SECONDS + 5);
    expect(response.body.current_user.target_app).toBe("platform");
    expect(response.body.current_user.routing).toEqual({
      status: AuthRoutingStatusEnum.ALLOWED,
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
    expect(response.body.claims.exp).toEqual(expect.any(Number));
    expect(response.body.current_user.principal.username).toBe(loginFixtures.superAdminByUsername.identifier);
  });

  it("rejects tampered signed tokens on current-user", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${createTamperedJwtToken(superAdminClaims)}`);

    expect(response.status).toBe(401);
    expect(response.body.error_code).toBe(AuthErrorCodeEnum.INVALID_CLAIMS);
  });

  it("returns invalid credentials for bad passwords", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ identifier: loginFixtures.tenantAdminByEmail.identifier, password: "WrongPassword123!" });

    expect(response.status).toBe(401);
    expect(response.body.error_code).toBe(AuthErrorCodeEnum.INVALID_CREDENTIALS);
  });

  it("returns disabled-account error for disabled users", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(loginFixtures.disabledUser);

    expect(response.status).toBe(403);
    expect(response.body.error_code).toBe(AuthErrorCodeEnum.DISABLED_ACCOUNT);
  });

  it("returns structured tenant-membership denial when login cannot resolve tenant context", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(loginFixtures.tenantUserWithoutMembership);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error_code: AuthErrorCodeEnum.TENANT_MEMBERSHIP_REQUIRED,
      message: "An active tenant membership is required for this user",
      routing: {
        status: AuthRoutingStatusEnum.ACCESS_DENIED,
        target_app: null,
        reason_code: AuthRoutingReasonCodeEnum.MISSING_ACTIVE_TENANT_MEMBERSHIP
      }
    });
  });

  it("returns tenant-selection-required when multiple active memberships exist", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(loginFixtures.tenantAdminMultiTenant);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error_code: AuthErrorCodeEnum.TENANT_SELECTION_REQUIRED,
      message: "Tenant selection is required and is not yet supported",
      routing: {
        status: AuthRoutingStatusEnum.SELECTION_REQUIRED,
        target_app: null,
        reason_code: AuthRoutingReasonCodeEnum.MULTIPLE_ACTIVE_TENANT_MEMBERSHIPS
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
      status: AuthRoutingStatusEnum.ALLOWED,
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
    expect(response.body.error_code).toBe(AuthErrorCodeEnum.INVALID_CLAIMS);
  });

  it("returns unauthenticated when current-user token is expired", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${createJwtToken({ ...superAdminClaims, exp: Math.floor(Date.now() / 1000) - 1 })}`);

    expect(response.status).toBe(401);
    expect(response.body.error_code).toBe(AuthErrorCodeEnum.UNAUTHENTICATED);
  });

  it("returns structured 403 when an authenticated tenant user lacks active membership", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${createJwtToken(tenantUserWithoutMembershipClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error_code: AuthErrorCodeEnum.TENANT_MEMBERSHIP_REQUIRED,
      message: "An active tenant membership is required for this user",
      routing: {
        status: AuthRoutingStatusEnum.ACCESS_DENIED,
        target_app: null,
        reason_code: AuthRoutingReasonCodeEnum.MISSING_ACTIVE_TENANT_MEMBERSHIP
      }
    });
  });

  it("returns structured selection-required response when multiple memberships are detected", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${createJwtToken(tenantAdminMultiTenantClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error_code: AuthErrorCodeEnum.TENANT_SELECTION_REQUIRED,
      message: "Tenant selection is required and is not yet supported",
      routing: {
        status: AuthRoutingStatusEnum.SELECTION_REQUIRED,
        target_app: null,
        reason_code: AuthRoutingReasonCodeEnum.MULTIPLE_ACTIVE_TENANT_MEMBERSHIPS
      }
    });
  });

  it("returns 204 on logout", async () => {
    const response = await request(app).post("/api/v1/auth/logout").send({});
    expect(response.status).toBe(204);
  });
});
