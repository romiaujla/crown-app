import { AccessTokenClaimsSchema, type AccessTokenClaims } from "./types";

const decodeTokenPayload = (token: string): unknown => {
  const parts = token.split(".");
  if (parts.length < 2) throw new Error("Malformed token");

  const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const normalized = payload.padEnd(Math.ceil(payload.length / 4) * 4, "=");
  return JSON.parse(atob(normalized));
};

export const parseAccessTokenClaims = (token: string): AccessTokenClaims | null => {
  try {
    const parsed = AccessTokenClaimsSchema.safeParse(decodeTokenPayload(token));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};
