"use client";

import { useState, useEffect } from "react";
import { connectWallet } from "@/lib/wallet";
import { useRouter } from "next/router";

export function useWallet() {
  const router = useRouter();
  const [publicKey, setPublicKey] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);

  // ✅ Rehydrate from sessionStorage on every page load
  useEffect(() => {
    const saved = sessionStorage.getItem("stellarsplit:wallet");
    if (saved) setPublicKey(saved);
  }, []);

  const connect = async () => {
    try {
      setIsConnecting(true);
      const key = await connectWallet();
      setPublicKey(key);
      // ✅ Persist so redirects don't lose the key
      sessionStorage.setItem("stellarsplit:wallet", key);
    } catch (err) {
      console.error("Wallet connection failed", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setPublicKey("");
    sessionStorage.removeItem("stellarsplit:wallet");
    router.push("/"); // Redirect to home on disconnect
  };

  // ✅ signTransaction needed for contract calls
  const signTransaction = async (xdr: string): Promise<string> => {
    const { signTransaction: freighterSign } = await import(
      "@stellar/freighter-api"
    );
    const result = await freighterSign(xdr, {
      networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE!,
    });
    return result.signedTxXdr;
  };

  return {
    publicKey,
    isConnected: !!publicKey,
    isConnecting,
    connect,
    disconnect,
    signTransaction, // ✅ needed by useSettle
  };
}