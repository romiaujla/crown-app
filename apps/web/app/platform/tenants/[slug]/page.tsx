import { PlatformShellFrame } from '@/components/platform/platform-shell-frame';
import {
  CrownDetailsActionIntentEnum,
  CrownDetailsDensityEnum,
} from '@/components/ui/crown-details-component.types';
import { CrownDetailsComponent } from '@/components/ui/crown-details-component';

type PlatformTenantDetailsEntryPageProps = {
  params: {
    slug: string;
  };
};

const PlatformTenantDetailsEntryPage = ({ params }: PlatformTenantDetailsEntryPageProps) => (
  <PlatformShellFrame
    activeNavigationKey="tenants"
    sectionContent={
      <CrownDetailsComponent
        actions={[
          {
            key: 'edit-tenant',
            label: 'Edit tenant',
            href: `/platform/tenants/${params.slug}/edit`,
          },
          {
            key: 'view-directory',
            label: 'View directory',
            href: '/platform/tenants',
          },
          {
            key: 'deprovision-tenant',
            label: 'Deprovision tenant',
            disabled: true,
            intent: CrownDetailsActionIntentEnum.DESTRUCTIVE,
          },
        ]}
        density={CrownDetailsDensityEnum.DEFAULT}
        fields={[
          {
            key: 'tenant-reference',
            label: 'Tenant reference',
            value: params.slug,
          },
          {
            key: 'route-scope',
            label: 'Route scope',
            value: 'Platform tenant-details entry point',
          },
          {
            key: 'details-status',
            label: 'Details status',
            value: 'Shared details component ready for future backend-backed adoption',
          },
          {
            key: 'next-milestone',
            label: 'Next milestone',
            value: 'Connect live tenant profile data and lifecycle actions in a follow-up story',
          },
          {
            key: 'layout-mode',
            label: 'Layout mode',
            value: 'Standard details grid with shared action overflow',
          },
          {
            key: 'dense-preview',
            label: 'Dense preview',
            value: 'Dense mode is available for compact detail surfaces when the consumer needs it',
          },
        ]}
        mobileCol={1}
        subheading="This route remains the stable platform entry point for tenant-specific work. The shared details primitive now provides the consistent layout, action placement, and empty-state behavior that future tenant workflows can reuse."
        tabletCol={2}
        title="Tenant Details"
      />
    }
    sectionDescription="Use this dedicated destination as the platform entry point for tenant-specific detail work."
    sectionEyebrow="Tenant management"
    sectionTitle="Tenant Details"
  />
);

export default PlatformTenantDetailsEntryPage;
