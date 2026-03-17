import { clearStoredReturnPath, getStoredReturnPath, storeStoredReturnPath } from '../auth/storage';
import type { CurrentUserResponse } from '../auth/types';

const LOGIN_PATH = '/login';
const PLATFORM_PATH = '/platform';
const TENANT_PATH = '/tenant';
const UNAUTHORIZED_PATH = '/unauthorized';

type ProtectedPathDecision =
  | {
      kind: 'allow';
    }
  | {
      kind: 'redirect';
      path: string;
    }
  | {
      kind: 'unauthorized';
      reason: string;
    };

const trimPath = (path: string) => {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
};

const isPlatformPath = (path: string) => trimPath(path).startsWith(PLATFORM_PATH);
const isTenantPath = (path: string) => trimPath(path).startsWith(TENANT_PATH);
const isLoginPath = (path: string) => trimPath(path).startsWith(LOGIN_PATH);
const isUnauthorizedPath = (path: string) => trimPath(path).startsWith(UNAUTHORIZED_PATH);

const isAllowedPathForUser = (path: string, currentUser: CurrentUserResponse) => {
  if (currentUser.routing.status !== 'allowed') return false;
  if (isPlatformPath(path)) return currentUser.targetApp === 'platform';
  if (isTenantPath(path)) return currentUser.targetApp === 'tenant' && currentUser.tenant !== null;
  if (path === '/') return true;
  return false;
};

export const toRecommendedPath = (currentUser: CurrentUserResponse) =>
  currentUser.targetApp === 'platform' ? PLATFORM_PATH : TENANT_PATH;

export const captureReturnPath = (path: string) => {
  if (!path || isLoginPath(path) || isUnauthorizedPath(path)) return;
  storeStoredReturnPath(trimPath(path));
};

export const consumeValidatedReturnPath = (currentUser: CurrentUserResponse) => {
  const returnPath = getStoredReturnPath();
  if (!returnPath) return null;

  clearStoredReturnPath();
  if (isAllowedPathForUser(returnPath, currentUser)) return returnPath;

  return null;
};

export const buildLoginHref = (reason: 'session-expired' | null) =>
  reason ? `${LOGIN_PATH}?reason=${encodeURIComponent(reason)}` : LOGIN_PATH;

export const buildUnauthorizedHref = (reason: string | null) =>
  reason ? `${UNAUTHORIZED_PATH}?reason=${encodeURIComponent(reason)}` : UNAUTHORIZED_PATH;

export const resolveProtectedPath = (
  path: string,
  currentUser: CurrentUserResponse,
): ProtectedPathDecision => {
  if (currentUser.routing.status !== 'allowed') {
    return {
      kind: 'unauthorized',
      reason: currentUser.routing.reasonCode ?? 'route_not_allowed',
    };
  }

  if (isAllowedPathForUser(path, currentUser)) {
    return { kind: 'allow' };
  }

  if (isPlatformPath(path) || isTenantPath(path)) {
    return {
      kind: 'redirect',
      path: toRecommendedPath(currentUser),
    };
  }

  return {
    kind: 'unauthorized',
    reason: 'route_not_allowed',
  };
};
