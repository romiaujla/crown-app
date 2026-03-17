import { Suspense } from 'react';

import { LoginPageContent } from '@/components/auth/login-page-content';
import { StatusPanel } from '@/components/auth/status-panel';

const LoginPage = () => (
  <Suspense
    fallback={
      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <StatusPanel
          description="Hang tight while Crown restores your current sign-in state."
          eyebrow="Crown access"
          title="Checking your session"
        />
      </main>
    }
  >
    <LoginPageContent />
  </Suspense>
);

export default LoginPage;
