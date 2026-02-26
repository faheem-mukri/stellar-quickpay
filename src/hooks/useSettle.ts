"use client";

import { useState } from "react";
import { recordPayment } from "@/lib/contract";
import { addSettlement } from "@/lib/storage";
import { sendXlm } from "@/lib/stellar";

export type SettleState =
  | "idle"
  | "awaiting_signature"
  | "sending_xlm"
  | "recording"
  | "success"
  | "error";

export function useSettle(
  publicKey: string,
  signTransaction: (xdr: string) => Promise<string>
) {
  const [state, setState] = useState<SettleState>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const settle = async (
    groupId: string,
    toAddress: string,
    amount: number
  ) => {
    try {
      setState("idle");
      setError(null);
      setTxHash(null);

      // Step 1: Sign + send XLM via Freighter
      setState("awaiting_signature");
      const xlmResult = await sendXlm(
        publicKey,
        toAddress,
        amount.toString(),
        signTransaction // ✅ passed through to stellar.ts
      );

      if (!xlmResult.success) {
        throw new Error(xlmResult.error || "XLM transfer failed");
      }

      // Step 2: Record on Soroban contract
      setState("recording");
      const contractResult = await recordPayment(
        publicKey,
        amount,
        signTransaction
      );

      if (!contractResult.success) {
        // XLM already sent — don't block user, just warn
        console.warn("Contract recording failed:", contractResult.error);
      }

      // Step 3: Persist settlement locally so group dashboard updates
      addSettlement(groupId, {
        from: publicKey,
        to: toAddress,
        amount,
        txHash: xlmResult.txHash || contractResult.txHash || "",
      });

      setTxHash(xlmResult.txHash || "");
      setState("success");
    } catch (err: any) {
      setError(err.message || "Settlement failed");
      setState("error");
    }
  };

  const reset = () => {
    setState("idle");
    setError(null);
    setTxHash(null);
  };

  return { settle, state, txHash, error, reset };
}