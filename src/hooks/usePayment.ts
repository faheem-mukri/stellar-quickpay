"use client";

import { useState } from "react";

export type TxState =
  | "idle"
  | "awaiting_signature"
  | "submitting"
  | "recording"
  | "success"
  | "error";

export function usePayment(onSuccess?: () => void) {
  const [txState, setTxState] = useState<TxState>("idle");
  const [error, setError] = useState<string | null>(null);

  const sendPayment = async (amount: number) => {
    try {
      setError(null);

      setTxState("awaiting_signature");
      await new Promise((res) => setTimeout(res, 1000));

      setTxState("submitting");
      await new Promise((res) => setTimeout(res, 1000));

      setTxState("recording");
      await new Promise((res) => setTimeout(res, 1000));

      setTxState("success");

      onSuccess?.();
    } catch (err) {
      setError("Transaction failed.");
      setTxState("error");
    }
  };

  const reset = () => {
    setTxState("idle");
    setError(null);
  };

  return {
    txState,
    error,
    sendPayment,
    reset,
  };
}
