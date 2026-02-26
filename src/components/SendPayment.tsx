"use client";

import { useState } from "react";
import { TxState } from "@/hooks/usePayment";

type Props = {
  onSend: (destination: string, amount: string) => void;
  state: TxState;
  error: string | null;
};

export default function SendPayment({ onSend, state, error }: Props) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const isLoading = state !== "idle" && state !== "success" && state !== "error";

  const handleSubmit = () => {
    if (!destination || !amount) return;
    onSend(destination, amount);
  };

  const inputStyle = (name: string) => ({
    width: "100%",
    background: "#0d1117",
    border: `1px solid ${focused === name ? "#0052ff" : "#1e2029"}`,
    borderRadius: 12,
    padding: "14px 16px",
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "'DM Mono', monospace",
    outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box" as const,
  });

  return (
    <div style={{
      background: "#0d1117",
      border: "1px solid #1e2029",
      borderRadius: 20,
      padding: "28px",
    }}>
      <p style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 16,
        fontWeight: 700,
        color: "#ffffff",
        margin: 0,
        marginBottom: 20,
      }}>
        Send XLM
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: "#4b5563",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            display: "block",
            marginBottom: 6,
          }}>
            Destination Address
          </label>
          <input
            type="text"
            placeholder="G..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onFocus={() => setFocused("destination")}
            onBlur={() => setFocused(null)}
            style={inputStyle("destination")}
          />
        </div>

        <div>
          <label style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: "#4b5563",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            display: "block",
            marginBottom: 6,
          }}>
            Amount (XLM)
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onFocus={() => setFocused("amount")}
            onBlur={() => setFocused(null)}
            style={inputStyle("amount")}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || !destination || !amount}
          style={{
            width: "100%",
            background: isLoading
              ? "#1a1d27"
              : "linear-gradient(135deg, #0052ff, #0066ff)",
            border: "none",
            borderRadius: 12,
            padding: "14px",
            color: isLoading ? "#4b5563" : "#ffffff",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "'Syne', sans-serif",
            cursor: isLoading || !destination || !amount ? "not-allowed" : "pointer",
            transition: "all 0.15s",
            marginTop: 4,
          }}
        >
          {isLoading ? "Processing..." : "Send Payment →"}
        </button>

        {state === "error" && error && (
          <div style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 10,
            padding: "10px 14px",
            color: "#ef4444",
            fontSize: 13,
            fontFamily: "'DM Mono', monospace",
          }}>
            ✗ {error}
          </div>
        )}

        {state === "success" && (
          <div style={{
            background: "rgba(0,211,149,0.08)",
            border: "1px solid rgba(0,211,149,0.2)",
            borderRadius: 10,
            padding: "10px 14px",
            color: "#00d395",
            fontSize: 13,
            fontFamily: "'DM Mono', monospace",
          }}>
            ✓ Transaction confirmed
          </div>
        )}
      </div>
    </div>
  );
}
