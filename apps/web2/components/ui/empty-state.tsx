import * as React from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';

export type EmptyStateAction = Omit<ButtonProps, 'asChild' | 'children' | 'icon'> & {
  icon?: React.ReactNode;
  label: string;
};

export type EmptyStateProps = Omit<React.ComponentProps<typeof Empty>, 'title'> & {
  action?: EmptyStateAction;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  title: React.ReactNode;
};

function EmptyState({ action, className, description, icon, title, ...props }: EmptyStateProps) {
  const actionButton = action ? <EmptyStateActionButton action={action} /> : null;

  return (
    <Empty className={cn('min-h-[18rem]', className)} {...props}>
      <EmptyHeader>
        {icon ? (
          <EmptyMedia aria-hidden="true" variant="icon">
            {icon}
          </EmptyMedia>
        ) : null}
        <EmptyTitle>{title}</EmptyTitle>
        {description ? <EmptyDescription>{description}</EmptyDescription> : null}
      </EmptyHeader>
      {actionButton ? <EmptyContent>{actionButton}</EmptyContent> : null}
    </Empty>
  );
}

function EmptyStateActionButton({ action }: { action: EmptyStateAction }) {
  const { icon, label, type = 'button', ...buttonProps } = action;

  return (
    <Button icon={icon} type={type} {...buttonProps}>
      {label}
    </Button>
  );
}

export { EmptyState };
