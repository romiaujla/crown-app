"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { buildLoginHref, buildUnauthorizedHref, captureReturnPath, resolveProtectedPath } from "@/lib/routing/auth-routing";
import { AuthStateStatusEnum, type CurrentUserResponse } from "@/lib/auth/types";

type ProtectedShellState =
  | {
      kind: "bootstrapping";
    }
  | {
      kind: "unauthenticated";
    }
  | {
      kind: "redirecting";
    }
  | {
      kind: "ready";
      currentUser: CurrentUserResponse;
    };

export const useProtectedShell = (pathname: string): ProtectedShellState => {
  const router = useRouter();
  const { state } = useAuth();

  const protectedPathDecision =
    state.status === AuthStateStatusEnum.AUTHENTICATED ? resolveProtectedPath(pathname, state.currentUser) : null;

  useEffect(() => {
    if (state.status === AuthStateStatusEnum.BOOTSTRAPPING) return;

    if (state.status === AuthStateStatusEnum.UNAUTHENTICATED) {
      captureReturnPath(pathname);
      router.replace(buildLoginHref(state.reason));
      return;
    }

    if (protectedPathDecision?.kind === "redirect") {
      router.replace(protectedPathDecision.path);
      return;
    }

    if (protectedPathDecision?.kind === "unauthorized") {
      router.replace(buildUnauthorizedHref(protectedPathDecision.reason));
    }
  }, [pathname, protectedPathDecision, router, state]);

  if (state.status === AuthStateStatusEnum.BOOTSTRAPPING) {
    return { kind: "bootstrapping" };
  }

  if (state.status === AuthStateStatusEnum.UNAUTHENTICATED) {
    return { kind: "unauthenticated" };
  }

  if (protectedPathDecision?.kind !== "allow") {
    return { kind: "redirecting" };
  }

  return {
    kind: "ready",
    currentUser: state.currentUser
  };
};
