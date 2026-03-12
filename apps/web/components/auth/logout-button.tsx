"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { useAuth } from "./auth-provider";

export const LogoutButton = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    setIsPending(true);
    try {
      await signOut();
      router.replace("/login");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button disabled={isPending} onClick={() => void handleClick()} type="button" variant="outline">
      {isPending ? "Signing out..." : "Log out"}
    </Button>
  );
};
