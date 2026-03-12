"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { StatusPanel } from "@/components/auth/status-panel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/components/auth/auth-provider";
import { AuthStateStatusEnum } from "@/lib/auth/types";
import { buildUnauthorizedHref, consumeValidatedReturnPath, toRecommendedPath } from "@/lib/routing/auth-routing";

export const LoginPageContent = () => {
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
      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <StatusPanel
          description="Hang tight while Crown restores your current sign-in state."
          eyebrow="Crown access"
          title="Checking your session"
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.05fr_minmax(0,0.95fr)]">
        <Card className="border-white/60 bg-white/80 shadow-2xl shadow-stone-950/10 backdrop-blur">
          <CardContent className="flex h-full flex-col justify-between gap-8 p-8">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Sign in to</p>
              <h1 id="login-title" className="text-5xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
                Crown
              </h1>
              <p className="max-w-lg text-base leading-7 text-stone-600">
                Use the shared Crown entry point to restore your session, land in the right shell, and keep platform
                and tenant work clearly separated.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Card className="border-amber-200/70 bg-amber-50/80 shadow-none">
                <CardHeader className="space-y-2 p-5">
                  <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    Platform access
                  </CardDescription>
                  <CardTitle className="text-xl text-stone-950">Control plane</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 text-sm leading-6 text-stone-600">
                  Super admins land in a global shell for tenant management and operational oversight.
                </CardContent>
              </Card>
              <Card className="border-emerald-200/70 bg-emerald-50/80 shadow-none">
                <CardHeader className="space-y-2 p-5">
                  <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                    Tenant access
                  </CardDescription>
                  <CardTitle className="text-xl text-stone-950">Workspace shell</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 text-sm leading-6 text-stone-600">
                  Tenant users are routed into their workspace with the same auth contract and bootstrap flow.
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/60 bg-white/88 shadow-2xl shadow-stone-950/10 backdrop-blur">
          <CardHeader className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Shared login</p>
            <div className="space-y-2">
              <CardTitle className="text-3xl tracking-tight text-stone-950">Access your workspace</CardTitle>
              <CardDescription className="text-base leading-7 text-stone-600">
                Enter your credentials and Crown will restore the safest valid destination for your role.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <LoginForm reason={reason} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
