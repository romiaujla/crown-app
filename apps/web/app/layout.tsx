import './globals.css';

import type { Metadata } from 'next';

import {
  PLATFORM_THEME_STORAGE_KEY,
  PlatformThemeProvider,
} from '../components/platform/platform-theme-provider';
import { AuthProvider } from '../components/auth/auth-provider';
import { AlertProvider } from '../components/ui/alert-toast';

export const metadata: Metadata = {
  title: 'Crown Workspaces',
  description: 'Platform control plane and tenant workspaces powered by Crown',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var storageKey = '${PLATFORM_THEME_STORAGE_KEY}';
                var storedTheme = null;

                try {
                  storedTheme = window.localStorage.getItem(storageKey);
                } catch (error) {
                  storedTheme = null;
                }

                var nextTheme = storedTheme === 'dark' ? 'dark' : 'light';
                document.documentElement.dataset.platformTheme = nextTheme;
              })();
            `,
          }}
        />
      </head>
      <body>
        <PlatformThemeProvider>
          <AlertProvider>
            <AuthProvider>{children}</AuthProvider>
          </AlertProvider>
        </PlatformThemeProvider>
      </body>
    </html>
  );
}
