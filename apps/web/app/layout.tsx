import './globals.css';

import { AuthProvider } from '../components/auth/auth-provider';

export const metadata = {
  title: 'Crown Workspaces',
  description: 'Platform control plane and tenant workspaces powered by Crown',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
