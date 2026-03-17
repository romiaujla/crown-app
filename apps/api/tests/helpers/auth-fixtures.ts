import { RoleEnum, type JwtClaims } from "../../src/auth/claims.js";
import { AUTH_ACCESS_TOKEN_TTL_SECONDS } from "../../src/auth/default-auth-service.js";
import { DEFAULT_SEEDED_PASSWORD, SEEDED_AUTH_PASSWORDS } from "../../src/auth/seeded-credentials.js";
import { signAccessToken } from "../../src/auth/tokens.js";

const futureExpiry = () => Math.floor(Date.now() / 1000) + AUTH_ACCESS_TOKEN_TTL_SECONDS;

export const createJwtToken = (claims: JwtClaims, secret?: string) => signAccessToken(claims, secret);

export const createTamperedJwtToken = (claims: JwtClaims) => {
  const token = signAccessToken(claims);
  const [header, , signature] = token.split(".");
  const tamperedClaims = {
    ...claims,
    sub: `${claims.sub}-tampered`
  };
  const tamperedPayload = Buffer.from(JSON.stringify(tamperedClaims), "utf8").toString("base64url");

  return `${header}.${tamperedPayload}.${signature}`;
};

export const superAdminClaims: JwtClaims = {
  sub: process.env.SEED_SUPER_ADMIN_USER_ID!,
  role: RoleEnum.SUPER_ADMIN,
  tenant_id: null,
  exp: futureExpiry()
};

export const tenantAdminClaims: JwtClaims = {
  sub: process.env.SEED_TENANT_ADMIN_USER_ID!,
  role: RoleEnum.TENANT_ADMIN,
  tenant_id: process.env.SEED_TENANT_ID!,
  exp: futureExpiry()
};

export const tenantUserClaims: JwtClaims = {
  sub: process.env.SEED_TENANT_USER_ID!,
  role: RoleEnum.TENANT_USER,
  tenant_id: process.env.SEED_TENANT_ID!,
  exp: futureExpiry()
};

export const tenantUserWithoutMembershipClaims: JwtClaims = {
  sub: process.env.SEED_TENANT_USER_ORPHAN_ID!,
  role: RoleEnum.TENANT_USER,
  tenant_id: process.env.SEED_TENANT_ID!,
  exp: futureExpiry()
};

export const tenantAdminMultiTenantClaims: JwtClaims = {
  sub: process.env.SEED_TENANT_ADMIN_MULTI_ID!,
  role: RoleEnum.TENANT_ADMIN,
  tenant_id: process.env.SEED_TENANT_ID!,
  exp: futureExpiry()
};

export const loginFixtures = {
  superAdminByEmail: {
    identifier: "super-admin@acme-local.test",
    password: SEEDED_AUTH_PASSWORDS.superAdmin
  },
  superAdminByUsername: {
    identifier: "super.admin",
    password: SEEDED_AUTH_PASSWORDS.superAdmin
  },
  tenantAdminByEmail: {
    identifier: "tenant-admin@acme-local.test",
    password: SEEDED_AUTH_PASSWORDS.tenantAdmin
  },
  tenantUserWithoutMembership: {
    identifier: "tenant-user-orphan@acme-local.test",
    password: DEFAULT_SEEDED_PASSWORD
  },
  tenantAdminMultiTenant: {
    identifier: "tenant-admin-multi@acme-local.test",
    password: DEFAULT_SEEDED_PASSWORD
  },
  disabledUser: {
    identifier: "disabled-user@acme-local.test",
    password: DEFAULT_SEEDED_PASSWORD
  }
} as const;
