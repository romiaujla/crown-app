"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { getCurrentUser, login, logout } from "../../lib/auth/api";
import {
  clearStoredAccessToken,
  clearStoredReturnPath,
  getStoredAccessToken,
  storeAccessToken
} from "../../lib/auth/storage";
import type { CurrentUserResponse } from "../../lib/auth/types";

type AuthReason = "session-expired" | null;

type AuthState =
  | {
      status: "bootstrapping";
      currentUser: null;
      reason: null;
    }
  | {
      status: "authenticated";
      currentUser: CurrentUserResponse;
      reason: null;
    }
  | {
      status: "unauthenticated";
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
    status: "bootstrapping",
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
            status: "unauthenticated",
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
            status: "authenticated",
            currentUser,
            reason: null
          });
        }
      } catch {
        clearAuthStorage();
        if (!cancelled) {
          setState({
            status: "unauthenticated",
            currentUser: null,
            reason: "session-expired"
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
        status: "authenticated",
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
          status: "unauthenticated",
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
