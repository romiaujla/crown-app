'use client';

import type { LucideIcon } from 'lucide-react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';

import { LogoutButton } from '@/components/auth/logout-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type NavigationCardItem = {
  title: string;
  eyebrow: string;
  description: string;
};

type SidebarNavigationItem = {
  key: string;
  title: string;
  href: string;
  icon: LucideIcon;
};

type OverviewCard = {
  title: string;
  value: string;
  detail: string;
};

type SharedWorkspaceShellProps = {
  tone: 'platform' | 'tenant';
  shellLabel?: string;
  title: string;
  description: string;
  contextLabel: string;
  contextValue: string;
  contextNote: string;
  userDisplayName: string;
  userRole: string;
  hideHero?: boolean;
};

type CardLayoutWorkspaceShellProps = SharedWorkspaceShellProps & {
  layout?: 'cards';
  navigationTitle: string;
  navigationItems: readonly NavigationCardItem[];
  overviewEyebrow: string;
  overviewTitle: string;
  overviewCards: readonly OverviewCard[];
  emptyEyebrow: string;
  emptyTitle: string;
  emptyDescription: string;
};

type SidebarLayoutWorkspaceShellProps = SharedWorkspaceShellProps & {
  layout: 'sidebar';
  navigationTitle: string;
  navigationItems: readonly SidebarNavigationItem[];
  activeNavigationKey: string;
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription?: string;
  sectionActions?: ReactNode;
  sectionContent: ReactNode;
};

type WorkspaceShellProps = CardLayoutWorkspaceShellProps | SidebarLayoutWorkspaceShellProps;

const toneClasses = {
  platform: {
    hero: 'border-amber-200/70 bg-white/85',
    accent: 'text-primary',
    panel: 'border-amber-200/80 bg-amber-50/90',
    section: 'border-white/70 bg-white/82',
    empty: 'border-orange-200/70 bg-orange-50/80',
  },
  tenant: {
    hero: 'border-emerald-200/80 bg-emerald-50/85',
    accent: 'text-emerald-700',
    panel: 'border-emerald-200/80 bg-emerald-100/80',
    section: 'border-emerald-100/80 bg-white/82',
    empty: 'border-emerald-200/80 bg-emerald-50/90',
  },
} as const;

const buildInitials = (displayName: string) => {
  const words = displayName.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return 'U';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return `${words[0][0] ?? ''}${words.at(-1)?.[0] ?? ''}`.toUpperCase();
};

const formatRoleLabel = (role: string) =>
  role
    .split('_')
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(' ');

export const WorkspaceShell = ({
  tone,
  shellLabel,
  title,
  description,
  contextLabel,
  contextValue,
  contextNote,
  userDisplayName,
  userRole,
  hideHero = false,
  ...layoutProps
}: WorkspaceShellProps) => {
  const style = toneClasses[tone];
  const profileMenuId = useId();
  const profileContainerRef = useRef<HTMLDivElement | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileInitials = useMemo(() => buildInitials(userDisplayName), [userDisplayName]);
  const roleLabel = useMemo(() => formatRoleLabel(userRole), [userRole]);

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!profileContainerRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProfileMenuOpen]);

  return (
    <main className="flex h-screen flex-col overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex min-h-0 w-full flex-1 flex-col gap-6">
        {layoutProps.layout === 'sidebar' ? null : (
          <Card className="border-white/70 bg-white/80 shadow-lg shadow-stone-950/5 backdrop-blur">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                  Authenticated as
                </p>
                <p className="text-lg font-semibold text-stone-950">{userDisplayName}</p>
              </div>
              <LogoutButton />
            </CardContent>
          </Card>
        )}

        {hideHero ? null : (
          <Card className={cn('border shadow-2xl shadow-stone-950/10 backdrop-blur', style.hero)}>
            <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.8fr_minmax(0,0.9fr)] lg:items-end">
              <div className="space-y-4">
                {shellLabel ? (
                  <p
                    className={cn(
                      'text-xs font-semibold uppercase tracking-[0.28em]',
                      style.accent,
                    )}
                  >
                    {shellLabel}
                  </p>
                ) : null}
                <div className="space-y-3">
                  <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                    {title}
                  </h1>
                  <p className="max-w-3xl text-base leading-7 text-stone-600">{description}</p>
                </div>
              </div>
              <Card className={cn('border shadow-none', style.panel)}>
                <CardHeader className="space-y-2">
                  <CardDescription
                    className={cn(
                      'text-xs font-semibold uppercase tracking-[0.22em]',
                      style.accent,
                    )}
                  >
                    {contextLabel}
                  </CardDescription>
                  <CardTitle className="text-2xl font-semibold capitalize text-stone-950">
                    {contextValue}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm leading-6 text-stone-600">
                  {contextNote}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}

        {layoutProps.layout === 'sidebar' ? (
          <div className="platform-shell-grid grid min-h-0 flex-1 gap-6">
            <Card
              className={cn(
                'sidebar-shell-card border shadow-lg shadow-stone-950/5 backdrop-blur',
                style.section,
              )}
            >
              <CardContent className="sidebar-shell-card__content px-3 pb-3 pt-5">
                <nav aria-label={layoutProps.navigationTitle}>
                  <ul className="sidebar-nav m-0 flex list-none flex-col gap-2 p-0">
                    {layoutProps.navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.key === layoutProps.activeNavigationKey;

                      return (
                        <li key={item.key}>
                          <Link
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={item.title}
                            className={cn(
                              'sidebar-nav__item relative flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-stone-600 transition hover:border-stone-200 hover:bg-white/90 hover:text-stone-950',
                              isActive &&
                                cn(
                                  'border-white/80 bg-white text-stone-950 shadow-sm',
                                  style.accent,
                                ),
                            )}
                            data-active={isActive ? 'true' : 'false'}
                            href={item.href}
                            onPointerUp={(event) => {
                              event.currentTarget.blur();
                            }}
                            title={item.title}
                          >
                            <span
                              className={cn(
                                'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-stone-700',
                                isActive && 'bg-white text-stone-950',
                              )}
                            >
                              <Icon aria-hidden="true" className="h-5 w-5" />
                            </span>
                            <span className="sidebar-nav__label">{item.title}</span>
                            <span
                              aria-hidden="true"
                              className="sidebar-nav__tooltip rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold tracking-[0.08em] text-stone-950 shadow-xl"
                              role="tooltip"
                            >
                              {item.title}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <div className="sidebar-profile" ref={profileContainerRef}>
                  <button
                    aria-controls={profileMenuId}
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="menu"
                    aria-label={`Open profile menu for ${userDisplayName}`}
                    className="sidebar-profile__trigger"
                    onClick={() => {
                      setIsProfileMenuOpen((currentValue) => !currentValue);
                    }}
                    title={userDisplayName}
                    type="button"
                  >
                    <span aria-hidden="true" className="sidebar-profile__avatar">
                      {profileInitials}
                    </span>
                    <span className="sidebar-profile__summary">
                      <span className="sidebar-profile__name">{userDisplayName}</span>
                      <span className="sidebar-profile__role">{roleLabel}</span>
                    </span>
                    <span aria-hidden="true" className="sidebar-profile__chevron">
                      {isProfileMenuOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  </button>

                  {isProfileMenuOpen ? (
                    <div className="sidebar-profile__menu" id={profileMenuId} role="menu">
                      <div className="sidebar-profile__menu-copy">
                        <p className="sidebar-profile__menu-label">Signed in as</p>
                        <p className="sidebar-profile__menu-name">{userDisplayName}</p>
                        <p className="sidebar-profile__menu-role">{roleLabel}</p>
                      </div>
                      <LogoutButton className="sidebar-profile__logout" size="sm" />
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <Card
              className={cn(
                'flex min-h-0 flex-col border shadow-lg shadow-stone-950/5 backdrop-blur',
                style.section,
              )}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
                    <CardDescription
                      className={cn(
                        'text-[0.65rem] font-semibold uppercase tracking-[0.22em] sm:text-xs sm:tracking-[0.28em]',
                        style.accent,
                      )}
                    >
                      {layoutProps.sectionEyebrow}
                    </CardDescription>
                    <div className="space-y-2 sm:space-y-3">
                      <CardTitle className="text-2xl leading-tight tracking-tight text-stone-950 sm:text-3xl">
                        {layoutProps.sectionTitle}
                      </CardTitle>
                      {layoutProps.sectionDescription ? (
                        <CardDescription className="max-w-3xl text-base leading-7 text-stone-600">
                          {layoutProps.sectionDescription}
                        </CardDescription>
                      ) : null}
                    </div>
                  </div>
                  {layoutProps.sectionActions ? (
                    <div className="shrink-0 pt-1">{layoutProps.sectionActions}</div>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col space-y-4 pb-0">
                {layoutProps.sectionContent}
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <Card
              className={cn('border shadow-lg shadow-stone-950/5 backdrop-blur', style.section)}
            >
              <CardHeader className="space-y-2">
                <CardDescription
                  className={cn('text-xs font-semibold uppercase tracking-[0.28em]', style.accent)}
                >
                  Primary navigation
                </CardDescription>
                <CardTitle className="text-3xl tracking-tight text-stone-950">
                  {layoutProps.navigationTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                {layoutProps.navigationItems.map((item) => (
                  <Card key={item.title} className="border-white/70 bg-white/90 shadow-sm">
                    <CardHeader className="space-y-3">
                      <CardDescription
                        className={cn(
                          'text-xs font-semibold uppercase tracking-[0.22em]',
                          style.accent,
                        )}
                      >
                        {item.eyebrow}
                      </CardDescription>
                      <CardTitle className="text-xl text-stone-950">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 text-sm leading-6 text-stone-600">
                      {item.description}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card
              className={cn('border shadow-lg shadow-stone-950/5 backdrop-blur', style.section)}
            >
              <CardHeader className="space-y-2">
                <CardDescription
                  className={cn('text-xs font-semibold uppercase tracking-[0.28em]', style.accent)}
                >
                  {layoutProps.overviewEyebrow}
                </CardDescription>
                <CardTitle className="text-3xl tracking-tight text-stone-950">
                  {layoutProps.overviewTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                {layoutProps.overviewCards.map((card) => (
                  <Card key={card.title} className="border-white/70 bg-white/90 shadow-sm">
                    <CardHeader className="space-y-3">
                      <CardDescription
                        className={cn(
                          'text-xs font-semibold uppercase tracking-[0.22em]',
                          style.accent,
                        )}
                      >
                        {card.title}
                      </CardDescription>
                      <CardTitle className="text-2xl text-stone-950">{card.value}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 text-sm leading-6 text-stone-600">
                      {card.detail}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card className={cn('border shadow-lg shadow-stone-950/5 backdrop-blur', style.empty)}>
              <CardHeader className="space-y-2">
                <CardDescription
                  className={cn('text-xs font-semibold uppercase tracking-[0.28em]', style.accent)}
                >
                  {layoutProps.emptyEyebrow}
                </CardDescription>
                <CardTitle className="text-3xl tracking-tight text-stone-950">
                  {layoutProps.emptyTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-base leading-7 text-stone-600">
                {layoutProps.emptyDescription}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
};
