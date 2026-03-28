import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-3xl rounded-[28px] border border-border/70 bg-card/95 p-10 shadow-[0_24px_70px_rgba(70,42,20,0.08)]">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Crown Web2
          </p>
          <h1 className="text-3xl font-semibold text-foreground">
            A clean canvas for the next product surface.
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            This workspace is intentionally minimal. We are starting with Storybook and a simple
            button so future login, dashboard, and tenant-directory redesign work can land here in
            focused follow-up stories.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary action</Button>
        </div>
      </section>
    </main>
  );
}
