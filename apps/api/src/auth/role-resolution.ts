import type { PlatformUserAccountStatus } from "../domain/status-enums.js";
import { isDisabledAccountStatus } from "./account-status.js";
import type { Role } from "./claims.js";

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
      reason:
        | "disabled_account"
        | "missing_password"
        | "missing_tenant_membership"
        | "multiple_tenant_memberships"
        | "role_mismatch";
    };

export const resolveAuthenticatedRoleContext = (
  platformUser: AuthPlatformUser & { tenantLinks: AuthTenantMembership[] }
): AuthResolutionResult => {
  if (isDisabledAccountStatus(platformUser.accountStatus)) return { ok: false, reason: "disabled_account" };
  if (!platformUser.passwordHash) return { ok: false, reason: "missing_password" };

  if (platformUser.role === "super_admin") {
    return {
      ok: true,
      platformUserId: platformUser.id,
      resolvedRole: "super_admin",
      tenantId: null
    };
  }

  const tenantMemberships = platformUser.tenantLinks.filter((tenantMembership) => tenantMembership.role === platformUser.role);

  if (tenantMemberships.length === 0) return { ok: false, reason: "missing_tenant_membership" };
  if (tenantMemberships.length > 1) return { ok: false, reason: "multiple_tenant_memberships" };

  const [tenantMembership] = tenantMemberships;
  if (tenantMembership.role !== platformUser.role) return { ok: false, reason: "role_mismatch" };

  return {
    ok: true,
    platformUserId: platformUser.id,
    resolvedRole: tenantMembership.role,
    tenantId: tenantMembership.tenantId
  };
};
