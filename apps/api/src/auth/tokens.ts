import { createHmac, timingSafeEqual } from 'node:crypto';

import { env } from '../config/env.js';
import type { JwtClaims } from './claims.js';

const JWT_ALGORITHM = 'HS256';
const JWT_TYPE = 'JWT';

const encodeBase64Url = (value: string) => Buffer.from(value, 'utf8').toString('base64url');

const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return Buffer.from(padded, 'base64').toString('utf8');
};

const signSegments = (headerSegment: string, payloadSegment: string, secret: string) =>
  createHmac('sha256', secret).update(`${headerSegment}.${payloadSegment}`).digest('base64url');

export const signAccessToken = (claims: JwtClaims, secret = env.JWT_ACCESS_SECRET) => {
  const headerSegment = encodeBase64Url(
    JSON.stringify({
      alg: JWT_ALGORITHM,
      typ: JWT_TYPE,
    }),
  );
  const payloadSegment = encodeBase64Url(JSON.stringify(claims));
  const signatureSegment = signSegments(headerSegment, payloadSegment, secret);

  return `${headerSegment}.${payloadSegment}.${signatureSegment}`;
};

export const verifyAccessToken = (token: string, secret = env.JWT_ACCESS_SECRET): unknown => {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    throw new Error('Malformed token');
  }

  const [headerSegment, payloadSegment, signatureSegment] = parts;
  const header = JSON.parse(decodeBase64Url(headerSegment)) as { alg?: string; typ?: string };
  if (header.alg !== JWT_ALGORITHM || header.typ !== JWT_TYPE) {
    throw new Error('Unexpected token header');
  }

  const expectedSignature = signSegments(headerSegment, payloadSegment, secret);
  const actualSignatureBuffer = Buffer.from(signatureSegment);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (
    actualSignatureBuffer.length !== expectedSignatureBuffer.length ||
    !timingSafeEqual(actualSignatureBuffer, expectedSignatureBuffer)
  ) {
    throw new Error('Invalid token signature');
  }

  return JSON.parse(decodeBase64Url(payloadSegment));
};
