"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <button className="toolbar-logout" disabled={isPending} onClick={() => void handleClick()} type="button">
      {isPending ? "Signing out..." : "Log out"}
    </button>
  );
};
