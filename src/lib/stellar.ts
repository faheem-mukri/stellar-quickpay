"use client";

import {
  TransactionBuilder,
  Networks,
  BASE_FEE,
  Operation,
  Asset,
  Account,
} from "@stellar/stellar-sdk";

const HORIZON = process.env.NEXT_PUBLIC_HORIZON || "https://horizon-testnet.stellar.org";

// ── getXlmBalance ───────────────────────────────────
export const getXlmBalance = async (publicKey: string): Promise<string> => {
  try {
    const response = await fetch(`${HORIZON}/accounts/${publicKey}`);
    if (!response.ok) throw new Error("Failed to load account");
    const data = await response.json();
    const nativeBalance = data.balances.find(
      (bal: any) => bal.asset_type === "native"
    );
    return nativeBalance?.balance || "0";
  } catch (error) {
    console.error("Error fetching XLM balance:", error);
    throw error;
  }
};

// ── sendXlm ─────────────────────────────────────────
// Builds a Stellar payment tx, signs via Freighter, submits to Horizon
export const sendXlm = async (
  fromAddress: string,
  toAddress: string,
  amount: string,
  signTransaction: (xdr: string) => Promise<string>
): Promise<{ success: boolean; txHash?: string; error?: string }> => {
  try {
    // 1. Fetch sender account sequence from Horizon
    const response = await fetch(`${HORIZON}/accounts/${fromAddress}`);
    if (!response.ok) throw new Error("Could not load sender account");
    const accountData = await response.json();

    // 2. Build the transaction manually using account data
    const account = new Account(fromAddress, accountData.sequence);

    const tx = new TransactionBuilder(account as any, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: toAddress,
          asset: Asset.native(),
          amount: parseFloat(amount).toFixed(7),
        })
      )
      .setTimeout(30)
      .build();

    // 3. Sign with Freighter
    const signedXdr = await signTransaction(tx.toXDR());

    // 4. Submit to Horizon
    const submitResponse = await fetch(`${HORIZON}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `tx=${encodeURIComponent(signedXdr)}`,
    });

    const submitData = await submitResponse.json();

    if (!submitResponse.ok) {
      const errorMsg =
        submitData?.extras?.result_codes?.transaction ||
        submitData?.title ||
        "Transaction failed";
      throw new Error(errorMsg);
    }

    return { success: true, txHash: submitData.hash };
  } catch (err: any) {
    console.error("sendXlm error:", err);
    return { success: false, error: err.message || "Payment failed" };
  }
};