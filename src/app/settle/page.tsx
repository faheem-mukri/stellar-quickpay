"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { useSettle } from "@/hooks/useSettle";
import { Header } from "@/components/Header";
import { Suspense } from "react";

function SettleContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { publicKey, isConnecting, connect, disconnect, signTransaction } = useWallet();

  const groupId = params.get("groupId") || "";
  const to = params.get("to") || "";
  const toName = params.get("toName") || "Unknown";
  const amount = parseFloat(params.get("amount") || "0");

  const { settle, state, txHash, error, reset } = useSettle(publicKey, signTransaction);

  const handleSettle = async () => {
    await settle(groupId, to, amount);
  };

  const isLoading = state === "awaiting_signature" || state === "sending_xlm" || state === "recording";

  const steps = [
    { key: "awaiting_signature", label: "Sign Transaction", desc: "Approve in Freighter" },
    { key: "sending_xlm", label: "Send XLM", desc: "Broadcasting to Stellar" },
    { key: "recording", label: "Record On-Chain", desc: "Writing to contract" },
    { key: "success", label: "Confirmed", desc: "Settlement complete" },
  ];

  const currentStep = steps.findIndex((s) => s.key === state);

  return (
    <div style={{ background: "#0a0b0f", minHeight: "100vh", fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');`}</style>
      <Header address={publicKey || null} isConnecting={isConnecting} connect={connect} disconnect={disconnect} />

      <main style={{ maxWidth: 480, margin: "0 auto", padding: "40px 16px 80px" }}>
        <button onClick={() => router.back()} style={{
          background: "none", border: "none", color: "#4b5563",
          fontFamily: "'DM Mono', monospace", fontSize: 12,
          cursor: "pointer", marginBottom: 32, padding: 0,
        }}>← Back</button>

        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.5px" }}>
          Settle Up
        </h2>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#4b5563", marginBottom: 32 }}>
          Send XLM and record on Stellar contract
        </p>

        {/* Summary card */}
        <div style={{
          background: "#0d1117", border: "1px solid #1e2029",
          borderRadius: 20, padding: "28px", marginBottom: 16,
        }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#4b5563", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 8px" }}>
              You owe
            </p>
            <p style={{ fontSize: 48, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-2px" }}>
              {amount.toFixed(2)}
              <span style={{ fontSize: 20, color: "#0052ff", marginLeft: 8 }}>XLM</span>
            </p>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#4b5563", margin: 0 }}>
              to <span style={{ color: "#00d395" }}>{toName}</span>
            </p>
          </div>

          <div style={{ background: "#0a0b0f", border: "1px solid #1e2029", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#4b5563", margin: "0 0 4px", letterSpacing: "1px", textTransform: "uppercase" }}>To Address</p>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#9ca3af", margin: 0, wordBreak: "break-all" }}>{to}</p>
          </div>

          {state === "idle" && (
            <button onClick={handleSettle} style={{
              width: "100%",
              background: "linear-gradient(135deg, #0052ff, #0066ff)",
              border: "none", borderRadius: 12, padding: "14px",
              color: "#fff", fontSize: 15, fontWeight: 700,
              fontFamily: "'Syne', sans-serif", cursor: "pointer",
            }}>
              Confirm & Pay →
            </button>
          )}

          {state === "error" && (
            <>
              <div style={{
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 10, padding: "12px 16px", marginBottom: 12,
                color: "#ef4444", fontSize: 13, fontFamily: "'DM Mono', monospace",
              }}>✗ {error}</div>
              <button onClick={reset} style={{
                width: "100%", background: "#1a1d27", border: "1px solid #2d3748",
                borderRadius: 12, padding: "14px", color: "#9ca3af",
                fontSize: 14, fontWeight: 600, fontFamily: "'Syne', sans-serif", cursor: "pointer",
              }}>Try Again</button>
            </>
          )}

          {state === "success" && (
            <div style={{ textAlign: "center" }}>
              <div style={{
                background: "rgba(0,211,149,0.08)", border: "1px solid rgba(0,211,149,0.2)",
                borderRadius: 12, padding: "16px", marginBottom: 16,
              }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#00d395", margin: "0 0 8px" }}>✓ Settlement confirmed!</p>
                {txHash && (
                  <a href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                    target="_blank" rel="noreferrer"
                    style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#0052ff" }}>
                    View on Stellar Explorer ↗
                  </a>
                )}
              </div>
              <button onClick={() => router.push(`/groups/${groupId}`)} style={{
                width: "100%", background: "linear-gradient(135deg, #0052ff, #0066ff)",
                border: "none", borderRadius: 12, padding: "14px",
                color: "#fff", fontSize: 14, fontWeight: 700,
                fontFamily: "'Syne', sans-serif", cursor: "pointer",
              }}>Back to Group →</button>
            </div>
          )}
        </div>

        {/* Progress stepper */}
        {isLoading && (
          <div style={{ background: "#0d1117", border: "1px solid #1e2029", borderRadius: 20, padding: "24px 28px" }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#4b5563", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 20px" }}>
              Transaction Progress
            </p>
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isActive = step.key === state;
              return (
                <div key={step.key} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                      background: isCompleted ? "#00d395" : isActive ? "#0052ff" : "#1e2029",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: isActive ? "0 0 12px rgba(0,82,255,0.4)" : "none",
                    }}>
                      {isCompleted && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>}
                      {isActive && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", animation: "pulse 1.2s infinite" }} />}
                    </div>
                    {index < steps.length - 1 && (
                      <div style={{ width: 1, height: 24, background: isCompleted ? "#00d395" : "#1e2029", margin: "2px 0" }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: index < steps.length - 1 ? 20 : 0, paddingTop: 1 }}>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: isActive ? 700 : 500, color: isCompleted ? "#00d395" : isActive ? "#fff" : "#374151", margin: 0 }}>{step.label}</p>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#4b5563", margin: 0 }}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
            <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }`}</style>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SettlePage() {
  return (
    <Suspense fallback={<div style={{ background: "#0a0b0f", minHeight: "100vh" }} />}>
      <SettleContent />
    </Suspense>
  );
}
