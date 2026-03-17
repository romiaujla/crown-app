'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAuth } from './auth-provider';
import { consumeValidatedReturnPath, toRecommendedPath } from '../../lib/routing/auth-routing';

type LoginFormProps = {
  reason: string | null;
};

const reasonMessage: Record<string, string> = {
  'session-expired': 'Your session expired. Sign in again to continue.',
};

export const LoginForm = ({ reason }: LoginFormProps) => {
  const router = useRouter();
  const { signIn } = useAuth();
  const identifierInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bannerMessage = useMemo(() => {
    if (formError) return formError;
    if (reason) return reasonMessage[reason] ?? null;
    return null;
  }, [formError, reason]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextFieldErrors: typeof fieldErrors = {};
    if (!identifier.trim()) nextFieldErrors.identifier = 'Enter your email or username.';
    if (!password.trim()) nextFieldErrors.password = 'Enter your password.';

    setFieldErrors(nextFieldErrors);
    setFormError(null);

    if (Object.keys(nextFieldErrors).length > 0) {
      if (nextFieldErrors.identifier) {
        identifierInputRef.current?.focus();
      } else if (nextFieldErrors.password) {
        passwordInputRef.current?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signIn(identifier.trim(), password);
      if (!result.ok) {
        setFormError(result.message);
        return;
      }

      const nextPath =
        consumeValidatedReturnPath(result.currentUser) ?? toRecommendedPath(result.currentUser);
      router.replace(nextPath);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {bannerMessage ? (
        <div
          className="form-banner rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {bannerMessage}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="identifier">Email or username</Label>
        <Input
          id="identifier"
          aria-invalid={fieldErrors.identifier ? 'true' : 'false'}
          autoComplete="username"
          name="identifier"
          placeholder="name@crown.test"
          ref={identifierInputRef}
          onChange={(event) => setIdentifier(event.target.value)}
          value={identifier}
        />
        {fieldErrors.identifier ? (
          <p className="text-sm text-destructive">{fieldErrors.identifier}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          aria-invalid={fieldErrors.password ? 'true' : 'false'}
          autoComplete="current-password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          ref={passwordInputRef}
          type="password"
          value={password}
        />
        {fieldErrors.password ? (
          <p className="text-sm text-destructive">{fieldErrors.password}</p>
        ) : null}
      </div>

      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};
