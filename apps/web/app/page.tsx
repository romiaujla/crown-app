"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "../components/auth/auth-provider";
import { AuthStateStatusEnum } from "../lib/auth/types";
import { buildLoginHref, toRecommendedPath } from "../lib/routing/auth-routing";

const RootPage = () => {
  const router = useRouter();
  const { state } = useAuth();

  useEffect(() => {
    if (state.status === AuthStateStatusEnum.BOOTSTRAPPING) return;

    if (state.status === AuthStateStatusEnum.AUTHENTICATED) {
      router.replace(toRecommendedPath(state.currentUser));
      return;
    }

    router.replace(buildLoginHref(state.reason));
  }, [router, state]);

  return (
    <main className="auth-transition-shell">
      <section className="status-card" aria-labelledby="app-entry-title">
        <p className="eyebrow">Crown access</p>
        <h1 id="app-entry-title">Resolving your workspace</h1>
        <p>Loading your Crown session and routing context.</p>
      </section>
    </main>
  );
};

export default RootPage;
