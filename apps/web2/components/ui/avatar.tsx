import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import Image from 'next/image';

import { cn } from '@/lib/utils';

const avatarVariants = cva(
  'relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full border border-border/80 bg-[radial-gradient(circle_at_30%_28%,hsl(var(--card)/0.96),transparent_38%),linear-gradient(135deg,hsl(var(--primary)/0.18),hsl(var(--accent)/0.95))] font-display font-semibold uppercase text-foreground shadow-[0_12px_30px_hsl(var(--foreground)/0.12)]',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-[0.72rem] tracking-[0.08em]',
        md: 'h-11 w-11 text-[0.88rem] tracking-[0.08em]',
        lg: 'h-14 w-14 text-[1rem] tracking-[0.08em]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const getAvatarInitials = (name?: string | null): string => {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];

  if (words.length === 0) {
    return 'U';
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] ?? ''}${words.at(-1)?.[0] ?? ''}`.toUpperCase();
};

export type AvatarProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof avatarVariants> & {
    imageAlt?: string;
    imageSrc?: string | null;
    name?: string | null;
  };

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ 'aria-hidden': ariaHidden, className, imageAlt, imageSrc, name, size, ...props }, ref) => {
    const initials = getAvatarInitials(name);
    const trimmedName = name?.trim();
    const hasImage = Boolean(imageSrc);
    const accessibleLabel = trimmedName ? `${trimmedName} avatar` : 'User avatar';
    const imageSize = size === 'sm' ? '32px' : size === 'lg' ? '56px' : '44px';

    return (
      <span
        aria-hidden={ariaHidden}
        aria-label={!ariaHidden && !hasImage ? accessibleLabel : undefined}
        className={cn(avatarVariants({ size }), className)}
        data-initials={initials}
        ref={ref}
        role={!ariaHidden && !hasImage ? 'img' : undefined}
        {...props}
      >
        {hasImage && imageSrc ? (
          <Image
            alt={ariaHidden ? '' : (imageAlt ?? accessibleLabel)}
            className="h-full w-full object-cover"
            fill
            sizes={imageSize}
            src={imageSrc}
            unoptimized
          />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}
      </span>
    );
  },
);

Avatar.displayName = 'Avatar';

export { avatarVariants };
