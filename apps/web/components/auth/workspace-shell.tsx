import { LogoutButton } from "@/components/auth/logout-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type NavigationItem = {
  title: string;
  eyebrow: string;
  description: string;
};

type OverviewCard = {
  title: string;
  value: string;
  detail: string;
};

type WorkspaceShellProps = {
  tone: "platform" | "tenant";
  shellLabel: string;
  title: string;
  description: string;
  contextLabel: string;
  contextValue: string;
  contextNote: string;
  userDisplayName: string;
  navigationTitle: string;
  navigationItems: readonly NavigationItem[];
  overviewEyebrow: string;
  overviewTitle: string;
  overviewCards: readonly OverviewCard[];
  emptyEyebrow: string;
  emptyTitle: string;
  emptyDescription: string;
};

const toneClasses = {
  platform: {
    hero: "border-amber-200/70 bg-white/85",
    accent: "text-primary",
    panel: "border-amber-200/80 bg-amber-50/90",
    section: "border-white/70 bg-white/82",
    empty: "border-orange-200/70 bg-orange-50/80"
  },
  tenant: {
    hero: "border-emerald-200/80 bg-emerald-50/85",
    accent: "text-emerald-700",
    panel: "border-emerald-200/80 bg-emerald-100/80",
    section: "border-emerald-100/80 bg-white/82",
    empty: "border-emerald-200/80 bg-emerald-50/90"
  }
} as const;

export const WorkspaceShell = ({
  tone,
  shellLabel,
  title,
  description,
  contextLabel,
  contextValue,
  contextNote,
  userDisplayName,
  navigationTitle,
  navigationItems,
  overviewEyebrow,
  overviewTitle,
  overviewCards,
  emptyEyebrow,
  emptyTitle,
  emptyDescription
}: WorkspaceShellProps) => {
  const style = toneClasses[tone];

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Card className="border-white/70 bg-white/80 shadow-lg shadow-stone-950/5 backdrop-blur">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Authenticated as</p>
              <p className="text-lg font-semibold text-stone-950">{userDisplayName}</p>
            </div>
            <LogoutButton />
          </CardContent>
        </Card>

        <Card className={cn("border shadow-2xl shadow-stone-950/10 backdrop-blur", style.hero)}>
          <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.8fr_minmax(0,0.9fr)] lg:items-end">
            <div className="space-y-4">
              <p className={cn("text-xs font-semibold uppercase tracking-[0.28em]", style.accent)}>{shellLabel}</p>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">{title}</h1>
                <p className="max-w-3xl text-base leading-7 text-stone-600">{description}</p>
              </div>
            </div>
            <Card className={cn("border shadow-none", style.panel)}>
              <CardHeader className="space-y-2">
                <CardDescription className={cn("text-xs font-semibold uppercase tracking-[0.22em]", style.accent)}>
                  {contextLabel}
                </CardDescription>
                <CardTitle className="text-2xl font-semibold capitalize text-stone-950">{contextValue}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm leading-6 text-stone-600">{contextNote}</CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card className={cn("border shadow-lg shadow-stone-950/5 backdrop-blur", style.section)}>
          <CardHeader className="space-y-2">
            <CardDescription className={cn("text-xs font-semibold uppercase tracking-[0.28em]", style.accent)}>
              Primary navigation
            </CardDescription>
            <CardTitle className="text-3xl tracking-tight text-stone-950">{navigationTitle}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {navigationItems.map((item) => (
              <Card key={item.title} className="border-white/70 bg-white/90 shadow-sm">
                <CardHeader className="space-y-3">
                  <CardDescription className={cn("text-xs font-semibold uppercase tracking-[0.22em]", style.accent)}>
                    {item.eyebrow}
                  </CardDescription>
                  <CardTitle className="text-xl text-stone-950">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm leading-6 text-stone-600">{item.description}</CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card className={cn("border shadow-lg shadow-stone-950/5 backdrop-blur", style.section)}>
          <CardHeader className="space-y-2">
            <CardDescription className={cn("text-xs font-semibold uppercase tracking-[0.28em]", style.accent)}>
              {overviewEyebrow}
            </CardDescription>
            <CardTitle className="text-3xl tracking-tight text-stone-950">{overviewTitle}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {overviewCards.map((card) => (
              <Card key={card.title} className="border-white/70 bg-white/90 shadow-sm">
                <CardHeader className="space-y-3">
                  <CardDescription className={cn("text-xs font-semibold uppercase tracking-[0.22em]", style.accent)}>
                    {card.title}
                  </CardDescription>
                  <CardTitle className="text-2xl text-stone-950">{card.value}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm leading-6 text-stone-600">{card.detail}</CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card className={cn("border shadow-lg shadow-stone-950/5 backdrop-blur", style.empty)}>
          <CardHeader className="space-y-2">
            <CardDescription className={cn("text-xs font-semibold uppercase tracking-[0.28em]", style.accent)}>
              {emptyEyebrow}
            </CardDescription>
            <CardTitle className="text-3xl tracking-tight text-stone-950">{emptyTitle}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-base leading-7 text-stone-600">{emptyDescription}</CardContent>
        </Card>
      </div>
    </main>
  );
};
