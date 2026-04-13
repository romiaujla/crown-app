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
        'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
        className,
      )}
      {...props}
    />
  ),
);
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<'li'>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} />
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
        'rounded-md underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] hover:text-foreground hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
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
      className={cn('font-medium text-primary', className)}
      {...props}
    />
  ),
);
BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<'li'>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('select-none [&>svg]:size-3.5', className)}
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
    className={cn('flex size-9 items-center justify-center', className)}
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

type CrownBreadcrumbProps = Omit<React.ComponentPropsWithoutRef<'nav'>, 'children'> & {
  currentLabel?: string;
  formatSegmentLabel?: (segment: string) => string;
  items?: CrownBreadcrumbSegment[];
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

function CrownBreadcrumb({
  className,
  currentLabel,
  formatSegmentLabel,
  items,
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

  return (
    <Breadcrumb
      className={cn('w-full text-xs font-medium uppercase tracking-[0.18em]', className)}
      {...props}
    >
      {showMobileBackLink ? (
        <div className="flex min-h-8 items-center sm:hidden">
          {parentItem?.href ? (
            <BreadcrumbLink
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
              href={parentItem.href}
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
              <span>{mobileLabel}</span>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{mobileLabel}</BreadcrumbPage>
          )}
        </div>
      ) : null}
      <BreadcrumbList
        className={cn(
          'gap-2 text-xs text-muted-foreground sm:gap-2',
          showMobileBackLink ? 'hidden sm:flex' : null,
        )}
      >
        {resolvedItems.map((item, index) => {
          const isCurrent = item.current ?? index === resolvedItems.length - 1;

          return (
            <React.Fragment key={`${item.href ?? 'current'}-${item.label}-${index}`}>
              <BreadcrumbItem>
                {isCurrent || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink className="hover:text-primary" href={item.href}>
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < resolvedItems.length - 1 ? (
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
