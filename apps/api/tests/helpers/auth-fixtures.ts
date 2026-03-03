import type { JwtClaims } from "../../src/auth/claims.js";

export const createJwtToken = (claims: JwtClaims) => {
  const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" }), "utf8").toString("base64url");
  const payload = Buffer.from(JSON.stringify(claims), "utf8").toString("base64url");
  return `${header}.${payload}.sig`;
};

export const superAdminClaims: JwtClaims = {
  sub: "user-super-admin",
  role: "super_admin",
  tenant_id: null
};

export const tenantAdminClaims: JwtClaims = {
  sub: "user-tenant-admin",
  role: "tenant_admin",
  tenant_id: "tenant-acme"
};

export const tenantUserClaims: JwtClaims = {
  sub: "user-tenant-user",
  role: "tenant_user",
  tenant_id: "tenant-acme"
};
