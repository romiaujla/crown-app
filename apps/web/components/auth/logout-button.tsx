'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, type ButtonProps } from '@/components/ui/button';

import { useAuth } from './auth-provider';

type LogoutButtonProps = Pick<ButtonProps, 'className' | 'size' | 'variant'>;

export const LogoutButton = ({ className, size, variant = 'outline' }: LogoutButtonProps = {}) => {
  const router = useRouter();
  const { signOut } = useAuth();
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    setIsPending(true);
    try {
      await signOut();
      router.replace('/login');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      className={className}
      disabled={isPending}
      onClick={() => void handleClick()}
      size={size}
      type="button"
      variant={variant}
    >
      {isPending ? 'Signing out...' : 'Log out'}
    </Button>
  );
};
