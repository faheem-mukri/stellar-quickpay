"use client";

import { useState } from "react";
import { connectWallet } from "@/lib/wallet";

interface Props {
  onConnect: (key: string) => void;
}

// =====================================================
// Component: WalletButton
// Purpose: A button component that allows the user to connect their Freighter wallet and displays their public key once connected. It also provides a disconnect option.
// Flow:
// 1. When the user clicks "Connect Freighter Wallet", it calls the connectWallet function to request access to the wallet and retrieve the public key.
// 2. If the connection is successful, it displays the user's public key and a "Disconnect" button.
// 3. If the user clicks "Disconnect", it clears the public key and calls onConnect with an empty string to notify the parent component.
// =====================================================

export default function WalletButton({ onConnect }: Props) {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      const key = await connectWallet();
      setPublicKey(key);
      onConnect(key);
    } catch {
      alert("Failed to connect wallet.");
    }
  };

  const handleDisconnect = () => {
    setPublicKey(null);
    onConnect("");
  };
    
    return (
  <div className="text-center">
    {!publicKey ? (
      <button
        onClick={handleConnect}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Connect Freighter Wallet
      </button>
    ) : (
      <div className="space-y-2">
        <p className="text-xs text-gray-500 break-all">
          {publicKey}
        </p>
        <button
          onClick={handleDisconnect}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
        >
          Disconnect
        </button>
      </div>
    )}
  </div>
);

}