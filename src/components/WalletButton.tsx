"use client";

import { useState } from "react";
import { connectWallet } from "@/lib/wallet";

export default function WalletButton() {
    const[publicKey, setPublicKey] = useState<string | null>(null);

    const handleConnect = async () => {
        try {
            const key = await connectWallet();
            setPublicKey(key);
        } catch (err) {
            alert("Failed to connect wallet. Please try again.");
        }
    };

    const handleDisconnect = () => {
        setPublicKey(null);
    };
    
    return (
    <div className="mt-6">
      {!publicKey ? (
        <button
          onClick={handleConnect}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p className="text-sm break-all mb-3 text-black">
            Connected: {publicKey}
          </p>
          <button
            onClick={handleDisconnect}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}