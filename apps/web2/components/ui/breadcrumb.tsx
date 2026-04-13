import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'nav'> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="Breadcrumb" {...props} />);
Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<'ol'>>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        'flex flex-nowrap items-center gap-1.5 overflow-hidden whitespace-nowrap text-sm text-muted-foreground [overflow-wrap:normal] sm:gap-2.5',
        className,
      )}
      {...props}
    />
  ),
);
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<'li'>>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(
        'inline-flex min-w-0 shrink-0 items-center gap-1.5 whitespace-nowrap',
        className,
      )}
      {...props}
    />
  ),
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      ref={ref}
      className={cn(
        'inline-flex max-w-full min-w-0 whitespace-nowrap rounded-md underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] hover:text-foreground hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<'span'>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        'inline-block max-w-full truncate whitespace-nowrap font-medium text-primary',
        className,
      )}
      {...props}
    />
  ),
);
BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<'li'>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('shrink-0 select-none whitespace-nowrap [&>svg]:size-3.5', className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('flex size-9 shrink-0 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="size-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

type CrownBreadcrumbSegment = {
  current?: boolean;
  href?: string;
  label: string;
};

type CrownBreadcrumbDisplaySegment = CrownBreadcrumbSegment & {
  ellipsis?: boolean;
};

type CrownBreadcrumbProps = Omit<React.ComponentPropsWithoutRef<'nav'>, 'children'> & {
  currentLabel?: string;
  formatSegmentLabel?: (segment: string) => string;
  items?: CrownBreadcrumbSegment[];
  maxVisibleItems?: 3 | 4;
  mobileBackLabel?: string;
  pathname?: string;
  rootHref?: string;
  rootLabel?: string;
  showMobileBackLink?: boolean;
};

const defaultFormatSegmentLabel = (segment: string) =>
  segment
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const getPathnameSegments = ({
  currentLabel,
  formatSegmentLabel = defaultFormatSegmentLabel,
  pathname,
  rootHref,
  rootLabel,
}: Pick<
  CrownBreadcrumbProps,
  'currentLabel' | 'formatSegmentLabel' | 'pathname' | 'rootHref' | 'rootLabel'
>): CrownBreadcrumbSegment[] => {
  if (!pathname) {
    return [];
  }

  const cleanPathname = pathname.split(/[?#]/)[0] ?? '';
  const pathParts = cleanPathname.split('/').filter(Boolean);
  const segments: CrownBreadcrumbSegment[] = rootLabel
    ? [{ href: rootHref ?? '/', label: rootLabel }]
    : [];

  pathParts.forEach((part, index) => {
    const isCurrent = index === pathParts.length - 1;
    const href = `/${pathParts.slice(0, index + 1).join('/')}`;

    segments.push({
      current: isCurrent,
      href: isCurrent ? undefined : href,
      label: isCurrent && currentLabel ? currentLabel : formatSegmentLabel(part),
    });
  });

  return segments;
};

const getResolvedItems = ({
  currentLabel,
  formatSegmentLabel,
  items,
  pathname,
  rootHref,
  rootLabel,
}: Pick<
  CrownBreadcrumbProps,
  'currentLabel' | 'formatSegmentLabel' | 'items' | 'pathname' | 'rootHref' | 'rootLabel'
>) => {
  const rawItems =
    items ??
    getPathnameSegments({ currentLabel, formatSegmentLabel, pathname, rootHref, rootLabel });

  return rawItems.filter((item) => item.label.trim().length > 0);
};

const getVisibleItems = (
  items: CrownBreadcrumbSegment[],
  maxVisibleItems: NonNullable<CrownBreadcrumbProps['maxVisibleItems']>,
): CrownBreadcrumbDisplaySegment[] => {
  if (items.length <= 3) {
    return items;
  }

  const currentItem = items[items.length - 1];
  const parentItem = items[items.length - 2];
  const ellipsisItem: CrownBreadcrumbDisplaySegment = {
    ellipsis: true,
    label: '...',
  };

  if (maxVisibleItems === 3) {
    return [ellipsisItem, parentItem, currentItem];
  }

  return [items[0], ellipsisItem, parentItem, currentItem];
};

function CrownBreadcrumb({
  className,
  currentLabel,
  formatSegmentLabel,
  items,
  maxVisibleItems = 3,
  mobileBackLabel,
  pathname,
  rootHref = '/',
  rootLabel,
  showMobileBackLink = true,
  ...props
}: CrownBreadcrumbProps) {
  const resolvedItems = getResolvedItems({
    currentLabel,
    formatSegmentLabel,
    items,
    pathname,
    rootHref,
    rootLabel,
  });

  if (resolvedItems.length === 0) {
    return null;
  }

  const currentIndex = resolvedItems.findIndex((item) => item.current);
  const currentItem =
    currentIndex >= 0 ? resolvedItems[currentIndex] : resolvedItems[resolvedItems.length - 1];
  const parentItem = [...resolvedItems]
    .slice(0, currentIndex >= 0 ? currentIndex : resolvedItems.length - 1)
    .reverse()
    .find((item) => item.href);
  const mobileLabel =
    mobileBackLabel ?? (parentItem ? `Back to ${parentItem.label}` : currentItem.label);
  const visibleItems = getVisibleItems(resolvedItems, maxVisibleItems);

  return (
    <Breadcrumb
      className={cn(
        'w-full max-w-full overflow-hidden whitespace-nowrap text-xs font-medium uppercase tracking-[0.18em] [overflow-wrap:normal]',
        className,
      )}
      {...props}
    >
      {showMobileBackLink ? (
        <div className="flex min-h-8 min-w-0 max-w-full items-center overflow-hidden whitespace-nowrap max-sm:flex sm:!hidden">
          {parentItem?.href ? (
            <BreadcrumbLink
              className="items-center gap-1 overflow-hidden text-muted-foreground hover:text-primary"
              href={parentItem.href}
            >
              <ChevronLeft aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate">{mobileLabel}</span>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{mobileLabel}</BreadcrumbPage>
          )}
        </div>
      ) : null}
      <BreadcrumbList
        className={cn(
          'min-w-0 !flex-nowrap gap-2 overflow-hidden whitespace-nowrap break-normal text-xs text-muted-foreground [overflow-wrap:normal] sm:gap-2',
          showMobileBackLink ? 'hidden max-sm:!hidden sm:flex' : null,
        )}
      >
        {visibleItems.map((item, index) => {
          const isCurrent = item.current ?? item === currentItem;

          return (
            <React.Fragment
              key={`${item.href ?? (item.ellipsis ? 'ellipsis' : 'current')}-${item.label}-${index}`}
            >
              <BreadcrumbItem>
                {item.ellipsis ? (
                  <span
                    aria-label="Collapsed breadcrumb items"
                    className="text-muted-foreground/70"
                  >
                    ...
                  </span>
                ) : isCurrent || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink className="hover:text-primary" href={item.href}>
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < visibleItems.length - 1 ? (
                <BreadcrumbSeparator className="text-muted-foreground/70">/</BreadcrumbSeparator>
              ) : null}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  CrownBreadcrumb,
  type CrownBreadcrumbProps,
  type CrownBreadcrumbSegment,
};
