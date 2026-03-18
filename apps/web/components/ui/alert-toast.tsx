'use client';

import { X } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/utils';

import { Alert, AlertDescription, AlertTitle, type AlertProps } from './alert';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type AlertPosition =
  | 'center'
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

type ToastOptions = {
  severity: NonNullable<AlertProps['severity']>;
  title: string;
  description?: string;
  position?: AlertPosition;
  duration?: number;
  dismissible?: boolean;
};

type ToastEntry = ToastOptions & {
  id: string;
  position: AlertPosition;
  duration: number;
  dismissible: boolean;
};

type AlertContextValue = {
  showAlert: (options: ToastOptions) => string;
  dismissAlert: (id: string) => void;
};

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const AlertContext = createContext<AlertContextValue | null>(null);

const DEFAULT_POSITION: AlertPosition = 'top-right';
const DEFAULT_DURATION = 5_000;

let nextId = 0;
const generateId = () => `alert-toast-${++nextId}`;

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const showAlert = useCallback((options: ToastOptions): string => {
    const id = generateId();
    const entry: ToastEntry = {
      ...options,
      id,
      position: options.position ?? DEFAULT_POSITION,
      duration: options.duration ?? DEFAULT_DURATION,
      dismissible: options.dismissible ?? true,
    };
    setToasts((prev) => [...prev, entry]);
    return id;
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, dismissAlert }}>
      {children}
      <AlertViewport dismissAlert={dismissAlert} toasts={toasts} />
    </AlertContext.Provider>
  );
};

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export const useAlerts = (): AlertContextValue => {
  const value = useContext(AlertContext);
  if (!value) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return value;
};

/* ------------------------------------------------------------------ */
/*  Viewport – renders grouped toasts by position                      */
/* ------------------------------------------------------------------ */

const positionClassNames: Record<AlertPosition, string> = {
  'top-right': 'fixed right-4 top-4',
  'top-left': 'fixed left-4 top-4',
  'top-center': 'fixed left-1/2 top-4 -translate-x-1/2',
  'bottom-right': 'fixed bottom-4 right-4',
  'bottom-left': 'fixed bottom-4 left-4',
  'bottom-center': 'fixed bottom-4 left-1/2 -translate-x-1/2',
  center: 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
};

type AlertViewportProps = {
  toasts: ToastEntry[];
  dismissAlert: (id: string) => void;
};

const AlertViewport = ({ toasts, dismissAlert }: AlertViewportProps) => {
  const grouped = toasts.reduce<Record<string, ToastEntry[]>>((acc, toast) => {
    const key = toast.position;
    if (!acc[key]) acc[key] = [];
    acc[key].push(toast);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(grouped).map(([position, entries]) => (
        <div
          aria-live="polite"
          className={cn(
            positionClassNames[position as AlertPosition],
            'pointer-events-none z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3',
          )}
          key={position}
        >
          {entries.map((toast) => (
            <ToastItem dismissAlert={dismissAlert} key={toast.id} toast={toast} />
          ))}
        </div>
      ))}
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  Toast item with auto-dismiss                                       */
/* ------------------------------------------------------------------ */

type ToastItemProps = {
  toast: ToastEntry;
  dismissAlert: (id: string) => void;
};

const ToastItem = ({ toast, dismissAlert }: ToastItemProps) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (toast.duration <= 0) return;

    timerRef.current = setTimeout(() => {
      dismissAlert(toast.id);
    }, toast.duration);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [toast.id, toast.duration, dismissAlert]);

  return (
    <div className="pointer-events-auto">
      <Alert className="shadow-xl shadow-stone-950/10 backdrop-blur" severity={toast.severity}>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <AlertTitle>{toast.title}</AlertTitle>
            {toast.description ? <AlertDescription>{toast.description}</AlertDescription> : null}
          </div>
          {toast.dismissible ? (
            <button
              aria-label="Dismiss notification"
              className="shrink-0 rounded-md p-0.5 opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1"
              onClick={() => dismissAlert(toast.id)}
              type="button"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </Alert>
    </div>
  );
};
