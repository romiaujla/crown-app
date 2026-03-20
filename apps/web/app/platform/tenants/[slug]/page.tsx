import { PlatformShellFrame } from '@/components/platform/platform-shell-frame';
import { TenantDetailsPage } from '@/components/platform/tenant-details-page';

type PlatformTenantDetailsEntryPageProps = {
  params: {
    slug: string;
  };
};

const PlatformTenantDetailsEntryPage = ({ params }: PlatformTenantDetailsEntryPageProps) => (
  <PlatformShellFrame
    activeNavigationKey="tenants"
    sectionContent={<TenantDetailsPage slug={params.slug} />}
    sectionDescription="Inspect the selected tenant from the control plane and branch into future tenant-specific administration work."
    sectionEyebrow="Tenant management"
    sectionTitle="Tenant Details"
  />
);

export default PlatformTenantDetailsEntryPage;
