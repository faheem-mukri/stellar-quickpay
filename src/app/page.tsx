"use client";

import { useEffect, useState } from "react";
import WalletButton from "@/components/WalletButton";
import BalanceCard from "@/components/BalanceCard";
import SendPayment from "@/components/SendPayment";
import { getXlmBalance } from "@/lib/stellar";
import EventPanel from "@/components/EventPanel";
import { getTotal, getUserTotal } from "@/lib/contract";
import TotalsCard from "@/components/TotalsCard";


export default function Home() {
  const [publicKey, setPublicKey] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [total, setTotal] = useState<bigint>(0n);
  const [userTotal, setUserTotal] = useState<bigint>(0n);

  const fetchBalance = async (key: string) => {
    const bal = await getXlmBalance(key);
    setBalance(bal);
  };

  const fetchTotals = async () => {
    try {
      const totalValue = await getTotal();
      setTotal(totalValue);

      if (publicKey) {
        const userTotalValue = await getUserTotal(publicKey);
        setUserTotal(userTotalValue);
      }
    } catch (err) {
      console.error("Failed to fetch totals:", err);
    }
  };

  useEffect(() => {
    fetchTotals();
  }, []);

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
            <TotalsCard total={total} userTotal={userTotal} />
            <SendPayment 
              publicKey={publicKey} 
              onSuccess={() => fetchBalance(publicKey)}
            />
            <EventPanel />
          </>
        )}
      </div>
    </main>
  );
}
