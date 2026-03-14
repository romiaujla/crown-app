import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformShellFrame } from "@/components/platform/platform-shell-frame";

type PlatformTenantEditEntryPageProps = {
  params: {
    tenantId: string;
  };
};

const PlatformTenantEditEntryPage = ({ params }: PlatformTenantEditEntryPageProps) => (
  <PlatformShellFrame
    activeNavigationKey="tenants"
    sectionContent={
      <Card className="border-white/70 bg-white/92 shadow-sm">
        <CardHeader className="space-y-3">
          <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Tenant management
          </CardDescription>
          <CardTitle className="text-2xl text-stone-950">Tenant edit coming soon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0 text-sm leading-7 text-stone-600">
          <p>
            This route is a stable entry point for the future tenant-edit workflow. Editing behavior remains follow-up
            scope for this story.
          </p>
          <p>
            Tenant reference: <span className="font-semibold text-stone-950">{params.tenantId}</span>
          </p>
        </CardContent>
      </Card>
    }
    sectionDescription="Use this dedicated destination as the platform entry point for future tenant-edit work."
    sectionEyebrow="Tenant management"
    sectionTitle="Edit Tenant"
  />
);

export default PlatformTenantEditEntryPage;
