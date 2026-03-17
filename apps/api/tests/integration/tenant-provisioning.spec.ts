import { beforeEach, describe, expect, it, vi } from "vitest";
import { TenantStatus } from "../../src/domain/status-enums.js";

const tenantCreate = vi.fn();
const tenantFindUnique = vi.fn();
const tenantUpdate = vi.fn();

const managementSystemTypeFindUnique = vi.fn();
const roleFindUnique = vi.fn();
const tenantMembershipCreate = vi.fn();
const tenantMembershipRoleAssignmentCreate = vi.fn();

const query = vi.fn();
const connect = vi.fn();
const end = vi.fn();

const loadTenantMigrations = vi.fn();
const executeTenantMigrations = vi.fn();

vi.mock("../../src/db/prisma.js", () => ({
  prisma: {
    tenant: {
      create: tenantCreate,
      findUnique: tenantFindUnique,
      update: tenantUpdate
    },
    managementSystemType: {
      findUnique: managementSystemTypeFindUnique
    },
    role: {
      findUnique: roleFindUnique
    },
    tenantMembership: {
      create: tenantMembershipCreate
    },
    tenantMembershipRoleAssignment: {
      create: tenantMembershipRoleAssignmentCreate
    }
  }
}));

vi.mock("../../src/tenant/migration-loader.js", () => ({
  loadTenantMigrations
}));

vi.mock("../../src/tenant/migrator.js", () => ({
  executeTenantMigrations,
  tenantMigrationStrategy: {
    prismaScope: "public",
    tenantScope: "tenant_<slug>",
    execution: "versioned-sql"
  }
}));

vi.mock("pg", () => ({
  Client: vi.fn(() => ({
    connect,
    query,
    end
  }))
}));

describe("tenant provisioning integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    managementSystemTypeFindUnique.mockResolvedValue({
      id: "mst-1",
      typeCode: "transportation",
      version: "1.0",
      displayName: "Transportation Management System",
      availabilityStatus: "active"
    });

    roleFindUnique.mockResolvedValue({
      id: "role-tenant-admin",
      roleCode: "tenant_admin",
      scope: "tenant",
      authClass: "tenant_admin",
      displayName: "Tenant Admin"
    });

    tenantMembershipCreate.mockResolvedValue({
      id: "membership-1",
      userId: "user-super-admin",
      tenantId: "tenant-1",
      membershipStatus: "active"
    });

    tenantMembershipRoleAssignmentCreate.mockResolvedValue({
      id: "assignment-1",
      tenantMembershipId: "membership-1",
      roleId: "role-tenant-admin",
      assignmentStatus: "active",
      isPrimary: true
    });

    tenantCreate.mockResolvedValue({
      id: "tenant-1",
      name: "Acme",
      slug: "acme",
      schemaName: "tenant_acme",
      status: TenantStatus.provisioning,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    tenantUpdate.mockResolvedValue({
      id: "tenant-1",
      name: "Acme",
      slug: "acme",
      schemaName: "tenant_acme",
      status: TenantStatus.active,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    loadTenantMigrations.mockResolvedValue([
      { version: "0001_base.001_foundational_tms_schema", description: "foundational tms schema", sqlPath: "a.sql", sequence: 1 }
    ]);
    executeTenantMigrations.mockResolvedValue({
      status: "provisioned",
      appliedVersions: ["0001_base.001_foundational_tms_schema"],
      skippedVersions: []
    });
  });

  it("creates schema and metadata on success", async () => {
    const { provisionTenant } = await import("../../src/tenant/provision-service.js");

    const result = await provisionTenant({
      name: "Acme",
      slug: "acme",
      actorSub: "user-super-admin",
      managementSystemTypeCode: "transportation"
    });

    expect(result.status).toBe("provisioned");
    expect(query).toHaveBeenCalledWith('CREATE SCHEMA IF NOT EXISTS "tenant_acme"');
  });

  it("creates tenant membership and role assignment on success", async () => {
    const { provisionTenant } = await import("../../src/tenant/provision-service.js");

    const result = await provisionTenant({
      name: "Acme",
      slug: "acme",
      actorSub: "user-super-admin",
      managementSystemTypeCode: "transportation"
    });

    expect(result.status).toBe("provisioned");
    expect(tenantMembershipCreate).toHaveBeenCalledWith({
      data: {
        userId: "user-super-admin",
        tenantId: "tenant-1",
        membershipStatus: "active"
      }
    });
    expect(tenantMembershipRoleAssignmentCreate).toHaveBeenCalledWith({
      data: {
        tenantMembershipId: "membership-1",
        roleId: "role-tenant-admin",
        assignmentStatus: "active",
        isPrimary: true
      }
    });
  });

  it("includes managementSystemTypeCode in success result", async () => {
    const { provisionTenant } = await import("../../src/tenant/provision-service.js");

    const result = await provisionTenant({
      name: "Acme",
      slug: "acme",
      actorSub: "user-super-admin",
      managementSystemTypeCode: "transportation"
    });

    expect(result.status).toBe("provisioned");
    if (result.status === "provisioned") {
      expect(result.managementSystemTypeCode).toBe("transportation");
    }
  });

  it("returns conflict for invalid management system type code", async () => {
    managementSystemTypeFindUnique.mockResolvedValue(null);

    const { provisionTenant } = await import("../../src/tenant/provision-service.js");

    const result = await provisionTenant({
      name: "Acme",
      slug: "acme",
      actorSub: "user-super-admin",
      managementSystemTypeCode: "nonexistent"
    });

    expect(result).toEqual({
      status: "conflict",
      message: "invalid management system type code"
    });
    expect(tenantCreate).not.toHaveBeenCalled();
  });

  it("returns conflict for active duplicate tenant", async () => {
    tenantCreate.mockRejectedValue({ code: "P2002" });
    tenantFindUnique.mockResolvedValue({
      id: "tenant-1",
      name: "Acme",
      slug: "acme",
      schemaName: "tenant_acme",
      status: TenantStatus.active,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const { provisionTenant } = await import("../../src/tenant/provision-service.js");

    const result = await provisionTenant({
      name: "Acme",
      slug: "acme",
      actorSub: "user-super-admin",
      managementSystemTypeCode: "transportation"
    });

    expect(result).toEqual({
      status: "conflict",
      message: "tenant slug already exists"
    });
    expect(query).not.toHaveBeenCalled();
  });
});
