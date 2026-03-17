'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { SessionExpiryNotification } from '@/components/auth/session-expiry-notification';
import { parseAccessTokenClaims } from '@/lib/auth/token';

import { getCurrentUser, login, logout } from '../../lib/auth/api';
import {
  clearStoredAccessToken,
  clearStoredLoginReason,
  clearStoredReturnPath,
  getStoredLoginReason,
  getStoredAccessToken,
  storeStoredLoginReason,
  storeAccessToken,
} from '../../lib/auth/storage';
import {
  AuthReasonEnum,
  AuthStateStatusEnum,
  type CurrentUserResponse,
} from '../../lib/auth/types';

type AuthReason = AuthReasonEnum | null;

type AuthState =
  | {
      status: AuthStateStatusEnum.BOOTSTRAPPING;
      currentUser: null;
      reason: null;
    }
  | {
      status: AuthStateStatusEnum.AUTHENTICATED;
      currentUser: CurrentUserResponse;
      reason: null;
    }
  | {
      status: AuthStateStatusEnum.UNAUTHENTICATED;
      currentUser: null;
      reason: AuthReason;
    };

type LoginResult =
  | {
      ok: true;
      currentUser: CurrentUserResponse;
    }
  | {
      ok: false;
      message: string;
    };

type AuthContextValue = {
  state: AuthState;
  signIn(identifier: string, password: string): Promise<LoginResult>;
  signOut(): Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const clearAuthStorage = () => {
  clearStoredAccessToken();
  clearStoredReturnPath();
};

const AUTH_EXPIRY_WARNING_MS = Number(process.env.NEXT_PUBLIC_AUTH_EXPIRY_WARNING_MS ?? '60000');

const getSecondsRemaining = (expiresAtMs: number) =>
  Math.max(1, Math.ceil((expiresAtMs - Date.now()) / 1000));

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    status: AuthStateStatusEnum.BOOTSTRAPPING,
    currentUser: null,
    reason: null,
  });
  const [warningExpiryMs, setWarningExpiryMs] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  const expireSession = async (accessToken: string | null) => {
    try {
      if (accessToken) await logout(accessToken);
    } finally {
      storeStoredLoginReason(AuthReasonEnum.SESSION_EXPIRED);
      clearAuthStorage();
      setWarningExpiryMs(null);
      setSecondsRemaining(0);
      setState({
        status: AuthStateStatusEnum.UNAUTHENTICATED,
        currentUser: null,
        reason: AuthReasonEnum.SESSION_EXPIRED,
      });
    }
  };

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const accessToken = getStoredAccessToken();
      if (!accessToken) {
        if (!cancelled) {
          setState({
            status: AuthStateStatusEnum.UNAUTHENTICATED,
            currentUser: null,
            reason: null,
          });
        }
        return;
      }

      const claims = parseAccessTokenClaims(accessToken);
      if (!claims || claims.exp * 1000 <= Date.now()) {
        storeStoredLoginReason(AuthReasonEnum.SESSION_EXPIRED);
        clearAuthStorage();
        if (!cancelled) {
          setState({
            status: AuthStateStatusEnum.UNAUTHENTICATED,
            currentUser: null,
            reason: AuthReasonEnum.SESSION_EXPIRED,
          });
        }
        return;
      }

      try {
        const currentUser = await getCurrentUser(accessToken);
        if (!cancelled) {
          setState({
            status: AuthStateStatusEnum.AUTHENTICATED,
            currentUser,
            reason: null,
          });
        }
      } catch {
        storeStoredLoginReason(AuthReasonEnum.SESSION_EXPIRED);
        clearAuthStorage();
        if (!cancelled) {
          setState({
            status: AuthStateStatusEnum.UNAUTHENTICATED,
            currentUser: null,
            reason: AuthReasonEnum.SESSION_EXPIRED,
          });
        }
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (state.status !== AuthStateStatusEnum.AUTHENTICATED) {
      setWarningExpiryMs(null);
      setSecondsRemaining(0);
      return;
    }

    const accessToken = getStoredAccessToken();
    const claims = accessToken ? parseAccessTokenClaims(accessToken) : null;
    if (!claims) return;

    const expiresAtMs = claims.exp * 1000;
    const logoutDelayMs = expiresAtMs - Date.now();
    if (logoutDelayMs <= 0) {
      void expireSession(accessToken);
      return;
    }

    const warningDelayMs = Math.max(expiresAtMs - AUTH_EXPIRY_WARNING_MS - Date.now(), 0);
    const warningTimer = window.setTimeout(() => {
      setWarningExpiryMs(expiresAtMs);
      setSecondsRemaining(getSecondsRemaining(expiresAtMs));
    }, warningDelayMs);

    const logoutTimer = window.setTimeout(() => {
      void expireSession(accessToken);
    }, logoutDelayMs);

    return () => {
      window.clearTimeout(warningTimer);
      window.clearTimeout(logoutTimer);
    };
  }, [state]);

  useEffect(() => {
    if (warningExpiryMs === null) return;

    setSecondsRemaining(getSecondsRemaining(warningExpiryMs));
    const countdownInterval = window.setInterval(() => {
      setSecondsRemaining(getSecondsRemaining(warningExpiryMs));
    }, 1000);

    return () => window.clearInterval(countdownInterval);
  }, [warningExpiryMs]);

  const value: AuthContextValue = {
    state,
    async signIn(identifier: string, password: string) {
      const result = await login(identifier, password);
      if (!result.ok) return result;

      storeAccessToken(result.accessToken);
      clearStoredLoginReason();
      setState({
        status: AuthStateStatusEnum.AUTHENTICATED,
        currentUser: result.currentUser,
        reason: null,
      });
      setWarningExpiryMs(null);
      setSecondsRemaining(0);

      return {
        ok: true,
        currentUser: result.currentUser,
      };
    },
    async signOut() {
      const accessToken = getStoredAccessToken();
      try {
        if (accessToken) await logout(accessToken);
      } finally {
        clearStoredLoginReason();
        clearAuthStorage();
        setState({
          status: AuthStateStatusEnum.UNAUTHENTICATED,
          currentUser: null,
          reason: null,
        });
      }
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {warningExpiryMs !== null ? (
        <SessionExpiryNotification secondsRemaining={secondsRemaining} />
      ) : null}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('AuthProvider is required');
  }

  return value;
};
