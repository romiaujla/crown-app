import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardEyebrow,
  CardFooter,
  CardHeader,
  CardIcon,
  CardMetric,
  CardTitle,
} from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const TrendingUpIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 15.5L10 10.5L13.5 14L19 8.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
    <path
      d="M15 8.5H19V12.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const SparkIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3L13.9 8.1L19 10L13.9 11.9L12 17L10.1 11.9L5 10L10.1 8.1L12 3Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12H19M13 6L19 12L13 18"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-8 lg:px-10">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="rounded-[32px] border border-border/80 bg-card/90 p-7 shadow-[0_22px_60px_hsl(var(--foreground)/0.12)] sm:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex max-w-3xl flex-col gap-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Crown Web2
              </p>
              <div className="flex flex-col gap-3">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
                  Shared card variants for the next dashboard surface.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  This preview shows the first reusable metric, informational, and interactive card
                  patterns for web-v2. The goal is consistent hierarchy, honest loading behavior,
                  and a clean path into future management workflows.
                </p>
              </div>
            </div>
            <div className="flex max-w-sm flex-col gap-4">
              <div className="rounded-[28px] border border-border/80 bg-background/80 p-4 shadow-[0_18px_40px_hsl(var(--foreground)/0.08)]">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Dashboard preview
                </p>
                <div className="mt-3 flex flex-col gap-3">
                  <ToggleGroup
                    aria-label="Preview reporting window"
                    defaultValue="month"
                    size="sm"
                    type="single"
                  >
                    <ToggleGroupItem value="week">Week</ToggleGroupItem>
                    <ToggleGroupItem value="month">Month</ToggleGroupItem>
                    <ToggleGroupItem value="year">Year</ToggleGroupItem>
                  </ToggleGroup>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Shared segmented control for mutually exclusive window switching in future
                    dashboard surfaces.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button>Review component library</Button>
                <Button variant="secondary">Inspect Storybook states</Button>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Card className="h-full" variant="metric">
              <CardHeader>
                <CardEyebrow>Platform overview</CardEyebrow>
                <CardTitle>Total workspaces</CardTitle>
                <CardDescription>
                  Provisioned environments currently managed from the control plane.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CardMetric>128</CardMetric>
              </CardContent>
              <CardFooter className="border-t border-border/70 pt-4 text-sm text-muted-foreground">
                <TrendingUpIcon />
                <span>Up 14% compared with the previous 30 days.</span>
              </CardFooter>
            </Card>

            <Card className="h-full" variant="metric">
              <CardHeader>
                <CardEyebrow>Platform overview</CardEyebrow>
                <CardTitle>New launches</CardTitle>
                <CardDescription>
                  Workspaces activated in the current 30-day operating window.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CardMetric>24</CardMetric>
              </CardContent>
              <CardFooter className="border-t border-border/70 pt-4 text-sm text-muted-foreground">
                <span>7 are still inside onboarding this week.</span>
              </CardFooter>
            </Card>

            <Card className="h-full sm:col-span-2 xl:col-span-1" variant="metric">
              <CardHeader>
                <CardEyebrow>Platform overview</CardEyebrow>
                <CardTitle>Support backlog</CardTitle>
                <CardDescription>
                  Open tenant requests currently waiting for a platform response.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CardMetric>09</CardMetric>
              </CardContent>
              <CardFooter className="border-t border-border/70 pt-4 text-sm text-muted-foreground">
                <span>Median response time is holding at 2.4 hours.</span>
              </CardFooter>
            </Card>
          </div>

          <Card className="h-full" variant="info">
            <CardHeader className="gap-5">
              <CardIcon>
                <SparkIcon />
              </CardIcon>
              <div className="flex flex-col gap-2">
                <CardEyebrow>Recommended next step</CardEyebrow>
                <CardTitle>Complete team setup</CardTitle>
                <CardDescription>
                  Add platform owners before enabling tenant launches so permissions and escalation
                  paths are ready from day one.
                </CardDescription>
              </div>
            </CardHeader>
            <CardFooter className="border-t border-border/70 pt-4 text-sm text-muted-foreground">
              <span>Suggested before opening billing and audit workflows.</span>
            </CardFooter>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card asChild className="text-left" variant="interactive">
            <a href="#tenant-directory-preview">
              <CardHeader className="gap-2">
                <CardEyebrow>Tenant operations</CardEyebrow>
                <CardTitle className="text-xl">Open directory</CardTitle>
                <CardDescription>
                  Review tenant health, search by workspace, and move into the next operational
                  detail surface.
                </CardDescription>
              </CardHeader>
              <CardFooter className="justify-between border-t border-border/70 pt-4">
                <span className="text-sm font-medium text-foreground">Go to tenant directory</span>
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ArrowRightIcon />
                </span>
              </CardFooter>
            </a>
          </Card>

          <Card asChild className="text-left" variant="interactive">
            <a href="#billing-preview">
              <CardHeader className="gap-2">
                <CardEyebrow>Finance controls</CardEyebrow>
                <CardTitle className="text-xl">Review billing posture</CardTitle>
                <CardDescription>
                  Jump into collection risk, renewal visibility, and tenant billing follow-up from
                  the same shared card pattern.
                </CardDescription>
              </CardHeader>
              <CardFooter className="justify-between border-t border-border/70 pt-4">
                <span className="text-sm font-medium text-foreground">Open billing review</span>
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ArrowRightIcon />
                </span>
              </CardFooter>
            </a>
          </Card>
        </section>
      </section>
    </main>
  );
}
