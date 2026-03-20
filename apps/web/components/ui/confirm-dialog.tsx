'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus the cancel button when the dialog opens
  useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      aria-describedby="confirm-dialog-description"
      aria-labelledby="confirm-dialog-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
      data-testid="confirm-dialog"
      role="alertdialog"
    >
      {/* Backdrop */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/40" onClick={onCancel} />

      {/* Panel */}
      <div
        className={cn(
          'platform-confirm-dialog relative z-10 mx-4 w-full max-w-md rounded-2xl border px-6 py-5 shadow-lg',
        )}
      >
        <h2
          className="platform-confirm-dialog__title text-base font-semibold"
          id="confirm-dialog-title"
        >
          {title}
        </h2>
        <p
          className="platform-confirm-dialog__description mt-2 text-sm"
          id="confirm-dialog-description"
        >
          {description}
        </p>
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button
            className="platform-dialog-cancel-button rounded-full px-4"
            onClick={onCancel}
            ref={cancelRef}
            type="button"
            variant="outline"
          >
            {cancelLabel}
          </Button>
          <Button
            className="platform-primary-button rounded-full px-4"
            onClick={onConfirm}
            type="button"
            variant={variant === 'destructive' ? 'destructive' : 'default'}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
