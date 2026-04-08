import './globals.css';

import type { Metadata } from 'next';

import { NotificationProvider } from '@/components/ui/notification-center';

export const metadata: Metadata = {
  title: 'Crown Web2',
  description: 'Next-generation component and page redesign workspace for Crown',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>{children}</NotificationProvider>
      </body>
    </html>
  );
}
