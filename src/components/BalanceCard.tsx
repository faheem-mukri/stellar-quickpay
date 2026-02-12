interface Props {
  balance: string;
}
// =====================================================
// Component: BalanceCard
// Purpose: A simple card component that displays the user's XLM balance. It receives the balance as a prop and formats it for display. If the balance is still loading, it shows a loading state.
// Flow:
// 1. The parent component fetches the user's XLM balance using the getXlmBalance function and passes it as a prop to the BalanceCard.
// 2. The BalanceCard formats the balance to a fixed number of decimal places and displays it. If the balance is not yet available, it shows "Loading...".
// =====================================================
export default function BalanceCard({ balance }: Props) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg text-center">
      <p className="text-sm text-gray-500">XLM Balance</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">
        {balance
            ? `${parseFloat(balance).toFixed(7).replace(/\.?0+$/, "")} XLM`
            : "Loading..."}
      </p>
    </div>
  );
}
