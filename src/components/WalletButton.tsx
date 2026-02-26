"use client";

import { useState } from "react";
import { connectWallet } from "@/lib/wallet";

interface Props {
  onConnect: (key: string) => void;
}

export default function WalletButton({ onConnect }: Props) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const key = await connectWallet();
      setPublicKey(key);
      onConnect(key);
    } catch {
      alert("Failed to connect wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setPublicKey(null);
    onConnect("");
  };

  if (publicKey) return null; // Header handles disconnect when connected

  return (
    <div style={{
      background: "#0d1117",
      border: "1px solid #1e2029",
      borderRadius: 20,
      padding: "32px 28px",
      textAlign: "center",
    }}>
      {/* Freighter icon placeholder */}
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 16,
        background: "linear-gradient(135deg, #0052ff22, #0066ff11)",
        border: "1px solid rgba(0,82,255,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        margin: "0 auto 16px",
      }}>
        🚀
      </div>

      <p style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 18,
        fontWeight: 700,
        color: "#ffffff",
        margin: 0,
        marginBottom: 8,
      }}>
        Connect your wallet
      </p>
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 12,
        color: "#4b5563",
        margin: 0,
        marginBottom: 24,
      }}>
        Use Freighter to connect to Stellar testnet
      </p>

      <button
        onClick={handleConnect}
        disabled={isConnecting}
        style={{
          width: "100%",
          background: isConnecting
            ? "#1a1d27"
            : "linear-gradient(135deg, #0052ff, #0066ff)",
          border: "none",
          borderRadius: 12,
          padding: "14px",
          color: isConnecting ? "#4b5563" : "#ffffff",
          fontSize: 15,
          fontWeight: 700,
          fontFamily: "'Syne', sans-serif",
          cursor: isConnecting ? "not-allowed" : "pointer",
          transition: "all 0.15s",
        }}
      >
        {isConnecting ? "Connecting..." : "Connect Freighter Wallet"}
      </button>
    </div>
  );
}
