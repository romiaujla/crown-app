import { describe, expect, it } from "vitest";

import { findAuthIdentityByIdentifier } from "../../src/auth/identity.js";
import { hashPassword, verifyPassword } from "../../src/auth/passwords.js";
import { resolveAuthenticatedRoleContext } from "../../src/auth/role-resolution.js";

describe("auth credential foundation", () => {
  it("stores passwords as hashes that can be verified", async () => {
    const passwordHash = await hashPassword("SeedPassword123!");

    expect(passwordHash.startsWith("scrypt$")).toBe(true);
    await expect(verifyPassword("SeedPassword123!", passwordHash)).resolves.toBe(true);
    await expect(verifyPassword("WrongPassword123!", passwordHash)).resolves.toBe(false);
  });

  it("resolves super admin identity without tenant context", () => {
    const result = resolveAuthenticatedRoleContext(
      {
        id: "platform-user-super-admin",
        email: "super-admin@acme-local.test",
        username: "seed.super.admin",
        passwordHash: "scrypt$salt$hash",
        accountStatus: "active",
        role: "super_admin"
      },
      null
    );

    expect(result).toEqual({
      ok: true,
      platformUserId: "platform-user-super-admin",
      resolvedRole: "super_admin",
      tenantId: null
    });
  });

  it("resolves tenant-scoped identities only with matching tenant membership", () => {
    const result = resolveAuthenticatedRoleContext(
      {
        id: "platform-user-tenant-admin",
        email: "tenant-admin@acme-local.test",
        username: "seed.tenant.admin",
        passwordHash: "scrypt$salt$hash",
        accountStatus: "active",
        role: "tenant_admin"
      },
      {
        tenantId: "tenant-acme-local",
        role: "tenant_admin"
      }
    );

    expect(result).toEqual({
      ok: true,
      platformUserId: "platform-user-tenant-admin",
      resolvedRole: "tenant_admin",
      tenantId: "tenant-acme-local"
    });
  });

  it("rejects disabled identities and missing tenant membership", () => {
    expect(
      resolveAuthenticatedRoleContext(
        {
          id: "platform-user-tenant-user",
          email: "tenant-user@acme-local.test",
          username: "seed.tenant.user",
          passwordHash: "scrypt$salt$hash",
          accountStatus: "disabled",
          role: "tenant_user"
        },
        {
          tenantId: "tenant-acme-local",
          role: "tenant_user"
        }
      )
    ).toEqual({
      ok: false,
      reason: "disabled_account"
    });

    expect(
      resolveAuthenticatedRoleContext(
        {
          id: "platform-user-tenant-user",
          email: "tenant-user@acme-local.test",
          username: "seed.tenant.user",
          passwordHash: "scrypt$salt$hash",
          accountStatus: "active",
          role: "tenant_user"
        },
        null
      )
    ).toEqual({
      ok: false,
      reason: "missing_tenant_membership"
    });
  });

  it("looks up identities by email or username", async () => {
    const capturedIdentifiers: string[] = [];
    const prisma = {
      platformUser: {
        async findFirst(args: {
          where: {
            OR: Array<{
              email?: string;
              username?: string;
            }>;
          };
        }) {
          for (const condition of args.where.OR) {
            if (condition.email) capturedIdentifiers.push(condition.email);
            if (condition.username) capturedIdentifiers.push(condition.username);
          }

          return {
            id: "platform-user-tenant-user",
            email: "tenant-user@acme-local.test",
            username: "seed.tenant.user",
            passwordHash: "scrypt$salt$hash",
            accountStatus: "active" as const,
            role: "tenant_user" as const,
            tenantLinks: [{ tenantId: "tenant-acme-local", role: "tenant_user" as const }]
          };
        }
      }
    };

    const identity = await findAuthIdentityByIdentifier(prisma, " Seed.Tenant.User ");

    expect(identity?.username).toBe("seed.tenant.user");
    expect(capturedIdentifiers).toEqual(["seed.tenant.user", "seed.tenant.user"]);
  });
});
