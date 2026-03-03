import type { Response } from "express";
import { z } from "zod";

import { AuthErrorCodeSchema, type AuthErrorCode } from "../auth/claims.js";

export const ErrorResponseSchema = z.object({
  error_code: AuthErrorCodeSchema,
  message: z.string()
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export const sendAuthError = (res: Response, status: number, errorCode: AuthErrorCode, message: string) => {
  res.status(status).json({ error_code: errorCode, message } satisfies ErrorResponse);
};

export const sendError = sendAuthError;
