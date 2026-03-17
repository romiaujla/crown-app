import type { Response } from 'express';
import { z } from 'zod';

import { AuthErrorCodeSchema, type AuthErrorCodeEnum } from '../auth/claims.js';
import { AuthRoutingSchema } from '../auth/contracts.js';
import type { BlockedAuthRouting } from '../auth/service.js';

export const ErrorResponseSchema = z.object({
  errorCode: AuthErrorCodeSchema,
  message: z.string(),
  routing: AuthRoutingSchema.optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export const sendAuthError = (
  res: Response,
  status: number,
  errorCode: AuthErrorCodeEnum,
  message: string,
  routing?: BlockedAuthRouting,
) => {
  res.status(status).json({
    errorCode: errorCode,
    message,
    ...(routing
      ? {
          routing: {
            status: routing.status,
            targetApp: routing.targetApp,
            reasonCode: routing.reasonCode,
          },
        }
      : {}),
  } satisfies ErrorResponse);
};

export const sendError = sendAuthError;
