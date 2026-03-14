import { TenantStatusEnum } from "@crown/types";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import type { RequestHandler } from "express";

import { buildApp } from "../../src/app.js";
import { createPlatformTenantsRouter } from "../../src/routes/platform-tenants.js";
import { createJwtToken, superAdminClaims, tenantAdminClaims } from "../helpers/auth-fixtures.js";

describe("platform tenant directory contract", () => {
  it("returns 200 for super_admin", async () => {
    const listTenants = vi.fn(async () => ({
      data: {
        tenantList: [
          {
            tenantId: "tenant-acme",
            name: "Acme Logistics",
            slug: "acme-logistics",
            schemaName: "tenant_acme_logistics",
            status: TenantStatusEnum.ACTIVE,
            createdAt: "2026-03-01T12:00:00.000Z",
            updatedAt: "2026-03-10T09:30:00.000Z"
          }
        ]
      },
      meta: {
        totalRecords: 1,
        filters: {
          name: "acme",
          status: TenantStatusEnum.ACTIVE
        }
      }
    }));
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ listTenants }) });

    const response = await request(app)
      .post("/api/v1/platform/tenants/search")
      .set("Authorization", `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ filters: { name: "acme", status: "active" } });

    expect(response.status).toBe(200);
    expect(response.body.data.tenantList).toHaveLength(1);
    expect(response.body.meta.totalRecords).toBe(1);
    expect(listTenants).toHaveBeenCalledWith({
      name: "acme",
      status: TenantStatusEnum.ACTIVE
    });
  });

  it("returns an empty tenantList when no records match", async () => {
    const listTenants = vi.fn(async () => ({
      data: {
        tenantList: []
      },
      meta: {
        totalRecords: 0,
        filters: {
          name: null,
          status: null
        }
      }
    }));
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ listTenants }) });

    const response = await request(app)
      .post("/api/v1/platform/tenants/search")
      .set("Authorization", `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ filters: {} });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        tenantList: []
      },
      meta: {
        totalRecords: 0,
        filters: {
          name: null,
          status: null
        }
      }
    });
  });

  it("returns 400 for invalid filter", async () => {
    const listTenants = vi.fn();
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ listTenants }) });

    const response = await request(app)
      .post("/api/v1/platform/tenants/search")
      .set("Authorization", `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ filters: { status: "destroyed" } });

    expect(response.status).toBe(400);
    expect(response.body.error_code).toBe("validation_error");
    expect(listTenants).not.toHaveBeenCalled();
  });

  it("accepts hard_deprovisioned as a valid status filter", async () => {
    const listTenants = vi.fn(async () => ({
      data: {
        tenantList: [
          {
            tenantId: "tenant-legacy",
            name: "Legacy Fleet",
            slug: "legacy-fleet",
            schemaName: "tenant_legacy_fleet",
            status: TenantStatusEnum.HARD_DEPROVISIONED,
            createdAt: "2026-03-01T12:00:00.000Z",
            updatedAt: "2026-03-10T09:30:00.000Z"
          }
        ]
      },
      meta: {
        totalRecords: 1,
        filters: {
          name: null,
          status: TenantStatusEnum.HARD_DEPROVISIONED
        }
      }
    }));
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ listTenants }) });

    const response = await request(app)
      .post("/api/v1/platform/tenants/search")
      .set("Authorization", `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ filters: { status: "hard_deprovisioned" } });

    expect(response.status).toBe(200);
    expect(response.body.data.tenantList[0]?.status).toBe("hard_deprovisioned");
    expect(listTenants).toHaveBeenCalledWith({
      status: TenantStatusEnum.HARD_DEPROVISIONED
    });
  });

  it("returns 401 for missing token", async () => {
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ listTenants: vi.fn() }) });

    const response = await request(app).post("/api/v1/platform/tenants/search").send({ filters: {} });

    expect(response.status).toBe(401);
    expect(response.body.error_code).toBe("unauthenticated");
  });

  it("returns 403 for non-super-admin", async () => {
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ listTenants: vi.fn() }) });

    const response = await request(app)
      .post("/api/v1/platform/tenants/search")
      .set("Authorization", `Bearer ${createJwtToken(tenantAdminClaims)}`)
      .send({ filters: {} });

    expect(response.status).toBe(403);
    expect(response.body.error_code).toBe("forbidden_role");
  });

  it("returns 429 when rate limited", async () => {
    const searchRateLimitMiddleware: RequestHandler = (_req, res) => {
      res.status(429).json({ error_code: "rate_limited", message: "Too many tenant directory requests" });
    };
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ listTenants: vi.fn(), searchRateLimitMiddleware }) });

    const response = await request(app)
      .post("/api/v1/platform/tenants/search")
      .set("Authorization", `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ filters: {} });

    expect(response.status).toBe(429);
    expect(response.body.error_code).toBe("rate_limited");
    expect(response.body.message).toBe("Too many tenant directory requests");
  });
});
