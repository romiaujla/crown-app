import { PlatformUserAccountStatus } from "../domain/status-enums.js";
import type { JwtClaims } from "./claims.js";
import { findAuthIdentityByIdentifier, type AuthIdentityRecord } from "./identity.js";
import { hashPassword, verifyPassword } from "./passwords.js";
import { resolveAuthenticatedRoleContext } from "./role-resolution.js";
import type { AuthService, CurrentUserContext, LoginFailure, LoginSuccess } from "./service.js";

type DirectoryUser = AuthIdentityRecord & {
  displayName: string;
  password: string;
};

const DEFAULT_TENANT = {
  id: "tenant-acme",
  slug: "acme-local",
  name: "Acme Local Logistics"
} as const;

export const AUTH_LOGIN_FIXTURES = {
  superAdminByEmail: {
    identifier: "super-admin@acme-local.test",
    password: "Password123!"
  },
  superAdminByUsername: {
    identifier: "super.admin",
    password: "Password123!"
  },
  tenantAdminByEmail: {
    identifier: "tenant-admin@acme-local.test",
    password: "Password123!"
  }
} as const;

type DirectorySeedUser = DirectoryUser;

const directorySeed: DirectorySeedUser[] = [
  {
    id: "user-super-admin",
    email: "super-admin@acme-local.test",
    username: "super.admin",
    password: "Password123!",
    passwordHash: "",
    accountStatus: PlatformUserAccountStatus.active,
    displayName: "Super Admin",
    role: "super_admin",
    tenantLinks: []
  },
  {
    id: "user-tenant-admin",
    email: "tenant-admin@acme-local.test",
    username: "tenant.admin",
    password: "Password123!",
    passwordHash: "",
    accountStatus: PlatformUserAccountStatus.active,
    displayName: "Tenant Admin",
    role: "tenant_admin",
    tenantLinks: [{ tenantId: "tenant-acme", role: "tenant_admin" as const }]
  },
  {
    id: "user-tenant-user",
    email: "tenant-user@acme-local.test",
    username: "tenant.user",
    password: "Password123!",
    passwordHash: "",
    accountStatus: PlatformUserAccountStatus.active,
    displayName: "Tenant User",
    role: "tenant_user",
    tenantLinks: [{ tenantId: "tenant-acme", role: "tenant_user" as const }]
  },
  {
    id: "user-disabled",
    email: "disabled-user@acme-local.test",
    username: "disabled.user",
    password: "Password123!",
    passwordHash: "",
    accountStatus: PlatformUserAccountStatus.disabled,
    displayName: "Disabled User",
    role: "tenant_user" as const,
    tenantLinks: [{ tenantId: "tenant-acme", role: "tenant_user" as const }]
  }
] as const;

export const DISABLED_AUTH_TEST_USER = {
  email: "disabled-user@acme-local.test",
  username: "disabled.user",
  password: "Password123!"
} as const;

const directoryPromise = Promise.all(
  directorySeed.map(async (user) => ({
    ...user,
    passwordHash: await hashPassword(user.password, user.id)
  }))
);

const createDirectoryClient = async () => {
  const users = await directoryPromise;

  return {
    users,
    prisma: {
      platformUser: {
        async findFirst(args: {
          where: { OR: Array<{ email?: string; username?: string }> };
          include: { tenantLinks: { select: { tenantId: true; role: true } } };
        }) {
          const requested = args.where.OR.map((condition) => ({
            email: condition.email?.toLowerCase(),
            username: condition.username?.toLowerCase()
          }));

          return (
            users.find((user) =>
              requested.some(
                (condition) =>
                  (condition.email && user.email.toLowerCase() === condition.email) ||
                  (condition.username && user.username?.toLowerCase() === condition.username)
              )
            ) ?? null
          );
        }
      }
    }
  };
};

const toCurrentUserContext = (user: DirectoryUser, role: JwtClaims["role"], tenantId: string | null): CurrentUserContext => ({
  principal: {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
    accountStatus: user.accountStatus
  },
  roleContext: {
    role,
    tenantId
  },
  tenant:
    tenantId && role !== "super_admin"
      ? {
          id: tenantId,
          slug: DEFAULT_TENANT.slug,
          name: DEFAULT_TENANT.name,
          role
        }
      : null,
  targetApp: role === "super_admin" ? "platform" : "tenant"
});

const buildLoginFailure = (reason: LoginFailure["reason"]): LoginFailure => ({ ok: false, reason });

const buildLoginSuccess = (user: DirectoryUser, role: JwtClaims["role"], tenantId: string | null): LoginSuccess => {
  const claims: JwtClaims = {
    sub: user.id,
    role,
    tenant_id: tenantId
  };

  return {
    ok: true,
    claims,
    currentUser: toCurrentUserContext(user, role, tenantId)
  };
};

export const defaultAuthService: AuthService = {
  async login(identifier, password) {
    const directory = await createDirectoryClient();
    const identity = await findAuthIdentityByIdentifier(directory.prisma, identifier);
    if (!identity) return buildLoginFailure("invalid_credentials");
    if (!identity.passwordHash || !(await verifyPassword(password, identity.passwordHash))) {
      return buildLoginFailure("invalid_credentials");
    }

    const user = directory.users.find((entry) => entry.id === identity.id);
    if (!user) return buildLoginFailure("invalid_credentials");

    const preferredMembership =
      user.role === "super_admin" ? null : user.tenantLinks.find((tenantLink) => tenantLink.role === user.role) ?? null;
    const resolved = resolveAuthenticatedRoleContext(user, preferredMembership);

    if (!resolved.ok) {
      if (resolved.reason === "disabled_account") return buildLoginFailure("disabled_account");
      return buildLoginFailure("invalid_credentials");
    }

    return buildLoginSuccess(user, resolved.resolvedRole, resolved.tenantId);
  },

  async resolveCurrentUser(claims) {
    const directory = await createDirectoryClient();
    const user = directory.users.find((entry) => entry.id === claims.sub);
    if (!user) return null;

    const membership =
      claims.role === "super_admin"
        ? null
        : user.tenantLinks.find((tenantLink) => tenantLink.tenantId === claims.tenant_id && tenantLink.role === claims.role) ?? null;
    const resolved = resolveAuthenticatedRoleContext(user, membership);
    if (!resolved.ok) return null;
    if (resolved.resolvedRole !== claims.role) return null;
    if (resolved.tenantId !== claims.tenant_id) return null;

    return toCurrentUserContext(user, claims.role, claims.tenant_id);
  }
};
