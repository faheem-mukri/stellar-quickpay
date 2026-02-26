"use client";

type Props = {
  title: string;
  value: number;
  isLoading: boolean;
};

export function StatCard({ title, value, isLoading }: Props) {
  return (
    <div className="bg-zinc-900 p-6 rounded-2xl shadow-md border border-zinc-800 w-full">
      <p className="text-sm text-zinc-400 mb-2">{title}</p>

      {isLoading ? (
        <div className="h-8 w-24 bg-zinc-800 animate-pulse rounded" />
      ) : (
        <h2 className="text-3xl font-semibold">
          {value} <span className="text-lg text-zinc-400">XLM</span>
        </h2>
      )}
    </div>
  );
}
