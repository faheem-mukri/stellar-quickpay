"use client";

import { useEffect, useState } from "react";
import WalletButton from "@/components/WalletButton";
import BalanceCard from "@/components/BalanceCard";
import SendPayment from "@/components/SendPayment";
import { getXlmBalance } from "@/lib/stellar";

export default function Home() {
  const [publicKey, setPublicKey] = useState<string>("");
  const [balance, setBalance] = useState<string>("");

  const fetchBalance = async (key: string) => {
    const bal = await getXlmBalance(key);
    setBalance(bal);
  };

  useEffect(() => {
    if (publicKey) {
      fetchBalance(publicKey);
    }
  }, [publicKey]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Stellar QuickPay
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Send XLM instantly on Stellar Testnet
          </p>
        </div>

        <WalletButton onConnect={setPublicKey} />

        {publicKey && (
          <>
            <BalanceCard balance={balance} />
            <SendPayment 
              publicKey={publicKey} 
              onSuccess={() => fetchBalance(publicKey)}
            />
          </>
        )}
      </div>
    </main>
  );
}
