import { PlatformShellFrame } from "@/components/platform/platform-shell-frame";
import { TenantDirectoryPage } from "@/components/platform/tenant-directory-page";

const PlatformTenantDirectoryPage = () => (
  <PlatformShellFrame
    activeNavigationKey="tenants"
    sectionContent={<TenantDirectoryPage />}
    sectionDescription="Search the platform tenant list, review lifecycle status, and move into follow-up tenant routes from one dedicated control-plane view."
    sectionEyebrow="Tenant management"
    sectionTitle="Tenant Directory"
  />
);

export default PlatformTenantDirectoryPage;
