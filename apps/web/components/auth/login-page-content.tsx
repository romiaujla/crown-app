'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { StatusPanel } from '@/components/auth/status-panel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { LoginForm } from '@/components/auth/login-form';
import { useAuth } from '@/components/auth/auth-provider';
import { clearStoredLoginReason, getStoredLoginReason } from '@/lib/auth/storage';
import { AuthReasonEnum, AuthStateStatusEnum } from '@/lib/auth/types';
import {
  buildLoginHref,
  buildUnauthorizedHref,
  consumeValidatedReturnPath,
  toRecommendedPath,
} from '@/lib/routing/auth-routing';

export const LoginPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state } = useAuth();

  useEffect(() => {
    if (state.status !== AuthStateStatusEnum.AUTHENTICATED) return;

    const nextPath =
      consumeValidatedReturnPath(state.currentUser) ?? toRecommendedPath(state.currentUser);
    router.replace(nextPath);
  }, [router, state]);

  const reason = searchParams.get('reason');
  const blockedReason = searchParams.get('blocked_reason');
  const storedReason = getStoredLoginReason();
  const resolvedReason =
    reason ??
    storedReason ??
    (state.reason === AuthReasonEnum.SESSION_EXPIRED ? state.reason : null);

  useEffect(() => {
    if (state.status !== AuthStateStatusEnum.UNAUTHENTICATED) return;
    if (
      state.reason !== AuthReasonEnum.SESSION_EXPIRED ||
      reason === AuthReasonEnum.SESSION_EXPIRED
    )
      return;
    router.replace(buildLoginHref(state.reason));
  }, [reason, router, state]);

  useEffect(() => {
    if (!blockedReason || state.status !== AuthStateStatusEnum.AUTHENTICATED) return;
    router.replace(buildUnauthorizedHref(blockedReason));
  }, [blockedReason, router, state]);

  useEffect(() => {
    if (!resolvedReason) return;
    clearStoredLoginReason();
  }, [resolvedReason]);

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
    <main className="flex min-h-screen items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <Card className="border-white/60 bg-white/80 shadow-2xl shadow-stone-950/10 backdrop-blur">
          <CardContent className="grid min-h-[560px] gap-8 p-8 lg:grid-cols-[0.9fr_minmax(0,1.1fr)] lg:items-center">
            <div className="flex h-full items-center">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Sign in to
                </p>
                <h1 id="login-title" aria-label="Enter Crown" className="text-3xl text-stone-950">
                  Crown
                </h1>
              </div>
            </div>

            <Card className="border-white/70 bg-[#ede7de]/95 shadow-sm">
              <CardHeader className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Login
                </p>
                <div className="space-y-2">
                  <CardTitle className="text-2xl text-stone-950">Access your workspace</CardTitle>
                  <CardDescription className="text-base text-stone-600">
                    Enter your credentials so Crown can take you to your destination.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Card className="border-white/70 bg-white/90 shadow-sm">
                  <CardContent className="p-6">
                    <LoginForm reason={resolvedReason} />
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
