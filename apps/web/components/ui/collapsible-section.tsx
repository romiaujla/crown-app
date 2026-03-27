'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useId, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type CollapsibleSectionProps = {
  title: string;
  description?: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
};

export const CollapsibleSection = ({
  title,
  description,
  count,
  defaultOpen = false,
  children,
  className,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isPresent, setIsPresent] = useState(defaultOpen);
  const contentId = useId();

  useEffect(() => {
    if (isOpen) {
      setIsPresent(true);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsPresent(false);
    }, 200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOpen]);

  return (
    <section
      className={cn('overflow-hidden rounded-3xl border border-stone-200 bg-white/92', className)}
    >
      <button
        aria-controls={contentId}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition hover:bg-stone-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        onClick={() => {
          setIsOpen((currentValue) => !currentValue);
        }}
        type="button"
      >
        <span className="space-y-1">
          <span className="flex items-center gap-3">
            <span className="text-base font-semibold text-stone-950">{title}</span>
            {typeof count === 'number' ? (
              <span className="inline-flex min-w-8 items-center justify-center rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
                {count}
              </span>
            ) : null}
          </span>
          {description ? (
            <span className="block text-sm leading-6 text-stone-600">{description}</span>
          ) : null}
        </span>
        <span className="rounded-full border border-stone-200 bg-stone-50 p-2 text-stone-600">
          {isOpen ? (
            <ChevronUp aria-hidden="true" className="h-4 w-4" />
          ) : (
            <ChevronDown aria-hidden="true" className="h-4 w-4" />
          )}
        </span>
      </button>
      {isPresent ? (
        <div
          className={cn(
            'grid border-t border-stone-200 bg-stone-50/60 transition-all duration-200 ease-out',
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
          id={contentId}
        >
          <div className="overflow-hidden">{children}</div>
        </div>
      ) : null}
    </section>
  );
};
