import type { PlatformUserAccountStatus } from '../domain/status-enums.js';
import { isDisabledAccountStatus } from './account-status.js';
import { RoleEnum } from './claims.js';

export enum AuthResolutionFailureReasonEnum {
  DISABLED_ACCOUNT = 'disabled_account',
  MISSING_PASSWORD = 'missing_password',
  MISSING_TENANT_MEMBERSHIP = 'missing_tenant_membership',
  MULTIPLE_TENANT_MEMBERSHIPS = 'multiple_tenant_memberships',
  ROLE_MISMATCH = 'role_mismatch',
}

export type AuthPlatformUser = {
  id: string;
  email: string;
  username: string | null;
  passwordHash: string | null;
  accountStatus: PlatformUserAccountStatus;
  platformRoleCodes: RoleEnum[];
};

export type AuthTenantMembership = {
  tenantId: string;
  roleCodes: RoleEnum[];
  primaryRoleCode: RoleEnum | null;
};

export type SuperAdminAuthResolutionResult = {
  ok: true;
  platformUserId: string;
  resolvedRole: RoleEnum.SUPER_ADMIN;
  tenantId: null;
};

export type TenantAuthResolutionResult = {
  ok: true;
  platformUserId: string;
  resolvedRole: RoleEnum.TENANT_ADMIN | RoleEnum.TENANT_USER;
  tenantId: string;
};

export type AuthResolutionFailureResult = {
  ok: false;
  reason: AuthResolutionFailureReasonEnum;
};

export type AuthResolutionResult =
  | SuperAdminAuthResolutionResult
  | TenantAuthResolutionResult
  | AuthResolutionFailureResult;

export const resolveAuthenticatedRoleContext = (
  platformUser: AuthPlatformUser & { tenantMemberships: AuthTenantMembership[] },
): AuthResolutionResult => {
  if (isDisabledAccountStatus(platformUser.accountStatus)) {
    return { ok: false, reason: AuthResolutionFailureReasonEnum.DISABLED_ACCOUNT };
  }
  if (!platformUser.passwordHash)
    return { ok: false, reason: AuthResolutionFailureReasonEnum.MISSING_PASSWORD };

  if (platformUser.platformRoleCodes.includes(RoleEnum.SUPER_ADMIN)) {
    return {
      ok: true,
      platformUserId: platformUser.id,
      resolvedRole: RoleEnum.SUPER_ADMIN,
      tenantId: null,
    };
  }

  const tenantMemberships = platformUser.tenantMemberships.filter(
    (tenantMembership) => tenantMembership.roleCodes.length > 0,
  );

  if (tenantMemberships.length === 0) {
    return { ok: false, reason: AuthResolutionFailureReasonEnum.MISSING_TENANT_MEMBERSHIP };
  }
  if (tenantMemberships.length > 1) {
    return { ok: false, reason: AuthResolutionFailureReasonEnum.MULTIPLE_TENANT_MEMBERSHIPS };
  }

  const [tenantMembership] = tenantMemberships;
  const resolvedRole =
    tenantMembership.primaryRoleCode ??
    (tenantMembership.roleCodes.includes(RoleEnum.TENANT_ADMIN)
      ? RoleEnum.TENANT_ADMIN
      : tenantMembership.roleCodes[0]);
  const normalizedResolvedRole = resolvedRole as
    | RoleEnum.TENANT_ADMIN
    | RoleEnum.TENANT_USER
    | null;
  if (!normalizedResolvedRole)
    return { ok: false, reason: AuthResolutionFailureReasonEnum.ROLE_MISMATCH };

  return {
    ok: true,
    platformUserId: platformUser.id,
    resolvedRole: normalizedResolvedRole,
    tenantId: tenantMembership.tenantId,
  };
};
