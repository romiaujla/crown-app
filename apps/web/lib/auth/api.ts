import {
  AccessTokenResponseSchema,
  AuthErrorResponseSchema,
  CurrentUserResponseSchema,
  type CurrentUserResponse
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type LoginSuccessResult = {
  ok: true;
  accessToken: string;
  currentUser: CurrentUserResponse;
};

type LoginFailureResult = {
  ok: false;
  message: string;
};

class AuthApiError extends Error {
  status: number;
  code: string | null;

  constructor(message: string, status: number, code: string | null = null) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const toUserFacingLoginMessage = (error: AuthApiError) => {
  if (error.code === "validation_error" || error.status === 400) {
    return "Enter a valid email or username and password.";
  }

  if (error.code === "invalid_credentials" || error.status === 401) {
    return "Invalid username/email or password.";
  }

  if (error.code === "disabled_account" || error.status === 403) {
    return "Your account cannot sign in right now.";
  }

  return "Sign in could not be completed. Try again.";
};

const parseJson = async (response: Response) => {
  if (response.status === 204) return null;
  return response.json();
};

const request = async (path: string, init: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init.headers ?? {})
    }
  });

  if (!response.ok) {
    const rawError = await parseJson(response).catch(() => null);
    const error = AuthErrorResponseSchema.safeParse(rawError);
    throw new AuthApiError(
      error.success ? error.data.message : "Authentication request failed.",
      response.status,
      error.success ? error.data.error_code : null
    );
  }

  return parseJson(response);
};

export const login = async (identifier: string, password: string): Promise<LoginSuccessResult | LoginFailureResult> => {
  try {
    const response = await request("/api/v1/auth/login", {
      body: JSON.stringify({ identifier, password }),
      method: "POST"
    });

    if (!response) {
      return {
        ok: false,
        message: "Authentication request failed."
      };
    }

    const parsed = AccessTokenResponseSchema.safeParse(response);
    if (!parsed.success) {
      return {
        ok: false,
        message: "Authentication response was invalid."
      };
    }

    return {
      ok: true,
      accessToken: parsed.data.access_token,
      currentUser: parsed.data.current_user
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof AuthApiError ? toUserFacingLoginMessage(error) : "Sign in could not be completed. Try again."
    };
  }
};

export const getCurrentUser = async (accessToken: string) =>
  CurrentUserResponseSchema.parse(
    await request("/api/v1/auth/me", {
      headers: {
        authorization: `Bearer ${accessToken}`
      },
      method: "GET"
    })
  ) as CurrentUserResponse;

export const logout = async (accessToken: string) => {
  await request("/api/v1/auth/logout", {
    body: JSON.stringify({}),
    headers: {
      authorization: `Bearer ${accessToken}`
    },
    method: "POST"
  });
};
