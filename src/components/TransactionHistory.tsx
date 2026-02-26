"use client";

type Props = {
  transactions: any[];
  isLoading: boolean;
};

export function TransactionHistory({
  transactions,
  isLoading,
}: Props) {
  return (
    <section className="p-6">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
        <h3 className="text-lg font-semibold mb-4">
          Transaction History
        </h3>

        {isLoading ? (
          <div className="h-6 w-40 bg-zinc-800 animate-pulse rounded" />
        ) : transactions.length === 0 ? (
          <p className="text-zinc-400">
            No transactions yet.
          </p>
        ) : (
          transactions.map((tx, i) => (
            <div
              key={i}
              className="flex justify-between py-2 border-b border-zinc-800"
            >
              <span>{tx.sender}</span>
              <span>{tx.amount} XLM</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
