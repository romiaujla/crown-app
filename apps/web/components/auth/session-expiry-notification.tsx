import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type SessionExpiryNotificationProps = {
  secondsRemaining: number;
};

export const SessionExpiryNotification = ({ secondsRemaining }: SessionExpiryNotificationProps) => (
  <div className="pointer-events-none fixed right-4 top-4 z-50 w-[min(24rem,calc(100vw-2rem))]">
    <Alert className="shadow-xl shadow-stone-950/10 backdrop-blur" severity="warning">
      <AlertTitle className="text-base font-semibold tracking-tight">
        Your session is about to expire
      </AlertTitle>
      <AlertDescription>
        <p>You will be logged out soon and will need to sign in again.</p>
        <p className="mt-2 font-medium">
          Signing out in {secondsRemaining} second{secondsRemaining === 1 ? '' : 's'}.
        </p>
      </AlertDescription>
    </Alert>
  </div>
);
