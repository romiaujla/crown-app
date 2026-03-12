import { RoleEnum, type JwtClaims } from "../../src/auth/claims.js";
import { AUTH_LOGIN_FIXTURES, DISABLED_AUTH_TEST_USER } from "../../src/auth/default-auth-service.js";

export const createJwtToken = (claims: JwtClaims) => {
  const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" }), "utf8").toString("base64url");
  const payload = Buffer.from(JSON.stringify(claims), "utf8").toString("base64url");
  return `${header}.${payload}.sig`;
};

export const superAdminClaims: JwtClaims = {
  sub: "user-super-admin",
  role: RoleEnum.SUPER_ADMIN,
  tenant_id: null
};

export const tenantAdminClaims: JwtClaims = {
  sub: "user-tenant-admin",
  role: RoleEnum.TENANT_ADMIN,
  tenant_id: "tenant-acme"
};

export const tenantUserClaims: JwtClaims = {
  sub: "user-tenant-user",
  role: RoleEnum.TENANT_USER,
  tenant_id: "tenant-acme"
};

export const tenantUserWithoutMembershipClaims: JwtClaims = {
  sub: "user-tenant-user-orphan",
  role: RoleEnum.TENANT_USER,
  tenant_id: "tenant-acme"
};

export const tenantAdminMultiTenantClaims: JwtClaims = {
  sub: "user-tenant-admin-multi",
  role: RoleEnum.TENANT_ADMIN,
  tenant_id: "tenant-acme"
};

export const loginFixtures = {
  ...AUTH_LOGIN_FIXTURES,
  disabledUser: {
    identifier: DISABLED_AUTH_TEST_USER.email,
    password: DISABLED_AUTH_TEST_USER.password
  }
} as const;
