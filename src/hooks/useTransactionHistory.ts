"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchHistory() {
  // Replace with real event fetching
  await new Promise((res) => setTimeout(res, 800));

  return [
    {
      sender: "GABC...123",
      amount: 10,
      timestamp: Date.now(),
    },
  ];
}

export function useTransactionHistory() {
  return useQuery({
    queryKey: ["txHistory"],
    queryFn: fetchHistory,
    staleTime: 20000,
  });
}
