import { PlatformUserAccountStatus } from "../domain/status-enums.js";
import { env } from "../config/env.js";
import { AuthErrorCodeEnum, RoleEnum, TenantRoleEnum, type JwtClaims } from "./claims.js";
import { findAuthIdentityByIdentifier, type AuthIdentityRecord } from "./identity.js";
import { hashPassword, verifyPassword } from "./passwords.js";
import { AuthResolutionFailureReasonEnum, resolveAuthenticatedRoleContext } from "./role-resolution.js";
import { DEFAULT_SEEDED_PASSWORD, SEEDED_AUTH_PASSWORDS } from "./seeded-credentials.js";
import type {
  AuthService,
  BlockedAuthRouting,
  CurrentUserContext,
  LoginFailure,
  LoginSuccess,
  ResolveCurrentUserFailure,
  ResolveCurrentUserResult
} from "./service.js";
import { AuthRoutingReasonCodeEnum, AuthRoutingStatusEnum, AuthTargetAppEnum } from "./service.js";

type DirectoryUser = AuthIdentityRecord & {
  displayName: string;
  password: string;
};

const DEFAULT_TENANT = {
  id: "tenant-acme",
  slug: "acme-local",
  name: "Acme Local Logistics"
} as const;

export const AUTH_ACCESS_TOKEN_TTL_SECONDS = env.JWT_ACCESS_TTL_SECONDS;

export const AUTH_LOGIN_FIXTURES = {
  superAdminByEmail: {
    identifier: "super-admin@acme-local.test",
    password: SEEDED_AUTH_PASSWORDS.superAdmin
  },
  superAdminByUsername: {
    identifier: "super.admin",
    password: SEEDED_AUTH_PASSWORDS.superAdmin
  },
  tenantAdminByEmail: {
    identifier: "tenant-admin@acme-local.test",
    password: SEEDED_AUTH_PASSWORDS.tenantAdmin
  },
  tenantUserWithoutMembership: {
    identifier: "tenant-user-orphan@acme-local.test",
    password: SEEDED_AUTH_PASSWORDS.tenantUserWithoutMembership
  },
  tenantAdminMultiTenant: {
    identifier: "tenant-admin-multi@acme-local.test",
    password: SEEDED_AUTH_PASSWORDS.tenantAdminMultiTenant
  }
} as const;

type DirectorySeedUser = DirectoryUser;

const directorySeed: DirectorySeedUser[] = [
  {
    id: "user-super-admin",
    email: "super-admin@acme-local.test",
    username: "super.admin",
    password: SEEDED_AUTH_PASSWORDS.superAdmin,
    passwordHash: "",
    accountStatus: PlatformUserAccountStatus.active,
    displayName: "Super Admin",
    platformRoleCodes: [RoleEnum.SUPER_ADMIN],
    tenantMemberships: []
  },
  {
    id: "user-tenant-admin",
    email: "tenant-admin@acme-local.test",
    username: "tenant.admin",
    password: SEEDED_AUTH_PASSWORDS.tenantAdmin,
    passwordHash: "",
    accountStatus: PlatformUserAccountStatus.active,
    displayName: "Tenant Admin",
    platformRoleCodes: [],
    tenantMemberships: [{ tenantId: "tenant-acme", roleCodes: [RoleEnum.TENANT_ADMIN], primaryRoleCode: RoleEnum.TENANT_ADMIN }]
  },
  {
    id: "user-tenant-user",
    email: "tenant-user@acme-local.test",
    username: "tenant.user",
    password: SEEDED_AUTH_PASSWORDS.tenantUser,
    passwordHash: "",
    accountStatus: PlatformUserAccountStatus.active,
    displayName: "Tenant User",
    platformRoleCodes: [],
    tenantMemberships: [{ tenantId: "tenant-acme", roleCodes: [RoleEnum.TENANT_USER], primaryRoleCode: RoleEnum.TENANT_USER }]
  },
  {
    id: "user-disabled",
    email: "disabled-user@acme-local.test",
    username: "disabled.user",
    password: SEEDED_AUTH_PASSWORDS.disabledUser,
    passwordHash: "",
    accountStatus: PlatformUserAccountStatus.disabled,
    displayName: "Disabled User",
    platformRoleCodes: [],
    tenantMemberships: [{ tenantId: "tenant-acme", roleCodes: [RoleEnum.TENANT_USER], primaryRoleCode: RoleEnum.TENANT_USER }]
  },
  {
    id: "user-tenant-user-orphan",
    email: "tenant-user-orphan@acme-local.test",
    username: "tenant.user.orphan",
    password: SEEDED_AUTH_PASSWORDS.tenantUserWithoutMembership,
    passwordHash: "",
    accountStatus: PlatformUserAccountStatus.active,
    displayName: "Tenant User Orphan",
    platformRoleCodes: [],
    tenantMemberships: []
  },
  {
    id: "user-tenant-admin-multi",
    email: "tenant-admin-multi@acme-local.test",
    username: "tenant.admin.multi",
    password: SEEDED_AUTH_PASSWORDS.tenantAdminMultiTenant,
    passwordHash: "",
    accountStatus: PlatformUserAccountStatus.active,
    displayName: "Tenant Admin Multi",
    platformRoleCodes: [],
    tenantMemberships: [
      { tenantId: "tenant-acme", roleCodes: [RoleEnum.TENANT_ADMIN], primaryRoleCode: RoleEnum.TENANT_ADMIN },
      { tenantId: "tenant-zenith", roleCodes: [RoleEnum.TENANT_ADMIN], primaryRoleCode: RoleEnum.TENANT_ADMIN }
    ]
  }
] as const;

export const DISABLED_AUTH_TEST_USER = {
  email: "disabled-user@acme-local.test",
  username: "disabled.user",
  password: DEFAULT_SEEDED_PASSWORD
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
      user: {
        async findFirst(args: {
          where: { OR: Array<{ email?: string; username?: string }> };
          include: {
            platformRoleAssignments: {
              include: {
                platformRole: {
                  select: {
                    roleCode: true;
                  };
                };
              };
            };
            tenantMemberships: {
              include: {
                roleAssignments: {
                  include: {
                    tenantRole: {
                      select: {
                        roleCode: true;
                      };
                    };
                  };
                };
              };
            };
          };
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
            )
              ? {
                  ...(users.find((user) =>
                    requested.some(
                      (condition) =>
                        (condition.email && user.email.toLowerCase() === condition.email) ||
                        (condition.username && user.username?.toLowerCase() === condition.username)
                    )
                  ) as DirectorySeedUser),
                  platformRoleAssignments: (users
                    .find((user) =>
                      requested.some(
                        (condition) =>
                          (condition.email && user.email.toLowerCase() === condition.email) ||
                          (condition.username && user.username?.toLowerCase() === condition.username)
                      )
                    )
                    ?.platformRoleCodes ?? []
                  ).map((roleCode) => ({
                    platformRole: { roleCode }
                  })),
                  tenantMemberships: (users
                    .find((user) =>
                      requested.some(
                        (condition) =>
                          (condition.email && user.email.toLowerCase() === condition.email) ||
                          (condition.username && user.username?.toLowerCase() === condition.username)
                      )
                    )
                    ?.tenantMemberships ?? []
                  ).map((membership) => ({
                    tenantId: membership.tenantId,
                    roleAssignments: membership.roleCodes.map((roleCode) => ({
                      isPrimary: membership.primaryRoleCode === roleCode,
                      tenantRole: { roleCode }
                    }))
                  }))
                }
              : null
          );
        }
      }
    }
  };
};

const toTenantRole = (role: Exclude<JwtClaims["role"], RoleEnum.SUPER_ADMIN>): TenantRoleEnum =>
  role === RoleEnum.TENANT_ADMIN ? TenantRoleEnum.TENANT_ADMIN : TenantRoleEnum.TENANT_USER;

const toCurrentUserContext = (user: DirectoryUser, role: JwtClaims["role"], tenantId: string | null): CurrentUserContext => ({
  principal: {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    role,
    accountStatus: user.accountStatus
  },
  roleContext: {
    role,
    tenantId
  },
  tenant:
    tenantId && role !== RoleEnum.SUPER_ADMIN
      ? {
          id: tenantId,
          slug: DEFAULT_TENANT.slug,
          name: DEFAULT_TENANT.name,
          role: toTenantRole(role)
        }
      : null,
  targetApp: role === RoleEnum.SUPER_ADMIN ? AuthTargetAppEnum.PLATFORM : AuthTargetAppEnum.TENANT,
  routing: {
    status: AuthRoutingStatusEnum.ALLOWED,
    targetApp: role === RoleEnum.SUPER_ADMIN ? AuthTargetAppEnum.PLATFORM : AuthTargetAppEnum.TENANT,
    reasonCode: null
  }
});

const buildBlockedRouting = (
  reason:
    | AuthResolutionFailureReasonEnum.MISSING_TENANT_MEMBERSHIP
    | AuthResolutionFailureReasonEnum.MULTIPLE_TENANT_MEMBERSHIPS
): BlockedAuthRouting =>
  reason === AuthResolutionFailureReasonEnum.MULTIPLE_TENANT_MEMBERSHIPS
    ? {
        status: AuthRoutingStatusEnum.SELECTION_REQUIRED,
        targetApp: null,
        reasonCode: AuthRoutingReasonCodeEnum.MULTIPLE_ACTIVE_TENANT_MEMBERSHIPS
      }
    : {
        status: AuthRoutingStatusEnum.ACCESS_DENIED,
        targetApp: null,
        reasonCode: AuthRoutingReasonCodeEnum.MISSING_ACTIVE_TENANT_MEMBERSHIP
      };

const buildLoginFailure = (
  errorCode: LoginFailure["errorCode"],
  message: string,
  routing?: BlockedAuthRouting
): LoginFailure => ({
  ok: false,
  status: errorCode === AuthErrorCodeEnum.INVALID_CREDENTIALS ? 401 : 403,
  errorCode,
  message,
  routing
});

const buildLoginSuccess = (user: DirectoryUser, role: JwtClaims["role"], tenantId: string | null): LoginSuccess => {
  const claims: JwtClaims = {
    sub: user.id,
    role,
    tenant_id: tenantId,
    exp: Math.floor(Date.now() / 1000) + AUTH_ACCESS_TOKEN_TTL_SECONDS
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
  status: errorCode === AuthErrorCodeEnum.INVALID_CLAIMS ? 401 : 403,
  errorCode,
  message,
  routing
});

const mapResolutionFailure = (
  reason: AuthResolutionFailureReasonEnum
): ResolveCurrentUserFailure => {
  switch (reason) {
    case AuthResolutionFailureReasonEnum.MISSING_TENANT_MEMBERSHIP:
      return buildResolveCurrentUserFailure(
        AuthErrorCodeEnum.TENANT_MEMBERSHIP_REQUIRED,
        "An active tenant membership is required for this user",
        buildBlockedRouting(reason)
      );
    case AuthResolutionFailureReasonEnum.MULTIPLE_TENANT_MEMBERSHIPS:
      return buildResolveCurrentUserFailure(
        AuthErrorCodeEnum.TENANT_SELECTION_REQUIRED,
        "Tenant selection is required and is not yet supported",
        buildBlockedRouting(reason)
      );
    default:
      return buildResolveCurrentUserFailure(AuthErrorCodeEnum.INVALID_CLAIMS, "Invalid authentication claims");
  }
};

export const defaultAuthService: AuthService = {
  async login(identifier, password) {
    const directory = await createDirectoryClient();
    const identity = await findAuthIdentityByIdentifier(directory.prisma, identifier);
    if (!identity) return buildLoginFailure(AuthErrorCodeEnum.INVALID_CREDENTIALS, "Invalid credentials");
    if (!identity.passwordHash || !(await verifyPassword(password, identity.passwordHash))) {
      return buildLoginFailure(AuthErrorCodeEnum.INVALID_CREDENTIALS, "Invalid credentials");
    }

    const user = directory.users.find((entry) => entry.id === identity.id);
    if (!user) return buildLoginFailure(AuthErrorCodeEnum.INVALID_CREDENTIALS, "Invalid credentials");

    const resolved = resolveAuthenticatedRoleContext(user);

    if (!resolved.ok) {
      if (resolved.reason === AuthResolutionFailureReasonEnum.DISABLED_ACCOUNT) {
        return buildLoginFailure(AuthErrorCodeEnum.DISABLED_ACCOUNT, "Account is disabled");
      }

      if (resolved.reason === AuthResolutionFailureReasonEnum.MISSING_TENANT_MEMBERSHIP) {
        return buildLoginFailure(
          AuthErrorCodeEnum.TENANT_MEMBERSHIP_REQUIRED,
          "An active tenant membership is required for this user",
          buildBlockedRouting(resolved.reason)
        );
      }

      if (resolved.reason === AuthResolutionFailureReasonEnum.MULTIPLE_TENANT_MEMBERSHIPS) {
        return buildLoginFailure(
          AuthErrorCodeEnum.TENANT_SELECTION_REQUIRED,
          "Tenant selection is required and is not yet supported",
          buildBlockedRouting(resolved.reason)
        );
      }

      return buildLoginFailure(AuthErrorCodeEnum.INVALID_CREDENTIALS, "Invalid credentials");
    }

    return buildLoginSuccess(user, resolved.resolvedRole, resolved.tenantId);
  },

  async resolveCurrentUser(claims) {
    const directory = await createDirectoryClient();
    const user = directory.users.find((entry) => entry.id === claims.sub);
    if (!user) return buildResolveCurrentUserFailure(AuthErrorCodeEnum.INVALID_CLAIMS, "Invalid authentication claims");

    const resolved = resolveAuthenticatedRoleContext(user);
    if (!resolved.ok) return mapResolutionFailure(resolved.reason);
    if (resolved.resolvedRole !== claims.role) {
      return buildResolveCurrentUserFailure(AuthErrorCodeEnum.INVALID_CLAIMS, "Invalid authentication claims");
    }
    if (resolved.tenantId !== claims.tenant_id) {
      return buildResolveCurrentUserFailure(AuthErrorCodeEnum.INVALID_CLAIMS, "Invalid authentication claims");
    }

    return {
      ok: true,
      currentUser: toCurrentUserContext(user, claims.role, claims.tenant_id)
    } satisfies ResolveCurrentUserResult;
  }
};
