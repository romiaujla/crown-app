import type { JwtClaims } from "../auth/claims.js";

declare global {
  namespace Express {
    interface Request {
      auth?: JwtClaims;
    }
  }
}

export {};
