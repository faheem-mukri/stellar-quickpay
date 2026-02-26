"use client";

import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { useEffect, useState } from "react";

export default function Landing() {
  const { connect, isConnected, isConnecting } = useWallet();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // ← wait for sessionStorage to load
    if (isConnected) router.push("/groups");
  }, [isConnected, mounted]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0b0f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Syne', sans-serif",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <div style={{
        position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,82,255,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 64 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: "linear-gradient(135deg, #0052ff, #00c2ff)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 800, color: "#fff",
        }}>S</div>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
          Stellar<span style={{ color: "#0052ff" }}>Split</span>
        </span>
      </div>

      <div style={{ textAlign: "center", maxWidth: 480, marginBottom: 48 }}>
        <h1 style={{
          fontSize: 52, fontWeight: 800, color: "#ffffff",
          letterSpacing: "-2px", lineHeight: 1.05, margin: 0, marginBottom: 20,
        }}>
          Split bills.<br />
          <span style={{
            background: "linear-gradient(135deg, #0052ff, #00c2ff)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Settle on-chain.</span>
        </h1>
        <p style={{
          fontFamily: "'DM Mono', monospace", fontSize: 14,
          color: "#4b5563", lineHeight: 1.7, margin: 0,
        }}>
          Create groups, track shared expenses, and settle<br />
          debts instantly with XLM on Stellar testnet.
        </p>
      </div>

      <button
        onClick={connect}
        disabled={isConnecting}
        style={{
          background: isConnecting ? "#1a1d27" : "linear-gradient(135deg, #0052ff, #0066ff)",
          border: "none", borderRadius: 14, padding: "16px 40px",
          color: isConnecting ? "#4b5563" : "#fff",
          fontSize: 16, fontWeight: 700, fontFamily: "'Syne', sans-serif",
          cursor: isConnecting ? "not-allowed" : "pointer",
          transition: "all 0.2s", marginBottom: 16,
        }}
      >
        {isConnecting ? "Connecting..." : "Connect Freighter Wallet →"}
      </button>

      <p style={{
        fontFamily: "'DM Mono', monospace", fontSize: 11,
        color: "#2d3748", letterSpacing: "0.5px",
      }}>
        Stellar Testnet · Powered by Soroban
      </p>

      <div style={{ display: "flex", gap: 10, marginTop: 64, flexWrap: "wrap", justifyContent: "center" }}>
        {["Create groups", "Track expenses", "Settle with XLM", "On-chain proof"].map((f) => (
          <div key={f} style={{
            background: "#0d1117", border: "1px solid #1e2029",
            borderRadius: 999, padding: "6px 16px",
            fontFamily: "'DM Mono', monospace", fontSize: 11,
            color: "#4b5563", letterSpacing: "0.5px",
          }}>{f}</div>
        ))}
      </div>
    </div>
  );
}
