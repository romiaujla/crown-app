import './globals.css';

import type { Metadata } from 'next';
import { AuthProvider } from '../components/auth/auth-provider';
import { AlertProvider } from '../components/ui/alert-toast';

export const metadata: Metadata = {
  title: 'Crown Workspaces',
  description: 'Platform control plane and tenant workspaces powered by Crown',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AlertProvider>
          <AuthProvider>{children}</AuthProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
