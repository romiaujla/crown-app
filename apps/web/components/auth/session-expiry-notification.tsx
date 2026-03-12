import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SessionExpiryNotificationProps = {
  secondsRemaining: number;
};

export const SessionExpiryNotification = ({ secondsRemaining }: SessionExpiryNotificationProps) => (
  <div className="pointer-events-none fixed right-4 top-4 z-50 w-[min(24rem,calc(100vw-2rem))]">
    <Card className="border-amber-200/80 bg-amber-50/95 shadow-xl shadow-stone-950/10 backdrop-blur">
      <CardHeader className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Session warning</p>
        <CardTitle className="text-xl tracking-tight text-stone-950">Your session is about to expire</CardTitle>
        <CardDescription className="text-sm leading-6 text-stone-700">
          You will be logged out soon and will need to sign in again.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 text-sm font-medium text-stone-700">
        Signing out in {secondsRemaining} second{secondsRemaining === 1 ? "" : "s"}.
      </CardContent>
    </Card>
  </div>
);
