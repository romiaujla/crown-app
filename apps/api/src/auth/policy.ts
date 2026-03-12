import { RoleEnum, type JwtClaims } from "./claims.js";

export type Namespace = "platform" | "tenant";
export type DenyReason = "forbidden_role" | "forbidden_tenant";

export type AccessDecision =
  | { allow: true }
  | {
      allow: false;
      reason: DenyReason;
    };

export const resolveNamespaceFromPath = (path: string): Namespace | null => {
  if (path.includes("/platform/")) return "platform";
  if (path.includes("/tenant/")) return "tenant";
  return null;
};

const isTenantRole = (role: RoleEnum) => role === RoleEnum.TENANT_ADMIN || role === RoleEnum.TENANT_USER;

export const evaluateAccess = (claims: JwtClaims, namespace: Namespace, targetTenantId?: string | null): AccessDecision => {
  if (namespace === "platform") {
    return claims.role === RoleEnum.SUPER_ADMIN ? { allow: true } : { allow: false, reason: "forbidden_role" };
  }

  if (claims.role === RoleEnum.SUPER_ADMIN) return { allow: true };

  if (!isTenantRole(claims.role)) return { allow: false, reason: "forbidden_role" };

  if (!claims.tenant_id || !targetTenantId || claims.tenant_id !== targetTenantId) {
    return { allow: false, reason: "forbidden_tenant" };
  }

  return { allow: true };
};
