"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "./auth-provider";
import { consumeValidatedReturnPath, toRecommendedPath } from "../../lib/routing/auth-routing";

type LoginFormProps = {
  reason: string | null;
};

const reasonMessage: Record<string, string> = {
  "session-expired": "Your session expired. Sign in again to continue."
};

export const LoginForm = ({ reason }: LoginFormProps) => {
  const router = useRouter();
  const { signIn } = useAuth();
  const identifierInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
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
    if (!identifier.trim()) nextFieldErrors.identifier = "Enter your email or username.";
    if (!password.trim()) nextFieldErrors.password = "Enter your password.";

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

      const nextPath = consumeValidatedReturnPath(result.currentUser) ?? toRecommendedPath(result.currentUser);
      router.replace(nextPath);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      {bannerMessage ? (
        <p className="form-banner" role="alert">
          {bannerMessage}
        </p>
      ) : null}

      <label className="form-field">
        <span className="field-label">Email or username</span>
        <input
          aria-invalid={fieldErrors.identifier ? "true" : "false"}
          className="text-input"
          autoComplete="username"
          name="identifier"
          ref={identifierInputRef}
          onChange={(event) => setIdentifier(event.target.value)}
          value={identifier}
        />
        {fieldErrors.identifier ? <span className="field-error">{fieldErrors.identifier}</span> : null}
      </label>

      <label className="form-field">
        <span className="field-label">Password</span>
        <input
          aria-invalid={fieldErrors.password ? "true" : "false"}
          className="text-input"
          autoComplete="current-password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          ref={passwordInputRef}
          type="password"
          value={password}
        />
        {fieldErrors.password ? <span className="field-error">{fieldErrors.password}</span> : null}
      </label>
      <button className="form-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};
