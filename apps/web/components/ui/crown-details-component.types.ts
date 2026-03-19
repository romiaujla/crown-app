import type { ReactNode } from 'react';

export enum CrownDetailsDensityEnum {
  DEFAULT = 'default',
  DENSE = 'dense',
}

export enum CrownDetailsActionIntentEnum {
  DEFAULT = 'default',
  DESTRUCTIVE = 'destructive',
}

export type CrownDetailsFieldValue = ReactNode | null | undefined;

export type CrownDetailsField = {
  key: string;
  label: string;
  value: CrownDetailsFieldValue;
  formatter?: (value: CrownDetailsFieldValue) => ReactNode;
};

export type CrownDetailsAction = {
  key: string;
  label: string;
  href?: string;
  onClick?: () => void;
  intent?: CrownDetailsActionIntentEnum;
  disabled?: boolean;
};

export type CrownDetailsComponentProps = {
  title: string;
  subheading?: string;
  fields: CrownDetailsField[];
  actions?: CrownDetailsAction[];
  density?: CrownDetailsDensityEnum;
  showHeader?: boolean;
  showActions?: boolean;
  desktopCol?: number;
  tabletCol?: number;
  mobileCol?: number;
  className?: string;
};
