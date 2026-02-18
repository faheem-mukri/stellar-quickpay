"use client";

interface Props {
  total: bigint;
  userTotal: bigint;
}

export default function TotalsCard({ total, userTotal }: Props) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
      <div>
        <p className="text-xs text-gray-500">Contract Total</p>
        <p className="text-lg font-semibold text-black">
          {total.toString()} XLM
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-500">Your Total</p>
        <p className="text-lg font-semibold text-black">
          {userTotal.toString()} XLM
        </p>
      </div>
    </div>
  );
}
