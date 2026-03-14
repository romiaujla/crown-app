import { PlatformShellFrame } from "@/components/platform/platform-shell-frame";
import { TenantDirectoryPage } from "@/components/platform/tenant-directory-page";

const PlatformTenantDirectoryPage = () => (
  <PlatformShellFrame
    activeNavigationKey="tenants"
    sectionContent={<TenantDirectoryPage />}
    sectionDescription=""
    sectionEyebrow="Tenant management"
    sectionTitle="Tenant Directory"
  />
);

export default PlatformTenantDirectoryPage;
