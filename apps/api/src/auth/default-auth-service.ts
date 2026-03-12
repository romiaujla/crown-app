import { PlatformUserAccountStatus } from "../domain/status-enums.js";
import type { JwtClaims } from "./claims.js";
import { findAuthIdentityByIdentifier, type AuthIdentityRecord } from "./identity.js";
import { hashPassword, verifyPassword } from "./passwords.js";
import { resolveAuthenticatedRoleContext } from "./role-resolution.js";
import type {
  AuthService,
  BlockedAuthRouting,
  CurrentUserContext,
  LoginFailure,
  LoginSuccess,
  ResolveCurrentUserFailure,
  ResolveCurrentUserResult
} from "./service.js";

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
  },
  tenantUserWithoutMembership: {
    identifier: "tenant-user-orphan@acme-local.test",
    password: "Password123!"
  },
  tenantAdminMultiTenant: {
    identifier: "tenant-admin-multi@acme-local.test",
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
  },
  {
    id: "user-tenant-user-orphan",
    email: "tenant-user-orphan@acme-local.test",
    username: "tenant.user.orphan",
    password: "Password123!",
    passwordHash: "",
    accountStatus: PlatformUserAccountStatus.active,
    displayName: "Tenant User Orphan",
    role: "tenant_user",
    tenantLinks: []
  },
  {
    id: "user-tenant-admin-multi",
    email: "tenant-admin-multi@acme-local.test",
    username: "tenant.admin.multi",
    password: "Password123!",
    passwordHash: "",
    accountStatus: PlatformUserAccountStatus.active,
    displayName: "Tenant Admin Multi",
    role: "tenant_admin",
    tenantLinks: [
      { tenantId: "tenant-acme", role: "tenant_admin" as const },
      { tenantId: "tenant-zenith", role: "tenant_admin" as const }
    ]
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
  targetApp: role === "super_admin" ? "platform" : "tenant",
  routing: {
    status: "allowed",
    targetApp: role === "super_admin" ? "platform" : "tenant",
    reasonCode: null
  }
});

const buildBlockedRouting = (reason: "missing_tenant_membership" | "multiple_tenant_memberships"): BlockedAuthRouting =>
  reason === "multiple_tenant_memberships"
    ? {
        status: "selection_required",
        targetApp: null,
        reasonCode: "multiple_active_tenant_memberships"
      }
    : {
        status: "access_denied",
        targetApp: null,
        reasonCode: "missing_active_tenant_membership"
      };

const buildLoginFailure = (
  errorCode: LoginFailure["errorCode"],
  message: string,
  routing?: BlockedAuthRouting
): LoginFailure => ({
  ok: false,
  status: errorCode === "invalid_credentials" ? 401 : 403,
  errorCode,
  message,
  routing
});

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

const buildResolveCurrentUserFailure = (
  errorCode: ResolveCurrentUserFailure["errorCode"],
  message: string,
  routing?: BlockedAuthRouting
): ResolveCurrentUserFailure => ({
  ok: false,
  status: errorCode === "invalid_claims" ? 401 : 403,
  errorCode,
  message,
  routing
});

const mapResolutionFailure = (
  reason: "disabled_account" | "missing_password" | "missing_tenant_membership" | "multiple_tenant_memberships" | "role_mismatch"
): ResolveCurrentUserFailure => {
  switch (reason) {
    case "missing_tenant_membership":
      return buildResolveCurrentUserFailure(
        "tenant_membership_required",
        "An active tenant membership is required for this user",
        buildBlockedRouting(reason)
      );
    case "multiple_tenant_memberships":
      return buildResolveCurrentUserFailure(
        "tenant_selection_required",
        "Tenant selection is required and is not yet supported",
        buildBlockedRouting(reason)
      );
    default:
      return buildResolveCurrentUserFailure("invalid_claims", "Invalid authentication claims");
  }
};

export const defaultAuthService: AuthService = {
  async login(identifier, password) {
    const directory = await createDirectoryClient();
    const identity = await findAuthIdentityByIdentifier(directory.prisma, identifier);
    if (!identity) return buildLoginFailure("invalid_credentials", "Invalid credentials");
    if (!identity.passwordHash || !(await verifyPassword(password, identity.passwordHash))) {
      return buildLoginFailure("invalid_credentials", "Invalid credentials");
    }

    const user = directory.users.find((entry) => entry.id === identity.id);
    if (!user) return buildLoginFailure("invalid_credentials", "Invalid credentials");

    const resolved = resolveAuthenticatedRoleContext(user);

    if (!resolved.ok) {
      if (resolved.reason === "disabled_account") {
        return buildLoginFailure("disabled_account", "Account is disabled");
      }

      if (resolved.reason === "missing_tenant_membership") {
        return buildLoginFailure(
          "tenant_membership_required",
          "An active tenant membership is required for this user",
          buildBlockedRouting(resolved.reason)
        );
      }

      if (resolved.reason === "multiple_tenant_memberships") {
        return buildLoginFailure(
          "tenant_selection_required",
          "Tenant selection is required and is not yet supported",
          buildBlockedRouting(resolved.reason)
        );
      }

      return buildLoginFailure("invalid_credentials", "Invalid credentials");
    }

    return buildLoginSuccess(user, resolved.resolvedRole, resolved.tenantId);
  },

  async resolveCurrentUser(claims) {
    const directory = await createDirectoryClient();
    const user = directory.users.find((entry) => entry.id === claims.sub);
    if (!user) return buildResolveCurrentUserFailure("invalid_claims", "Invalid authentication claims");

    const resolved = resolveAuthenticatedRoleContext(user);
    if (!resolved.ok) return mapResolutionFailure(resolved.reason);
    if (resolved.resolvedRole !== claims.role) {
      return buildResolveCurrentUserFailure("invalid_claims", "Invalid authentication claims");
    }
    if (resolved.tenantId !== claims.tenant_id) {
      return buildResolveCurrentUserFailure("invalid_claims", "Invalid authentication claims");
    }

    return {
      ok: true,
      currentUser: toCurrentUserContext(user, claims.role, claims.tenant_id)
    } satisfies ResolveCurrentUserResult;
  }
};
