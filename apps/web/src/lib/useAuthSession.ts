"use client";

import { useSession } from "next-auth/react";

export function useAuthSession() {
  const { data, status } = useSession();
  const session = data as any;
  return {
    status,
    accessToken: session?.accessToken as string | undefined,
    userId: session?.userId as string | undefined,
    orgId: session?.orgId as string | undefined,
  };
}

