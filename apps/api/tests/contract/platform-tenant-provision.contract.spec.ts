import request from "supertest";
import { describe, expect, it, vi } from "vitest";

import { buildApp } from "../../src/app.js";
import { TenantStatus } from "../../src/domain/status-enums.js";
import { createPlatformTenantsRouter } from "../../src/routes/platform-tenants.js";
import type { ProvisionTenantResult } from "../../src/tenant/types.js";
import { createJwtToken, superAdminClaims, tenantAdminClaims } from "../helpers/auth-fixtures.js";

const createProvisioned = (): ProvisionTenantResult => ({
  status: "provisioned",
  tenantId: "tenant-id-1",
  slug: "acme",
  schemaName: "tenant_acme",
  appliedVersions: ["0001_base.001_foundational_tms_schema"],
  skippedVersions: [],
  tenant: {
    id: "tenant-id-1",
    name: "Acme",
    slug: "acme",
    schemaName: "tenant_acme",
    status: TenantStatus.active,
    createdAt: new Date(),
    updatedAt: new Date()
  }
});

describe("platform tenant provisioning contract", () => {
  it("returns 201 for super_admin", async () => {
    const provision = vi.fn(async () => createProvisioned());
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ provision }) });

    const response = await request(app)
      .post("/api/v1/platform/tenant")
      .set("Authorization", `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ name: "Acme", slug: "acme" });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("provisioned");
    expect(response.body.slug).toBe("acme");
  });

  it("returns 400 for invalid payload", async () => {
    const provision = vi.fn(async () => createProvisioned());
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ provision }) });

    const response = await request(app)
      .post("/api/v1/platform/tenant")
      .set("Authorization", `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ name: "A", slug: "INVALID" });

    expect(response.status).toBe(400);
    expect(response.body.error_code).toBe("validation_error");
  });

  it("returns 401 for missing token", async () => {
    const provision = vi.fn(async () => createProvisioned());
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ provision }) });

    const response = await request(app).post("/api/v1/platform/tenant").send({ name: "Acme", slug: "acme" });

    expect(response.status).toBe(401);
    expect(response.body.error_code).toBe("unauthenticated");
  });

  it("returns 403 for non-super-admin", async () => {
    const provision = vi.fn(async () => createProvisioned());
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ provision }) });

    const response = await request(app)
      .post("/api/v1/platform/tenant")
      .set("Authorization", `Bearer ${createJwtToken(tenantAdminClaims)}`)
      .send({ name: "Acme", slug: "acme" });

    expect(response.status).toBe(403);
    expect(response.body.error_code).toBe("forbidden_role");
  });

  it("returns 409 on conflict", async () => {
    const provision = vi.fn(async () => ({ status: "conflict", message: "tenant slug already exists" } as const));
    const app = buildApp({ platformTenantsRouter: createPlatformTenantsRouter({ provision }) });

    const response = await request(app)
      .post("/api/v1/platform/tenant")
      .set("Authorization", `Bearer ${createJwtToken(superAdminClaims)}`)
      .send({ name: "Acme", slug: "acme" });

    expect(response.status).toBe(409);
    expect(response.body.error_code).toBe("conflict");
  });
});
