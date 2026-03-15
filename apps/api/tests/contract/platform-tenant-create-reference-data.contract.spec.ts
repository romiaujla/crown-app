import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import type { RequestHandler } from "express";

import { buildApp } from "../../src/app.js";
import { createPlatformTenantsRouter } from "../../src/routes/platform-tenants.js";
import { createJwtToken, superAdminClaims, tenantAdminClaims } from "../helpers/auth-fixtures.js";

describe("platform tenant create reference data contract", () => {
  it("returns 200 for super_admin", async () => {
    const getReferenceData = vi.fn(async () => ({
      data: {
        managementSystemTypes: [
          {
            typeCode: "transportation",
            version: "1.0",
            displayName: "Transportation Management System",
            description: "Transportation workflows",
            roleOptions: [
              {
                roleCode: "tenant_admin",
                displayName: "Admin",
                description: "Baseline administrator role.",
                isDefault: true,
                isRequired: true
              }
            ]
          }
        ]
      }
    }));
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ getReferenceData }) });

    const response = await request(app)
      .get("/api/v1/platform/tenant/reference-data")
      .set("Authorization", `Bearer ${createJwtToken(superAdminClaims)}`);

    expect(response.status).toBe(200);
    expect(response.body.data.managementSystemTypes).toHaveLength(1);
    expect(response.body.data.managementSystemTypes[0]?.roleOptions[0]?.isRequired).toBe(true);
    expect(getReferenceData).toHaveBeenCalledWith();
  });

  it("returns an empty managementSystemTypes collection when no records match", async () => {
    const getReferenceData = vi.fn(async () => ({
      data: {
        managementSystemTypes: []
      }
    }));
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ getReferenceData }) });

    const response = await request(app)
      .get("/api/v1/platform/tenant/reference-data")
      .set("Authorization", `Bearer ${createJwtToken(superAdminClaims)}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        managementSystemTypes: []
      }
    });
  });

  it("returns 401 for missing token", async () => {
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ getReferenceData: vi.fn() }) });

    const response = await request(app).get("/api/v1/platform/tenant/reference-data");

    expect(response.status).toBe(401);
    expect(response.body.error_code).toBe("unauthenticated");
  });

  it("returns 403 for non-super-admin", async () => {
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ getReferenceData: vi.fn() }) });

    const response = await request(app)
      .get("/api/v1/platform/tenant/reference-data")
      .set("Authorization", `Bearer ${createJwtToken(tenantAdminClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body.error_code).toBe("forbidden_role");
  });

  it("returns 429 when rate limited", async () => {
    const searchRateLimitMiddleware: RequestHandler = (_req, res) => {
      res.status(429).json({ error_code: "rate_limited", message: "Too many tenant directory requests" });
    };
    const app = buildApp({
      platformTenantsRouter: createPlatformTenantsRouter({ getReferenceData: vi.fn(), searchRateLimitMiddleware })
    });

    const response = await request(app)
      .get("/api/v1/platform/tenant/reference-data")
      .set("Authorization", `Bearer ${createJwtToken(superAdminClaims)}`);

    expect(response.status).toBe(429);
    expect(response.body.error_code).toBe("rate_limited");
    expect(response.body.message).toBe("Too many tenant directory requests");
  });
});
