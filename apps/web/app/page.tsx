"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { StatusPanel } from "@/components/auth/status-panel";

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
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <StatusPanel
        description="Loading your Crown session and routing context."
        eyebrow="Crown access"
        title="Resolving your workspace"
      />
    </main>
  );
};

export default RootPage;
