import { Suspense } from "react";

import { StatusPanel } from "@/components/auth/status-panel";
import { UnauthorizedPageContent } from "@/components/auth/unauthorized-page-content";

const UnauthorizedPage = () => (
  <Suspense
    fallback={
      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <StatusPanel
          description="Crown is resolving the safest destination for this authenticated route."
          eyebrow="Access state"
          title="Checking your access"
          tone="access"
        />
      </main>
    }
  >
    <UnauthorizedPageContent />
  </Suspense>
);

export default UnauthorizedPage;
