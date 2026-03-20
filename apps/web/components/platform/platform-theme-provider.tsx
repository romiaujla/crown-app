'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export const PLATFORM_THEME_STORAGE_KEY = 'crown-platform-theme';

export type PlatformTheme = 'light' | 'dark';

type PlatformThemeContextValue = {
  isReady: boolean;
  theme: PlatformTheme;
  setTheme: (theme: PlatformTheme) => void;
  toggleTheme: () => void;
};

const PlatformThemeContext = createContext<PlatformThemeContextValue | null>(null);

const isPlatformTheme = (value: string | null): value is PlatformTheme =>
  value === 'light' || value === 'dark';

const resolveInitialTheme = (): PlatformTheme => {
  if (typeof document === 'undefined') {
    return 'light';
  }

  const theme = document.documentElement.dataset.platformTheme ?? null;

  return isPlatformTheme(theme) ? theme : 'light';
};

export const PlatformThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const [theme, setThemeState] = useState<PlatformTheme>(resolveInitialTheme);

  useEffect(() => {
    const nextTheme = resolveInitialTheme();

    setThemeState(nextTheme);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.dataset.platformTheme = theme;
    window.localStorage.setItem(PLATFORM_THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo<PlatformThemeContextValue>(
    () => ({
      isReady,
      theme,
      setTheme: setThemeState,
      toggleTheme: () => {
        setThemeState((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
      },
    }),
    [isReady, theme],
  );

  return <PlatformThemeContext.Provider value={value}>{children}</PlatformThemeContext.Provider>;
};

export const usePlatformTheme = () => {
  const context = useContext(PlatformThemeContext);

  if (!context) {
    throw new Error('usePlatformTheme must be used within a PlatformThemeProvider.');
  }

  return context;
};
