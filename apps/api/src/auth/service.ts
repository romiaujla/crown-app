import type { PlatformUserAccountStatus } from "../domain/status-enums.js";
import type { JwtClaims } from "./claims.js";
import { AuthErrorCodeEnum, RoleEnum, TenantRoleEnum } from "./claims.js";

export enum AuthTargetAppEnum {
  PLATFORM = "platform",
  TENANT = "tenant"
}

export enum AuthRoutingStatusEnum {
  ALLOWED = "allowed",
  ACCESS_DENIED = "access_denied",
  SELECTION_REQUIRED = "selection_required"
}

export enum AuthRoutingReasonCodeEnum {
  MISSING_ACTIVE_TENANT_MEMBERSHIP = "missing_active_tenant_membership",
  MULTIPLE_ACTIVE_TENANT_MEMBERSHIPS = "multiple_active_tenant_memberships"
}

export type AuthPrincipal = {
  id: string;
  email: string;
  username: string | null;
  displayName: string;
  role: RoleEnum;
  accountStatus: PlatformUserAccountStatus;
};

export type AuthTenantContext = {
  id: string;
  slug: string;
  name: string;
  role: TenantRoleEnum;
};

export type AllowedAuthRouting = {
  status: AuthRoutingStatusEnum.ALLOWED;
  targetApp: AuthTargetAppEnum;
  reasonCode: null;
};

export type BlockedAuthRouting = {
  status: AuthRoutingStatusEnum.ACCESS_DENIED | AuthRoutingStatusEnum.SELECTION_REQUIRED;
  targetApp: null;
  reasonCode: AuthRoutingReasonCodeEnum;
};

export type AuthRouting = AllowedAuthRouting | BlockedAuthRouting;

export type CurrentUserContext = {
  principal: AuthPrincipal;
  roleContext: {
    role: RoleEnum;
    tenantId: string | null;
  };
  tenant: AuthTenantContext | null;
  targetApp: AuthTargetAppEnum;
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
    | AuthErrorCodeEnum.INVALID_CREDENTIALS
    | AuthErrorCodeEnum.DISABLED_ACCOUNT
    | AuthErrorCodeEnum.TENANT_MEMBERSHIP_REQUIRED
    | AuthErrorCodeEnum.TENANT_SELECTION_REQUIRED;
  message: string;
  routing?: BlockedAuthRouting;
};

export type ResolveCurrentUserFailure = {
  ok: false;
  status: 401 | 403;
  errorCode:
    | AuthErrorCodeEnum.INVALID_CLAIMS
    | AuthErrorCodeEnum.TENANT_MEMBERSHIP_REQUIRED
    | AuthErrorCodeEnum.TENANT_SELECTION_REQUIRED;
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
