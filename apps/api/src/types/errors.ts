import type { Response } from "express";
import { z } from "zod";

import { AuthRoutingSchema } from "../auth/contracts.js";
import { AuthErrorCodeSchema, type AuthErrorCode } from "../auth/claims.js";
import type { BlockedAuthRouting } from "../auth/service.js";

export const ErrorResponseSchema = z.object({
  error_code: AuthErrorCodeSchema,
  message: z.string(),
  routing: AuthRoutingSchema.optional()
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export const sendAuthError = (
  res: Response,
  status: number,
  errorCode: AuthErrorCode,
  message: string,
  routing?: BlockedAuthRouting
) => {
  res.status(status).json({
    error_code: errorCode,
    message,
    ...(routing
      ? {
          routing: {
            status: routing.status,
            target_app: routing.targetApp,
            reason_code: routing.reasonCode
          }
        }
      : {})
  } satisfies ErrorResponse);
};

export const sendError = sendAuthError;
