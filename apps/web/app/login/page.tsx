"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { LoginForm } from "../../components/auth/login-form";
import { useAuth } from "../../components/auth/auth-provider";
import { AuthStateStatusEnum } from "../../lib/auth/types";
import {
  buildUnauthorizedHref,
  consumeValidatedReturnPath,
  toRecommendedPath
} from "../../lib/routing/auth-routing";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state } = useAuth();

  useEffect(() => {
    if (state.status !== AuthStateStatusEnum.AUTHENTICATED) return;

    const nextPath = consumeValidatedReturnPath(state.currentUser) ?? toRecommendedPath(state.currentUser);
    router.replace(nextPath);
  }, [router, state]);

  const reason = searchParams.get("reason");
  const blockedReason = searchParams.get("blocked_reason");

  useEffect(() => {
    if (!blockedReason || state.status !== AuthStateStatusEnum.AUTHENTICATED) return;
    router.replace(buildUnauthorizedHref(blockedReason));
  }, [blockedReason, router, state]);

  if (state.status === AuthStateStatusEnum.BOOTSTRAPPING) {
    return (
      <main className="auth-transition-shell">
        <section className="status-card" aria-labelledby="login-loading-title">
          <p className="eyebrow">Crown access</p>
          <h1 id="login-loading-title">Checking your session</h1>
          <p>Hang tight while Crown restores your current sign-in state.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="login-shell">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-copy">
          <p className="eyebrow">Sign in to</p>
          <h1 id="login-title">Crown</h1>
        </div>
        <LoginForm reason={reason} />
      </section>
    </main>
  );
};

export default LoginPage;
