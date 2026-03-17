import type { ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type StatusPanelTone = 'default' | 'platform' | 'tenant' | 'access';

type StatusPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  tone?: StatusPanelTone;
  children?: ReactNode;
};

const toneStyles: Record<StatusPanelTone, string> = {
  default: 'border-white/60 bg-white/85',
  platform: 'border-amber-200/70 bg-white/85',
  tenant: 'border-emerald-200/80 bg-emerald-50/85',
  access: 'border-orange-200/80 bg-orange-50/85',
};

export const StatusPanel = ({
  eyebrow,
  title,
  description,
  tone = 'default',
  children,
}: StatusPanelProps) => (
  <Card
    className={cn(
      'w-full max-w-2xl border shadow-2xl shadow-stone-950/10 backdrop-blur',
      toneStyles[tone],
    )}
  >
    <CardHeader className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
      <div className="space-y-2">
        <h1 className="text-4xl leading-none tracking-tight text-stone-950 sm:text-5xl">{title}</h1>
        <CardDescription className="max-w-xl text-base leading-7 text-stone-600">
          {description}
        </CardDescription>
      </div>
    </CardHeader>
    {children ? <CardContent className="pt-0">{children}</CardContent> : null}
  </Card>
);
