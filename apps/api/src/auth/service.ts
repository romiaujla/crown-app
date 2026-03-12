import type { PlatformUserAccountStatus } from "../domain/status-enums.js";
import type { AuthErrorCode, JwtClaims, Role } from "./claims.js";

export type AuthTargetApp = "platform" | "tenant";

export enum AuthRoutingStatus {
  ALLOWED = "allowed",
  ACCESS_DENIED = "access_denied",
  SELECTION_REQUIRED = "selection_required"
}

export enum AuthRoutingReasonCode {
  MISSING_ACTIVE_TENANT_MEMBERSHIP = "missing_active_tenant_membership",
  MULTIPLE_ACTIVE_TENANT_MEMBERSHIPS = "multiple_active_tenant_memberships"
}

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
  status: AuthRoutingStatus.ALLOWED;
  targetApp: AuthTargetApp;
  reasonCode: null;
};

export type BlockedAuthRouting = {
  status: AuthRoutingStatus.ACCESS_DENIED | AuthRoutingStatus.SELECTION_REQUIRED;
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
  errorCode:
    | AuthErrorCode.INVALID_CREDENTIALS
    | AuthErrorCode.DISABLED_ACCOUNT
    | AuthErrorCode.TENANT_MEMBERSHIP_REQUIRED
    | AuthErrorCode.TENANT_SELECTION_REQUIRED;
  message: string;
  routing?: BlockedAuthRouting;
};

export type ResolveCurrentUserFailure = {
  ok: false;
  status: 401 | 403;
  errorCode:
    | AuthErrorCode.INVALID_CLAIMS
    | AuthErrorCode.TENANT_MEMBERSHIP_REQUIRED
    | AuthErrorCode.TENANT_SELECTION_REQUIRED;
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
