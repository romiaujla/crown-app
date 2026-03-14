import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformShellFrame } from "@/components/platform/platform-shell-frame";

const PlatformTenantCreateEntryPage = () => (
  <PlatformShellFrame
    activeNavigationKey="tenants"
    sectionContent={
      <Card className="border-white/70 bg-white/92 shadow-sm">
        <CardHeader className="space-y-3">
          <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Tenant management
          </CardDescription>
          <CardTitle className="text-2xl text-stone-950">Tenant creation coming soon</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-sm leading-7 text-stone-600">
          This route is a stable entry point for the future tenant-creation workflow. The creation form and provisioning
          flow are tracked in follow-up scope.
        </CardContent>
      </Card>
    }
    sectionDescription="Use this dedicated destination as the platform entry point for the future tenant-creation workflow."
    sectionEyebrow="Tenant management"
    sectionTitle="Add Tenant"
  />
);

export default PlatformTenantCreateEntryPage;
