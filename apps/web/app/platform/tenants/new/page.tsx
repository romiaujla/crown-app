import { PlatformShellFrame } from "@/components/platform/platform-shell-frame";
import { TenantCreateShell } from "@/components/platform/tenant-create-shell";

const PlatformTenantCreateEntryPage = () => (
  <PlatformShellFrame
    activeNavigationKey="tenants"
    sectionContent={<TenantCreateShell />}
    sectionDescription="Guide super admins through the future tenant onboarding flow with a dedicated page shell and visible stepper."
    sectionEyebrow="Tenant management"
    sectionTitle="Add Tenant"
  />
);

export default PlatformTenantCreateEntryPage;
