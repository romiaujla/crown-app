import request from "supertest";
import { describe, expect, it, vi } from "vitest";

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
            status: "active" as const,
            createdAt: "2026-03-01T12:00:00.000Z",
            updatedAt: "2026-03-10T09:30:00.000Z"
          }
        ]
      },
      meta: {
        totalRecords: 1,
        filters: {
          search: "acme",
          status: "active" as const
        }
      }
    }));
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ listTenants }) });

    const response = await request(app)
      .post("/api/v1/platform/tenants/search")
      .set("Authorization", `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ filter: { search: "acme", status: "active" } });

    expect(response.status).toBe(200);
    expect(response.body.data.tenantList).toHaveLength(1);
    expect(response.body.meta.totalRecords).toBe(1);
    expect(listTenants).toHaveBeenCalledWith({
      search: "acme",
      status: "active"
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
          search: null,
          status: null
        }
      }
    }));
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ listTenants }) });

    const response = await request(app)
      .post("/api/v1/platform/tenants/search")
      .set("Authorization", `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ filter: {} });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        tenantList: []
      },
      meta: {
        totalRecords: 0,
        filters: {
          search: null,
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
      .send({ filter: { status: "destroyed" } });

    expect(response.status).toBe(400);
    expect(response.body.error_code).toBe("validation_error");
    expect(listTenants).not.toHaveBeenCalled();
  });

  it("returns 401 for missing token", async () => {
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ listTenants: vi.fn() }) });

    const response = await request(app).post("/api/v1/platform/tenants/search").send({ filter: {} });

    expect(response.status).toBe(401);
    expect(response.body.error_code).toBe("unauthenticated");
  });

  it("returns 403 for non-super-admin", async () => {
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ listTenants: vi.fn() }) });

    const response = await request(app)
      .post("/api/v1/platform/tenants/search")
      .set("Authorization", `Bearer ${createJwtToken(tenantAdminClaims)}`)
      .send({ filter: {} });

    expect(response.status).toBe(403);
    expect(response.body.error_code).toBe("forbidden_role");
  });
});
