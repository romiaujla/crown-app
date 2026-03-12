import type { PlatformUserAccountStatus } from "../domain/status-enums.js";
import { isDisabledAccountStatus } from "./account-status.js";
import type { Role } from "./claims.js";

export enum AuthResolutionFailureReason {
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
  role: Role;
};

export type AuthTenantMembership = {
  tenantId: string;
  role: Role;
};

export type AuthResolutionResult =
  | { ok: true; platformUserId: string; resolvedRole: "super_admin"; tenantId: null }
  | { ok: true; platformUserId: string; resolvedRole: "tenant_admin" | "tenant_user"; tenantId: string }
  | {
      ok: false;
      reason: AuthResolutionFailureReason;
    };

export const resolveAuthenticatedRoleContext = (
  platformUser: AuthPlatformUser & { tenantLinks: AuthTenantMembership[] }
): AuthResolutionResult => {
  if (isDisabledAccountStatus(platformUser.accountStatus)) {
    return { ok: false, reason: AuthResolutionFailureReason.DISABLED_ACCOUNT };
  }
  if (!platformUser.passwordHash) return { ok: false, reason: AuthResolutionFailureReason.MISSING_PASSWORD };

  if (platformUser.role === "super_admin") {
    return {
      ok: true,
      platformUserId: platformUser.id,
      resolvedRole: "super_admin",
      tenantId: null
    };
  }

  const tenantMemberships = platformUser.tenantLinks.filter((tenantMembership) => tenantMembership.role === platformUser.role);

  if (tenantMemberships.length === 0) {
    return { ok: false, reason: AuthResolutionFailureReason.MISSING_TENANT_MEMBERSHIP };
  }
  if (tenantMemberships.length > 1) {
    return { ok: false, reason: AuthResolutionFailureReason.MULTIPLE_TENANT_MEMBERSHIPS };
  }

  const [tenantMembership] = tenantMemberships;
  if (tenantMembership.role !== platformUser.role) {
    return { ok: false, reason: AuthResolutionFailureReason.ROLE_MISMATCH };
  }

  return {
    ok: true,
    platformUserId: platformUser.id,
    resolvedRole: tenantMembership.role,
    tenantId: tenantMembership.tenantId
  };
};
