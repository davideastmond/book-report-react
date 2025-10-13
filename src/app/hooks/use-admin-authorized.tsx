"use client";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

export function useAdminAuthorized() {
  const { data: session } = useSession();

  const isAdminAuthorized = useMemo<boolean | null>(() => {
    if (!session?.user) return null;

    return ["admin", "teacher"].includes(session.user.role);
  }, [session?.user]);

  return { isAdminAuthorized };
}
