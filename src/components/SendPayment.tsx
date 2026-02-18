"use client";

type TxStatus =
  | "idle"
  | "preparing"
  | "signing"
  | "submitting"
  | "confirming"
  | "success"
  | "error";

import { useState } from "react";
import { recordPayment } from "@/lib/contractTx";
import { sendXlm } from "@/lib/transaction";

interface Props {
  publicKey: string;
  onSuccess: () => void;
}

export default function SendPayment({ publicKey, onSuccess }: Props) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<{
    success: boolean;
    hash?: string;
    errorCode?: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");

  const handleSend = async () => {
    if (!publicKey) {
      setResult({ success: false, errorCode: "WALLET_NOT_CONNECTED" });
      return;
    }

    if (!destination || !amount) {
      setResult({ success: false, errorCode: "INVALID_INPUT" });
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      setTxStatus("preparing");

      // 1️⃣ Transfer XLM
      setTxStatus("signing");

      const transfer = await sendXlm(publicKey, destination, amount);

      if (!transfer.success) {
        setTxStatus("error");
        setResult(transfer);
        setLoading(false);
        return;
      }

      // 2️⃣ Call contract
      setTxStatus("submitting");

      const contractCall = await recordPayment(
        publicKey,
        Number(amount)
      );

      if (!contractCall.success) {
        setTxStatus("error");
        setResult(contractCall);
        setLoading(false);
        return;
      }

      // ✅ Success
      setTxStatus("success");

      setResult({
        success: true,
        hash: transfer.hash,
      });

      onSuccess?.();
    } catch (err: any) {
      setTxStatus("error");
      setResult({
        success: false,
        errorCode: "UNEXPECTED_ERROR",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Human-friendly error mapping
  const renderErrorMessage = (code?: string) => {
    switch (code) {
      case "WALLET_NOT_CONNECTED":
        return "🔐 Please connect your wallet first.";

      case "INVALID_INPUT":
        return "⚠️ Please enter destination and amount.";

      case "USER_REJECTED":
        return "❌ Transaction rejected in wallet.";

      case "INSUFFICIENT_BALANCE":
        return "💸 Insufficient balance.";

      case "NETWORK_ERROR":
        return "🌐 Network error. Try again.";

      case "CONTRACT_FAILED":
        return "⚠️ Contract execution failed.";

      default:
        return "Unexpected error occurred.";
    }
  };

  return (
    <div className="space-y-4">
      {/* Destination */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">
          Destination Address
        </label>
        <input
          type="text"
          placeholder="Destination Stellar Address (GAX...)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">
          Amount (XLM)
        </label>
        <input
          type="number"
          placeholder="Amount in XLM (e.g. 10)"
          min="1"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Button */}
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

      {/* Status Indicator */}
      {txStatus !== "idle" && (
        <div className="text-sm text-center">
          {txStatus === "preparing" && (
            <p className="text-gray-500">Preparing transaction...</p>
          )}
          {txStatus === "signing" && (
            <p className="text-blue-500">
              Waiting for wallet signature...
            </p>
          )}
          {txStatus === "submitting" && (
            <p className="text-purple-500">
              Submitting to network...
            </p>
          )}
          {txStatus === "success" && (
            <p className="text-green-600">
              Transaction successful ✅
            </p>
          )}
          {txStatus === "error" && (
            <p className="text-red-600">
              Transaction failed ❌
            </p>
          )}
          {txStatus === "confirming" && (
            <p className="text-yellow-500">
              Confirming transaction...
            </p>
          )}
          
        </div>
      )}

      {/* Result Panel */}
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
              <p className="break-all">Hash: {result.hash}</p>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${result.hash}`}
                target="_blank"
                className="underline text-blue-600"
              >
                View on Explorer
              </a>
            </>
          ) : (
            <p className="font-medium">
              {renderErrorMessage(result.errorCode)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
