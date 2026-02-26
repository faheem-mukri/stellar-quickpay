"use client";

import { StatCard } from "./StatCard";

type Props = {
  globalTotal: number;
  userTotal: number;
  isLoading: boolean;
};

export function StatsSection({
  globalTotal,
  userTotal,
  isLoading,
}: Props) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <StatCard
        title="Global Total"
        value={globalTotal}
        isLoading={isLoading}
      />
      <StatCard
        title="Your Total"
        value={userTotal}
        isLoading={isLoading}
      />
    </section>
  );
}
