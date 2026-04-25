import './globals.css';

import type { Metadata } from 'next';

import { AppShell, CrownBrandMark, crownWeb2NavigationGroups } from '@/components/shell/app-shell';
import { NotificationProvider } from '@/components/ui/notification-center';

export const metadata: Metadata = {
  title: 'Crown Web2',
  description: 'Next-generation component and page redesign workspace for Crown',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          <AppShell
            brandIcon={<CrownBrandMark />}
            brandName="Crown"
            navigationGroups={crownWeb2NavigationGroups}
          >
            {children}
          </AppShell>
        </NotificationProvider>
      </body>
    </html>
  );
}
