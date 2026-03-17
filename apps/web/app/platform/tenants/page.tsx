import { PlatformShellFrame } from '@/components/platform/platform-shell-frame';
import {
  TenantDirectoryPage,
  TenantDirectoryPrimaryAction,
} from '@/components/platform/tenant-directory-page';

const PlatformTenantDirectoryPage = () => (
  <PlatformShellFrame
    activeNavigationKey="tenants"
    sectionActions={<TenantDirectoryPrimaryAction />}
    sectionContent={<TenantDirectoryPage />}
    sectionDescription=""
    sectionEyebrow="Tenant management"
    sectionTitle="Tenant Directory"
  />
);

export default PlatformTenantDirectoryPage;
