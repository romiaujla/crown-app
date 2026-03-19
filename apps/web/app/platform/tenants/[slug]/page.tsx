import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlatformShellFrame } from '@/components/platform/platform-shell-frame';

type PlatformTenantDetailsEntryPageProps = {
  params: {
    slug: string;
  };
};

const PlatformTenantDetailsEntryPage = ({ params }: PlatformTenantDetailsEntryPageProps) => (
  <PlatformShellFrame
    activeNavigationKey="tenants"
    sectionContent={
      <Card className="border-white/70 bg-white/92 shadow-sm">
        <CardHeader className="space-y-3">
          <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Tenant management
          </CardDescription>
          <CardTitle className="text-2xl text-stone-950">Tenant details coming soon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0 text-sm text-stone-600">
          <p>
            This route is a stable entry point for the future tenant-details workflow. Detailed
            tenant management remains follow-up scope for this story.
          </p>
          <p>
            Tenant reference: <span className="font-semibold text-stone-950">{params.slug}</span>
          </p>
        </CardContent>
      </Card>
    }
    sectionDescription="Use this dedicated destination as the platform entry point for tenant-specific detail work."
    sectionEyebrow="Tenant management"
    sectionTitle="Tenant Details"
  />
);

export default PlatformTenantDetailsEntryPage;
