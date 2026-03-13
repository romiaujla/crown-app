import request from "supertest";
import { describe, expect, it, vi } from "vitest";

import { buildApp } from "../../src/app.js";
import type { DashboardOverviewResponse } from "../../src/platform/dashboard/contracts.js";
import { createPlatformDashboardOverviewRouter } from "../../src/routes/platform-dashboard-overview.js";
import { createJwtToken, superAdminClaims, tenantAdminClaims, tenantUserClaims } from "../helpers/auth-fixtures.js";

const createOverviewPayload = (): DashboardOverviewResponse => ({
  widgets: {
    tenant_summary: {
      total_tenant_count: 3,
      tenant_status_counts: [
        { status: "active", count: 1 },
        { status: "inactive", count: 1 },
        { status: "provisioning", count: 1 },
        { status: "provisioning_failed", count: 0 }
      ]
    }
  }
});

describe("platform dashboard overview contract", () => {
  it("returns 200 with the widgets envelope for super_admin", async () => {
    const getOverview = vi.fn(async () => createOverviewPayload());
    const app = buildApp({
      platformDashboardOverviewRouter: createPlatformDashboardOverviewRouter({ getOverview })
    });

    const response = await request(app)
      .get("/api/v1/platform/dashboard/overview")
      .set("Authorization", `Bearer ${createJwtToken(superAdminClaims)}`);

    expect(response.status).toBe(200);
    expect(response.body.widgets.tenant_summary.total_tenant_count).toBe(3);
    expect(response.body.widgets.tenant_summary.tenant_status_counts).toEqual([
      { status: "active", count: 1 },
      { status: "inactive", count: 1 },
      { status: "provisioning", count: 1 },
      { status: "provisioning_failed", count: 0 }
    ]);
    expect(response.body.widgets.tenant_summary.recent_activity).toBeUndefined();
  });

  it("returns 401 for missing token", async () => {
    const getOverview = vi.fn(async () => createOverviewPayload());
    const app = buildApp({
      platformDashboardOverviewRouter: createPlatformDashboardOverviewRouter({ getOverview })
    });

    const response = await request(app).get("/api/v1/platform/dashboard/overview");

    expect(response.status).toBe(401);
    expect(response.body.error_code).toBe("unauthenticated");
    expect(getOverview).not.toHaveBeenCalled();
  });

  it("returns 403 for tenant_admin", async () => {
    const getOverview = vi.fn(async () => createOverviewPayload());
    const app = buildApp({
      platformDashboardOverviewRouter: createPlatformDashboardOverviewRouter({ getOverview })
    });

    const response = await request(app)
      .get("/api/v1/platform/dashboard/overview")
      .set("Authorization", `Bearer ${createJwtToken(tenantAdminClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body.error_code).toBe("forbidden_role");
    expect(getOverview).not.toHaveBeenCalled();
  });

  it("returns 403 for tenant_user", async () => {
    const getOverview = vi.fn(async () => createOverviewPayload());
    const app = buildApp({
      platformDashboardOverviewRouter: createPlatformDashboardOverviewRouter({ getOverview })
    });

    const response = await request(app)
      .get("/api/v1/platform/dashboard/overview")
      .set("Authorization", `Bearer ${createJwtToken(tenantUserClaims)}`);

    expect(response.status).toBe(403);
    expect(response.body.error_code).toBe("forbidden_role");
    expect(getOverview).not.toHaveBeenCalled();
  });
});
