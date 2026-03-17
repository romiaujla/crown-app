import { env } from "../config/env.js";
import { prisma } from "../db/prisma.js";
import { AuthErrorCodeEnum, RoleEnum, TenantRoleEnum, type JwtClaims } from "./claims.js";
import { findAuthIdentityByIdentifier, type AuthIdentityRecord } from "./identity.js";
import { verifyPassword } from "./passwords.js";
import { AuthResolutionFailureReasonEnum, resolveAuthenticatedRoleContext } from "./role-resolution.js";
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

export const AUTH_ACCESS_TOKEN_TTL_SECONDS = env.JWT_ACCESS_TTL_SECONDS;

const toTenantRole = (role: Exclude<JwtClaims["role"], RoleEnum.SUPER_ADMIN>): TenantRoleEnum =>
    role === RoleEnum.TENANT_ADMIN ? TenantRoleEnum.TENANT_ADMIN : TenantRoleEnum.TENANT_USER;

const findTenantById = async (tenantId: string) =>
    prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { id: true, slug: true, name: true }
    });

const toCurrentUserContext = async (
    identity: AuthIdentityRecord,
    role: JwtClaims["role"],
    tenantId: string | null
): Promise<CurrentUserContext> => {
    const tenant = tenantId && role !== RoleEnum.SUPER_ADMIN ? await findTenantById(tenantId) : null;

    return {
        principal: {
            id: identity.id,
            email: identity.email,
            username: identity.username,
            displayName: identity.displayName,
            role,
            accountStatus: identity.accountStatus
        },
        roleContext: {
            role,
            tenantId
        },
        tenant: tenant
            ? {
                id: tenant.id,
                slug: tenant.slug,
                name: tenant.name,
                role: toTenantRole(role as Exclude<JwtClaims["role"], RoleEnum.SUPER_ADMIN>)
            }
            : null,
        targetApp: role === RoleEnum.SUPER_ADMIN ? AuthTargetAppEnum.PLATFORM : AuthTargetAppEnum.TENANT,
        routing: {
            status: AuthRoutingStatusEnum.ALLOWED,
            targetApp: role === RoleEnum.SUPER_ADMIN ? AuthTargetAppEnum.PLATFORM : AuthTargetAppEnum.TENANT,
            reasonCode: null
        }
    };
};

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

const mapLoginResolutionFailure = (
    reason: AuthResolutionFailureReasonEnum
): LoginFailure => {
    switch (reason) {
        case AuthResolutionFailureReasonEnum.DISABLED_ACCOUNT:
            return buildLoginFailure(AuthErrorCodeEnum.DISABLED_ACCOUNT, "Account is disabled");
        case AuthResolutionFailureReasonEnum.MISSING_TENANT_MEMBERSHIP:
            return buildLoginFailure(
                AuthErrorCodeEnum.TENANT_MEMBERSHIP_REQUIRED,
                "An active tenant membership is required for this user",
                buildBlockedRouting(reason)
            );
        case AuthResolutionFailureReasonEnum.MULTIPLE_TENANT_MEMBERSHIPS:
            return buildLoginFailure(
                AuthErrorCodeEnum.TENANT_SELECTION_REQUIRED,
                "Tenant selection is required and is not yet supported",
                buildBlockedRouting(reason)
            );
        default:
            return buildLoginFailure(AuthErrorCodeEnum.INVALID_CREDENTIALS, "Invalid credentials");
    }
};

const findAuthIdentityById = async (userId: string): Promise<AuthIdentityRecord | null> => {
    const record = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            platformRoleAssignments: {
                where: { assignmentStatus: "active" },
                include: {
                    role: {
                        select: {
                            authClass: true
                        }
                    }
                }
            },
            tenantMemberships: {
                where: { membershipStatus: "active" },
                include: {
                    roleAssignments: {
                        where: { assignmentStatus: "active" },
                        include: {
                            role: {
                                select: {
                                    authClass: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!record) return null;

    return {
        id: record.id,
        email: record.email,
        username: record.username,
        passwordHash: record.passwordHash,
        accountStatus: record.accountStatus,
        displayName: record.displayName,
        platformRoleCodes: record.platformRoleAssignments.map((a) => a.role.authClass as RoleEnum),
        tenantMemberships: record.tenantMemberships.map((m) => {
            const roleCodes = m.roleAssignments.map((a) => a.role.authClass as RoleEnum);
            const primaryRoleCode =
                m.roleAssignments.find((a) => a.isPrimary)?.role.authClass as RoleEnum | undefined ??
                (roleCodes.length === 1 ? roleCodes[0] : null);

            return {
                tenantId: m.tenantId,
                roleCodes,
                primaryRoleCode: primaryRoleCode ?? null
            };
        })
    };
};

export const prismaAuthService: AuthService = {
    async login(identifier, password) {
        const identity = await findAuthIdentityByIdentifier(prisma, identifier);
        if (!identity) return buildLoginFailure(AuthErrorCodeEnum.INVALID_CREDENTIALS, "Invalid credentials");
        if (!identity.passwordHash || !(await verifyPassword(password, identity.passwordHash))) {
            return buildLoginFailure(AuthErrorCodeEnum.INVALID_CREDENTIALS, "Invalid credentials");
        }

        const resolved = resolveAuthenticatedRoleContext(identity);
        if (!resolved.ok) return mapLoginResolutionFailure(resolved.reason);

        const claims: JwtClaims = {
            sub: identity.id,
            role: resolved.resolvedRole,
            tenant_id: resolved.tenantId,
            exp: Math.floor(Date.now() / 1000) + AUTH_ACCESS_TOKEN_TTL_SECONDS
        };

        const currentUser = await toCurrentUserContext(identity, resolved.resolvedRole, resolved.tenantId);

        return {
            ok: true,
            claims,
            currentUser
        } satisfies LoginSuccess;
    },

    async resolveCurrentUser(claims) {
        const identity = await findAuthIdentityById(claims.sub);
        if (!identity) return buildResolveCurrentUserFailure(AuthErrorCodeEnum.INVALID_CLAIMS, "Invalid authentication claims");

        const resolved = resolveAuthenticatedRoleContext(identity);
        if (!resolved.ok) return mapResolutionFailure(resolved.reason);
        if (resolved.resolvedRole !== claims.role) {
            return buildResolveCurrentUserFailure(AuthErrorCodeEnum.INVALID_CLAIMS, "Invalid authentication claims");
        }
        if (resolved.tenantId !== claims.tenant_id) {
            return buildResolveCurrentUserFailure(AuthErrorCodeEnum.INVALID_CLAIMS, "Invalid authentication claims");
        }

        const currentUser = await toCurrentUserContext(identity, claims.role, claims.tenant_id);

        return {
            ok: true,
            currentUser
        } satisfies ResolveCurrentUserResult;
    }
};
