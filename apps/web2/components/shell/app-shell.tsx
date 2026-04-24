'use client';

import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Blocks,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Home,
  Menu,
  RefreshCw,
  Sparkles,
  TriangleAlert,
  Wallet,
  X,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type AppShellNavigationLeafItem = {
  disabled?: boolean;
  href: string;
  icon: LucideIcon;
  id: string;
  label: string;
};

type AppShellNavigationParentItem = AppShellNavigationLeafItem & {
  children?: AppShellNavigationLeafItem[];
};

export type AppShellNavigationGroup = {
  id: string;
  items: AppShellNavigationParentItem[];
};

export type AppShellNavigationState = 'ready' | 'loading' | 'empty' | 'error';

export type AppShellProps = {
  brandIcon: React.ReactNode;
  brandName: string;
  defaultDesktopRailCollapsed?: boolean;
  children: React.ReactNode;
  defaultDesktopOpenParentId?: string | null;
  defaultMobileExpandedParentId?: string | null;
  defaultMobileNavOpen?: boolean;
  navigationGroups: AppShellNavigationGroup[];
  navigationState?: AppShellNavigationState;
  onRetry?: () => void;
};

const navigationItemSelector = '[data-nav-item="true"]:not([aria-disabled="true"])';

export const crownWeb2NavigationGroups: AppShellNavigationGroup[] = [
  {
    id: 'foundation',
    items: [
      {
        href: '#overview',
        icon: Home,
        id: 'overview',
        label: 'Overview',
      },
      {
        href: '#component-library',
        icon: Blocks,
        id: 'component-library',
        label: 'Component library',
      },
    ],
  },
  {
    id: 'operations',
    items: [
      {
        children: [
          {
            href: '#platform-overview',
            icon: Building2,
            id: 'platform-overview',
            label: 'Platform overview',
          },
          {
            href: '#recommended-next-step',
            icon: Sparkles,
            id: 'recommended-next-step',
            label: 'Recommended next step',
          },
          {
            href: '#workflow-launchers',
            icon: FolderKanban,
            id: 'workflow-launchers',
            label: 'Workflow launchers',
          },
        ],
        href: '#platform-overview',
        icon: FolderKanban,
        id: 'operations',
        label: 'Operations',
      },
      {
        children: [
          {
            href: '#tenant-directory-preview',
            icon: Building2,
            id: 'tenant-directory-preview',
            label: 'Tenant directory',
          },
          {
            href: '#billing-preview',
            icon: Wallet,
            id: 'billing-preview',
            label: 'Billing review',
          },
        ],
        href: '#tenant-directory-preview',
        icon: Wallet,
        id: 'finance',
        label: 'Finance controls',
      },
    ],
  },
];

export function CrownBrandMark() {
  return (
    <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
      <Building2 aria-hidden="true" className="h-5 w-5" strokeWidth={1.9} />
    </span>
  );
}

function AppShell({
  brandIcon,
  brandName,
  children,
  defaultDesktopRailCollapsed,
  defaultDesktopOpenParentId,
  defaultMobileExpandedParentId,
  defaultMobileNavOpen = false,
  navigationGroups,
  navigationState = 'ready',
  onRetry,
}: AppShellProps) {
  const pathname = usePathname() ?? '/';
  const [currentHash, setCurrentHash] = React.useState('');
  const [desktopOpenParentId, setDesktopOpenParentId] = React.useState<string | null>(
    defaultDesktopOpenParentId ?? null,
  );
  const [isDesktopRailCollapsed, setIsDesktopRailCollapsed] = React.useState(
    defaultDesktopRailCollapsed ?? Boolean(defaultDesktopOpenParentId),
  );
  const [isDesktopSubmenuExpanded, setIsDesktopSubmenuExpanded] = React.useState(
    Boolean(defaultDesktopOpenParentId),
  );
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(defaultMobileNavOpen);
  const [mobileExpandedParentId, setMobileExpandedParentId] = React.useState<string | null>(
    defaultMobileExpandedParentId ?? null,
  );
  const mobileCloseButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const desktopParentButtonRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  React.useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  React.useEffect(() => {
    if (!isMobileNavOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    mobileCloseButtonRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileNavOpen]);

  const normalizedGroups = React.useMemo(
    () => navigationGroups.map((group) => ({ ...group, items: group.items.filter(Boolean) })),
    [navigationGroups],
  );
  const hasNavigationItems = React.useMemo(
    () => normalizedGroups.some((group) => group.items.length > 0),
    [normalizedGroups],
  );
  const effectiveNavigationState =
    navigationState === 'ready' && !hasNavigationItems ? 'empty' : navigationState;
  const activeChildParentId = React.useMemo(
    () => findActiveChildParentId(normalizedGroups, pathname, currentHash),
    [currentHash, normalizedGroups, pathname],
  );
  const selectedDesktopParentId = desktopOpenParentId ?? activeChildParentId;

  React.useEffect(() => {
    if (!activeChildParentId) {
      return;
    }

    const parentChanged = activeChildParentId !== selectedDesktopParentId;
    setDesktopOpenParentId(activeChildParentId);
    if (parentChanged) {
      setIsDesktopSubmenuExpanded(true);
    }
    setIsDesktopRailCollapsed(true);
  }, [activeChildParentId, selectedDesktopParentId]);

  const desktopActiveParentId = selectedDesktopParentId;
  const selectedDesktopParent = selectedDesktopParentId
    ? findParentItemById(normalizedGroups, selectedDesktopParentId)
    : null;
  const activeDesktopParent = desktopActiveParentId
    ? findParentItemById(normalizedGroups, desktopActiveParentId)
    : null;
  const activeItemLabel =
    findActiveItemLabel(normalizedGroups, pathname, currentHash) ??
    activeDesktopParent?.label ??
    brandName;
  const handleRetry = React.useCallback(() => {
    if (onRetry) {
      onRetry();
      return;
    }

    window.location.reload();
  }, [onRetry]);

  const navigateToHref = React.useCallback(
    (href: string) => {
      if (typeof window === 'undefined') {
        return;
      }

      const [pathPart, hashPart] = href.split('#');
      const targetPathname = pathPart || pathname;
      const targetHash = hashPart ? `#${hashPart}` : '';

      if (targetPathname !== pathname) {
        window.location.assign(href);
        return;
      }

      if (!targetHash) {
        window.history.pushState(null, '', `${window.location.pathname}${window.location.search}`);
        setCurrentHash('');
        return;
      }

      window.history.pushState(
        null,
        '',
        `${window.location.pathname}${window.location.search}${targetHash}`,
      );
      setCurrentHash(targetHash);
      document.getElementById(hashPart)?.scrollIntoView({ block: 'start' });
    },
    [pathname],
  );

  const collapseDesktopSubmenu = React.useCallback(() => {
    setIsDesktopSubmenuExpanded(false);
  }, []);

  const handleDirectNavigation = React.useCallback(() => {
    setDesktopOpenParentId(null);
    setIsDesktopSubmenuExpanded(false);
    setIsMobileNavOpen(false);
  }, []);

  const handleParentActivation = React.useCallback(
    (item: AppShellNavigationParentItem) => {
      if (!item.children?.length) {
        handleDirectNavigation();
        return;
      }

      setDesktopOpenParentId(item.id);
      setIsDesktopSubmenuExpanded(true);
      setIsDesktopRailCollapsed(true);
      navigateToHref(item.children[0].href);
    },
    [handleDirectNavigation, navigateToHref],
  );

  const primaryNavigation = renderNavigationGroups({
    activeParentId: desktopActiveParentId,
    currentHash,
    currentPathname: pathname,
    groups: normalizedGroups,
    isCollapsed: isDesktopRailCollapsed,
    openParentId: isDesktopSubmenuExpanded ? selectedDesktopParentId : null,
    onDirectNavigation: handleDirectNavigation,
    onParentActivate: handleParentActivation,
    parentButtonRefs: desktopParentButtonRefs,
    scope: 'desktop-primary',
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border/80 bg-card/95 backdrop-blur transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none lg:flex',
            isDesktopRailCollapsed ? 'w-[72px]' : 'w-[240px]',
          )}
        >
          <div
            className={cn(
              'flex min-h-24 items-start gap-3 px-4 py-4',
              isDesktopRailCollapsed && 'items-center justify-center px-3 py-4',
            )}
          >
            {brandIcon}
            {!isDesktopRailCollapsed ? (
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-card-foreground">{brandName}</p>
                <p className="text-xs text-muted-foreground">Application shell</p>
              </div>
            ) : (
              <span className="sr-only">{brandName}</span>
            )}
          </div>
          <div aria-hidden="true" className="h-px w-full bg-border/80" />
          <div className="flex min-h-0 flex-1 flex-col">
            {effectiveNavigationState === 'ready' ? (
              <nav aria-label="Primary navigation" className="flex min-h-0 flex-1 flex-col">
                {primaryNavigation}
              </nav>
            ) : (
              <NavigationStateBody
                onRetry={handleRetry}
                state={effectiveNavigationState}
                variant="desktop"
              />
            )}
          </div>
          <div className="border-t border-border/80 p-2">
            <button
              aria-label={
                isDesktopRailCollapsed ? 'Expand primary navigation' : 'Collapse primary navigation'
              }
              className={cn(
                'flex h-10 w-full items-center text-left text-sm text-muted-foreground transition-[background-color,color] duration-150 ease-out hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isDesktopRailCollapsed
                  ? 'justify-center rounded-2xl px-0'
                  : 'gap-3 rounded-2xl px-4',
              )}
              onClick={() => setIsDesktopRailCollapsed((currentRailState) => !currentRailState)}
              title={isDesktopRailCollapsed ? 'Expand primary navigation' : undefined}
              type="button"
            >
              {isDesktopRailCollapsed ? (
                <>
                  <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.9} />
                  <span className="sr-only">Expand primary navigation</span>
                </>
              ) : (
                <>
                  <ChevronLeft aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.9} />
                  <span>Collapse navigation</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {selectedDesktopParent?.children?.length ? (
          <aside
            className={cn(
              'sticky top-0 hidden h-screen shrink-0 overflow-hidden border-r border-border/80 bg-card/90 transition-[width,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none lg:flex',
              isDesktopSubmenuExpanded ? 'w-56' : 'w-[72px]',
            )}
          >
            <nav
              aria-label={`${selectedDesktopParent.label} submenu`}
              className="flex min-h-0 flex-1 flex-col"
              id={`desktop-submenu-${selectedDesktopParent.id}`}
            >
              <div
                className={cn(
                  'flex min-h-24 border-b border-border/80 px-4 py-4',
                  isDesktopSubmenuExpanded
                    ? 'items-start gap-3'
                    : 'items-center justify-center px-3',
                )}
              >
                {isDesktopSubmenuExpanded ? (
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      Submenu
                    </p>
                    <h2 className="mt-2 font-display text-lg font-semibold text-card-foreground">
                      {selectedDesktopParent.label}
                    </h2>
                  </div>
                ) : (
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                    <selectedDesktopParent.icon
                      aria-hidden="true"
                      className="h-4 w-4"
                      strokeWidth={1.9}
                    />
                    <span className="sr-only">{selectedDesktopParent.label}</span>
                  </span>
                )}
              </div>
              <div
                className={cn(
                  'flex min-h-0 flex-1 flex-col py-4',
                  isDesktopSubmenuExpanded ? 'px-4' : 'px-3',
                )}
              >
                <div className="flex flex-col gap-2" data-nav-list="desktop-submenu">
                  {selectedDesktopParent.children.map((child) => (
                    <NavRow
                      active={isHrefActive(child.href, pathname, currentHash)}
                      className={cn('rounded-xl', isDesktopSubmenuExpanded && 'px-3')}
                      collapsed={!isDesktopSubmenuExpanded}
                      disabled={child.disabled}
                      href={child.href}
                      icon={child.icon}
                      key={child.id}
                      label={child.label}
                      onClick={handleDirectNavigation}
                      onKeyDown={(event) =>
                        handleNavigationKeyDown(event, {
                          onCloseSubmenu: collapseDesktopSubmenu,
                        })
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="border-t border-border/80 p-2">
                <button
                  aria-label={
                    isDesktopSubmenuExpanded
                      ? `Collapse ${selectedDesktopParent.label} submenu`
                      : `Expand ${selectedDesktopParent.label} submenu`
                  }
                  className={cn(
                    'flex h-10 w-full items-center rounded-2xl text-left text-sm text-muted-foreground transition-[background-color,color] duration-150 ease-out hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isDesktopSubmenuExpanded ? 'gap-3 px-4' : 'justify-center px-0',
                  )}
                  onClick={() =>
                    setIsDesktopSubmenuExpanded((currentExpandedState) => !currentExpandedState)
                  }
                  type="button"
                >
                  {isDesktopSubmenuExpanded ? (
                    <>
                      <ChevronLeft
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0"
                        strokeWidth={1.9}
                      />
                      <span>Collapse submenu</span>
                    </>
                  ) : (
                    <>
                      <ChevronRight
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0"
                        strokeWidth={1.9}
                      />
                      <span className="sr-only">Expand submenu</span>
                    </>
                  )}
                </button>
              </div>
            </nav>
          </aside>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/80 bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
            <button
              aria-controls="mobile-app-navigation"
              aria-expanded={isMobileNavOpen}
              aria-label="Open navigation menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setIsMobileNavOpen(true)}
              type="button"
            >
              <Menu aria-hidden="true" className="h-4 w-4" strokeWidth={1.9} />
            </button>
            <div className="flex min-w-0 items-center gap-3">
              {brandIcon}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{brandName}</p>
                <p className="truncate text-xs text-muted-foreground">{activeItemLabel}</p>
              </div>
            </div>
          </div>
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>

      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-[hsl(var(--foreground)/0.56)] backdrop-blur-[6px]"
            onClick={() => setIsMobileNavOpen(false)}
            type="button"
          />
          <div
            aria-labelledby="mobile-navigation-title"
            aria-modal="true"
            className="relative flex h-full w-[min(20rem,calc(100vw-2rem))] max-w-full flex-col border-r border-border/80 bg-card shadow-[0_28px_90px_hsl(var(--foreground)/0.18)]"
            id="mobile-app-navigation"
            role="dialog"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-4">
              <div className="flex min-w-0 items-center gap-3">
                {brandIcon}
                <div className="min-w-0">
                  <h2
                    className="truncate text-base font-semibold text-card-foreground"
                    id="mobile-navigation-title"
                  >
                    {brandName}
                  </h2>
                  <p className="text-xs text-muted-foreground">Navigation menu</p>
                </div>
              </div>
              <button
                aria-label="Close navigation menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setIsMobileNavOpen(false)}
                ref={mobileCloseButtonRef}
                type="button"
              >
                <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.9} />
              </button>
            </div>
            <div aria-hidden="true" className="mx-4 h-px bg-border/80" />
            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
              {effectiveNavigationState === 'ready' ? (
                <nav aria-label="Mobile navigation" className="flex flex-col">
                  {normalizedGroups.map((group, groupIndex) => (
                    <React.Fragment key={group.id}>
                      {groupIndex > 0 ? (
                        <div
                          aria-hidden="true"
                          className="my-4 h-px bg-border/80"
                          role="separator"
                        />
                      ) : null}
                      <div className="flex flex-col gap-1" data-nav-list={`mobile-${group.id}`}>
                        {group.items.map((item) => {
                          const hasChildren = Boolean(item.children?.length);
                          const isExpanded = mobileExpandedParentId === item.id;
                          const isChildActive = hasChildren
                            ? item.children!.some((child) =>
                                isHrefActive(child.href, pathname, currentHash),
                              )
                            : false;
                          const isDirectActive =
                            !hasChildren && isHrefActive(item.href, pathname, currentHash);

                          if (hasChildren) {
                            return (
                              <div
                                key={item.id}
                                className="rounded-[20px] border border-transparent bg-background/60"
                              >
                                <NavRow
                                  active={isExpanded || isChildActive}
                                  ariaControls={`mobile-submenu-${item.id}`}
                                  ariaExpanded={isExpanded}
                                  disabled={item.disabled}
                                  icon={item.icon}
                                  label={item.label}
                                  onClick={() =>
                                    setMobileExpandedParentId((currentId) =>
                                      currentId === item.id ? null : item.id,
                                    )
                                  }
                                  onKeyDown={(event) =>
                                    handleNavigationKeyDown(event, {
                                      onOpenSubmenu: () => setMobileExpandedParentId(item.id),
                                    })
                                  }
                                  trailingIcon={isExpanded ? ChevronDown : ChevronRight}
                                />
                                {isExpanded ? (
                                  <div
                                    className="mb-2 ml-4 flex flex-col gap-1 border-l border-border/70 pl-3"
                                    id={`mobile-submenu-${item.id}`}
                                  >
                                    {item.children!.map((child) => (
                                      <NavRow
                                        active={isHrefActive(child.href, pathname, currentHash)}
                                        disabled={child.disabled}
                                        href={child.href}
                                        icon={child.icon}
                                        key={child.id}
                                        label={child.label}
                                        onClick={() => {
                                          setMobileExpandedParentId(item.id);
                                          setIsMobileNavOpen(false);
                                        }}
                                      />
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            );
                          }

                          return (
                            <NavRow
                              active={isDirectActive}
                              disabled={item.disabled}
                              href={item.href}
                              icon={item.icon}
                              key={item.id}
                              label={item.label}
                              onClick={() => setIsMobileNavOpen(false)}
                            />
                          );
                        })}
                      </div>
                    </React.Fragment>
                  ))}
                </nav>
              ) : (
                <NavigationStateBody
                  onRetry={handleRetry}
                  state={effectiveNavigationState}
                  variant="mobile"
                />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type RenderNavigationGroupsOptions = {
  activeParentId: string | null;
  currentHash: string;
  currentPathname: string;
  groups: AppShellNavigationGroup[];
  isCollapsed: boolean;
  openParentId: string | null;
  onDirectNavigation: () => void;
  onParentActivate: (item: AppShellNavigationParentItem) => void;
  parentButtonRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
  scope: string;
};

function renderNavigationGroups({
  activeParentId,
  currentHash,
  currentPathname,
  groups,
  isCollapsed,
  openParentId,
  onDirectNavigation,
  onParentActivate,
  parentButtonRefs,
  scope,
}: RenderNavigationGroupsOptions) {
  return groups.map((group, groupIndex) => (
    <React.Fragment key={group.id}>
      {groupIndex > 0 ? (
        <div aria-hidden="true" className="my-4 h-px bg-border/80" role="separator" />
      ) : null}
      <div className="flex flex-col gap-1" data-nav-list={`${scope}-${group.id}`}>
        {group.items.map((item) => {
          const hasChildren = Boolean(item.children?.length);
          const isChildActive = hasChildren
            ? item.children!.some((child) => isHrefActive(child.href, currentPathname, currentHash))
            : false;
          const isDirectActive =
            !hasChildren && isHrefActive(item.href, currentPathname, currentHash);
          const isParentActive = item.id === activeParentId || isChildActive || isDirectActive;

          if (hasChildren) {
            return (
              <NavRow
                active={isParentActive}
                ariaControls={`desktop-submenu-${item.id}`}
                ariaExpanded={item.id === openParentId}
                collapsed={isCollapsed}
                disabled={item.disabled}
                icon={item.icon}
                key={item.id}
                label={item.label}
                onClick={() => onParentActivate(item)}
                onKeyDown={(event) =>
                  handleNavigationKeyDown(event, {
                    onOpenSubmenu: () => onParentActivate(item),
                  })
                }
                ref={(node) => {
                  parentButtonRefs.current[item.id] = node;
                }}
                trailingIcon={item.id === openParentId ? ChevronDown : ChevronRight}
              />
            );
          }

          return (
            <NavRow
              active={isDirectActive}
              collapsed={isCollapsed}
              disabled={item.disabled}
              href={item.href}
              icon={item.icon}
              key={item.id}
              label={item.label}
              onClick={onDirectNavigation}
              onKeyDown={(event) => handleNavigationKeyDown(event)}
            />
          );
        })}
      </div>
    </React.Fragment>
  ));
}

type NavigationStateBodyProps = {
  onRetry: () => void;
  state: AppShellNavigationState;
  variant: 'desktop' | 'mobile';
};

function NavigationStateBody({ onRetry, state, variant }: NavigationStateBodyProps) {
  if (state === 'loading') {
    return (
      <div className="flex flex-col gap-4 px-4 py-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-2xl" />
          {variant === 'desktop' ? <Skeleton className="h-4 w-28 rounded-full" /> : null}
        </div>
        <Skeleton className="h-px w-full rounded-full" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton className="h-10 w-full rounded-2xl" key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <EmptyState
        action={{
          label: 'Retry',
          onClick: onRetry,
          size: 'sm',
          variant: 'secondary',
        }}
        className="min-h-0 rounded-none border-0 bg-background/60 px-4 py-8"
        description="The navigation schema could not be loaded. Try reloading the shell."
        icon={<TriangleAlert className="h-5 w-5" strokeWidth={1.9} />}
        title="Navigation failed to load"
      />
    );
  }

  return (
    <EmptyState
      action={{
        icon: <RefreshCw className="h-4 w-4" strokeWidth={1.9} />,
        label: 'Reload',
        onClick: onRetry,
        size: 'sm',
        variant: 'secondary',
      }}
      className="min-h-0 rounded-none border-0 bg-background/60 px-4 py-8"
      description="Add menu items to the shell configuration to populate the navigation rail."
      icon={<Blocks className="h-5 w-5" strokeWidth={1.9} />}
      title="No navigation items"
    />
  );
}

type NavRowProps = {
  active?: boolean;
  ariaControls?: string;
  ariaExpanded?: boolean;
  className?: string;
  collapsed?: boolean;
  disabled?: boolean;
  href?: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  trailingIcon?: LucideIcon;
};

const NavRow = React.forwardRef<HTMLButtonElement, NavRowProps>(
  (
    {
      active = false,
      ariaControls,
      ariaExpanded,
      className,
      collapsed = false,
      disabled = false,
      href,
      icon: Icon,
      label,
      onClick,
      onKeyDown,
      trailingIcon: TrailingIcon,
    },
    ref,
  ) => {
    const rowClassName = cn(
      'flex h-10 w-full items-center overflow-hidden px-4 text-left text-sm transition-[background-color,color,box-shadow,padding,gap] duration-200 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      collapsed ? 'justify-center gap-0 px-0' : 'gap-3',
      active
        ? 'bg-secondary text-secondary-foreground shadow-sm'
        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      disabled && 'pointer-events-none opacity-50',
      className,
    );
    const iconMarkup = <Icon aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.9} />;
    const labelMarkup = (
      <>
        <span className={cn('sr-only', !collapsed && 'hidden')}>{label}</span>
        <span
          aria-hidden={collapsed}
          className={cn(
            'whitespace-nowrap transition-[max-width,opacity,transform] duration-200 ease-out motion-reduce:transition-none',
            collapsed
              ? 'max-w-0 -translate-x-1 opacity-0'
              : 'max-w-[12rem] translate-x-0 opacity-100',
          )}
        >
          {label}
        </span>
      </>
    );
    const trailingMarkup = TrailingIcon ? (
      <span
        aria-hidden={collapsed}
        className={cn(
          'flex shrink-0 transition-[max-width,opacity,transform,margin] duration-200 ease-out motion-reduce:transition-none',
          collapsed
            ? 'max-w-0 translate-x-1 overflow-hidden opacity-0'
            : 'ml-auto max-w-6 translate-x-0 opacity-100',
        )}
      >
        <TrailingIcon aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.9} />
      </span>
    ) : null;

    if (href) {
      return (
        <a
          aria-current={active ? 'page' : undefined}
          aria-disabled={disabled || undefined}
          className={rowClassName}
          data-nav-item="true"
          href={href}
          onClick={onClick}
          onKeyDown={onKeyDown}
          title={collapsed ? label : undefined}
        >
          {iconMarkup}
          {labelMarkup}
          {trailingMarkup}
        </a>
      );
    }

    return (
      <button
        aria-controls={ariaControls}
        aria-disabled={disabled || undefined}
        aria-expanded={ariaExpanded}
        aria-label={collapsed ? label : undefined}
        className={rowClassName}
        data-nav-item="true"
        onClick={onClick}
        onKeyDown={onKeyDown as React.KeyboardEventHandler<HTMLButtonElement> | undefined}
        ref={ref}
        title={collapsed ? label : undefined}
        type="button"
      >
        {iconMarkup}
        {labelMarkup}
        {trailingMarkup}
      </button>
    );
  },
);

NavRow.displayName = 'NavRow';

function findActiveChildParentId(
  groups: AppShellNavigationGroup[],
  currentPathname: string,
  currentHash: string,
) {
  for (const group of groups) {
    for (const item of group.items) {
      if (item.children?.some((child) => isHrefActive(child.href, currentPathname, currentHash))) {
        return item.id;
      }
    }
  }

  return null;
}

function findActiveItemLabel(
  groups: AppShellNavigationGroup[],
  currentPathname: string,
  currentHash: string,
) {
  for (const group of groups) {
    for (const item of group.items) {
      if (isHrefActive(item.href, currentPathname, currentHash)) {
        return item.label;
      }

      const activeChild = item.children?.find((child) =>
        isHrefActive(child.href, currentPathname, currentHash),
      );

      if (activeChild) {
        return activeChild.label;
      }
    }
  }

  return null;
}

function findParentItemById(groups: AppShellNavigationGroup[], parentId: string) {
  for (const group of groups) {
    const matchedItem = group.items.find((item) => item.id === parentId);

    if (matchedItem) {
      return matchedItem;
    }
  }

  return null;
}

function isHrefActive(href: string, currentPathname: string, currentHash: string) {
  const [pathPart, hashPart] = href.split('#');
  const targetPathname = pathPart || '/';
  const targetHash = hashPart ? `#${hashPart}` : '';

  if (targetPathname !== currentPathname) {
    return false;
  }

  if (!targetHash) {
    return currentHash === '';
  }

  if (targetHash === '#overview') {
    return currentHash === '' || currentHash === '#overview';
  }

  return currentHash === targetHash;
}

type HandleNavigationKeyDownOptions = {
  onCloseSubmenu?: () => void;
  onOpenSubmenu?: () => void;
};

function handleNavigationKeyDown(
  event: React.KeyboardEvent<HTMLElement>,
  options: HandleNavigationKeyDownOptions = {},
) {
  const container = event.currentTarget.closest('[data-nav-list]');

  if (!container) {
    return;
  }

  const items = Array.from(container.querySelectorAll<HTMLElement>(navigationItemSelector));
  const currentIndex = items.indexOf(event.currentTarget);

  if (event.key === ' ') {
    event.preventDefault();
    event.currentTarget.click();
    return;
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    items[(currentIndex + 1) % items.length]?.focus();
    return;
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    items[(currentIndex - 1 + items.length) % items.length]?.focus();
    return;
  }

  if (event.key === 'Home') {
    event.preventDefault();
    items[0]?.focus();
    return;
  }

  if (event.key === 'End') {
    event.preventDefault();
    items.at(-1)?.focus();
    return;
  }

  if (event.key === 'ArrowRight' && options.onOpenSubmenu) {
    event.preventDefault();
    options.onOpenSubmenu();
    return;
  }

  if (event.key === 'ArrowLeft' && options.onCloseSubmenu) {
    event.preventDefault();
    options.onCloseSubmenu();
  }
}

export { AppShell };
