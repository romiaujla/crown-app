import type { PlatformUserAccountStatus } from "../domain/status-enums.js";
import type { JwtClaims, Role } from "./claims.js";

export type AuthTargetApp = "platform" | "tenant";

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

export type CurrentUserContext = {
  principal: AuthPrincipal;
  roleContext: {
    role: Role;
    tenantId: string | null;
  };
  tenant: AuthTenantContext | null;
  targetApp: AuthTargetApp;
};

export type LoginSuccess = {
  ok: true;
  claims: JwtClaims;
  currentUser: CurrentUserContext;
};

export type LoginFailure = {
  ok: false;
  reason: "invalid_credentials" | "disabled_account";
};

export type ResolveClaimsFailure = {
  ok: false;
  reason: "invalid_claims";
};

export type AuthService = {
  login(identifier: string, password: string): Promise<LoginSuccess | LoginFailure>;
  resolveCurrentUser(claims: JwtClaims): Promise<CurrentUserContext | null>;
};
