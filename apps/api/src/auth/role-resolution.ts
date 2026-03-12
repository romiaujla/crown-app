import type { PlatformUserAccountStatus } from "../domain/status-enums.js";
import { isDisabledAccountStatus } from "./account-status.js";
import { RoleEnum } from "./claims.js";

export enum AuthResolutionFailureReasonEnum {
  DISABLED_ACCOUNT = "disabled_account",
  MISSING_PASSWORD = "missing_password",
  MISSING_TENANT_MEMBERSHIP = "missing_tenant_membership",
  MULTIPLE_TENANT_MEMBERSHIPS = "multiple_tenant_memberships",
  ROLE_MISMATCH = "role_mismatch"
}

export type AuthPlatformUser = {
  id: string;
  email: string;
  username: string | null;
  passwordHash: string | null;
  accountStatus: PlatformUserAccountStatus;
  role: RoleEnum;
};

export type AuthTenantMembership = {
  tenantId: string;
  role: RoleEnum;
};

export type AuthResolutionResult =
  | { ok: true; platformUserId: string; resolvedRole: RoleEnum.SUPER_ADMIN; tenantId: null }
  | { ok: true; platformUserId: string; resolvedRole: RoleEnum.TENANT_ADMIN | RoleEnum.TENANT_USER; tenantId: string }
  | {
      ok: false;
      reason: AuthResolutionFailureReasonEnum;
    };

export const resolveAuthenticatedRoleContext = (
  platformUser: AuthPlatformUser & { tenantLinks: AuthTenantMembership[] }
): AuthResolutionResult => {
  if (isDisabledAccountStatus(platformUser.accountStatus)) {
    return { ok: false, reason: AuthResolutionFailureReasonEnum.DISABLED_ACCOUNT };
  }
  if (!platformUser.passwordHash) return { ok: false, reason: AuthResolutionFailureReasonEnum.MISSING_PASSWORD };

  if (platformUser.role === RoleEnum.SUPER_ADMIN) {
    return {
      ok: true,
      platformUserId: platformUser.id,
      resolvedRole: RoleEnum.SUPER_ADMIN,
      tenantId: null
    };
  }

  const tenantMemberships = platformUser.tenantLinks.filter((tenantMembership) => tenantMembership.role === platformUser.role);

  if (tenantMemberships.length === 0) {
    return { ok: false, reason: AuthResolutionFailureReasonEnum.MISSING_TENANT_MEMBERSHIP };
  }
  if (tenantMemberships.length > 1) {
    return { ok: false, reason: AuthResolutionFailureReasonEnum.MULTIPLE_TENANT_MEMBERSHIPS };
  }

  const [tenantMembership] = tenantMemberships;
  if (tenantMembership.role !== platformUser.role) {
    return { ok: false, reason: AuthResolutionFailureReasonEnum.ROLE_MISMATCH };
  }

  return {
    ok: true,
    platformUserId: platformUser.id,
    resolvedRole: tenantMembership.role,
    tenantId: tenantMembership.tenantId
  };
};
