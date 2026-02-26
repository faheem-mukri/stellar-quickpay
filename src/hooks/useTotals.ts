"use client";

import { useQuery } from "@tanstack/react-query";
import { getTotal, getUserTotal } from "@/lib/contract";

export function useTotals(publicKey: string) {
  const globalQuery = useQuery({
    queryKey: ["globalTotal"],
    queryFn: getTotal,
    staleTime: 30000,
  });

  const userQuery = useQuery({
    queryKey: ["userTotal", publicKey],
    queryFn: () => getUserTotal(publicKey),
    enabled: !!publicKey,
    staleTime: 30000,
  });

  return {
    total: globalQuery.data ?? 0n,
    userTotal: userQuery.data ?? 0n,
    isLoading: globalQuery.isLoading || userQuery.isLoading,
    refetch: () => {
      globalQuery.refetch();
      userQuery.refetch();
    },
  };
}
