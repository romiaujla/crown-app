'use client';

import { MoonStar, SunMedium } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { usePlatformTheme } from './platform-theme-provider';

export const PlatformThemeToggle = ({ className }: { className?: string }) => {
  const { isReady, theme, toggleTheme } = usePlatformTheme();

  return (
    <Button
      aria-label={
        isReady ? `Switch to ${theme === 'light' ? 'dark' : 'light'} mode` : 'Toggle theme'
      }
      className={cn(
        'platform-outline-button platform-theme-toggle rounded-full border px-3.5 text-xs font-semibold uppercase tracking-[0.14em]',
        className,
      )}
      onClick={toggleTheme}
      size="sm"
      type="button"
      variant="outline"
    >
      {isReady && theme === 'dark' ? (
        <MoonStar aria-hidden="true" className="mr-2 h-3.5 w-3.5" />
      ) : (
        <SunMedium aria-hidden="true" className="mr-2 h-3.5 w-3.5" />
      )}
      {isReady ? (theme === 'dark' ? 'Dark mode' : 'Light mode') : 'Theme'}
    </Button>
  );
};
