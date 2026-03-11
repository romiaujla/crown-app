import type { JwtClaims } from "../auth/claims.js";
import type { CurrentUserContext } from "../auth/service.js";

declare global {
  namespace Express {
    interface Request {
      auth?: JwtClaims;
      authContext?: {
        claims: JwtClaims;
        currentUser: CurrentUserContext;
      };
    }
  }
}

export {};
