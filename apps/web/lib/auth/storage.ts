const ACCESS_TOKEN_STORAGE_KEY = 'crown.auth.access_token';
const RETURN_PATH_STORAGE_KEY = 'crown.auth.return_path';
const LOGIN_REASON_STORAGE_KEY = 'crown.auth.login_reason';

const getStorage = () => {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage;
};

export const getStoredAccessToken = () => getStorage()?.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? null;

export const storeAccessToken = (accessToken: string) => {
  getStorage()?.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
};

export const clearStoredAccessToken = () => {
  getStorage()?.removeItem(ACCESS_TOKEN_STORAGE_KEY);
};

export const storeStoredReturnPath = (path: string) => {
  getStorage()?.setItem(RETURN_PATH_STORAGE_KEY, path);
};

export const getStoredReturnPath = () => getStorage()?.getItem(RETURN_PATH_STORAGE_KEY) ?? null;

export const clearStoredReturnPath = () => {
  getStorage()?.removeItem(RETURN_PATH_STORAGE_KEY);
};

export const storeStoredLoginReason = (reason: string) => {
  getStorage()?.setItem(LOGIN_REASON_STORAGE_KEY, reason);
};

export const getStoredLoginReason = () => getStorage()?.getItem(LOGIN_REASON_STORAGE_KEY) ?? null;

export const clearStoredLoginReason = () => {
  getStorage()?.removeItem(LOGIN_REASON_STORAGE_KEY);
};
