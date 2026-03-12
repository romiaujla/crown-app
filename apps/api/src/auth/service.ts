import type { PlatformUserAccountStatus } from "../domain/status-enums.js";
import type { AuthErrorCode, JwtClaims, Role } from "./claims.js";

export type AuthTargetApp = "platform" | "tenant";
export type AuthRoutingStatus = "allowed" | "access_denied" | "selection_required";
export type AuthRoutingReasonCode = "missing_active_tenant_membership" | "multiple_active_tenant_memberships";

export type AuthPrincipal = {
  id: string;
  email: string;
  username: string | null;
  displayName: string;
  role: Role;
  accountStatus: PlatformUserAccountStatus;
};

export type AuthTenantContext = {
  id: string;
  slug: string;
  name: string;
  role: Extract<Role, "tenant_admin" | "tenant_user">;
};

export type AllowedAuthRouting = {
  status: "allowed";
  targetApp: AuthTargetApp;
  reasonCode: null;
};

export type BlockedAuthRouting = {
  status: "access_denied" | "selection_required";
  targetApp: null;
  reasonCode: AuthRoutingReasonCode;
};

export type AuthRouting = AllowedAuthRouting | BlockedAuthRouting;

export type CurrentUserContext = {
  principal: AuthPrincipal;
  roleContext: {
    role: Role;
    tenantId: string | null;
  };
  tenant: AuthTenantContext | null;
  targetApp: AuthTargetApp;
  routing: AllowedAuthRouting;
};

export type LoginSuccess = {
  ok: true;
  claims: JwtClaims;
  currentUser: CurrentUserContext;
};

export type LoginFailure = {
  ok: false;
  status: 401 | 403;
  errorCode: Exclude<AuthErrorCode, "unauthenticated" | "invalid_claims" | "forbidden_role" | "forbidden_tenant" | "conflict" | "migration_failed">;
  message: string;
  routing?: BlockedAuthRouting;
};

export type ResolveCurrentUserFailure = {
  ok: false;
  status: 401 | 403;
  errorCode: "invalid_claims" | "tenant_membership_required" | "tenant_selection_required";
  message: string;
  routing?: BlockedAuthRouting;
};

export type ResolveCurrentUserSuccess = {
  ok: true;
  currentUser: CurrentUserContext;
};

export type ResolveCurrentUserResult = ResolveCurrentUserSuccess | ResolveCurrentUserFailure;

export type AuthService = {
  login(identifier: string, password: string): Promise<LoginSuccess | LoginFailure>;
  resolveCurrentUser(claims: JwtClaims): Promise<ResolveCurrentUserResult>;
};
