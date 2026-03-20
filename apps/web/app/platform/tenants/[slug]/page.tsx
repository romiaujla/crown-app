import { PlatformShellFrame } from '@/components/platform/platform-shell-frame';
import { CrownDetailsComponent } from '@/components/ui/crown-details-component';
import {
  CrownDetailsActionIntentEnum,
  CrownDetailsDensityEnum,
  CrownDetailsFieldSurfaceEnum,
  CrownDetailsFrameVariantEnum,
} from '@/components/ui/crown-details-component.types';

type PlatformTenantDetailsEntryPageProps = {
  params: {
    slug: string;
  };
};

const PlatformTenantDetailsEntryPage = ({ params }: PlatformTenantDetailsEntryPageProps) => (
  <PlatformShellFrame
    activeNavigationKey="tenants"
    sectionActionItems={[
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
    sectionContent={
      <CrownDetailsComponent
        density={CrownDetailsDensityEnum.DEFAULT}
        fieldSurface={CrownDetailsFieldSurfaceEnum.DIVIDED}
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
            value: 'Borderless details rows with shared shell action overflow',
          },
          {
            key: 'dense-preview',
            label: 'Dense preview',
            value: 'Dense mode is available for compact detail surfaces when the consumer needs it',
          },
        ]}
        frameVariant={CrownDetailsFrameVariantEnum.FLUSH}
        mobileCol={1}
        showHeader={false}
        tabletCol={2}
      />
    }
    sectionDescription="Use this dedicated destination as the platform entry point for tenant-specific detail work."
    sectionEyebrow="Tenant management"
    sectionTitle="Tenant Details"
  />
);

export default PlatformTenantDetailsEntryPage;
