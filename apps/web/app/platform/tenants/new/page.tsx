import { PlatformShellFrame } from '@/components/platform/platform-shell-frame';
import { TenantCreateShell } from '@/components/platform/tenant-create-shell';

const PlatformTenantCreateEntryPage = () => (
  <PlatformShellFrame
    activeNavigationKey="tenants"
    sectionContent={<TenantCreateShell />}
    sectionEyebrow="Tenant management"
    sectionTitle="Add Tenant"
  />
);

export default PlatformTenantCreateEntryPage;
