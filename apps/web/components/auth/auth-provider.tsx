"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { getCurrentUser, login, logout } from "../../lib/auth/api";
import {
  clearStoredAccessToken,
  clearStoredReturnPath,
  getStoredAccessToken,
  storeAccessToken
} from "../../lib/auth/storage";
import { AuthReasonEnum, AuthStateStatusEnum, type CurrentUserResponse } from "../../lib/auth/types";

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    status: AuthStateStatusEnum.BOOTSTRAPPING,
    currentUser: null,
    reason: null
  });

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const accessToken = getStoredAccessToken();
      if (!accessToken) {
        if (!cancelled) {
          setState({
            status: AuthStateStatusEnum.UNAUTHENTICATED,
            currentUser: null,
            reason: null
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
            reason: null
          });
        }
      } catch {
        clearAuthStorage();
        if (!cancelled) {
          setState({
            status: AuthStateStatusEnum.UNAUTHENTICATED,
            currentUser: null,
            reason: AuthReasonEnum.SESSION_EXPIRED
          });
        }
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const value: AuthContextValue = {
    state,
    async signIn(identifier: string, password: string) {
      const result = await login(identifier, password);
      if (!result.ok) return result;

      storeAccessToken(result.accessToken);
      setState({
        status: AuthStateStatusEnum.AUTHENTICATED,
        currentUser: result.currentUser,
        reason: null
      });

      return {
        ok: true,
        currentUser: result.currentUser
      };
    },
    async signOut() {
      const accessToken = getStoredAccessToken();
      try {
        if (accessToken) await logout(accessToken);
      } finally {
        clearAuthStorage();
        setState({
          status: AuthStateStatusEnum.UNAUTHENTICATED,
          currentUser: null,
          reason: null
        });
      }
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("AuthProvider is required");
  }

  return value;
};
