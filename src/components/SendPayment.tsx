"use client";

import { useState } from "react";
import { sendXlm } from "@/lib/transaction";

interface Props {
  publicKey: string;
  onSuccess: () => void;
}

// =====================================================
// Component: SendPayment
// Purpose: A form component that allows the user to send XLM to another Stellar address. It includes input fields for the destination address and amount, and a button to submit the payment. 
// It also displays the result of the transaction (success or error) after submission.
// Flow:
// 1. The user enters a destination Stellar address and an amount of XLM to send.
// 2. When the user clicks "Send XLM", it calls the sendXlm function to build, sign, and submit the transaction.
// 3. The component displays a loading state while the transaction is being processed.
// 4. After the transaction is submitted, it displays the result (success or error) to the user. If successful, it also calls onSuccess to allow the parent component to refresh the balance or perform other actions.
// =====================================================

export default function SendPayment({ publicKey, onSuccess }: Props) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setResult(null);

    const response = await sendXlm(
      publicKey,
      destination,
      amount.toString()
    );

    setResult(response);

    if (response.success) {
      onSuccess();
      setDestination("");
      setAmount("");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">
          Destination Address
        </label>
        <input
          type="text"
          placeholder="Destination Stellar Address (GAX...)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">
          Amount (XLM)
        </label>
        <input
          type="text"
          placeholder="Amount in XLM (e.g. 10)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder:text-gray-400"

        />
      </div>

      <button
        onClick={handleSend}
        disabled={loading || !destination || !amount}
        className={`w-full py-3 rounded-lg font-medium transition ${
          loading || !destination || !amount
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {loading ? "Processing..." : "Send XLM"}
      </button>

      {result && (
        <div
          className={`p-4 rounded-lg text-sm ${
            result.success
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {result.success ? (
            <>
              <p className="font-medium">Transaction Successful</p>
              <p className="font-medium break-all">Hash: {result.hash}</p>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${result.hash}`}
                target="_blank"
                className="underline text-blue-600"
              >
                View on Explorer
              </a>
            </>
          ) : (
            <p>{result.error}</p>
          )}
        </div>
      )}
    </div>
  );

}
